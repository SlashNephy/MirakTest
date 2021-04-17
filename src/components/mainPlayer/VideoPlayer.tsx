import React, { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import WebChimeraJs from "webchimera.js"
import { toast } from "react-toastify"
import {
  mainPlayerAudioChannel,
  mainPlayerAudioTrack,
  mainPlayerAudioTracks,
  mainPlayerScreenShotTrigger,
  mainPlayerSubtitleEnabled,
  mainPlayerUrl,
  mainPlayerVolume,
} from "../../atoms/mainPlayer"
import { VideoRenderer } from "../../utils/videoRenderer"
import { VLCLogFilter } from "../../utils/vlc"

export const CoiledVideoPlayer: React.VFC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [aspect, setAspect] = useState(1.777777778)
  const [width, setWidth] = useState(1280)
  const height = Math.ceil(width * aspect)

  const playerRef = useRef<WebChimeraJs.Player | null>(null)

  const url = useRecoilValue(mainPlayerUrl)
  useEffect(() => {
    if (!playerRef.current) return
    if (url) {
      playerRef.current.play(url)
      console.log("URL再生:", url)
    } else {
      playerRef.current.stop()
      console.log("再生停止")
    }
  }, [url])

  const volume = useRecoilValue(mainPlayerVolume)
  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.volume = volume
    console.log("音量変更:", volume)
  }, [volume])

  const [subtitleEnabled, setSubtitleEnabled] = useRecoilState(
    mainPlayerSubtitleEnabled
  )
  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.subtitles.track = Number(subtitleEnabled)
    console.log("字幕変更:", Number(subtitleEnabled))
  }, [subtitleEnabled])

  const audioChannel = useRecoilValue(mainPlayerAudioChannel)
  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.audio.channel = audioChannel
    console.log("オーディオチャンネル変更:", audioChannel)
  }, [audioChannel])

  const audioTrack = useRecoilValue(mainPlayerAudioTrack)
  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.audio.track = audioTrack
    console.log("オーディオトラック変更:", audioTrack)
  }, [audioTrack])
  const setAudioTracks = useSetRecoilState(mainPlayerAudioTracks)

  const screenShotTrigger = useRecoilValue(mainPlayerScreenShotTrigger)
  useEffect(() => {
    if (!screenShotTrigger || !canvasRef.current) return
    ;(async () => {
      try {
        const glCanvas = canvasRef.current!
        const canvas = document.createElement("canvas")
        canvas.height = glCanvas.height
        canvas.width = Math.ceil(glCanvas.height / aspect)
        const context = canvas.getContext("2d", { alpha: false })
        if (!context) throw new Error("ctx")
        context.drawImage(glCanvas, 0, 0, canvas.width, canvas.height)
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob((blob) => res(blob), "image/png", 1)
        )
        if (!blob) throw new Error("blob")
        await navigator.clipboard.write([
          new window.ClipboardItem({ [blob.type]: blob }),
        ])
        toast.info("クリップボードにキャプチャがコピーされました", {
          autoClose: 2000,
        })
      } catch (error) {
        toast.error("キャプチャに失敗しました", { autoClose: 2000 })
        console.error(error)
      }
    })()
  }, [screenShotTrigger])

  useEffect(() => {
    const renderContext = new VideoRenderer(canvasRef.current!, {
      preserveDrawingBuffer: true,
    })
    const player = WebChimeraJs.createPlayer()
    player.onLogMessage = (level, message, format) => {
      const parsed = VLCLogFilter(message)
      switch (parsed.category) {
        case "resize":
          console.log(message)
          if (parsed.width && parsed.height) {
            setAspect(width / height)
            console.log(`Aspect: ${width / height}`)
          }
          break
        case "successfully_opened":
          setSubtitleEnabled(false)
          break
        case "received_first_picture":
        case "es_out_program_epg":
          setAudioTracks(
            [...Array(player.audio.count).keys()].map(
              (trackId) => player.audio[trackId]
            )
          )
          break
        case "unable_to_open":
          toast.error("映像の受信に失敗しました")
          break
        case "end_of_stream":
          renderContext.fillTransparent()
          break
        case "unknown":
          console.log(message)
          break
        default:
          break
      }
    }
    player.onFrameReady = (frame) => {
      renderContext.render(
        frame,
        frame.width,
        frame.height,
        frame.uOffset,
        frame.vOffset
      )
    }
    player.volume = volume
    // @ts-ignore
    window.player = player
    playerRef.current = player
    const onResize = () => {
      if (!containerRef.current) return
      setWidth(containerRef.current.clientWidth)
    }
    window.addEventListener("resize", onResize)
    onResize()
    return () => {
      window.removeEventListener("resize", onResize)
      player.close()
    }
  }, [])
  return (
    <div className="w-full" ref={containerRef}>
      <canvas style={{ width: width, height: height }} ref={canvasRef}></canvas>
    </div>
  )
}