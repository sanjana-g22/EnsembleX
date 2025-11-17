import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import axios from "axios";

export default function ProfilePage() {
  const { id } = useParams();
  const { api, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState([]);

  // ⭐ ADDED: liked posts state
  const [liked, setLiked] = useState([]);

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    nav("/login");
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/" + id);
      setProfile(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) loadProfile();
  }, [id]);

  // --------------------------
  // SAVED POSTS (existing code)
  // --------------------------
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/me/saved",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaved(res.data.saved || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadSaved();
  }, []);

  // --------------------------
  // ⭐ NEW — LIKED POSTS
  // Follows EXACT SAME structure as saved posts
  // --------------------------
  useEffect(() => {
    const loadLiked = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/me/liked",   // ⭐ SAME PATTERN AS SAVED
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLiked(res.data.liked || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadLiked();
  }, []);

  const amIFollowing = profile?.followers?.includes(user?._id);

  if (!profile)
    return (
      <div className="app">
        <div className="card">Loading...</div>
      </div>
    );

  return (
    <div className="app">

      <button
        onClick={logout}
        className="btn"
        style={{
          float: "right",
          background: "#8b005d",
          color: "white",
          marginBottom: "10px",
        }}
      >
        Logout
      </button>

      <div
        className="card"
        style={{ display: "flex", gap: 16, alignItems: "center" }}
      >

        <img
          src="/default.png"
          alt="avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: 12,
            objectFit: "cover",
          }}
        />

        <div>
          <h2>{profile.username}</h2>
          <p className="muted">{profile.bio}</p>

          <div className="muted">
            {profile.followers?.length || 0} followers •{" "}
            {profile.following?.length || 0} following
          </div>
        </div>
      </div>

      {/* ------------------ POSTS ------------------ */}
      <h3 style={{ marginTop: 20 }}>Posts</h3>
      <div className="grid">
        {profile.posts?.map((p) => (
          <div key={p._id} className="card post-card">
            <img src={"http://localhost:5000" + p.imagePath} alt="post" />
          </div>
        ))}
      </div>

      {/* ------------------ SAVED ------------------ */}
      <h3 style={{ marginTop: 20 }}>Saved Posts</h3>
      <div className="grid">
        {saved.length === 0 && <p>No saved posts yet.</p>}

        {saved.map((p) => (
          <div key={p._id} className="card post-card">
            <img
              src={"http://localhost:5000" + p.imagePath}
              alt="saved"
              style={{ width: "100%", borderRadius: 12 }}
            />
          </div>
        ))}
      </div>

      
      <h3 style={{ marginTop: 20 }}>Liked Posts</h3>
      <div className="grid">
        {liked.length === 0 && <p>No liked posts yet.</p>}

        {liked.map((p) => (
          <div key={p._id} className="card post-card">
            <img
              src={"http://localhost:5000" + p.imagePath}
              alt="liked"
              style={{ width: "100%", borderRadius: 12 }}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
