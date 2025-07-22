
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface CustomDomain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  sslStatus: 'pending' | 'issued' | 'failed';
  createdAt: Date;
  verifiedAt?: Date;
}

export function CustomDomainForm() {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([
    {
      id: '1',
      domain: 'laundry.mystore.com',
      status: 'verified',
      sslStatus: 'issued',
      createdAt: new Date('2025-01-01'),
      verifiedAt: new Date('2025-01-02')
    }
  ]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast.error('Please enter a domain name');
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      toast.error('Please enter a valid domain name');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDomain: CustomDomain = {
        id: Date.now().toString(),
        domain,
        status: 'pending',
        sslStatus: 'pending',
        createdAt: new Date()
      };

      setCustomDomains([...customDomains, newDomain]);
      setDomain('');
      toast.success('Domain added successfully! Please verify ownership.');
    } catch (error) {
      toast.error('Failed to add domain. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDomain = (id: string) => {
    setCustomDomains(customDomains.filter(d => d.id !== id));
    toast.success('Domain removed successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'issued':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domain Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your custom domain to provide a branded experience for your customers. 
              Make sure you have access to your domain's DNS settings.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleAddDomain} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com or subdomain.example.com"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Domain'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
        </CardHeader>
        <CardContent>
          {customDomains.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No custom domains connected yet.
            </p>
          ) : (
            <div className="space-y-4">
              {customDomains.map((customDomain) => (
                <div key={customDomain.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{customDomain.domain}</h4>
                      <a
                        href={`https://${customDomain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDomain(customDomain.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(customDomain.status)}>
                        {customDomain.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {customDomain.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">SSL:</span>
                      <Badge variant={getStatusColor(customDomain.sslStatus)}>
                        {customDomain.sslStatus === 'issued' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {customDomain.sslStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Added: {formatDate(customDomain.createdAt)}
                    {customDomain.verifiedAt && (
                      <> • Verified: {formatDate(customDomain.verifiedAt)}</>
                    )}
                  </div>

                  {customDomain.status === 'pending' && (
                    <Alert className="mt-3">
                      <AlertDescription className="text-xs">
                        <strong>DNS Configuration Required:</strong><br />
                        Add a CNAME record pointing {customDomain.domain} to: your-app.lovable.app
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
