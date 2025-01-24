import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './appInfo.jsx'

const root = createRoot(document.getElementById('root'))

root.render(
    < App />
)
