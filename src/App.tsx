import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
