export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  // Get all unique keys from the data
  const headers = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );

  // Create CSV content
  const csvContent = [
    // Header row
    headers.map(header => `"${header}"`).join(","),
    // Data rows
    ...data.map(item =>
      headers.map(header => {
        const value = item[header];
        if (value === null || value === undefined) {
          return '""';
        }
        // Handle nested objects and arrays
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Escape quotes in strings
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDataForExport(data: any[], excludeFields: string[] = []) {
  return data.map(item => {
    const formatted = { ...item };
    
    // Remove excluded fields
    excludeFields.forEach(field => {
      delete formatted[field];
    });
    
    // Flatten nested objects for better CSV compatibility
    Object.keys(formatted).forEach(key => {
      const value = formatted[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Flatten object
        Object.keys(value).forEach(nestedKey => {
          formatted[`${key}_${nestedKey}`] = value[nestedKey];
        });
        delete formatted[key];
      }
    });
    
    return formatted;
  });
}

export function generateReportSummary(data: any[], title: string) {
  const summary = {
    title,
    generatedAt: new Date().toISOString(),
    totalRecords: data.length,
    summary: {
      // Add basic statistics
      recordCount: data.length,
      firstRecord: data.length > 0 ? data[0].createdAt || data[0].date : null,
      lastRecord: data.length > 0 ? data[data.length - 1].createdAt || data[data.length - 1].date : null,
    }
  };
  
  return summary;
}