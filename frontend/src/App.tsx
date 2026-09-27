import { useState } from 'react'

function App() {
  const [crash, setCrash] = useState(false)

  // Удалить после проверки
  if (crash) {
    throw new Error('Test error from frontend')
  }

  return (
    <div>
      <h1>PC Parts Shop</h1>
      {/* Удалить после проверки*/}
      <button onClick={() => setCrash(true)}>Trigger frontend error</button>
    </div>
  )
}

export default App