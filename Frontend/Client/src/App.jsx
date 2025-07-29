
import React from 'react';
import {  Routes, Route } from 'react-router-dom'; 
import EventoApp from './EventoApp';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Error404 from './pages/Error404';
import EventForm from './components/EventForm';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<EventoApp />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path= "/signUp" element = {<SignUpPage />}></Route>
        <Route path="/error" element={<Error404 />} />
        <Route path="/eventform" element={<EventForm />} />
      </Routes>
  );
};

export default App;
