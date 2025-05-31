
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Database, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataImportPanel = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Data Imported Successfully",
        description: `${selectedFile.name} has been processed and is ready for analysis.`,
      });
      
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const supportedFormats = ['CSV', 'Excel', 'JSON', 'XML'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Import & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Your Dataset</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls,.json,.xml"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">
            Supported formats: {supportedFormats.join(', ')}
          </p>
        </div>

        {selectedFile && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import & Analyze Data
            </>
          )}
        </Button>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Quick Analysis Options
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Sales Analysis
            </Button>
            <Button variant="outline" size="sm">
              Customer Insights
            </Button>
            <Button variant="outline" size="sm">
              Performance Trends
            </Button>
            <Button variant="outline" size="sm">
              Custom Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImportPanel;
