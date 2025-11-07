import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SidebarLayout from './components/SidebarLayout';
import Dashboard from './pages/Dashboard';
import UserSearch from './pages/UserSearch';
import Project from './pages/Project';
import TaskFormPage from './pages/TaskFormPage';

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
            <Route path='/projects/:id/tasks' element={<Project />} />
            <Route path='/projects/:projectId/new-task' element={<TaskFormPage />} />
            <Route path='/projects/:projectId/edit-task/:taskId' element={<TaskFormPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
