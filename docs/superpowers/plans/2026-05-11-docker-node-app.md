# Docker Node App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a small Node.js backend and React client that can be deployed with Docker and Docker Compose.

**Architecture:** The backend is an Express API running on port 3000. The client is a Vite React app built into static files and served by Nginx, with Nginx proxying `/api` requests to the backend container through the Compose service name `server`.

**Tech Stack:** Node.js, Express, React, Vite, Docker, Docker Compose, Nginx.

---

### Task 1: Backend Application

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/server.js`

- [ ] **Step 1: Create an Express backend**

Create a server with `GET /api/health`, `GET /api/messages`, and `POST /api/messages`. The server must listen on `0.0.0.0` so Docker can publish it.

- [ ] **Step 2: Run backend locally**

Run: `cd backend && npm install && npm start`
Expected: `Server listening on port 3000`

### Task 2: Frontend Application

**Files:**
- Create: `client/package.json`
- Create: `client/index.html`
- Create: `client/src/main.jsx`
- Create: `client/src/App.jsx`
- Create: `client/src/styles.css`

- [ ] **Step 1: Create a React client**

Build a page that calls `/api/health` and `/api/messages`, displays backend status, and posts new messages.

- [ ] **Step 2: Build client**

Run: `cd client && npm install && npm run build`
Expected: Vite creates `dist/`.

### Task 3: Docker Configuration

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/.dockerignore`
- Create: `client/Dockerfile`
- Create: `client/.dockerignore`
- Create: `client/nginx.conf`
- Create: `docker-compose.yml`

- [ ] **Step 1: Add backend Dockerfile**

Use the official Node image, install production dependencies, copy source, expose port 3000, and run `npm start`.

- [ ] **Step 2: Add client Dockerfile**

Use a Node build stage for Vite and an Nginx runtime stage for static files and API proxying.

- [ ] **Step 3: Add Compose**

Define `server` and `client` services on the same default network. Publish backend on `3000:3000` and client on `8080:80`.

### Task 4: Documentation and Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Document Docker usage**

Include install notes, single-container backend commands, Compose commands, check URLs, and stop commands.

- [ ] **Step 2: Verify Docker build and runtime**

Run:
`docker build -t docker-node-backend ./backend`
`docker run -d --name docker-node-backend-check -p 3000:3000 docker-node-backend`
`curl http://localhost:3000/api/health`
`docker stop docker-node-backend-check && docker rm docker-node-backend-check`
`docker compose up --build -d`
`curl http://localhost:8080/api/health`
`docker compose down`
