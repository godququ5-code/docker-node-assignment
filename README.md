# Docker Node.js Deployment Assignment

Repository: https://github.com/godququ5-code/docker-node-assignment

This repository demonstrates how to deploy a Node.js backend with Docker and how to run a React client and Node.js server together with Docker Compose.

## Project Structure

```text
.
├── backend/              # Express API server
├── client/               # React + Vite client served by Nginx
├── docker-compose.yml    # Runs client and server together
└── README.md             # Assignment report and commands
```

## Sources Used

- Docker tutorial: https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/
- Node.js Docker guide: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
- Docker hello-world example: https://www.bogotobogo.com/DevOps/Docker/Docker_Hello_World_Application.php
- Client/server Compose example: https://medium.com/@xiaolishen/develop-in-docker-a-node-backend-and-a-react-front-end-talking-to-each-other-5c522156f634

## 1. Install Docker

Install Docker Desktop from the official Docker documentation:

https://docs.docker.com/desktop/

On macOS, Docker can also be provided by Docker CLI plus Colima:

```bash
brew install docker docker-compose colima
mkdir -p ~/.docker
node -e "const fs=require('fs'); const p=process.env.HOME+'/.docker/config.json'; const cfg=fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')||'{}'):{}; cfg.cliPluginsExtraDirs=[...new Set([...(cfg.cliPluginsExtraDirs||[]), '/opt/homebrew/lib/docker/cli-plugins'])]; fs.writeFileSync(p, JSON.stringify(cfg, null, 2));"
colima start
```

After installation, verify Docker:

```bash
docker --version
docker compose version
docker run hello-world
```

## 2. Run the Backend in One Docker Container

Build the backend image:

```bash
docker build -t docker-node-backend ./backend
```

Run the backend container:

```bash
docker run -d --name docker-node-backend-check -p 3000:3000 docker-node-backend
```

Check that the backend works:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/messages
```

Stop container execution:

```bash
docker stop docker-node-backend-check
docker rm docker-node-backend-check
```

## 3. Run Client and Server with Docker Compose

Build and start both containers:

```bash
docker compose up --build -d
```

Open the client:

```text
http://localhost:8081
```

Check communication through the client container and Nginx proxy:

```bash
curl http://localhost:8081/api/health
curl http://localhost:8081/api/messages
```

The `client` container serves the React app with Nginx. Requests to `/api/` are proxied to the `server` container by using the Compose service name:

```nginx
proxy_pass http://server:3000/api/;
```

Stop the system:

```bash
docker compose down
```

## 4. Local Development Without Docker

Backend:

```bash
cd backend
npm install
npm start
```

Client:

```bash
cd client
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:3000`.

## 5. Expected Result

- Backend API is available at `http://localhost:3000/api/health`.
- React client is available at `http://localhost:8081`.
- The client can read backend status, list messages, and send new messages.
- `docker compose down` stops and removes both containers.
