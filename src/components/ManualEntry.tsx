import styled from '@emotion/styled'
import { FC, ReactNode, memo } from 'react'
import { useActivationCode } from './hooks/lpa'

const Container = styled('section')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media only screen and (min-width: 36rem) {
    max-width: 36rem;
  }

  @media print {
    align-items: start;
    gap: 1rem;
  }
`

const Title = styled('h3')`
  margin: 0;

  font-size: 1.75rem;
  text-transform: uppercase;

  @media print {
    display: none;
  }
`

const HintMessage = styled('p')`
  margin: 0;

  font-size: 1.125rem;
  text-align: center;

  @media print {
    display: none;
  }
`

const Form = styled('section')`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  section {
    min-width: 15rem;
    font-size: 1rem;
    line-height: 1.5;
  }

  h4 {
    margin: 0;

    color: #8a8f93;
    font-weight: normal;
    text-transform: uppercase;
  }

  pre {
    margin: 0;

    word-break: break-all;
    white-space: pre-wrap;
  }
`

export const ManualEntry: FC = () => {
  const activation = useActivationCode()
  return (
    <Container>
      <Title>Manual Entry</Title>
      <HintMessage>
        To install, go to your phone settings and enter in the information below or refer to your specific phone's
        manual.
      </HintMessage>
      <Form>
        <Field title='SM-DP+ Address' children={activation.address} />
        <Field title='Matching ID' children={activation.matchingId} />
        <Field
          title='Confirmation Code'
          children={() => {
            const code = activation.confirmationCode
            if (code === undefined) return undefined
            if (code.length === 0) return '<confirmation code required, but unknown>'
            return code
          }}
        />
        <Field title='Full Activation Code' children={activation.toURI()} />
      </Form>
    </Container>
  )
}

interface FieldProps {
  readonly title: ReactNode
  readonly children?: ReactNode | (() => ReactNode)
}

const Field = memo<FieldProps>((props) => {
  const children = typeof props.children === 'function' ? props.children() : props.children
  if (isEmpty(children)) return null
  return (
    <section>
      <h4>{props.title}</h4>
      <pre>{children}</pre>
    </section>
  )
})

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.length === 0
  if (typeof value === 'object' && 'length' in value) return value.length === 0
  return false
}
