import {
  contentPlayerBounds,
  contentPlayerKeyForRestoration,
  contentPlayerVolume,
} from "../atoms/contentPlayer"
import { mirakurunServices } from "../atoms/mirakurun"
import {
  controllerSetting,
  experimentalSetting,
  mirakurunSetting,
  sayaSetting,
  screenshotSetting,
} from "../atoms/settings"

export const RECOIL_SHARED_ATOM_KEYS = [
  mirakurunSetting.key,
  sayaSetting.key,
  controllerSetting.key,
  screenshotSetting.key,
  experimentalSetting.key,
  mirakurunServices.key,
]

export const RECOIL_STORED_ATOM_KEYS = [
  mirakurunSetting.key,
  sayaSetting.key,
  controllerSetting.key,
  screenshotSetting.key,
  experimentalSetting.key,
  contentPlayerVolume.key,
  contentPlayerKeyForRestoration.key,
  contentPlayerBounds.key,
]
