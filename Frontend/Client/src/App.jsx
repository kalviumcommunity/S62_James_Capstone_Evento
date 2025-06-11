import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import EventoLogin from './pages/LoginPage'


function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<EventoLogin />} />
    </Routes>
    </>
  )
}

export default App
