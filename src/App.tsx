import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SidebarLayout from './components/SidebarLayout';
import Dashboard from './pages/Dashboard';
import UserSearch from './pages/UserSearch';
import Project from './pages/Project';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route element={<SidebarLayout />} >
            <Route path='/' element={<Dashboard />} />
            <Route path='/users' element={<UserSearch />} />
            <Route path='/projects/:id' element={<Project />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
