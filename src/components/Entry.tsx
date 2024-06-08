import styled from '@emotion/styled'
import { FC } from 'react'
import { Card } from './Card'
import { Footer } from './Footer'

const Container = styled('main')`
  background-color: #fff;

  padding: 1.25rem;

  border: 1px solid #e5e5e5;
  border-radius: 1rem;

  width: 100%;
  max-width: 50rem;

  @media only screen and (max-width: 50rem) {
    background-color: transparent;

    padding: 0;
    border: none;
    border-radius: 0;
  }

  @media print {
    border: 0;
  }
`

export const Entry: FC = () => (
  <>
    <Container>
      <Card />
    </Container>
    <Footer />
  </>
)
