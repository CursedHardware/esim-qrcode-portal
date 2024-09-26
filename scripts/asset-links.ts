import emitFile from '@nice-labs/emit-file-webpack-plugin'

// https://developer.android.com/training/app-links/verify-android-applinks

const fingerprints = {
  // from Sakura eSIM
  'sakura': 'dd0dddbee79fc418ccf1523e670ff62f22926ed76a8ff50b1b63106195deab13',
  // from 9eSIM
  '9esim': '6966004ad0161165335f9204f8f5a52df49fe068c9545c0c589c23221af8d3a4',
  // Community Key from ShiinaSekiu
  'shiinasekiu': '4139278aacce8338c03dc9a6b0172c1880e0a4949ff3e05292c2e781765026fa',
  // from OpenEUICC
  'openeuicc': '57becc26b373a6475d093d33b0ea1c5e2bf2738ec0233680094ccbbcb500a13e',
}

const assetLinks: AssetLinks = [
  // EasyEUICC official
  buildAssetLink('im.angry.easyeuicc', ['openeuicc']),
  // Modified EasyEUICC by Ultra
  buildAssetLink('im.angry.easyeuicc', ['sakura', '9esim', 'shiinasekiu']),
  // Nekoko LPA
  buildAssetLink('ee.nekoko.nlpa', ['sakura', '9esim', 'shiinasekiu']),
  buildAssetLink('ee.nekoko.nlpa.multisign', ['sakura', '9esim', 'shiinasekiu']),
]

export function emitAssetLinks() {
  return emitFile({
    name: '.well-known/assetlinks.json',
    content: JSON.stringify(assetLinks),
  })
}

function buildAssetLink(name: string, keys: readonly (keyof typeof fingerprints)[]): AssetLink.Link {
  return {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: name,
      sha256_cert_fingerprints: keys.map(normalizeFingerprint),
    },
  }
}

function normalizeFingerprint(name: keyof typeof fingerprints): string {
  const fingerprint = fingerprints[name]
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
