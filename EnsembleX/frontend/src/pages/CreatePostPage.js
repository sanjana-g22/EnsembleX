import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import axios from 'axios';

export default function CreatePostPage() {
  const { api } = useAuth();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select an image');
      return;
    }

    const fd = new FormData();
    fd.append('image', file);
    fd.append('caption', caption);
    fd.append('hashtags', tags);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again — session expired');
        nav('/login');
        return;
      }

      // ✅ direct axios call ensures token is included
      const res = await axios.post('http://localhost:5000/api/posts', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // ✅ critical fix
        },
      });

      if (res.data.success) {
        alert('Post uploaded successfully!');
        nav('/home');
      } else {
        alert('Failed to upload post');
      }

    } catch (err) {
      console.error('Error uploading post:', err.response?.data || err.message);
      alert('Error creating post');
    }
  };

  return (
    <div className="app">
      <div className="card" style={{ maxWidth: 600, margin: '20px auto' }}>
        <h3>Create Outfit Post</h3>
        <form onSubmit={submit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <textarea
            placeholder="Caption and keywords"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
          ></textarea>
          <input
            placeholder="hashtags, comma separated"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button className="btn" type="submit">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
