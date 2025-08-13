
// import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import TaskDetails from './pages/TaskDetails/TaskDetails'
// import Model from 'react-modal';

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/task/:id" exact element={<TaskDetails />} />
    </Routes>
  </Router>
);


const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}


export default App
