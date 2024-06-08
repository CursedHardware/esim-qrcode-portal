import { css, injectGlobal } from '@emotion/css'
import ready from 'domready'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Entry } from './components/Entry'

const container = document.createElement('main')
container.className = css`
  padding: 1.5rem 0.5rem;
  width: 100%;
  min-width: 20rem;
  gap: 1.5rem;

  display: flex;
  align-items: center;
  flex-direction: column;

  @media only screen and (max-width: 50rem) {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }

  @media print {
    padding: 0;
  }
`
createRoot(container).render(createElement(Entry))

injectGlobal`
  * {
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;

    background-color: #513b6b;
  }

  :root {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`

ready(() => {
  document.body = document.createElement('body')
  document.body.appendChild(container)
})
