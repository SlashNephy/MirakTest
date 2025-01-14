// https://github.com/l3tnun/EPGStation/blob/7949ffe4b4e3b79c896181e0f95526409818330f/src/util/StrUtil.ts#L10
export const ENCLOSED_CHARACTERS_TABLE: { [key: string]: string } = {
  "\u{1f14a}": "HV",
  "\u{1f13f}": "P",
  "\u{1f14c}": "SD",
  "\u{1f146}": "W",
  "\u{1f14b}": "MV",
  "\u{1f210}": "手",
  "\u{1f211}": "字",
  "\u{1f212}": "双",
  "\u{1f213}": "デ",
  "\u{1f142}": "S",
  "\u{1f214}": "二",
  "\u{1f215}": "多",
  "\u{1f216}": "解",
  "\u{1f14d}": "SS",
  "\u{1f131}": "B",
  "\u{1f13d}": "N",
  "\u{1f217}": "天",
  "\u{1f218}": "交",
  "\u{1f219}": "映",
  "\u{1f21a}": "無",
  "\u{1f21b}": "料",
  "\u{26bf}": "鍵",
  "\u{1f21c}": "前",
  "\u{1f21d}": "後",
  "\u{1f21e}": "再",
  "\u{1f21f}": "新",
  "\u{1f220}": "初",
  "\u{1f221}": "終",
  "\u{1f222}": "生",
  "\u{1f223}": "販",
  "\u{1f224}": "声",
  "\u{1f225}": "吹",
  "\u{1f14e}": "PPV",
  "\u{3299}": "秘",
  "\u{1f200}": "ほか",
}

export const ENCLOSED_CHARACTERS = Object.keys(ENCLOSED_CHARACTERS_TABLE)
