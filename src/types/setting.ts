export type MirakurunSetting = {
  baseUrl?: string
  isEnableWaitForSingleTuner: boolean
  isEnableServiceTypeFilter: boolean
}

export type ControllerSetting = {
  volumeRange: [number, number]
}

export type ScreenshotSetting = {
  saveAsAFile: boolean
  includeSubtitle: boolean
  basePath?: string
}

export type ExperimentalSetting = {
  isWindowDragMoveEnabled: boolean
  isProgramDetailInServiceSelectorEnabled: boolean
  vlcNetworkCaching: number
}
