export class ActivationCode {
  /** SM-DP+ Address */
  readonly address: string
  /** Activation Code Token */
  readonly matchingId: string
  /** SM-DP+ OID */
  readonly oid: string
  /** Confirmation Code Required Flag */
  readonly confirmationCode?: string
  /** eSIM CA Root CA Public Key indicator */
  readonly publicKey: string
  /** Delete Notification for Device Change */
  readonly deleteNotificationForDeviceChange: string

  constructor(activationCode: string, confirmationCode: string) {
    if (!/^(?:LPA:)?1\$/i.test(activationCode)) {
      throw new Error('invalid lpa activation code string')
    }
    const index = activationCode.indexOf('$')
    if (index !== -1) {
      activationCode = activationCode.slice(index + 1)
    }
    const parts = activationCode.split('$').map((part) => part.trim())
    if (parts.length === 0) {
      throw new Error('invalid lpa activation code string')
    }
    this.address = parts[0].toLowerCase()
    this.matchingId = toString(parts[1])
    this.oid = toString(parts[2])
    this.confirmationCode = parseConfirmationCode(confirmationCode, parts[3] === '1')
    this.publicKey = toString(parts[4]).replace(/-/g, '').toLowerCase()
    this.deleteNotificationForDeviceChange = toString(parts[5]).toLowerCase()
    Object.freeze(this)
  }

  toString() {
    const parts: string[] = [
      // required, activation code format
      '1',
      // required, sm-dp+ address
      this.address,
      // required, matching id
      this.matchingId,
      // optional, sm-dp+ oid
      this.oid,
      // optional, confirmation code
      this.confirmationCode !== undefined ? '1' : '',
      // optional, root ca public key
      this.publicKey,
      // optional, delete notification for device change
      this.deleteNotificationForDeviceChange,
    ]
    while (parts.length > 3 && parts.at(-1)!.length === 0) {
      parts.pop()
    }
    return parts.join('$')
  }

  toURI() {
    return 'LPA:' + this
  }
}

function parseConfirmationCode(input: string, required: boolean): string | undefined {
  if (input.length > 0) return input
  return required ? '' : undefined
}

function toString(value: string | undefined): string {
  if (value === undefined) return ''
  return value
}
