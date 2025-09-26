// PM2 Configuration for OLA Laundry Master
// Production deployment on AlmaLinux VPS

module.exports = {
  apps: [{
    name: 'olalaundry',
    script: 'dist/index.js',
    cwd: '/var/www/olalaundry',
    instances: 'max',
    exec_mode: 'cluster',
    
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    
    // Logging
    log_file: '/var/log/olalaundry/combined.log',
    out_file: '/var/log/olalaundry/out.log',
    error_file: '/var/log/olalaundry/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Process management
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    
    // Monitoring
    monitoring: false,
    
    // Auto restart on file changes (disable in production)
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log'],
    
    // Graceful shutdown
    kill_timeout: 5000,
    
    // Health check
    health_check_grace_period: 3000,
    
    // Advanced settings
    node_args: '--max-old-space-size=2048',
    
    // Restart conditions
    restart_delay: 4000,
    
    // Environment variables file
    env_file: '/var/www/olalaundry/.env'
  }],

  // Deployment configuration
  deploy: {
    production: {
      user: 'root',
      host: '159.198.32.97',
      ref: 'origin/main',
      repo: 'https://github.com/your-username/ola-laundry-master.git',
      path: '/var/www/olalaundry',
      'post-deploy': 'npm ci --production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/olalaundry /var/log/olalaundry'
    }
  }
};