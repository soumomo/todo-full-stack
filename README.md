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

<<<<<<< HEAD
=======
## Deployment

Deploying this full-stack application involves setting up the backend (Node.js and MongoDB) and the frontend (static HTML, CSS, JS).

### 1. Backend Deployment (Node.js & MongoDB)

**A. Choose a Hosting Platform for Node.js:**
   - **PaaS (Platform as a Service):** Heroku, Render, Fly.io. These often simplify deployment and may offer MongoDB add-ons.
   - **VPS (Virtual Private Server):** AWS EC2, DigitalOcean Droplets, Linode. Offers more control but requires manual server setup (Node.js, potentially MongoDB, firewall, process manager like PM2).
   - **Serverless:** AWS Lambda, Google Cloud Functions (might require code restructuring).

**B. Deploy MongoDB:**
   - **MongoDB Atlas (Recommended):**
     - Create a free or paid cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
     - **IP Access List:** In your Atlas cluster settings (Network Access), add the IP address of your deployed backend server. For initial testing or if your backend server's IP is dynamic, you can add `0.0.0.0/0` (allow access from anywhere). **IMPORTANT: For production, restrict this to only the necessary IP addresses for security.**
     - **Database User:** Ensure you have a database user with appropriate permissions.
     - **Connection String:** Get the connection string from Atlas (e.g., `mongodb+srv://<username>:<password>@clustername.mongodb.net/yourdbname?retryWrites=true&w=majority`). This will be used as an environment variable in your Node.js app.
   - **Self-Hosted MongoDB (on a VPS):**
     - Install MongoDB on your server.
     - Configure `mongod.conf` (usually in `/etc/mongod.conf`):
       - Set `net.bindIp` to `0.0.0.0` to allow connections from any IP, or to the specific public IP of your server.
       - Ensure `security.authorization` is enabled (`enabled`).
     - Set up firewall rules (e.g., `ufw` on Ubuntu) to allow incoming connections on port `27017` from your backend application's IP or `0.0.0.0/0` (again, be restrictive for production).
     - Create a database and a user with strong credentials.

**C. Configure and Deploy Node.js Application:**
   - **Environment Variables:** On your chosen hosting platform, set the following environment variables:
     - `MONGODB_URI`: Your MongoDB connection string.
     - `JWT_SECRET`: A strong, unique secret key for JWT signing.
     - `PORT`: The platform will usually provide this, or you can set it (e.g., `3000` or `8080`).
   - **`package.json`:** Ensure your `scripts.start` command is appropriate for production (e.g., `node backend/index.js`).
   - **Deployment Method:**
     - **PaaS:** Typically involves connecting your Git repository and pushing changes. The platform handles the build and deployment.
     - **VPS:** Clone your repository, install dependencies (`npm install` in the `backend` directory), and use a process manager like PM2 (`pm2 start backend/index.js --name todo-app`) to run and manage your application.

### 2. Frontend Deployment (Static Files)

Since the frontend consists of HTML, CSS, and JavaScript files, you can host it on various static site hosting services:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 (with CloudFront)
   - Firebase Hosting

   Deployment usually involves connecting your Git repository or uploading the `frontend` directory contents.

### 3. Connecting Frontend to Backend

   - **Update API Endpoints:** In your frontend JavaScript files (e.g., `frontend/script.js`, `frontend/pages/login.html`, `frontend/pages/signup.html`, `frontend/pages/todo.html`), you'll need to change the API base URL from localhost to your deployed backend's URL.
     For example, if your fetch calls look like:
     ```javascript
     fetch('http://localhost:3000/api/auth/login', { /* ... */ });
     ```
     You'll need to change them to:
     ```javascript
     fetch('https://your-deployed-backend-url.com/api/auth/login', { /* ... */ });
     ```
     Replace `https://your-deployed-backend-url.com` with the actual URL of your deployed Node.js backend.

### Deployment on Vercel

This project can be deployed to Vercel with the frontend as a static site and the backend as serverless functions.

### Environment Variables on Vercel

You must set the following environment variables in your Vercel project settings for the backend deployment:

- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A strong, unique secret key for JWT signing.
- `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-frontend-app.vercel.app`). This is used for CORS configuration.

**Important:** Do not commit your `.env` file to GitHub. These variables should only be set in the Vercel dashboard.

### Setup Steps:

1.  **Push your code to a GitHub repository.**
2.  **Import your project to Vercel.**
3.  **Configure the Backend:**
    *   Vercel should automatically detect the Node.js backend using the `vercel.json` file.
    *   Set the environment variables (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`) in the Vercel project settings.
4.  **Configure the Frontend:**
    *   Create a new Vercel project or configure the existing one.
    *   Set the **Root Directory** to `frontend`.
    *   The build command can usually be left blank for static HTML/CSS/JS sites.
    *   You might need to set an environment variable for the frontend if your `script.js` is adapted to use one for the API base URL (e.g., `NEXT_PUBLIC_API_URL` if you were using Next.js, or a custom one).

### `vercel.json`

A `vercel.json` file is included in the root of the project to instruct Vercel how to build and route the backend:

```json
{
  "version": 2,
  "builds": [
    { "src": "backend/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/index.js" }
  ]
}
```

This configuration tells Vercel to build `backend/index.js` as a Node.js serverless function and route all requests starting with `/api/` to it.

>>>>>>> 8548f74 (Fix: Align Express routes with Vercel routing by adding /api prefix)
---

*This README was framed on 13 June 2025.*
