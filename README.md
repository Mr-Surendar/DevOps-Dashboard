# DevOps Dashboard

A modern, futuristic DevOps dashboard for monitoring and managing your DevOps tools and infrastructure.

## Features

- Real-time system metrics monitoring (CPU, memory, disk, temperature)
- Integration with DevOps tools (Jenkins, GitHub, Docker, Kubernetes, Terraform)
- Futuristic UI with 3D Spline background
- Responsive design for all device sizes
- Dark theme optimized for long monitoring sessions

## Project Structure

The project is divided into two main parts:

- `frontend`: Next.js application with App Router
- `backend`: Express.js API server

### Frontend

The frontend is built with Next.js and uses the App Router for efficient navigation. The UI components are built with shadcn/ui for a consistent and modern look.

### Backend

The backend is built with Express.js and provides API endpoints for the frontend to consume. It includes services for fetching data from various DevOps tools.

## Getting Started

### Prerequisites

- Node.js 18 or later
- Docker and Docker Compose (for containerized deployment)

### Development

1. Clone the repository:

\`\`\`bash
git clone https://github.com/Mr-Surendar/devops-dashboard.git
cd devops-dashboard
\`\`\`

2. Install dependencies for both frontend and backend:

\`\`\`bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
\`\`\`

3. Create a `.env` file in the backend directory based on `.env.example`.

4. Start the development servers:

\`\`\`bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

You can deploy the application using Docker Compose:

\`\`\`bash
docker-compose up -d
\`\`\`

This will build and start both the frontend and backend containers.

## Dockerization

Both the frontend and backend include Dockerfiles for containerization:

- `frontend/Dockerfile`: Builds the Next.js application
- `backend/Dockerfile`: Builds the Express.js API server
- `docker-compose.yml`: Orchestrates both containers

## Connecting to Real DevOps Tools

To connect the dashboard to your actual DevOps tools:

1. Update the configuration in `backend/config.js` with your tool credentials
2. Modify the service implementations in `backend/services/` to use the actual APIs
3. Set the appropriate environment variables in your deployment environment

## API Endpoints

The backend provides the following API endpoints:

- `/api/auth`: Authentication endpoints
- `/api/metrics`: System metrics endpoints
- `/api/jenkins`: Jenkins integration endpoints
- `/api/github`: GitHub integration endpoints
- `/api/docker`: Docker integration endpoints
- `/api/kubernetes`: Kubernetes integration endpoints
- `/api/terraform`: Terraform integration endpoints
- `/api/devops`: Combined DevOps tools endpoints
- `/api/deployments`: Deployment management endpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Spline](https://spline.design/)
- [Lucide Icons](https://lucide.dev/)
