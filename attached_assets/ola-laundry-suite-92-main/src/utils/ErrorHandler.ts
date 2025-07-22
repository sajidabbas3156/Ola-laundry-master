
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: ((error: Error) => void)[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context?: string): void {
    console.error(`[ErrorHandler] ${context || 'Unknown'}: `, error);
    
    // Notify listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  addErrorListener(listener: (error: Error) => void): () => void {
    this.errorListeners.push(listener);
    
    // Return cleanup function
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  handleAsyncError<T>(
    promise: Promise<T>, 
    context?: string
  ): Promise<T | null> {
    return promise.catch((error) => {
      this.handleError(error, context);
      return null;
    });
  }

  wrapFunction<T extends (...args: any[]) => any>(
    fn: T, 
    context?: string
  ): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return this.handleAsyncError(result, context);
        }
        return result;
      } catch (error) {
        this.handleError(error as Error, context);
        return null;
      }
    }) as T;
  }
}

export const errorHandler = ErrorHandler.getInstance();
