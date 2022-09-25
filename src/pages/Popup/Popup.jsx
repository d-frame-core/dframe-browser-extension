import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
// Views
import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route path='*' element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
