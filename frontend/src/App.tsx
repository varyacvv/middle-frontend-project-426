function App() {
  return (
    <div>
      <h1>Комплектующие</h1>
      {/* Удалить после проверки */}
      <button
        onClick={() => {
          throw new Error('Test error from frontend')
        }}
      >
        Trigger frontend error
      </button>
    </div>
  )
}

export default App