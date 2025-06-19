import { useEffect } from 'react'

const Protections = () => {
  useEffect(() => {
    const blockKeys = (e) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['p', 's', 'u'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault()
        alert('Ação bloqueada por segurança.')
      }
    }

    const blockContextMenu = (e) => e.preventDefault()

    window.addEventListener('keydown', blockKeys)
    window.addEventListener('contextmenu', blockContextMenu)

    return () => {
      window.removeEventListener('keydown', blockKeys)
      window.removeEventListener('contextmenu', blockContextMenu)
    }
  }, [])

  return null
}

export default Protections
