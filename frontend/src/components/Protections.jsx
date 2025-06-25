import { useEffect } from 'react'

const Protections = () => {
  useEffect(() => {
    const blockKeys = (e) => {
      const key = e.key.toLowerCase()
      if (
        key === 'printscreen' ||
        (e.ctrlKey && ['p', 's', 'u'].includes(key))
      ) {
        e.preventDefault()
        alert('Ação bloqueada por segurança.')
      }
    }

    const blockContextMenu = (e) => {
      e.preventDefault()
      alert('Clique direito desativado por segurança.')
    }

    const blockZoomScroll = (e) => {
      if (e.ctrlKey) e.preventDefault()
    }

    const beforePrint = () => {
      alert('Impressão desativada para este conteúdo.')
    }

    window.addEventListener('keydown', blockKeys)
    window.addEventListener('contextmenu', blockContextMenu)
    window.addEventListener('wheel', blockZoomScroll, { passive: false })
    window.addEventListener('beforeprint', beforePrint)

    return () => {
      window.removeEventListener('keydown', blockKeys)
      window.removeEventListener('contextmenu', blockContextMenu)
      window.removeEventListener('wheel', blockZoomScroll)
      window.removeEventListener('beforeprint', beforePrint)
    }
  }, [])

  return null
}

export default Protections
