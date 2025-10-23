#!/bin/bash

echo "🚀 Setting up E-Learning Admin Score Management System"
echo "======================================================"
echo ""

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🗄️  Setting up database..."
cd backend
npm run db:seed
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "  Terminal 1: npm run dev:backend"
echo "  Terminal 2: npm run dev:frontend"
echo ""
echo "Then open http://localhost:5173 in your browser"
