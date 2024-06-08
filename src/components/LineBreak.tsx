import styled from '@emotion/styled'
import { FC, memo } from 'react'

const Container = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  @media print {
    display: none;
  }
`

const HorizontalRule = styled('hr')`
  width: 40%;
  opacity: 0.25;
`

const Text = styled('span')`
  width: 15%;
  text-align: center;
  font-size: 1.875rem;
`

export const LineBreak: FC = memo(() => (
  <Container>
    <HorizontalRule />
    <Text>OR</Text>
    <HorizontalRule />
  </Container>
))
