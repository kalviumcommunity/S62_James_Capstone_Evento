
import React from 'react';
import {  Routes, Route } from 'react-router-dom'; 
import EventoApp from './EventoApp';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<EventoApp />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path= "/signUp" element = {<SignUpPage />}></Route>
      </Routes>
  );
};

export default App;
