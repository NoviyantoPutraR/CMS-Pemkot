import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import ErrorBoundary from './components/shared/ErrorBoundary'
import Toaster from './components/shared/Toaster'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

