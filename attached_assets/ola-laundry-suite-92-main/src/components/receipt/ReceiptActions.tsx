
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface ReceiptActionsProps {
  onPrint: () => void;
  onDownload: () => void;
  isPrinting: boolean;
}

export function ReceiptActions({ onPrint, onDownload, isPrinting }: ReceiptActionsProps) {
  return (
    <div className="flex gap-2 mt-4">
      <Button 
        onClick={onPrint} 
        disabled={isPrinting}
        className="flex-1 bg-blue-600 hover:bg-blue-700"
      >
        <Printer className="h-4 w-4 mr-2" />
        {isPrinting ? "Printing..." : "Print"}
      </Button>
      <Button 
        onClick={onDownload} 
        variant="outline"
        className="flex-1"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
}
