# Todo Full Stack Application

A full-stack application for managing your daily tasks. This application includes a Node.js backend with Express and MongoDB, and a vanilla JavaScript frontend.

## Features

*   User authentication (signup and login)
*   Create, Read, Update, and Delete (CRUD) operations for todos
*   Mark todos as done/undone
*   Responsive design

## Technologies Used

**Backend:**

*   Node.js
*   Express.js
*   MongoDB (with Mongoose)
*   JSON Web Tokens (JWT) for authentication

**Frontend:**

*   HTML
*   CSS
*   Vanilla JavaScript

## Project Structure

```
.
├── backend/
│   ├── db.js           # MongoDB connection and schemas
│   ├── index.js        # Express server setup and API routes
│   └── README.md       # Backend specific information (if any)
├── frontend/
│   ├── index.html      # Main entry point for the frontend (could be login/signup page)
│   ├── script.js       # General JavaScript for frontend logic
│   ├── css/
│   │   └── styles.css  # CSS styles
│   ├── pages/
│   │   ├── login.html
│   │   ├── signup.html
│   │   └── todo.html   # Page to display and manage todos
│   └── utilities/      # Placeholder for images or other static assets
├── .gitignore          # Specifies intentionally untracked files that Git should ignore
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Records exact versions of dependencies
└── README.md           # This file
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/soumomo/todo-full-stack.git
    cd todo-full-stack
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```
    *(Assuming frontend does not have separate dependencies to install via npm. If it does, add steps for `cd frontend && npm install`)*

3.  **Set up environment variables:**
    The backend might require a `.env` file for configuration (e.g., MongoDB connection string, JWT secret). Create a `.env` file in the `backend` directory.
    Example `backend/.env`:
    ```
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=3000
    ```

4.  **Start the backend server:**
    ```bash
    cd backend
    npm start 
    ```
    *(Or whatever command is specified in `backend/package.json` or `index.js` to start the server, e.g., `node index.js`)*

5.  **Open the frontend:**
    Open `frontend/index.html` (or `frontend/pages/login.html` / `signup.html` as appropriate) in your web browser.

## Usage

1.  Navigate to the signup page (`frontend/pages/signup.html`) to create a new account.
2.  Log in with your credentials on the login page (`frontend/pages/login.html`).
3.  Once logged in, you will be redirected to the todo page (`frontend/pages/todo.html`) where you can manage your tasks.

---

*This README was framed on 13 June 2025.*
