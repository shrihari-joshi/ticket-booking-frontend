# TicketKhidki Frontend

This repository contains the React/Vite frontend application for the TicketKhidki platform.

## Architecture

The frontend is built with **React** and **Vite**, connecting to the Go microservices backend over HTTP.

By default, the application is configured to connect to the backend services running locally:
- `user-service`: http://localhost:8081
- `event-service`: http://localhost:8082
- `booking-service`: http://localhost:8083

## Local Setup

### Recommended Setup (Full Stack via Docker)

It is highly recommended to run the frontend concurrently alongside the backend utilizing the `docker-compose.yml` file located in the `backend-repo`. 

If you have cloned this repository side-by-side with the backend:
```bash
cd ../ticket-booking-backend/infra/docker
docker-compose up --build
```
This will containerize the frontend using NGINX and serve it on port `3000`.

### Developing Frontend Locally

If you just want to run the frontend development server without containerizing:
1. Make sure you have Node 20+ installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

*(Note: Unless the backend database and API services are running, login and data-fetching will fail).*

## CI/CD

This repository uses GitHub Actions (`.github/workflows/deploy.yml`) to automatically test, build, and publish the frontend NGINX Docker image to the GitHub Container Registry (`ghcr.io`).
