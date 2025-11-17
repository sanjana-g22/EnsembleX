import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const AuthContext = createContext();
export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(()=>{
    if(token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  },[token]);
  useEffect(()=>{
    if(user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  },[user]);

  const login = (data)=>{ setToken(data.token); setUser(data.user); }
  const logout = ()=>{ setToken(null); setUser(null); }

  const api = axios.create({ baseURL: API, headers: { Authorization: token ? `Bearer ${token}` : '' } });
  return <AuthContext.Provider value={{ token, user, setUser, login, logout, api }}>{children}</AuthContext.Provider>
}
export const useAuth = ()=> useContext(AuthContext);
