import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileUpload } from '@/components/ui/file-upload';
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  File,
  Upload,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DataImportPanelProps {
  onDataImported: (data: any) => void;
}

interface UploadedData {
  fileName: string;
  fileSize: number;
  headers: string[];
  data: any[];
  analysis: any;
}

const DataImportPanel: React.FC<DataImportPanelProps> = ({ onDataImported }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const { toast } = useToast()

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], data: [] };
    
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      return headers.reduce((obj: any, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    });
    
    return { headers, data };
  };

  const analyzeData = (data: any[]) => {
    if (!data || data.length === 0) return {};

    const analysis: any = {
      totalRows: data.length,
      columns: {},
      summary: {}
    };

    // Get column names from first row
    const columns = Object.keys(data[0]);
    
    columns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== '');
      const nonEmptyValues = values.filter(val => val !== undefined && val !== null && val !== '');
      
      analysis.columns[column] = {
        totalValues: values.length,
        nonEmptyValues: nonEmptyValues.length,
        emptyValues: values.length - nonEmptyValues.length,
        uniqueValues: [...new Set(nonEmptyValues)].length,
        dataType: inferDataType(nonEmptyValues)
      };
    });

    return analysis;
  };

  const inferDataType = (values: any[]) => {
    if (values.length === 0) return 'unknown';
    
    const sampleSize = Math.min(values.length, 100);
    const sample = values.slice(0, sampleSize);
    
    let numberCount = 0;
    let dateCount = 0;
    
    sample.forEach(value => {
      const strValue = String(value).trim();
      
      if (!isNaN(Number(strValue)) && strValue !== '') {
        numberCount++;
      }
      
      if (isValidDate(strValue)) {
        dateCount++;
      }
    });
    
    const numberRatio = numberCount / sampleSize;
    const dateRatio = dateCount / sampleSize;
    
    if (numberRatio > 0.8) return 'number';
    if (dateRatio > 0.8) return 'date';
    return 'text';
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.match(/\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const { headers, data } = parseCSV(csvText);
        
        if (headers.length === 0) {
          throw new Error('No data found in CSV file');
        }

        const analysis = analyzeData(data);
        
        setUploadedData({
          fileName: file.name,
          fileSize: file.size,
          headers,
          data,
          analysis
        });

        setUploadProgress(100);
        
        toast({
          title: "File Uploaded Successfully",
          description: `${file.name} has been processed with ${data.length} rows.`,
        });
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast({
          title: "Error Processing File",
          description: "There was an error processing your CSV file. Please check the format.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "File Read Error",
        description: "There was an error reading your file.",
        variant: "destructive"
      });
    };

    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file to import your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csvFile">CSV File</Label>
          <FileUpload
            accept=".csv"
            onFileUpload={(file: File) => {
              const fakeEvent = {
                target: {
                  files: [file],
                },
              } as any;
              handleFileUpload(fakeEvent);
            }}
            className="w-full"
          />
          {isUploading && (
            <Progress value={uploadProgress} />
          )}
          {uploadedData && (
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">
                  {uploadedData.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedData.fileSize} bytes
                </p>
              </div>
            </div>
          )}
        </div>
        {uploadedData ? (
          <Button onClick={() => onDataImported(uploadedData)}>
            Import Data
          </Button>
        ) : (
          <Button disabled>Import Data</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DataImportPanel;
