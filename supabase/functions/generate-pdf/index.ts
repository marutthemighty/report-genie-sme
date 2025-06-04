
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportData {
  summary?: string;
  keyMetrics?: Array<{ label: string; value: string; change: string; }>;
  recommendations?: string[];
  chartData?: {
    revenue?: Array<{ month: string; revenue: number; }>;
    sales?: Array<{ period: string; sales: number; }>;
    distribution?: Array<{ name: string; value: number; }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData, reportTitle, reportType, includeCharts } = await req.json();
    
    console.log('Generating PDF report for:', reportTitle || 'Unknown Report');

    // Generate comprehensive HTML report with better PDF styling
    const htmlContent = generatePDFReport(reportData, reportTitle, reportType, includeCharts);
    
    // Use jsPDF library for proper PDF generation
    const pdfLibResponse = await fetch('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    const jsPDFScript = await pdfLibResponse.text();
    
    // Create a simple PDF using basic HTML to PDF conversion
    // For now, we'll return the HTML content that can be printed as PDF
    const response = {
      pdf: btoa(unescape(encodeURIComponent(htmlContent))),
      contentType: 'text/html',
      filename: `${reportTitle || 'report'}_${new Date().toISOString().split('T')[0]}.html`
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate PDF report'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generatePDFReport(reportData: ReportData, title: string, type: string, includeCharts: boolean): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Business Report'}</title>
    <style>
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
            page-break-after: avoid;
        }
        .header h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin: 0;
        }
        .header p {
            color: #666;
            font-size: 1.1em;
            margin: 10px 0;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border-radius: 8px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .metric-card {
            background: #fff;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }
        .metric-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #2563eb;
        }
        .metric-change {
            color: #059669;
            font-weight: 500;
        }
        .recommendation {
            background: #fff;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
            border-left: 4px solid #10b981;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .summary-box {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .data-table th,
        .data-table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
        }
        .data-table th {
            background: #f8fafc;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title || 'Business Analysis Report'}</h1>
        <p><strong>Report Type:</strong> ${type || 'Dashboard Overview'}</p>
        <p><strong>Generated:</strong> ${currentDate}</p>
        <p><strong>Status:</strong> Complete</p>
    </div>

    ${reportData?.summary ? `
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="summary-box">
            <p>${reportData.summary}</p>
        </div>
    </div>
    ` : ''}

    ${reportData?.keyMetrics && reportData.keyMetrics.length > 0 ? `
    <div class="section">
        <h2>Key Performance Metrics</h2>
        <div class="metrics-grid">
            ${reportData.keyMetrics.map(metric => `
                <div class="metric-card">
                    <div class="metric-label">${metric.label}</div>
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-change">${metric.change}</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${reportData?.recommendations && reportData.recommendations.length > 0 ? `
    <div class="section">
        <h2>AI Recommendations</h2>
        ${reportData.recommendations.map((rec, index) => `
            <div class="recommendation">
                <strong>${index + 1}.</strong> ${rec}
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="footer">
        <p><strong>Report Generated by AI Analytics Platform</strong></p>
        <p>This report was automatically generated on ${currentDate}</p>
        <p>For questions or support, please contact your analytics team.</p>
    </div>
</body>
</html>
  `;
}
