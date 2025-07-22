
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { dataBackupManager } from '@/utils/DataBackupManager';

export function DataBackupRestore() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const backup = await dataBackupManager.createBackup();
      dataBackupManager.downloadBackup(backup);
      toast.success('Backup created and downloaded successfully');
    } catch (error) {
      toast.error('Failed to create backup: ' + error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      await dataBackupManager.importFromFile(file);
      toast.success('Data restored successfully. Please refresh the page.');
    } catch (error) {
      toast.error('Failed to restore backup: ' + error);
    } finally {
      setIsRestoring(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Backup & Restore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Create Backup
              </h4>
              <p className="text-sm text-muted-foreground">
                Download a complete backup of your data including orders, customers, inventory, and settings.
              </p>
              <Button 
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="w-full"
              >
                {isCreatingBackup ? 'Creating...' : 'Download Backup'}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Restore Backup
              </h4>
              <p className="text-sm text-muted-foreground">
                Upload and restore data from a previous backup file.
              </p>
              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  disabled={isRestoring}
                  className="w-full"
                />
                {isRestoring && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <span className="text-sm">Restoring...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-medium text-yellow-800">Important Notes</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Restoring will overwrite all current data</li>
                  <li>• Always create a backup before restoring</li>
                  <li>• Refresh the page after restoring data</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">All data is stored locally in your browser</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Backup files are encrypted and secure</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">No data is sent to external servers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
