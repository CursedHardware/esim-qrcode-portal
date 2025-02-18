export function hasAppleSetupAvailable(): boolean {
  if (navigator.platform !== 'iPhone' && navigator.platform !== 'iPad') return false
  const matched = /OS (\d+)_(\d+)/.exec(navigator.appVersion)
  if (matched === null) return false
  const major = Number.parseInt(matched[1], 10)
  const minor = Number.parseInt(matched[2], 10)
  return major > 17 || (major === 17 && minor >= 4)
}
