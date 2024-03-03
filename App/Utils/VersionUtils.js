export function getPackageVersion() {
  const packageJson = require('../../package.json')
  return packageJson.version
}

export function getPackageVersions() {
  const packageJson = getPackageVersion()
  return packageJson.split('.')
}

export function getVersionCode() {
  const packageVersion = getPackageVersions()
  const versionMajor = parseInt(packageVersion[0])
  const versionMinor = parseInt(packageVersion[1])
  const versionPoint = parseInt(packageVersion[2])
  return versionMajor * 10000 + versionMinor * 100 + versionPoint
}