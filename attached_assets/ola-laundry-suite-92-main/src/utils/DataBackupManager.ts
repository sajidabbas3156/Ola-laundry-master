
import { cacheManager } from './CacheManager';

interface BackupData {
  version: string;
  timestamp: string;
  data: {
    orders: any[];
    inventory: any[];
    drivers: any[];
    routes: any[];
    settings: any;
  };
}

class DataBackupManager {
  private readonly VERSION = '1.0.0';

  async createBackup(): Promise<string> {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
      const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
      const routes = JSON.parse(localStorage.getItem('routes') || '[]');
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');

      const backup: BackupData = {
        version: this.VERSION,
        timestamp: new Date().toISOString(),
        data: {
          orders,
          inventory,
          drivers,
          routes,
          settings
        }
      };

      return JSON.stringify(backup, null, 2);
    } catch (error) {
      throw new Error('Failed to create backup: ' + error);
    }
  }

  async restoreBackup(backupString: string): Promise<void> {
    try {
      const backup: BackupData = JSON.parse(backupString);
      
      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup format');
      }

      // Validate backup data structure
      this.validateBackupData(backup.data);

      // Store backup data
      localStorage.setItem('orders', JSON.stringify(backup.data.orders));
      localStorage.setItem('inventory', JSON.stringify(backup.data.inventory));
      localStorage.setItem('drivers', JSON.stringify(backup.data.drivers));
      localStorage.setItem('routes', JSON.stringify(backup.data.routes));
      localStorage.setItem('settings', JSON.stringify(backup.data.settings));

      // Clear cache after restore
      cacheManager.invalidate();

      console.log('Data restored successfully from backup created on:', backup.timestamp);
    } catch (error) {
      throw new Error('Failed to restore backup: ' + error);
    }
  }

  private validateBackupData(data: any): void {
    const requiredFields = ['orders', 'inventory', 'drivers', 'routes', 'settings'];
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  downloadBackup(backup: string, filename?: string): void {
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename || `laundry-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  async importFromFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          await this.restoreBackup(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

export const dataBackupManager = new DataBackupManager();
