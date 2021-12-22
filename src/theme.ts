// colors are numbered from lightest to darkest

const colors = {
  blue: ['#1C95E8', '#4482FF', '#2B71FF', '#0F45B2'],
  green: ['#4BC68B'],
  yellow: ['#FFBE2B'],
  red: ['#FF0000', '#FF6245'],
  brown: ['#B27C00'],
  gray: ['#FFFFFF', '#FDFDFD', '#FAFAFA', '#F7F7F7', '#F2F2F2', '#EAEAEA', '#AAAAAA', '#7D7D7D', '#151212'],
}

const palette = {
  primaryColor: colors.blue[2],
  secondaryColor: colors.gray[3],
  foregroundColor: colors.gray[0],
  backgroundColor: colors.gray[1],
  backgroundColorSecondary: colors.gray[2],
  shadeColor: colors.gray[3],
  borderColor: colors.gray[2],
  successColor: colors.green[0],
  errorColor: colors.red[1],
  warningColor: colors.yellow[0],
  iconColor: colors.gray[4],
  primaryBlue: colors.blue[3],
}

const text = {
  fontFamily: 'proxima-nova, sans-serif',
  fontStyle: {
    italic: 'italic',
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontSize: {
    h1: '42px',
    h2: '32px',
    h3: '24px',
    h4: '20px',
    h5: '18px',
    h6: '16px',
    h7: '14px',
    h8: '12px',
    h9: '11px',
    h10: '8px',
  },
}

const spacing = (multiplier = 1) => {
  const unit = 5
  return `${unit * multiplier}px`
}

const fixed = {
  maxWidth: '1240px',
}

const line = {
  weight: {
    light: '1px',
    normal: '2px',
    heavy: '3px',
  },
}

const animation = {
  defaultTransition: 0.3,
}

const breakpoints = {
  sm: [0, 767],
  md: [768, 991],
  lg: [992, 1199],
  xl: [1200],
}

const theme = {
  animation,
  fixed,
  colors,
  palette,
  text,
  spacing,
  line,
  breakpoints,
}

export default theme
