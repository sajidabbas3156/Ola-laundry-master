
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PreviewProps {
  settings: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    accentColor: string;
    logo: string;
    storeName: string;
    tagline: string;
    fontFamily: string;
    buttonStyle: "rounded" | "square" | "pill";
  };
}

export function CustomizationPreview({ settings }: PreviewProps) {
  const getButtonClassName = () => {
    const base = "px-4 py-2 text-white font-medium transition-colors";
    switch (settings.buttonStyle) {
      case "square":
        return `${base} rounded-none`;
      case "pill":
        return `${base} rounded-full`;
      default:
        return `${base} rounded-md`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="border rounded-lg p-6 space-y-4"
          style={{ 
            backgroundColor: settings.backgroundColor,
            fontFamily: settings.fontFamily 
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div 
                  className="h-8 w-8 rounded flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {settings.storeName.charAt(0) || 'S'}
                </div>
              )}
              <div>
                <h3 className="font-bold">{settings.storeName || 'Store Name'}</h3>
                {settings.tagline && (
                  <p className="text-sm text-gray-600">{settings.tagline}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={getButtonClassName()}
                style={{ backgroundColor: settings.primaryColor }}
              >
                Primary Action
              </button>
              <button
                className={getButtonClassName()}
                style={{ backgroundColor: settings.secondaryColor }}
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg p-4 bg-white">
                  <div 
                    className="h-2 w-16 rounded mb-2"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                  <h4 className="font-medium mb-2">Service {item}</h4>
                  <p className="text-sm text-gray-600">Sample service description</p>
                  <button
                    className={`${getButtonClassName()} mt-3 text-sm`}
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Select Service
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="flex gap-4">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: settings.accentColor }}
                />
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: settings.primaryColor }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-sm text-gray-500">
            Preview of {settings.storeName || 'Your Store'} with applied customizations
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
