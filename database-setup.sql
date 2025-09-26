-- OLA Laundry Master Database Setup for Production
-- Run this on your AlmaLinux VPS PostgreSQL instance

-- Create database and user
CREATE DATABASE ola_laundry_production;
CREATE USER ola_user WITH ENCRYPTED PASSWORD 'OLA_Secure_2024!@#';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ola_laundry_production TO ola_user;
ALTER USER ola_user CREATEDB;

-- Connect to the database
\c ola_laundry_production;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO ola_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ola_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ola_user;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ola_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ola_user;

-- Create development database as well
CREATE DATABASE ola_laundry_dev;
CREATE USER ola_dev WITH ENCRYPTED PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE ola_laundry_dev TO ola_dev;

\c ola_laundry_dev;
GRANT ALL ON SCHEMA public TO ola_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ola_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ola_dev;