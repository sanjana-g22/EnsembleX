# 🚀 EnsembleX - MERN Full-Stack Social Platform

A full-stack social media platform built using the **MERN Stack** that enables users to create and interact with content through posts, likes, comments, ratings, follows, bookmarks, and personalized notifications.

Designed as a scalable and modular project, EnsembleX demonstrates modern full-stack web development practices including secure authentication, RESTful APIs, media uploads, and responsive frontend architecture.

---

# ✨ Features

## 👤 Authentication & User Management

* Secure user registration and login
* JWT-based authentication
* Password hashing using bcrypt
* User profile management
* Edit profile information
* Follow / Unfollow users

---

## 📝 Post Management

* Create posts with:

  * Image uploads
  * Captions
  * Hashtags
  * Categories
  * Brand tags
* View detailed post pages
* Responsive feed displaying recent posts

---

## ❤️ Social Interaction

Users can interact with posts by:

* Like / Unlike posts
* Save (Bookmark) posts
* Add comments
* Rate posts (1–5 stars)

---

## 🔔 Notification System

Automatic notifications are generated for:

* New followers
* Likes on posts
* Comments on posts

Notifications are stored within the user's profile for future retrieval.

---

## 🔍 Search & Filtering

* Search users
* Search posts
* Filter posts by category
* Sort posts by:

  * ⭐ Highest Rated
  * 💬 Most Commented
  * 🕒 Newest

---

## 🎨 Frontend

Developed using React with clean component-based architecture.

Pages include:

* Authentication
* Home Feed
* User Profile
* Create Post
* Individual Post View

The frontend uses plain CSS for styling, making the project lightweight and easy to customize.

---

# 🛠 Tech Stack

## Frontend

* React
* React Router
* Axios
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* bcrypt

---

# 📁 Project Structure

```
EnsembleX/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/EnsembleX.git

cd EnsembleX
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

PORT=5000
```

Start the backend server:

Development mode:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## 3. Frontend Setup

Open another terminal.

```bash
cd frontend

npm install

npm start
```

The React application will launch on:

```
http://localhost:3000
```

Backend API:

```
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

Required variables:

| Variable   | Description                            |
| ---------- | -------------------------------------- |
| MONGO_URI  | MongoDB Connection URI                 |
| JWT_SECRET | Secret key used for JWT authentication |
| PORT       | Backend server port                    |

---

# 📡 API Highlights

### Authentication

* Register
* Login
* JWT Authentication

### Users

* View Profile
* Update Profile
* Follow User
* Unfollow User

### Posts

* Create Post
* Upload Images
* Like / Unlike
* Save / Unsave
* Comment
* Rate
* Delete

### Search

* Search Users
* Search Posts
* Category Filter
* Sorting

### Notifications

* Follow Notifications
* Like Notifications
* Comment Notifications

---

# 🖼 Image Upload

Image uploads are handled using **Multer**, allowing users to attach media to their posts.

---

# 🔒 Security Features

* JWT Authentication
* Password hashing with bcrypt
* Protected API routes
* Middleware-based authorization
* Input validation

---

# 📈 Future Enhancements

* Infinite scrolling
* Image CDN integration (Cloudinary/AWS S3)
* Real-time notifications
* Chat/Messaging
* Dark mode
* OAuth login (Google/GitHub)
* Responsive mobile optimization
* Admin dashboard
* Post sharing
* Story feature
* User analytics

---

# 📚 Learning Outcomes

This project demonstrates practical implementation of:

* MERN Stack Development
* RESTful API Design
* Authentication & Authorization
* MongoDB Data Modeling
* File Upload Handling
* Full-Stack State Management
* React Component Architecture
* Secure Backend Development
* CRUD Operations
* Search & Filtering Systems

---

# 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

# 📄 License

This project is intended for educational and learning purposes.
