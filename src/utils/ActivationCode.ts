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
    while (parts.length > 3 && parts[parts.length - 1].length === 0) parts.pop()
    return parts.join('$')
  }

  toURI() {
    return 'LPA:' + this.toString()
  }

  toSetupURL(type: 'apple' | 'android') {
    let setup: URL
    if (type === 'apple') {
      setup = new URL('https://esimsetup.apple.com/esim_qrcode_provisioning')
    } else if (type === 'android') {
      setup = new URL('https://esimsetup.android.com/esim_qrcode_provisioning')
    } else {
      throw new Error('unknown device type')
    }
    setup.searchParams.set('carddata', this.toURI())
    return setup.toString()
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
