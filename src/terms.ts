/**
 *
 */
export interface SolarTerm {
  date?: Date;
  lunar?: string;
  description?: string;
  longitude: number;
}

export const LUNAR_CAPS_1 = new Array('日', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十');
export const LUNAR_CAPS_2 = new Array('初', '十', '廿', '卅');

/**
 *
 */
export const SOLAR_TERMS: Map<number, SolarTerm> = new Map([
  [
    1,
    {
      description: '春分',
      longitude: 0
    }
  ],
  [
    2,
    {
      description: '清明',
      longitude: 15
    }
  ],
  [
    3,
    {
      description: '谷雨',
      longitude: 30
    }
  ],
  [
    4,
    {
      description: '立夏',
      longitude: 45
    }
  ],
  [
    5,
    {
      description: '小满',
      longitude: 60
    }
  ],
  [
    6,
    {
      description: '芒种',
      longitude: 75
    }
  ],
  [
    7,
    {
      description: '夏至',
      longitude: 90
    }
  ],
  [
    8,
    {
      description: '小暑',
      longitude: 105
    }
  ],
  [
    9,
    {
      description: '大暑',
      longitude: 120
    }
  ],
  [
    10,
    {
      description: '立秋',
      longitude: 135
    }
  ],
  [
    11,
    {
      description: '处暑',
      longitude: 150
    }
  ],
  [
    12,
    {
      description: '白露',
      longitude: 165
    }
  ],
  [
    13,
    {
      description: '秋分',
      longitude: 180
    }
  ],
  [
    14,
    {
      description: '寒露',
      longitude: 195
    }
  ],
  [
    15,
    {
      description: '霜降',
      longitude: 210
    }
  ],
  [
    16,
    {
      description: '立冬',
      longitude: 225
    }
  ],
  [
    17,
    {
      description: '小雪',
      longitude: 240
    }
  ],
  [
    18,
    {
      description: '大雪',
      longitude: 255
    }
  ],
  [
    19,
    {
      description: '冬至',
      longitude: 270
    }
  ],
  [
    20,
    {
      description: '小寒',
      longitude: 285
    }
  ],
  [
    21,
    {
      description: '大寒',
      longitude: 300
    }
  ],
  [
    22,
    {
      description: '立春',
      longitude: 315
    }
  ],
  [
    23,
    {
      description: '雨水',
      longitude: 330
    }
  ],
  [
    24,
    {
      description: '惊蛰',
      longitude: 345
    }
  ]
]);
