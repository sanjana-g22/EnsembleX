import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import axios from "axios";

export default function PostPage() {
  const { id } = useParams();
  const { api } = useAuth();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [authorProfile, setAuthorProfile] = useState(null);
  const [amIFollowing, setAmIFollowing] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const meId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))._id;
    } catch {
      return null;
    }
  })();

  // -------------------------------------------------------
  // LOAD POST + AUTHOR (does NOT overwrite follow state)
  // -------------------------------------------------------
  const load = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      const loadedPost = res.data.post;
      setPost(loadedPost);

      // load author
      const authorId = loadedPost.author?._id;
      if (authorId) {
        const userRes = await api.get(`/users/${authorId}`);
        const author = userRes.data.user;
        setAuthorProfile(author);

        // set follow state only initially
        if (amIFollowing === null) {
          const isFollowing = author.followers?.some(
            (f) => String(f) === String(meId)
          );
          setAmIFollowing(!!isFollowing);
        }
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]); // no ESLint comment needed

  // -------------------------------------------------------
  // FOLLOW / UNFOLLOW
  // -------------------------------------------------------
  const toggleFollow = async () => {
    try {
      const newState = !amIFollowing;
      setAmIFollowing(newState);

      // update UI followers list instantly
      setAuthorProfile((prev) => {
        if (!prev) return prev;
        const followers = prev.followers || [];

        return {
          ...prev,
          followers: newState
            ? [...followers, meId] // add myself
            : followers.filter((f) => String(f) !== String(meId)), // remove myself
        };
      });

      // hit backend
      const resp = await axios.post(
        `http://localhost:5000/api/users/${post.author._id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // backend tells us actual final state
      setAmIFollowing(resp.data.following);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  // -------------------------------------------------------
  // LIKE / UNLIKE (update local likes only)
  // -------------------------------------------------------
  const like = async () => {
    try {
      const res = await api.post(`/posts/${id}/like`);
      const liked = res.data.liked;

      setPost((prev) => {
        if (!prev) return prev;
        const likes = prev.likes || [];

        return {
          ...prev,
          likes: liked
            ? [...likes, meId] // add me
            : likes.filter((u) => String(u) !== String(meId)), // remove me
        };
      });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // -------------------------------------------------------
  // SAVE (no UI change needed here)
  // -------------------------------------------------------
  const save = async () => {
    try {
      await api.post(`/posts/${id}/save`);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // -------------------------------------------------------
  // COMMENT
  // -------------------------------------------------------
  const addComment = async () => {
    try {
      const res = await api.post(`/posts/${id}/comment`, { text: comment });
      setComment("");
      setPost((prev) => ({ ...prev, comments: res.data.comments }));
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  // -------------------------------------------------------
  // RATE
  // -------------------------------------------------------
  const rate = async (score) => {
    try {
      const res = await api.post(`/posts/${id}/rate`, { score });
      setPost((prev) => ({ ...prev, avgRating: res.data.avgRating }));
    } catch (err) {
      console.error("Rate error:", err);
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  if (!post)
    return (
      <div className="app">
        <div className="card">Loading...</div>
      </div>
    );

  return (
    <div className="app">
      <div className="card" style={{ display: "flex", gap: 16 }}>
        <img
          src={`http://localhost:5000${post.imagePath}`}
          alt="post"
          style={{ maxWidth: "400px" }}
        />

        <div style={{ flex: 1 }}>
          {/* USERNAME */}
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${post.author._id}`)}
          >
            {post.author.username}
          </h3>

          {/* FOLLOWERS - FOLLOWING */}
          {authorProfile && (
            <div className="muted" style={{ marginBottom: 6 }}>
              {authorProfile.followers?.length || 0} followers •{" "}
              {authorProfile.following?.length || 0} following
            </div>
          )}

          {/* FOLLOW BUTTON */}
          {authorProfile && authorProfile._id !== meId && amIFollowing !== null && (
            <button
              className="btn"
              onClick={toggleFollow}
              style={{
                background: amIFollowing ? "#5a275a" : "#8b005d",
                color: "white",
                padding: "6px 14px",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              {amIFollowing ? "Following" : "Follow"}
            </button>
          )}

          {/* CAPTION */}
          <p className="muted">{post.caption}</p>

          {/* LIKE + SAVE */}
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={like}>
              <i className="fa fa-heart"></i>{" "}
              {post.likes?.length || 0}
            </button>

            <button className="btn" onClick={save} style={{ marginLeft: 8 }}>
              <i className="fa fa-bookmark"></i>
            </button>
          </div>

          {/* RATING */}
          <div style={{ marginTop: 12 }}>
            <strong>Average rating:</strong> {post.avgRating?.toFixed(1) || 0}
            <div style={{ marginTop: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => rate(n)}
                  className="btn"
                  style={{ marginRight: 6 }}
                >
                  {n}★
                </button>
              ))}
            </div>
          </div>

          {/* COMMENTS */}
          <div style={{ marginTop: 12 }}>
            <h4>Comments</h4>

            {post.comments?.map((c) => (
              <div key={c._id} className="card" style={{ marginBottom: 8 }}>
                <strong>{c.author?.username}</strong>
                <p className="muted">{c.text}</p>
              </div>
            ))}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            ></textarea>

            <button className="btn" onClick={addComment}>
              Add comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
