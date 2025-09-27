module.exports = {
  apps: [{
    name: 'olalaundry',
    script: 'dist/index.js',
    cwd: '/var/www/olalaundry',
    instances: 'max',
    exec_mode: 'cluster',
    
    // Environment
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    
    // Process Management
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    kill_timeout: 5000,
    
    // Logging
    log_file: '/var/log/olalaundry/combined.log',
    out_file: '/var/log/olalaundry/out.log',
    error_file: '/var/log/olalaundry/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Health & Monitoring
    health_check_grace_period: 3000,
    listen_timeout: 8000,
    
    // Node.js Options
    node_args: '--max-old-space-size=1024',
    
    // Auto-restart conditions
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log', 'uploads'],
    
    // Environment file
    env_file: '/var/www/olalaundry/.env'
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/sajidabbas3156/Ola-laundry-master.git',
      path: '/var/www/olalaundry',
      'post-deploy': 'npm ci --production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'sudo mkdir -p /var/www/olalaundry /var/log/olalaundry && sudo chown -R deploy:deploy /var/www/olalaundry /var/log/olalaundry'
    }
  }
};