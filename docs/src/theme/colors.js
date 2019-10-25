const white = '#FFFFFF';
const black = '#0F131A';

const neutrals = {
  n100: '#FAFBFC',
  n200: '#EEF0F2',
  n300: '#D8DDE1',
  n500: '#9DA7B1',
  n700: '#5C656F',
  n800: '#323E49',
  n900: '#212933'
};

const blues = {
  b100: '#EDF4FC',
  b200: '#DAEAFF',
  b300: '#AFD0FE',
  b400: '#7FB5FF',
  b500: '#3388FF',
  b700: '#1760CE',
  b900: '#003C8B'
};

const greens = {
  g100: '#E4EABB',
  g200: '#D4DB8F',
  g300: '#BED630',
  g500: '#8CC13F',
  g700: '#47995A',
  g900: '#356560'
};

const violets = {
  v100: '#E9CFF2',
  v200: '#D7A9DC',
  v300: '#C781C9',
  v500: '#B54DB3',
  v700: '#8928A2',
  v900: '#5F1D6B'
};

const oranges = {
  o100: '#EFD0BB',
  o200: '#F7B97C',
  o300: '#F7941D',
  o500: '#CE6C0B',
  o700: '#8E4503',
  o900: '#66391B'
};

const yellows = {
  y100: '#F2E9C7',
  y200: '#EDDD8E',
  y300: '#F6CC1B',
  y500: '#D8A413',
  y700: '#AD7A14',
  y900: '#725514'
};

const reds = {
  r100: '#F4CBCB',
  r200: '#EDA2A2',
  r300: '#EA7A7A',
  r500: '#DB4D4D',
  r700: '#B22828',
  r900: '#7F1818'
};

const primary = {
  p100: blues.b100,
  p200: blues.b200,
  p300: blues.b300,
  p400: blues.b400,
  p500: blues.b500,
  p700: blues.b700,
  p900: blues.b900
};

const misc = {
  shadow: '#0C0F14',
  bodyBg: neutrals.n100,
  bodyColor: black,
  danger: reds.r500,
  success: greens.g700,
  warning: yellows.y500
};

export const colors = {
  white,
  black,
  ...neutrals,
  ...blues,
  ...greens,
  ...yellows,
  ...reds,
  ...oranges,
  ...violets,
  ...primary,
  ...misc
};

export const spacings = {
  bit: '4px',
  byte: '8px',
  kilo: '12px',
  mega: '16px',
  giga: '24px',
  tera: '32px',
  peta: '40px',
  exa: '48px',
  zetta: '56px'
};

export const iconSizes = {
  byte: '14px',
  kilo: '16px',
  mega: '24px',
  giga: '32px'
};

export const borderRadius = {
  kilo: '1px',
  mega: '4px',
  giga: '5px'
};

export const borderWidth = {
  kilo: '1px',
  mega: '2px'
};

export const typography = {
  headings: {
    kilo: {
      fontSize: '17px',
      lineHeight: '24px'
    },
    mega: {
      fontSize: '19px',
      lineHeight: '24px'
    },
    giga: {
      fontSize: '22px',
      lineHeight: '24px'
    },
    tera: {
      fontSize: '24px',
      lineHeight: '32px'
    },
    peta: {
      fontSize: '28px',
      lineHeight: '32px'
    },
    exa: {
      fontSize: '36px',
      lineHeight: '44px'
    },
    zetta: {
      fontSize: '42px',
      lineHeight: '48px'
    }
  },
  subHeadings: {
    kilo: {
      fontSize: '12px',
      lineHeight: '20px'
    },
    mega: {
      fontSize: '14px',
      lineHeight: '18px'
    }
  },
  text: {
    kilo: {
      fontSize: '13px',
      lineHeight: '20px'
    },
    mega: {
      fontSize: '16px',
      lineHeight: '24px'
    },
    giga: {
      fontSize: '18px',
      lineHeight: '28px'
    }
  }
};

export const fontStack = {
  default:
    // eslint-disable-next-line
    'aktiv-grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  mono: 'Consolas, monaco, monospace'
};

export const fontWeight = {
  regular: '400',
  bold: '700'
};

export const grid = {
  default: {
    priority: 0,
    breakpoint: 'default',
    cols: 12,
    maxWidth: '880px',
    gutter: spacings.mega
  },
  untilKilo: {
    priority: 1,
    breakpoint: 'untilKilo',
    cols: 12,
    maxWidth: '400px',
    gutter: spacings.byte
  },
  kilo: {
    priority: 2,
    breakpoint: 'kilo',
    cols: 12,
    maxWidth: '600px',
    gutter: spacings.mega
  },
  mega: {
    priority: 3,
    breakpoint: 'mega',
    cols: 12,
    maxWidth: '760px',
    gutter: spacings.giga
  },
  giga: {
    priority: 4,
    breakpoint: 'giga',
    cols: 12,
    maxWidth: '880px',
    gutter: spacings.giga
  },
  afterTera: {
    priority: 5,
    breakpoint: 'tera',
    cols: 12,
    maxWidth: '1200px',
    gutter: spacings.giga
  }
};

export const breakpoints = {
  untilKilo: '(max-width: 479px)',
  kilo: 480,
  kiloToMega: '(min-width: 480px) and (max-width: 767px)',
  mega: 768,
  untilMega: '(max-width: 767px)',
  megaToGiga: '(min-width: 768px) and (max-width: 959px)',
  giga: 960,
  gigaToTera: '(min-width: 960px) and (max-width: 1279px)',
  tera: 1280,
  afterTera: '(min-width: 1280px)'
};

export const transitions = {
  default: `200ms ease-in-out`,
  slow: `300ms ease-in-out`
};

// these values need to be properly trimmed/renamed as we go.
export const zIndex = {
  default: 0,
  absolute: 1,
  drawer: 10,
  select: 20,
  popover: 30,
  tooltip: 31,
  header: 600,
  backdrop: 700,
  sidebar: 800,
  modal: 1000
};

export const palette = {
  divider: 'rgba(0, 0, 0, 0.12)'
};