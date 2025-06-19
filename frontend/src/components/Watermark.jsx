import { useEffect, useState } from 'react'

const Watermark = () => {
  const [user, setUser] = useState('')
  const [time, setTime] = useState(new Date().toLocaleString())

  useEffect(() => {
    const token = localStorage.getItem('access')
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {}
    setUser(payload?.username || 'usuário')

    const interval = setInterval(() => {
      setTime(new Date().toLocaleString())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="watermark">
      {user} - {time}
    </div>
  )
}

export default Watermark
