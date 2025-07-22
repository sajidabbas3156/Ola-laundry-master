
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, Calendar, Clock, Settings, Trash2 } from "lucide-react";

export function AutomatedReports() {
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    frequency: "weekly",
    time: "09:00",
    recipients: "",
    enabled: true
  });

  const scheduledReports = [
    {
      id: 1,
      name: "Weekly Performance Summary",
      frequency: "Weekly",
      nextRun: "2024-06-17 09:00",
      recipients: ["manager@company.com", "owner@company.com"],
      status: "active",
      lastSent: "2024-06-10 09:00"
    },
    {
      id: 2,
      name: "Monthly Financial Report",
      frequency: "Monthly",
      nextRun: "2024-07-01 08:00",
      recipients: ["accounting@company.com"],
      status: "active",
      lastSent: "2024-06-01 08:00"
    },
    {
      id: 3,
      name: "Daily Operations Dashboard",
      frequency: "Daily",
      nextRun: "2024-06-14 07:30",
      recipients: ["operations@company.com"],
      status: "paused",
      lastSent: "2024-06-12 07:30"
    }
  ];

  const reportTemplates = [
    { name: "Performance Summary", description: "KPIs, revenue, and customer metrics" },
    { name: "Financial Report", description: "P&L, cash flow, and expense analysis" },
    { name: "Customer Analytics", description: "Retention, segmentation, and LTV" },
    { name: "Operations Dashboard", description: "Service times, capacity, and staff performance" }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="create">Create Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Automated Report Schedules
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Schedule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge variant={report.status === "active" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.frequency}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Next: {report.nextRun}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {report.recipients.length} recipients
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">
                          Recipients: {report.recipients.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={report.status === "active"}
                        // onCheckedChange={(checked) => toggleReportStatus(report.id, checked)}
                      />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Report Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium">Weekly Performance Summary</span>
                    <p className="text-sm text-muted-foreground">Sent to 2 recipients</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Delivered</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Jun 10, 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="font-medium">Monthly Financial Report</span>
                    <p className="text-sm text-muted-foreground">Sent to 1 recipient</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Delivered</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Jun 1, 8:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Automated Report Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Template Selection */}
              <div className="space-y-4">
                <Label>Select Report Template</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-name">Schedule Name</Label>
                    <Input 
                      id="schedule-name"
                      placeholder="Enter schedule name"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time">Send Time</Label>
                    <Input 
                      id="time"
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipients">Email Recipients</Label>
                    <Input 
                      id="recipients"
                      placeholder="Enter email addresses (comma separated)"
                      value={newSchedule.recipients}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, recipients: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enabled"
                      checked={newSchedule.enabled}
                      onCheckedChange={(checked) => setNewSchedule(prev => ({ ...prev, enabled: checked }))}
                    />
                    <Label htmlFor="enabled">Enable schedule immediately</Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
                <Button variant="outline">
                  Preview Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
