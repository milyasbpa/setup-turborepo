-- Initial database setup script
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (already created by POSTGRES_DB)
-- CREATE DATABASE IF NOT EXISTS turborepo_dev;

-- You can add any initial SQL commands here
-- For example, create extensions, initial data, etc.

-- Enable UUID extension (useful for UUIDs if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a comment to verify script ran
COMMENT ON DATABASE turborepo_dev IS 'TurboRepo development database initialized';
