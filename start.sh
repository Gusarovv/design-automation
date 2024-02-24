#!/bin/sh

# Backend
cd backend
docker compose up -d

# Frontend
cd ../frontend
npm i && npm run build && npm run preview