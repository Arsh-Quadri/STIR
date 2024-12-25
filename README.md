## Introduction
This project demonstrates a full-stack application with a Vite-powered React frontend and an Express-based Node.js backend. It includes functionality such as trending topic scraping and storing data in MongoDB.

## Folder Structure
## Installation and Setup

### Frontend
1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

### Backend
1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file with the following variables:
    ```env
    MONGO_URI=<Your MongoDB URI>
    PROXY=<Your Proxy URL>
    USERNAME=<your username of x>
    PASSWORD=<your password of x>
    ```
4. Start the backend server:
    ```bash
    node app.js
    ```
