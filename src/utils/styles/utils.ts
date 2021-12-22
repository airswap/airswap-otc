export const hexWithOpacity = (hex, opacity) => {
  const alpha = Math.round(opacity * 255)
  const opacityHex = (alpha + 0x10000)
    .toString(16)
    .substr(-2)
    .toUpperCase()
  return `${hex}${opacityHex}`
}
