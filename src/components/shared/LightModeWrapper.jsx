import { useEffect } from 'react'

export default function LightModeWrapper({ children }) {
  useEffect(() => {
    const root = document.documentElement
    
    // Force light mode: remove dark class from root immediately
    root.classList.remove('dark')
    
    // Monitor for any attempts to add dark class back
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (root.classList.contains('dark')) {
            root.classList.remove('dark')
          }
        }
      })
    })
    
    // Start observing the document element for class changes
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Cleanup: stop observing when component unmounts
    return () => {
      observer.disconnect()
    }
  }, [])

  return <>{children}</>
}

