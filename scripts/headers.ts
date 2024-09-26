import emitFile from '@nice-labs/emit-file-webpack-plugin'

const paths: Record<string, HeadersInit> = {
  '/*': {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Robots-Tag': 'noindex, nofollow',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  },
}

export function emitHeaders() {
  return emitFile({
    name: '_headers',
    content() {
      const lines: string[] = []
      let headers: Headers
      for (const pathname of Object.keys(paths)) {
        lines.push(pathname)
        headers = new Headers(paths[pathname])
        for (const name of headers.keys()) {
          lines.push(`\t${name}: ${headers.get(name)}`)
        }
      }
      return lines.join('\n').replace(/\t/g, '\x20'.repeat(2))
    },
  })
}
