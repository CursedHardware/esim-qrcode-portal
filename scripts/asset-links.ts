// https://developer.android.com/training/app-links/verify-android-applinks

const fingerprints: readonly string[] = [
  'dd0dddbee79fc418ccf1523e670ff62f22926ed76a8ff50b1b63106195deab13',
  '4139278aacce8338c03dc9a6b0172c1880e0a4949ff3e05292c2e781765026fa',
  '6966004ad0161165335f9204f8f5a52df49fe068c9545c0c589c23221af8d3a4',
]

export const assetLinks: AssetLinks = [
  // EasyEUICC official
  buildAssetLink('im.angry.easyeuicc', ['57becc26b373a6475d093d33b0ea1c5e2bf2738ec0233680094ccbbcb500a13e']),
  // Modified EasyEUICC by Ultra
  buildAssetLink('im.angry.easyeuicc', fingerprints),
  // Nekoko LPA
  buildAssetLink('ee.nekoko.nlpa', fingerprints),
  buildAssetLink('ee.nekoko.nlpa.multisign', fingerprints),
]

function buildAssetLink(name: string, fingerprints: readonly string[]): AssetLink.Link {
  return {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: name,
      sha256_cert_fingerprints: fingerprints.map(normalizeFingerprint),
    },
  }
}

function normalizeFingerprint(fingerprint: string): string {
  const chunks: string[] = []
  for (let index = 0; index < fingerprint.length; index += 2) {
    chunks.push(fingerprint.slice(index, index + 2))
  }
  return chunks.join(':').toUpperCase()
}

type AssetLinks = readonly AssetLink.Link[]

namespace AssetLink {
  export interface Link {
    readonly relation: readonly Relation[]
    readonly target: Target
  }

  export type Relation = 'delegate_permission/common.handle_all_urls'

  export interface Target {
    readonly namespace: 'android_app'
    readonly package_name: string
    readonly sha256_cert_fingerprints: readonly string[]
  }
}
