import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';
import { AuthProvider, useAuth } from './utils/auth';

function Private({ children }){
  const { token } = useAuth();
  return token ? children : <Navigate to='/' />;
}

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthPage/>} />
          <Route path='/home' element={<Private><HomePage/></Private>} />
          <Route path='/create' element={<Private><CreatePostPage/></Private>} />
          <Route path='/post/:id' element={<Private><PostPage/></Private>} />
          <Route path='/profile/:id' element={<Private><ProfilePage/></Private>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
