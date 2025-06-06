
import { supabase } from '@/integrations/supabase/client';

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'googleSlides';
  data: any;
  title: string;
  includeCharts?: boolean;
}

export const exportData = async (options: ExportOptions) => {
  const { format, data, title, includeCharts = false } = options;

  switch (format) {
    case 'pdf':
      return await exportToPDF(data, title, includeCharts);
    case 'csv':
      return await exportToCSV(data, title);
    case 'googleSlides':
      return await exportToGoogleSlides(data, title);
    default:
      throw new Error('Unsupported export format');
  }
};

const exportToPDF = async (data: any, title: string, includeCharts: boolean) => {
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-pdf', {
      body: { 
        reportData: data,
        reportTitle: title,
        reportType: 'Analysis Report',
        includeCharts,
        chartData: data.chartData
      }
    });

    if (error) throw error;

    if (!result || !result.pdf) {
      throw new Error('No PDF data received from server');
    }

    // Create a printable HTML page
    const htmlContent = atob(result.pdf);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.title = title;
      printWindow.document.close();
      
      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    return { success: true };
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

const exportToCSV = async (data: any, title: string) => {
  try {
    let csvContent = `${title}\nGenerated on: ${new Date().toLocaleDateString()}\n\n`;
    
    // Add key metrics
    if (data.keyMetrics) {
      csvContent += "Key Metrics\n";
      csvContent += "Metric,Value,Change\n";
      data.keyMetrics.forEach((metric: any) => {
        csvContent += `"${metric.label}","${metric.value}","${metric.change}"\n`;
      });
      csvContent += "\n";
    }

    // Add chart data if available
    if (data.chartData) {
      if (data.chartData.revenue) {
        csvContent += "Revenue Data\n";
        csvContent += "Month,Revenue\n";
        data.chartData.revenue.forEach((item: any) => {
          csvContent += `"${item.month}",${item.revenue}\n`;
        });
        csvContent += "\n";
      }

      if (data.chartData.sales) {
        csvContent += "Sales Data\n";
        csvContent += "Period,Sales\n";
        data.chartData.sales.forEach((item: any) => {
          csvContent += `"${item.period}",${item.sales}\n`;
        });
        csvContent += "\n";
      }
    }

    // Add recommendations
    if (data.recommendations) {
      csvContent += "AI Recommendations\n";
      data.recommendations.forEach((rec: string, index: number) => {
        csvContent += `${index + 1},"${rec}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

const exportToGoogleSlides = async (data: any, title: string) => {
  try {
    // For Google Slides, we'll create a PowerPoint-compatible format
    let slidesContent = `${title}\n\n`;
    
    slidesContent += `Summary:\n${data.summary || 'No summary available'}\n\n`;
    
    if (data.keyMetrics) {
      slidesContent += "Key Metrics:\n";
      data.keyMetrics.forEach((metric: any, index: number) => {
        slidesContent += `${index + 1}. ${metric.label}: ${metric.value} (${metric.change})\n`;
      });
      slidesContent += "\n";
    }

    if (data.recommendations) {
      slidesContent += "Recommendations:\n";
      data.recommendations.forEach((rec: string, index: number) => {
        slidesContent += `${index + 1}. ${rec}\n`;
      });
    }

    const blob = new Blob([slidesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_slides.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Google Slides export error:', error);
    throw error;
  }
};
