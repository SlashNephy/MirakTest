import { ipcRenderer, remote } from "electron"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  contentPlayerIsPlaying,
  contentPlayerKeyForRestoration,
  contentPlayerSelectedService,
} from "../atoms/contentPlayer"
import { mirakurunServices } from "../atoms/mirakurun"
import { REQUEST_OPEN_PLAYER, REQUEST_OPEN_SETTINGS } from "../constants/ipc"
import { useRefFromState } from "../hooks/ref"

export const useContentPlayerContextMenu = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(contentPlayerIsPlaying)
  const isPlayingRef = useRefFromState(isPlaying)
  const [selectedService, setSelectedService] = useRecoilState(
    contentPlayerSelectedService
  )
  const selectedServiceRef = useRefFromState(selectedService)
  const keyForRestoration = useRecoilValue(contentPlayerKeyForRestoration)
  const keyForRestorationRef = useRefFromState(keyForRestoration)
  const services = useRecoilValue(mirakurunServices)
  const servicesRef = useRefFromState(services)

  return (e: Electron.Event, params: Electron.ContextMenuParams) => {
    const remoteWindow = remote.getCurrentWindow()
    const noParams = typeof params !== "object"
    e.preventDefault()
    const pluginContextMenus = Object.values(window.contextMenus || {})
    if (0 < pluginContextMenus.length) {
      pluginContextMenus.push({
        type: "separator",
      })
    }
    const menu: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
      {
        label: "再生停止",
        type: "checkbox",
        checked: isPlayingRef.current === false,
        click: () => {
          // 再生中である場合停止
          if (isPlayingRef.current) {
            setIsPlaying(false)
            // 再生中でなく、サービスが埋められている（停止 or 受信失敗）の際に再生開始
          } else if (selectedServiceRef.current) {
            setIsPlaying(true)
            // 再生中でなく、サービスが埋められていない場合サービスを埋めることによって再生開始を試みる
          } else {
            if (servicesRef.current && 0 < servicesRef.current?.length) {
              const lastSelectedService = servicesRef.current.find(
                (service) =>
                  service.id === keyForRestorationRef.current?.serviceId
              )
              if (lastSelectedService) {
                setSelectedService(lastSelectedService)
              } else {
                setSelectedService(servicesRef.current[0])
              }
            }
          }
        },
      },
      {
        type: "separator",
      },
      {
        label: "最前面に固定",
        type: "checkbox",
        checked: remoteWindow.isAlwaysOnTop(),
        click: () => remoteWindow.setAlwaysOnTop(!remoteWindow.isAlwaysOnTop()),
      },
      {
        type: "separator",
      },
      {
        label: "新しいプレイヤーを開く",
        click: () => {
          ipcRenderer.send(REQUEST_OPEN_PLAYER)
        },
      },
      {
        label: "設定",
        click: () => {
          ipcRenderer.send(REQUEST_OPEN_SETTINGS)
        },
      },

      {
        type: "separator",
      },
      {
        label: "切り取り",
        role: "cut",
        visible: noParams || params.editFlags.canCut,
      },
      {
        label: "コピー",
        role: "copy",
        visible: noParams || params.editFlags.canCopy,
      },
      {
        label: "貼り付け",
        role: "paste",
        visible: noParams || params.editFlags.canPaste,
      },
      {
        label: "削除",
        role: "delete",
        visible: noParams || params.editFlags.canDelete,
        click: () => remoteWindow.webContents.delete(),
      },
      {
        label: "すべて選択",
        role: "selectAll",
        visible: noParams || params.editFlags.canSelectAll,
      },
      {
        type: "separator",
      },
      ...pluginContextMenus,
      {
        label: "再読み込み",
        role: "reload",
        click: () => remoteWindow.webContents.reload(),
      },
      {
        label: "ウィンドウを閉じる",
        click: () => remoteWindow.destroy(),
      },
      {
        label: "終了",
        role: "quit",
      },
    ].filter((item) => item.visible !== false) as (
      | Electron.MenuItemConstructorOptions
      | Electron.MenuItem
    )[] // bug: https://github.com/electron/electron/issues/2895
    remote.Menu.buildFromTemplate(menu).popup()
  }
}
