import { createRoot } from 'react-dom/client'

function App() {
  return <h1>Hello React!</h1>
}

const root = createRoot(document.getElementById('app'))
root.render(<App />)
