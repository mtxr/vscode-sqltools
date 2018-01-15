export function int(v) {
  return notEmpty(v.toString()) ? parseInt(v, 10) : null
}
export function bool(v) {
  v = v.toString().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes' || v === 'y'
}
export function notEmpty(value) {
  return value && value.toString().trim().length > 0
}
notEmpty.errorMessage = '{0} can\'t be empty'

export function gtz(value) {
  value = int(value)
  return value > 0
}
gtz.errorMessage = '{0} should be greater than zero'

export function inRange(max, min) {
  return (value) => {
    value = int(value)
    return value >= min && value <= max
  }
}
