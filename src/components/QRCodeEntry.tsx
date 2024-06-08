/// <reference types="user-agent-data-types" />
import styled from '@emotion/styled'
import QrCreator from 'qr-creator'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { hasAppleSetupAvailable } from '../utils/Apple'
import QRCODE_PRELOADED_BACKGROUND from './assets/background.png'
import { useActivationCode } from './hooks/lpa'

const AppleSetupURL = new URL('https://esimsetup.apple.com/esim_qrcode_provisioning')

const Container = styled('section')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;

  @media only screen and (min-width: 36rem) {
    max-width: 36rem;
  }
`

const Title = styled('h3')`
  margin: 0;

  font-size: 1.75rem;

  @media print {
    display: none;
  }
`

const Figure = styled('figure')`
  margin: 0;

  text-align: center;

  img {
    display: block;
  }
`

export const QRCodeEntry = memo(() => {
  const activation = useActivationCode()
  const handleQRCodeClick = useCallback(() => {
    if (hasAppleSetupAvailable()) {
      const setup = new URL(AppleSetupURL)
      setup.searchParams.set('carddata', activation.toURI())
      location.assign(setup)
    }
  }, [activation])
  return (
    <Container>
      <Title>Now, install your eSIM</Title>
      <Figure onClick={handleQRCodeClick}>
        <QRCode size={160} lpaString={activation.toURI()} />
      </Figure>
      <StepByStep />
    </Container>
  )
})

interface QRCodeProps {
  readonly lpaString: string
  readonly size: number
}

const QRCode = memo<QRCodeProps>((props) => {
  const [blob, setBlob] = useState(QRCODE_PRELOADED_BACKGROUND)
  useEffect(() => {
    const element = document.createElement('canvas')
    QrCreator.render(
      {
        text: props.lpaString,
        ecLevel: 'M',
        size: props.size * Math.min(devicePixelRatio, 3),
        background: null,
        radius: 0,
      },
      element,
    )
    element.toBlob((blob) => setBlob(URL.createObjectURL(blob!)))
    return () => URL.revokeObjectURL(blob)
  }, [props.size, props.lpaString])
  return <img width={props.size} height={props.size} src={blob} alt={props.lpaString} title={props.lpaString} />
})

const StepList = styled('section')`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-row-gap: 0.5rem;
  align-items: center;
  width: 100%;

  @media print {
    display: none;
  }
`

const StepIndex = styled('b')`
  display: inline-block;

  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  font-weight: normal;
  line-height: 2rem;

  text-align: center;
  border-radius: 50%;
  background: #5b367e;
  color: #fff;
  margin-right: 0.625rem;
`

const StepByStep: FC = () => (
  <StepList>
    <StepIndex>1</StepIndex>
    <span>Scan the QR code using the phone your mobile service will be on.</span>
    <StepIndex>2</StepIndex>
    <span>Follow the steps</span>
  </StepList>
)
