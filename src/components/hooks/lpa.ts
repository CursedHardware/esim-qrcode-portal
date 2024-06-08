import { FC, PropsWithChildren, createContext, createElement, useContext, useEffect, useMemo } from 'react'
import { ActivationCode } from '../../utils/ActivationCode'

const Context = createContext<ActivationCode | null>(null)

interface Props {
  readonly activationCode: string
  readonly confirmationCode: string
}

export const ActivationProvider: FC<PropsWithChildren<Props>> = (props) => {
  const activiationCode = useMemo(() => new ActivationCode(props.activationCode, props.confirmationCode), [props])
  useEffect(() => {
    if (props.activationCode === activiationCode.toString()) return
    const url = new URL(`/${activiationCode}`, location.href)
    if (activiationCode.confirmationCode) {
      url.hash = '#' + activiationCode.confirmationCode
    }
    history.replaceState(null, '', url)
  }, [props.activationCode, activiationCode])
  return createElement(Context.Provider, {
    value: activiationCode,
    children: props.children,
  })
}

export function useActivationCode(): ActivationCode {
  const activiationCode = useContext(Context)
  if (activiationCode === null) {
    throw new Error('no activation code found in context')
  }
  return activiationCode
}
