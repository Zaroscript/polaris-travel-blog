# Travel Blog API

This repository contains the backend API for a travel blog application. It utilizes Node.js, Express.js, Socket.IO, Cloudinary, JWT, and MongoDB to provide a robust and scalable backend for managing user authentication, profile updates, real-time messaging, media uploads, and password recovery.

## Features

- **User Authentication:** Secure user registration, login, and logout using JWT.
- **Profile Management:** Users can update their profiles, including profile pictures uploaded to Cloudinary.
- **Real-time Messaging:** Integrated Socket.IO for real-time chat functionality between users.
- **Media Uploads:** Cloudinary integration for efficient image storage and retrieval.
- **Database:** MongoDB for persistent data storage.
- **Protected Routes:** JWT-based authentication for secure API endpoints.
- **Password Recovery:** Functionality to allow users to reset forgotten passwords.
- **Notifications:** Functionality to manage user notifications.

## Technologies

- Node.js
- Express.js
- Socket.IO
- Cloudinary
- JSON Web Tokens (JWT)
- MongoDB
- Mongoose
- nodemailer

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone "https://github.com/mariam-nabil-dev/travel-blog-api"
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd travel-blog-api
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Create a `.env` file in the root directory and add the following environment variables:**

    ```plaintext
    MONGODB_URI=<your_mongodb_uri>
    PORT=5001
    JWT_SECRET=<your_jwt_secret>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    NODE_ENV=development
    EMAIL_USER=<your_email_user>
    EMAIL_PASS=<your_email_password>
    CLIENT_URL=<your_frontend_url>
    ```

    - Replace `<your_mongodb_uri>`, `<your_jwt_secret>`, `<your_cloudinary_cloud_name>`, `<your_cloudinary_api_key>`, `<your_cloudinary_api_secret>`, `<your_email_user>`, `<your_email_password>`, and `<your_frontend_url>` with your actual values.
    - `EMAIL_USER` and `EMAIL_PASS` are for nodemailer to send reset password emails.
    - `CLIENT_URL` is where the password reset link will redirect the user.

5.  **Start the server:**

    ```bash
    npm run dev
    ```

    The server will start at `http://localhost:5001` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.
- `POST /api/auth/logout`: Log out the current user.
- `POST /api/auth/forgot-password`: send reset password email.
- `POST /api/auth/reset-password`: reset the password using token.

### User Profile

- `PUT /api/auth/update-profile`: Update the user's profile (requires authentication).
- `GET /api/auth/check`: Check if the user is authenticated (requires authentication).
- `GET /api/auth/users`: Get list of users for sidebar (requires authentication).

### Messaging

- `GET /api/messages/:id`: Get messages between the authenticated user and another user (requires authentication).
- `POST /api/messages/send/:id`: Send a message to another user (requires authentication).

### Notifications

- `GET /api/notifications`: Get all notifications for the authenticated user (requires authentication).
- `PATCH /api/notifications/:id/read`: Mark a specific notification as read (requires authentication).
- `PATCH /api/notifications/read-all`: Mark all notifications as read (requires authentication).

## Environment Variables

- `MONGODB_URI`: The MongoDB connection string.
- `PORT`: The port on which the server will run.
- `JWT_SECRET`: The secret key used to sign JWTs.
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
- `NODE_ENV`: The environment (development or production).
- `EMAIL_USER`: Email address used by nodemailer to send emails.
- `EMAIL_PASS`: Password for the email address used by nodemailer.
- `CLIENT_URL`: URL of the frontend application.
