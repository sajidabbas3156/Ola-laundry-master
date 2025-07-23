import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaundrySpinner, LoadingState } from '@/components/ui/laundry-spinner';

import LaundryLoadingScreen, { LaundryPageLoader } from '@/components/LaundryLoadingScreen';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function SpinnerDemo() {
  const [selectedVariant, setSelectedVariant] = useState<'washing' | 'drying' | 'folding' | 'delivery' | 'bubbles' | 'clothes'>('washing');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [selectedColor, setSelectedColor] = useState<'primary' | 'secondary' | 'accent' | 'white'>('primary');
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(false);

  const variants = [
    { value: 'washing', label: 'Washing Machine', description: 'Spinning drum with clothes and water' },
    { value: 'drying', label: 'Dryer', description: 'Hot air waves and tumbling motion' },
    { value: 'folding', label: 'Folding', description: 'Clothes being folded with hands' },
    { value: 'delivery', label: 'Delivery Truck', description: 'Truck with motion lines and bouncing' },
    { value: 'bubbles', label: 'Soap Bubbles', description: 'Rising bubbles animation' },
    { value: 'clothes', label: 'Clothes Hanger', description: 'Swinging clothes on hanger' }
  ] as const;

  const sizes = [
    { value: 'sm', label: 'Small (16px)' },
    { value: 'md', label: 'Medium (32px)' },
    { value: 'lg', label: 'Large (48px)' },
    { value: 'xl', label: 'Extra Large (64px)' }
  ] as const;

  const speeds = [
    { value: 'slow', label: 'Slow (3s)' },
    { value: 'normal', label: 'Normal (1s)' },
    { value: 'fast', label: 'Fast (0.5s)' }
  ] as const;

  const colors = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent (Blue)' },
    { value: 'white', label: 'White' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Full Screen Loader */}
      {showFullScreen && (
        <LaundryLoadingScreen
          variant={selectedVariant}
          duration={5000}
          onComplete={() => setShowFullScreen(false)}
          showProgress={true}
        />
      )}

      {/* Page Loader */}
      {showPageLoader && (
        <div className="fixed inset-0 z-50">
          <LaundryPageLoader 
            variant={selectedVariant}
            message={`Loading ${selectedVariant} demonstration...`}
          />
          <Button
            onClick={() => setShowPageLoader(false)}
            className="fixed top-4 right-4 z-50"
            variant="secondary"
          >
            Close Demo
          </Button>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl">OLA</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Laundry Spinner Showcase</h1>
          <p className="text-lg text-gray-600">Interactive demonstration of themed loading animations</p>
        </div>

        <Tabs defaultValue="interactive" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
            <TabsTrigger value="variants">All Variants</TabsTrigger>
            <TabsTrigger value="sizes">Size Options</TabsTrigger>
            <TabsTrigger value="examples">Usage Examples</TabsTrigger>
          </TabsList>

          {/* Interactive Demo */}
          <TabsContent value="interactive" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Customization Controls</CardTitle>
                  <CardDescription>Adjust spinner properties in real-time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variant</label>
                    <Select value={selectedVariant} onValueChange={(value: any) => setSelectedVariant(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {variants.map(variant => (
                          <SelectItem key={variant.value} value={variant.value}>
                            {variant.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Size</label>
                    <Select value={selectedSize} onValueChange={(value: any) => setSelectedSize(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map(size => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speed</label>
                    <Select value={selectedSpeed} onValueChange={(value: any) => setSelectedSpeed(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {speeds.map(speed => (
                          <SelectItem key={speed.value} value={speed.value}>
                            {speed.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Select value={selectedColor} onValueChange={(value: any) => setSelectedColor(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      onClick={() => setShowFullScreen(true)}
                      className="w-full"
                      variant="default"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Show Full Screen Loader
                    </Button>
                    
                    <Button
                      onClick={() => setShowPageLoader(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Show Page Loader
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    {variants.find(v => v.value === selectedVariant)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-6 py-12">
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                      <LaundrySpinner
                        variant={selectedVariant}
                        size={selectedSize}
                        speed={selectedSpeed}
                        color={selectedColor}
                      />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <Badge variant="outline">
                        {selectedVariant} • {selectedSize} • {selectedSpeed}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Perfect for {selectedVariant === 'washing' ? 'order processing' : 
                                   selectedVariant === 'drying' ? 'completion states' :
                                   selectedVariant === 'folding' ? 'finishing touches' :
                                   selectedVariant === 'delivery' ? 'route planning' :
                                   selectedVariant === 'bubbles' ? 'cleaning processes' :
                                   'inventory management'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Variants */}
          <TabsContent value="variants" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {variants.map(variant => (
                <Card key={variant.value} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{variant.label}</CardTitle>
                    <CardDescription>{variant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="py-8">
                    <LaundrySpinner variant={variant.value} size="lg" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Size Options */}
          <TabsContent value="sizes" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sizes.map(size => (
                <Card key={size.value} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{size.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8 flex items-center justify-center">
                    <LaundrySpinner variant="washing" size={size.value} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Usage Examples */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Loading States */}
              <Card>
                <CardHeader>
                  <CardTitle>Loading State Components</CardTitle>
                  <CardDescription>Full loading screens with messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <LoadingState message="Processing your order..." variant="washing" />
                  <LoadingState message="Items are drying..." variant="drying" />
                  <LoadingState message="Preparing for delivery..." variant="delivery" />
                </CardContent>
              </Card>

              {/* Inline Loaders */}
              <Card>
                <CardHeader>
                  <CardTitle>Inline Loaders</CardTitle>
                  <CardDescription>Small loaders for buttons and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <LaundrySpinner variant="washing" size="sm" />
                      <span className="text-sm text-muted-foreground animate-pulse">Processing...</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <LaundrySpinner variant="delivery" size="sm" />
                      <span className="text-sm text-muted-foreground animate-pulse">En route...</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <LaundrySpinner variant="folding" size="sm" />
                      <span className="text-sm text-muted-foreground animate-pulse">Finishing up...</span>
                    </div>
                  </div>
                  
                  {/* Button Examples */}
                  <div className="space-y-2">
                    <Button disabled className="w-full">
                      <LaundrySpinner variant="bubbles" size="sm" className="mr-2" />
                      Cleaning in progress...
                    </Button>
                    <Button disabled className="w-full" variant="outline">
                      <LaundrySpinner variant="clothes" size="sm" className="mr-2" />
                      Adding to cart...
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Indicators</CardTitle>
                  <CardDescription>Spinners with status badges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Order #1234</span>
                    <div className="flex items-center space-x-2">
                      <LaundrySpinner variant="washing" size="sm" />
                      <Badge>In Progress</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Order #1235</span>
                    <div className="flex items-center space-x-2">
                      <LaundrySpinner variant="delivery" size="sm" />
                      <Badge variant="secondary">Out for Delivery</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>How to use the spinner components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono space-y-2">
                    <div className="text-green-400">// Basic spinner</div>
                    <div>&lt;LaundrySpinner variant="washing" /&gt;</div>
                    
                    <div className="text-green-400 pt-2">// With custom props</div>
                    <div>&lt;LaundrySpinner</div>
                    <div className="pl-4">variant="delivery"</div>
                    <div className="pl-4">size="lg"</div>
                    <div className="pl-4">speed="fast"</div>
                    <div className="pl-4">color="accent"</div>
                    <div>/&gt;</div>
                    
                    <div className="text-green-400 pt-2">// Loading screen</div>
                    <div>&lt;LaundryLoadingScreen</div>
                    <div className="pl-4">variant="washing"</div>
                    <div className="pl-4">duration=&#123;3000&#125;</div>
                    <div className="pl-4">onComplete=&#123;() =&gt; ...&#125;</div>
                    <div>/&gt;</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}