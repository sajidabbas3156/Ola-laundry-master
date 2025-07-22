import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Machine } from "@shared/schema";

interface MachineStatusProps {
  machines: Machine[];
}

const statusColors = {
  available: "bg-green-100 text-green-800",
  in_use: "bg-yellow-100 text-yellow-800",
  maintenance: "bg-red-100 text-red-800",
} as const;

export function MachineStatus({ machines }: MachineStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Machine Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {machines.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No machines configured</p>
          ) : (
            machines.map((machine) => (
              <div key={machine.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{machine.name}</span>
                <Badge className={statusColors[machine.status as keyof typeof statusColors]}>
                  {machine.status === "in_use" && machine.timeRemaining 
                    ? `In Use (${machine.timeRemaining} min left)`
                    : machine.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
                  }
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
