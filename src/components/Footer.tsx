import styled from '@emotion/styled'
import { Fragment, memo } from 'react'

const Container = styled('footer')`
  display: flex;
  gap: 1em;

  @media print {
    display: none;
  }
`

const Link = styled('a')`
  display: inline-block;
  color: rgba(250, 250, 250, 0.6);
  text-decoration: none;
`

const Separator = styled('span')`
  border-left: 1px dotted rgba(250, 250, 250, 0.6);

  @media only screen and (max-width: 50rem) {
    display: none;
  }
`

const links: [href: string | URL, name: string][] = [
  ['https://github.com/CursedHardware/esim-qrcode-portal/blob/main/LICENSE', 'MIT LICENSE'],
  ['https://github.com/CursedHardware/esim-qrcode-portal', 'Source Code'],
]

export const Footer = memo(() => (
  <Container>
    {links.map(([href, name], index) => (
      <Fragment key={index}>
        {index > 0 && <Separator />}
        <Link href={href.toString()} target='_blank'>
          {name}
        </Link>
      </Fragment>
    ))}
  </Container>
))
