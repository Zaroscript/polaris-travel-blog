
# Project Title

A brief description of what this project does and who it's for

# Polaris Travel Blog

A modern, feature-rich travel blog platform built with React, TypeScript, Node.js, and PostgreSQL.

# Project presentation video and preview

- Video: [Presentation video](https://drive.google.com/file/d/1-rdDh86srBd1Jvz6GXP1xW9z_4MeK8wk/view?usp=drive_link)
- Video: [Presentation Preview](https://prezi.com/p/spufppdllfby/travel-blog/)



## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Project Overview

Polaris Travel Blog is a comprehensive platform for travel enthusiasts to share their experiences, connect with other travelers, and discover new destinations. The platform combines modern web technologies with a user-friendly interface to create an engaging travel community.

### Key Objectives

- Provide a platform for travelers to share their experiences
- Create an engaging community for travel enthusiasts
- Offer real-time communication features
- Ensure a seamless user experience across devices
- Implement robust security measures
- Maintain high performance and scalability

## Features

### Core Features

- **User Authentication**

  - Secure registration and login
  - JWT-based authentication
  - Password recovery system
  - Role-based access control

- **Blog Management**

  - Create, edit, and delete blog posts
  - Rich text editor
  - Image upload and management
  - Tag-based categorization
  - Search functionality

- **Social Features**

  - Real-time chat system
  - Comment system
  - Like and share functionality
  - User profiles
  - Follow system

- **Travel Features**
  - Destination showcase
  - Interactive maps
  - Travel guides
  - Trip planning tools
  - Weather integration

### Technical Features

- **Frontend**

  - Responsive design
  - Dark/Light theme support
  - Progressive Web App capabilities
  - Optimized performance
  - Accessibility compliance

- **Backend**
  - RESTful API
  - Real-time capabilities
  - File upload system
  - Caching system
  - Rate limiting

## Technical Stack

### Frontend

- React 18
- TypeScript
- Zustand (State Management)
- Tailwind CSS
- Socket.IO Client
- React Query
- React Router
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.IO
- JWT Authentication
- Winston Logger

### Development Tools

- Git
- ESLint
- Prettier
- Jest
- Docker
- GitHub Actions

## Project Structure

```
polaris-travel-blog/
├── client/                 # Frontend application
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── styles/        # Global styles
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend application
│   ├── src/              # Source code
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   └── types/        # TypeScript types
│   ├── prisma/           # Database schema
│   └── package.json      # Backend dependencies
│
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- Git
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/polaris-travel-blog.git
cd polaris-travel-blog
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:

```bash
# Create .env files for both frontend and backend
cp .env.example .env
```

4. Start the development servers:

```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd client
npm run dev
```

## Development Guide

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Document complex functions and components

### Git Workflow

1. Create a new branch for each feature
2. Make atomic commits
3. Submit pull requests for review
4. Resolve conflicts before merging

### Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## API Documentation

### Authentication

#### Register

- **POST** `/api/auth/register`
- Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login

- **POST** `/api/auth/login`
- Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Blog Posts

#### Create Post

- **POST** `/api/posts`
- Requires authentication
- Request body:

```json
{
  "title": "My Travel Experience",
  "content": "Blog content...",
  "excerpt": "Short description...",
  "tags": ["travel", "adventure"]
}
```

#### Get Posts

- **GET** `/api/posts`
- Query parameters:
  - `page`: Page number
  - `limit`: Items per page

## Deployment

### Frontend Deployment

1. Build the application:

```bash
cd client
npm run build
```

2. Deploy to your preferred hosting service (e.g., Vercel, Netlify)

### Backend Deployment

1. Build the application:

```bash
cd server
npm run build
```

2. Set up environment variables on the server
3. Start the production server:

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to:

- **ENG/Basma Abdel Halim** - Project Supervisor
- All team members for their contributions
- Open-source community for their tools and libraries

## Contact

For any questions or suggestions, please contact:

- Email: andrewazer18@gmail.com
- GitHub: [Zaroscript](https://github.com/Zaroscript)
