
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Tag, Plus, Trash2, Save } from "lucide-react";
import { TagSettings } from "@/types/pos-settings";

export function TagSettingsTab() {
  const [tagSettings, setTagSettings] = useState<TagSettings[]>([
    { id: "urgent", name: "Urgent", color: "#ef4444", description: "Rush orders", enabled: true },
    { id: "vip", name: "VIP Customer", color: "#f59e0b", description: "Premium customers", enabled: true },
    { id: "delicate", name: "Delicate", color: "#06b6d4", description: "Handle with care", enabled: true },
    { id: "stains", name: "Stains", color: "#8b5cf6", description: "Items with stains", enabled: true }
  ]);

  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6", description: "" });

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      const tag: TagSettings = {
        id: newTag.name.toLowerCase().replace(/\s+/g, '-'),
        name: newTag.name,
        color: newTag.color,
        description: newTag.description,
        enabled: true
      };
      setTagSettings(prev => [...prev, tag]);
      setNewTag({ name: "", color: "#3b82f6", description: "" });
      toast.success("Tag added successfully!");
    }
  };

  const handleDeleteTag = (tagId: string) => {
    setTagSettings(prev => prev.filter(t => t.id !== tagId));
    toast.success("Tag deleted successfully!");
  };

  const handleToggleTag = (tagId: string, enabled: boolean) => {
    setTagSettings(prev => prev.map(tag => 
      tag.id === tagId ? { ...tag, enabled } : tag
    ));
  };

  const handleSaveTagSettings = () => {
    localStorage.setItem('pos_tag_settings', JSON.stringify(tagSettings));
    toast.success("Tag settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tag Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tagSettings.map((tag) => (
          <div key={tag.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge style={{ backgroundColor: tag.color, color: 'white' }}>
                  {tag.name}
                </Badge>
                <span className="text-sm text-muted-foreground">{tag.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={tag.enabled}
                  onCheckedChange={(enabled) => handleToggleTag(tag.id, enabled)}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium mb-3">Add New Tag</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tag Name</Label>
                <Input
                  placeholder="Enter tag name"
                  value={newTag.name}
                  onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Enter tag description"
                value={newTag.description}
                onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Button onClick={handleAddTag} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>
        </div>

        <Button onClick={handleSaveTagSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Tag Settings
        </Button>
      </CardContent>
    </Card>
  );
}
