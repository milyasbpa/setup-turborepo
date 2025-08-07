#!/bin/bash

# Quick Database Setup Script for TurboRepo
# This script sets up PostgreSQL with Docker and runs initial database setup

set -e  # Exit on any error

echo "🚀 Starting PostgreSQL Database Setup..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Check if .env file exists, if not copy from example
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Copying from .env.example..."
    cp .env.example .env
    print_status "Created .env file from .env.example"
else
    print_status ".env file already exists"
fi

# Stop existing containers if they exist
print_status "Stopping any existing containers..."
docker-compose down --volumes --remove-orphans 2>/dev/null || true

# Start PostgreSQL container
print_status "Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
timeout=30
counter=0

while ! docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        print_error "PostgreSQL failed to start within $timeout seconds"
        docker-compose logs postgres
        exit 1
    fi
    echo -n "."
    sleep 1
    counter=$((counter + 1))
done

echo ""
print_status "PostgreSQL is ready!"

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run database migrations
print_status "Running database migrations..."
npx prisma db push

# Test database connection
print_status "Testing database connection..."
npm run db:test

if [ $? -eq 0 ]; then
    print_status "Database connection successful!"
    
    # Ask if user wants to seed the database
    echo ""
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Seeding database with sample data..."
        npm run db:seed
        print_status "Database seeded successfully!"
    fi
    
    echo ""
    print_status "🎉 Database setup complete!"
    echo ""
    echo "Database Information:"
    echo "  📊 Database URL: postgresql://postgres:postgres@localhost:5432/turborepo_dev"
    echo "  🔑 Username: postgres"
    echo "  🔒 Password: postgres"
    echo "  🏷️  Database: turborepo_dev"
    echo "  🌐 Port: 5432"
    echo ""
    echo "Useful Commands:"
    echo "  📋 View data: npm run db:studio"
    echo "  🌱 Seed database: npm run db:seed"
    echo "  🔄 Reset database: npm run db:reset"
    echo "  🧪 Test connection: npm run db:test"
    echo ""
    echo "To access pgAdmin (optional):"
    echo "  1. Start pgAdmin: docker-compose --profile tools up -d pgadmin"
    echo "  2. Open http://localhost:8080"
    echo "  3. Login with admin@example.com / admin"
    echo ""
    
else
    print_error "Database connection failed. Check the logs above."
    exit 1
fi
