import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';


function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login key="login"/>} />
          <Route path='/register' element={<Register key="register"/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
