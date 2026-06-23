export function buildIntentURI(intent: string | URL, extras: object): string {
  intent = new URL(intent)
  intent.hash = buildExtras(intent.protocol.slice(0, -1), extras)
  intent.protocol = 'intent:'
  return intent.toString()
}

function buildExtras(scheme: string, extras: object): string {
  const entries: string[] = []
  entries.push('#Intent', 'scheme=' + scheme)
  for (const [name, value] of Object.entries(extras)) {
    if (value === undefined) continue
    entries.push(name + '=' + encodeURIComponent(value))
  }
  entries.push('end')
  return entries.join(';')
}
