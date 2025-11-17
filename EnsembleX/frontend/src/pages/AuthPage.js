import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

export default function AuthPage(){
  const [mode,setMode] = useState('login');
  const [form,setForm] = useState({ username:'', email:'', password:'' });
  const { api, login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      if(mode === 'register'){
        const res = await api.post('/auth/register', { username: form.username, email: form.email, password: form.password });
        if(res.data.success){ login(res.data); nav('/home'); }
      } else {
        const res = await api.post('/auth/login', { email: form.email, password: form.password });
        if(res.data.success){ login(res.data); nav('/home'); }
      }
    }catch(err){ alert('Error: '+ (err.response?.data?.message || err.message)); }
  };

  return (
    <div className='app'>
      <div className='card auth-form'>
        <h2 className='logo'>EnsembleX</h2>
        <p className='muted'>{mode==='login' ? 'Welcome Back!' : 'Create your account'}</p>
        <form onSubmit={submit}>
          {mode==='register' && <input placeholder='Username' value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required/>}
          <input placeholder='Email' type='email' value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
          <input placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
          <button className='btn' type='submit'>{mode==='login' ? 'Login' : 'Register'}</button>
        </form>
        <p className='muted' style={{marginTop:10}}>{mode==='login' ? "Don't have an account?" : "Already have an account?"} <a href='#' onClick={e=>{e.preventDefault(); setMode(mode==='login'?'register':'login')}}>{mode==='login'?' Sign up':' Sign in'}</a></p>
      </div>
    </div>
  )
}
