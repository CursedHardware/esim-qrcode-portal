import styled from '@emotion/styled'
import { FC } from 'react'
import { LineBreak } from './LineBreak'
import { ManualEntry } from './ManualEntry'
import { QRCodeEntry } from './QRCodeEntry'
import { useHashTag } from './hooks/hash'
import { ActivationProvider } from './hooks/lpa'

const CardOutline = styled('main')`
  background-color: #fff;

  padding: 2rem 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 0 1rem 0 rgba(75, 75, 77, 0.3);

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media only screen and (max-width: 50rem) {
    border-radius: 0;
    box-shadow: none;
  }

  @media print {
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    align-items: start;
  }
`

const Link = styled('a')`
  color: #17a1e6;
  text-decoration: none;
`

export const Card: FC = () => {
  const activationCode = location.pathname.slice(1)
  const confirmationCode = useHashTag()
  if (!/^(?:LPA:)?1\$/i.test(activationCode)) {
    const url = new URL('/1$example.com$matching-id#confirmation-code', location.href)
    return (
      <CardOutline>
        <h1>Invalid Activation Code</h1>
        <p>
          e.g: <Link href={url.toString()}>{url.toString()}</Link>
        </p>
      </CardOutline>
    )
  }
  return (
    <CardOutline>
      <ActivationProvider activationCode={activationCode} confirmationCode={confirmationCode}>
        <QRCodeEntry />
        <LineBreak />
        <ManualEntry />
      </ActivationProvider>
    </CardOutline>
  )
}
