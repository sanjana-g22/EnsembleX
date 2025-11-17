import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';

function PostCard({ p, onLike, onSave }){
  return (
    <div className='card post-card'>
      <Link to={'/post/'+p._id}><img src={'http://localhost:5000'+p.imagePath} alt='post' /></Link>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
        <div><strong>{p.author.username}</strong><div className='muted'>{p.caption?.slice(0,80)}</div></div>
        <div style={{textAlign:'right'}}>
          <button className='btn' onClick={()=>onLike(p._id)} style={{marginRight:6}}><i className='fa fa-heart'></i> {p.likes?.length||0}</button>
          <button className='btn' onClick={()=>onSave(p._id)}><i className='fa fa-bookmark'></i></button>
        </div>
      </div>
    </div>
  )
}

export default function HomePage(){
  const { api, user } = useAuth();
  const [posts,setPosts] = useState([]);
  const [q,setQ] = useState('');

  useEffect(()=>{ fetchPosts(); },[]);
  const fetchPosts = async ()=>{
    try{ const res = await api.get('/posts'); setPosts(res.data.posts); }catch(err){ console.error(err); }
  };
  const like = async (id)=>{ try{ await api.post('/posts/'+id+'/like'); fetchPosts(); }catch(err){ console.error(err); } };
  const save = async (id)=>{ try{ await api.post('/posts/'+id+'/save'); fetchPosts(); }catch(err){ console.error(err); } };
  const search = async (e)=>{ e.preventDefault(); try{ const res = await api.get('/posts?search='+encodeURIComponent(q)); setPosts(res.data.posts);}catch(err){console.error(err);} }

  return (
    <div className='app'>
      <div className='nav'>
        <div className='logo'>EnsembleX</div>
        <form onSubmit={search} style={{flex:1,margin:'0 12px'}}>
          <input placeholder='Search outfits, users, tags...' value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%', padding:10, borderRadius:8}} />
        </form>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <Link to='/create' className='btn'>Create</Link>
          <Link to={'/profile/'+(user?.id || '')} className='btn'>Profile</Link>
        </div>
      </div>

      <div className='grid'>
        {posts.map(p=> <PostCard key={p._id} p={p} onLike={like} onSave={save} />)}
      </div>
    </div>
  )
}
