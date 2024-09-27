import emitFile from '@nice-labs/emit-file-webpack-plugin'

const redirects: Record<string, string> = {
  // from https://esimqr.com
  'br1': '1$smdp.io$QR-G-5C-1LS-1W1Z9P7',
  // from https://www.linkedin.com/posts/hakan-koc_i-am-happy-to-announce-my-newest-company-activity-7079382859777486848-MK7I/
  'br2': '1$smdp.io$QR-G-5C-KR-1PCDWP9',
  // from https://www.betterroaming.com/esim-installation/
  'br3': '1$smdp.io$QRF-BETTERROAMING-PMRDGIR2EARDEIT5',
  // from https://www.tigo.com.sv/esim
  'tigo': '1$millicomelsalvador.validereachdpplus.com$GENERICJOWMI-FAHTCU0-SKFMYPW6UIEFGRWC8GE933ITFAUVN63WMUVHFOWTS80',
  // from https://redteago.com/redteago-esim-data-plans/esim-for-qrsim/
  'redtea': '1$rsp-eu.redteamobile.com$5901981126831169',
  // from https://www.speedtest.net/esimqr
  'speedtest': '1$rsp.truphone.com$QRF-SPEEDTEST',
  // from T-Mobile
  'tmo': '1$t-mobile.gdsb.net$',
  'tmo-alt': '1$cust-005-v4-prod-atl2.gdsb.net$',
  // from Vodafone UK
  'vdf/uk': '1$vfgb.idemia.io$',
  'vdf/uk-alt': '1$vuk-gto.prod.ondemandconnectivity.com$',
  // from RSP Dumper
  'dumper': `1$rsp.septs.app$${hex('euicc-dev-manual@septs.pw')}`,
  // from Billion Connect
  'bc1': '1$ecprsp.eastcompeace.com$2D2E6B5F22354650856546C43DB8F265',
  'bc2': '1$ecprsp.eastcompeace.com$AF5877BAA75D47EAB55B148301626441',
}

export function emitRedirects() {
  return emitFile({
    name: '_redirects',
    content() {
      const lines: string[] = []
      for (const name of Object.keys(redirects)) {
        lines.push([`/${name}`, `/${redirects[name]}`].join(' '))
      }
      return lines.join('\n')
    },
  })
}

function hex(input: string) {
  return Buffer.from(input, 'ascii').toString('hex').toUpperCase()
}
