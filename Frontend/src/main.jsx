import './styles/index.css'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './components/common/ThemeProvider.jsx'

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
