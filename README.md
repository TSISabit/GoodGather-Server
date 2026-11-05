# GoodGather Server API

Robust RESTful backend service powering the GoodGather event platform. Built with Express.js, TypeScript, and MongoDB.

## Tech Stack
- Node.js & Express.js
- TypeScript (Strict config)
- MongoDB Native Driver
- JWT & BCrypt for security

## Environment Variables
- `PORT`: 5000
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret hash token
- `CLIENT_URL`: Client origin for CORS

## Available Scripts
- `npm run dev`: Start local development server with ts-node-dev
- `npm run build`: Compile TypeScript into production JavaScript
- `npm run start`: Run production build
- `npm run seed`: Populate database with initial upcoming events