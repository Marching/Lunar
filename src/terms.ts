/**
 *
 */
export interface ISolarTerm {
  date?: Date;
  lunar?: string;
  description?: string;
}

export const LUNAR_CAPS_1 = new Array('日', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十');
export const LUNAR_CAPS_2 = new Array('初', '十', '廿', '卅');

/**
 *
 */
export const SOLAR_TERMS: ISolarTerm[] = [
  {
    description: '小寒',
  },
  {
    description: '大寒',
  },
  {
    description: '立春',
  },
  {
    description: '雨水',
  },
  {
    description: '惊蛰',
  },
  {
    description: '春分',
  },
  {
    description: '清明',
  },
  {
    description: '谷雨',
  },
  {
    description: '立夏',
  },
  {
    description: '小满',
  },
  {
    description: '芒种',
  },
  {
    description: '夏至',
  },
  {
    description: '小暑',
  },
  {
    description: '大暑',
  },
  {
    description: '立秋',
  },
  {
    description: '处暑',
  },
  {
    description: '白露',
  },
  {
    description: '秋分',
  },
  {
    description: '寒露',
  },
  {
    description: '霜降',
  },
  {
    description: '立冬',
  },
  {
    description: '小雪',
  },
  {
    description: '大雪',
  },
  {
    description: '冬至',
  },
];
