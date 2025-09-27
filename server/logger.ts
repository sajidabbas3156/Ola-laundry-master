interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  requestId?: string;
  [key: string]: any;
}

class Logger {
  private logLevel: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatLog(level: string, message: string, meta?: any): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString()
    };

    if (meta) {
      Object.assign(entry, this.sanitizeLog(meta));
    }

    return entry;
  }

  private sanitizeLog(data: any): any {
    const sensitive = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...data };
    
    for (const key in sanitized) {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  private output(entry: LogEntry): void {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, 
        entry.requestId ? `(${entry.requestId})` : '');
    }
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog('error')) {
      this.output(this.formatLog('error', message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog('warn')) {
      this.output(this.formatLog('warn', message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog('info')) {
      this.output(this.formatLog('info', message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog('debug')) {
      this.output(this.formatLog('debug', message, meta));
    }
  }
}

export const logger = new Logger();
export default logger;