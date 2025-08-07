#!/bin/bash

echo "🔍 Verifying Turborepo Setup..."
echo ""

# Check if Node.js version is sufficient
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js version $(node --version) is too old. Need v18+"
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm is not installed"
    exit 1
fi

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Run: npm install"
    exit 1
fi

# Check if both apps are running
echo ""
echo "🌐 Checking running services..."

# Check frontend (with timeout using gtimeout if available, otherwise plain curl)
if command -v gtimeout >/dev/null 2>&1; then
    TIMEOUT_CMD="gtimeout 5s"
elif command -v timeout >/dev/null 2>&1; then
    TIMEOUT_CMD="timeout 5s"
else
    TIMEOUT_CMD=""
fi

if $TIMEOUT_CMD curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend running on http://localhost:3000"
else
    echo "⚠️  Frontend not responding on http://localhost:3000"
    echo "   Run: npm run dev"
fi

# Check backend health
if $TIMEOUT_CMD curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo "✅ Backend API running on http://localhost:3002"
else
    echo "⚠️  Backend not responding on http://localhost:3002"
    echo "   Run: npm run dev"
fi

# Check backend users endpoint
if $TIMEOUT_CMD curl -s http://localhost:3002/api/users > /dev/null 2>&1; then
    echo "✅ Backend API endpoints working"
else
    echo "⚠️  Backend API endpoints not responding"
fi

echo ""
echo "🎉 Setup verification complete!"
echo ""
echo "📖 Next steps:"
echo "   • Open http://localhost:3000 in your browser"
echo "   • Check the frontend loads and displays data"
echo "   • Visit http://localhost:3002/api/health for API status"
echo ""
