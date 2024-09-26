import emitFile from '@nice-labs/emit-file-webpack-plugin'

interface Robot {
  readonly userAgent: string
  readonly disallowes?: string[]
  readonly allowes?: string[]
}

const robots: readonly Robot[] = [
  {
    userAgent: '*',
    disallowes: ['/'],
    allowes: ['/.well-known/assetlinks.json'],
  },
]

export function emitRobotsTXT() {
  return emitFile({
    name: 'robots.txt',
    content() {
      const lines: string[] = []
      for (const robot of robots) {
        lines.push(`User-Agent: ${robot.userAgent}`)
        for (const disallow of new Set(robot.disallowes)) {
          lines.push(`Disallow: ${disallow}`)
        }
        for (const allow of new Set(robot.allowes)) {
          lines.push(`Allow: ${allow}`)
        }
        lines.push('')
      }
      return lines.join('\n').trim()
    },
  })
}
