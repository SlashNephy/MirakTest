import path from "path"
import fs from "fs"
import child from "child_process"
import glob from "glob"
import axios from "axios"
import type { Arch, Target, Packager } from "electron-builder"

// https://www.electron.build/configuration/configuration#afterpack
interface AfterPackContext {
  outDir: string
  appOutDir: string
  packager: Packager
  electronPlatformName: string
  arch: Arch
  targets: Array<Target>
}

const exec = async (command: string) => {
  return await new Promise((res, rej) => {
    child.exec(command, (err, std) => {
      if (err) rej(err)
      res(std)
    })
  })
}

exports.default = async (ctx: AfterPackContext) => {
  console.log(`${ctx.electronPlatformName} 用の変更を適用します`)
  let dest = "./build"
  if (ctx.electronPlatformName === "darwin") {
    const src = path.resolve("./vlc_libs/")
    dest = path.resolve("./build/mac/MirakTest.app/Contents/Frameworks/")

    if (!fs.existsSync(src) || !fs.existsSync(dest)) {
      console.log("ファイルが存在しません、スキップします")
      return
    }
    console.log("libVLC を Contents/Frameworks にコピーします")
    const files = await new Promise<string[]>((res, rej) => {
      glob(path.join(src, "*"), (err, files) => {
        if (err) rej(err)
        res(files)
      })
    })
    for (const file of files) {
      await exec(`cp -Ra ${file} ${dest}`)
    }
    dest = path.resolve("./build/mac/MirakTest.app/Contents/")
  } else if (ctx.electronPlatformName === "win32") {
    dest = path.resolve("./build/win-unpacked/")
  }

  console.log("libVLC の COPYRING, COPYRING.LIB をコピーします")
  const COPYRING = await axios.get(
    "https://raw.githubusercontent.com/videolan/vlc/master/COPYING",
    { responseType: "text" }
  )
  await fs.promises.writeFile(
    path.join(dest, "./LICENSE.VLC-COPYRING.txt"),
    COPYRING.data
  )
  const COPYRING_LIB = await axios.get(
    "https://raw.githubusercontent.com/videolan/vlc/master/COPYING.LIB",
    { responseType: "text" }
  )
  await fs.promises.writeFile(
    path.join(dest, "./LICENSE.VLC-COPYRING.LIB.txt"),
    COPYRING_LIB.data
  )
}
