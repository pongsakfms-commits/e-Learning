#!/bin/bash

echo "🚀 Setting up e-Learning Admin Dashboard..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install backend dependencies"
  exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install frontend dependencies"
  exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
