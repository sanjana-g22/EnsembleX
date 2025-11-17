EnsembleX - MERN Starter (Simplified Full-Stack Project)
------------------------------------------------------
This archive contains a working MERN starter app implementing core features from your syllabus:
  - User registration, login (JWT), profile edit, follow/unfollow
  - Post creation with image upload (multer), caption, hashtags, categories, brand tags
  - Likes, saves (bookmarks), comments, rating (1-5)
  - Search endpoint for posts/users, category filtering, sort by top-rated / most-commented / newest
  - Notifications for likes/comments/follows (stored in user.notifications)
  - Frontend React app (no Tailwind, plain CSS) with Auth page, Home feed, Profile, Create Post, Post page

Important:
  - Backend uses MongoDB. Provide MONGO_URI and JWT_SECRET in backend/.env
  - To run backend:
      cd backend
      npm install
      cp .env.example .env   # then edit .env to add MONGO_URI and JWT_SECRET
      npm run dev   # requires nodemon (devDependency), or npm start
  - To run frontend:
      cd frontend
      npm install
      npm start

File layout (top-level):
  frontend/   - React app (src, public)
  backend/    - Express + Mongoose API
  README.md
  .env.example files included in backend

This project is a starting point and implements the features requested in a clear and extendable way.
If you'd like, I can expand any part (more UI polish, infinite scroll, image CDN integration) in a follow-up.
