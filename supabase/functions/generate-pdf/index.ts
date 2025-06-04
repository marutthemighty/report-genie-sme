
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
    products?: Array<{ name: string; sales: number; }>;
    customers?: Array<{ segment: string; count: number; value: number; }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData, reportTitle, reportType, includeCharts } = await req.json();
    
    console.log('Generating PDF report for:', reportTitle || 'Unknown Report');

    // Generate comprehensive HTML report with charts
    const htmlContent = generatePDFReport(reportData, reportTitle, reportType, includeCharts);
    
    // Create a proper HTML document for printing as PDF
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
  
  // Generate chart HTML if data is available
  const chartsHTML = includeCharts && reportData?.chartData ? generateChartsHTML(reportData.chartData) : '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Business Report'} - Professional Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @media print {
            body { -webkit-print-color-adjust: exact; color-adjust: exact; }
            .page-break { page-break-before: always; }
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin: 0 0 10px 0;
        }
        .header .subtitle {
            color: #666;
            font-size: 1.2em;
            margin: 5px 0;
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
            margin-bottom: 20px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .metric-card {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .metric-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 8px;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        .metric-change {
            color: #059669;
            font-weight: 500;
            font-size: 0.9em;
        }
        .recommendation {
            background: #fff;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
            border-left: 4px solid #10b981;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chart-container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chart-title {
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1e40af;
        }
        .chart-canvas {
            max-width: 100%;
            height: 300px;
            margin: 0 auto;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .summary-box {
            background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
            border: 1px solid #93c5fd;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .data-table th,
        .data-table td {
            border: 1px solid #e5e7eb;
            padding: 12px 15px;
            text-align: left;
        }
        .data-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #1e40af;
        }
        .chart-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title || 'Business Analysis Report'}</h1>
        <div class="subtitle"><strong>Report Type:</strong> ${type || 'Dashboard Overview'}</div>
        <div class="subtitle"><strong>Generated:</strong> ${currentDate}</div>
        <div class="subtitle"><strong>Status:</strong> Complete ✅</div>
    </div>

    ${reportData?.summary ? `
    <div class="section">
        <h2>📊 Executive Summary</h2>
        <div class="summary-box">
            <p style="font-size: 1.1em; line-height: 1.7;">${reportData.summary}</p>
        </div>
    </div>
    ` : ''}

    ${reportData?.keyMetrics && reportData.keyMetrics.length > 0 ? `
    <div class="section">
        <h2>🎯 Key Performance Metrics</h2>
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

    ${chartsHTML}

    ${reportData?.recommendations && reportData.recommendations.length > 0 ? `
    <div class="section page-break">
        <h2>🤖 AI-Powered Recommendations</h2>
        ${reportData.recommendations.map((rec, index) => `
            <div class="recommendation">
                <strong>${index + 1}.</strong> ${rec}
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="footer">
        <p><strong>📈 Report Generated by AI Analytics Platform</strong></p>
        <p>This comprehensive business report was automatically generated on ${currentDate}</p>
        <p>For questions or support, please contact your analytics team.</p>
        <p style="margin-top: 15px; font-size: 0.8em; color: #999;">
            Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} | 
            Version: 1.0 | 
            Confidential Business Document
        </p>
    </div>

    <script>
        // Initialize charts after DOM loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeCharts();
        });
        
        function initializeCharts() {
            ${includeCharts && reportData?.chartData ? generateChartJavaScript(reportData.chartData) : ''}
        }
        
        // Auto-trigger print dialog after charts load
        setTimeout(() => {
            window.print();
        }, 1000);
    </script>
</body>
</html>
  `;
}

function generateChartsHTML(chartData: any): string {
  let chartsHTML = '<div class="section"><h2>📈 Data Visualizations</h2><div class="chart-section">';
  
  if (chartData.revenue && chartData.revenue.length > 0) {
    chartsHTML += `
      <div class="chart-container">
        <div class="chart-title">Revenue Trends</div>
        <canvas id="revenueChart" class="chart-canvas"></canvas>
      </div>
    `;
  }
  
  if (chartData.sales && chartData.sales.length > 0) {
    chartsHTML += `
      <div class="chart-container">
        <div class="chart-title">Sales Performance</div>
        <canvas id="salesChart" class="chart-canvas"></canvas>
      </div>
    `;
  }
  
  if (chartData.products && chartData.products.length > 0) {
    chartsHTML += `
      <div class="chart-container">
        <div class="chart-title">Product Performance</div>
        <canvas id="productsChart" class="chart-canvas"></canvas>
      </div>
    `;
  }
  
  if (chartData.distribution && chartData.distribution.length > 0) {
    chartsHTML += `
      <div class="chart-container">
        <div class="chart-title">Data Distribution</div>
        <canvas id="distributionChart" class="chart-canvas"></canvas>
      </div>
    `;
  }
  
  if (chartData.customers && chartData.customers.length > 0) {
    chartsHTML += `
      <div class="chart-container">
        <div class="chart-title">Customer Segments</div>
        <canvas id="customersChart" class="chart-canvas"></canvas>
      </div>
    `;
  }
  
  chartsHTML += '</div></div>';
  return chartsHTML;
}

function generateChartJavaScript(chartData: any): string {
  let js = '';
  
  if (chartData.revenue && chartData.revenue.length > 0) {
    js += `
      new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: ${JSON.stringify(chartData.revenue.map((item: any) => item.month))},
          datasets: [{
            label: 'Revenue',
            data: ${JSON.stringify(chartData.revenue.map((item: any) => item.revenue))},
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } }
        }
      });
    `;
  }
  
  if (chartData.sales && chartData.sales.length > 0) {
    js += `
      new Chart(document.getElementById('salesChart'), {
        type: 'bar',
        data: {
          labels: ${JSON.stringify(chartData.sales.map((item: any) => item.period))},
          datasets: [{
            label: 'Sales',
            data: ${JSON.stringify(chartData.sales.map((item: any) => item.sales))},
            backgroundColor: '#059669'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } }
        }
      });
    `;
  }
  
  if (chartData.products && chartData.products.length > 0) {
    js += `
      new Chart(document.getElementById('productsChart'), {
        type: 'bar',
        data: {
          labels: ${JSON.stringify(chartData.products.map((item: any) => item.name))},
          datasets: [{
            label: 'Sales',
            data: ${JSON.stringify(chartData.products.map((item: any) => item.sales))},
            backgroundColor: '#f59e0b'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } }
        }
      });
    `;
  }
  
  if (chartData.distribution && chartData.distribution.length > 0) {
    js += `
      new Chart(document.getElementById('distributionChart'), {
        type: 'pie',
        data: {
          labels: ${JSON.stringify(chartData.distribution.map((item: any) => item.name))},
          datasets: [{
            data: ${JSON.stringify(chartData.distribution.map((item: any) => item.value))},
            backgroundColor: ['#2563eb', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    `;
  }
  
  if (chartData.customers && chartData.customers.length > 0) {
    js += `
      new Chart(document.getElementById('customersChart'), {
        type: 'doughnut',
        data: {
          labels: ${JSON.stringify(chartData.customers.map((item: any) => item.segment))},
          datasets: [{
            data: ${JSON.stringify(chartData.customers.map((item: any) => item.count))},
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    `;
  }
  
  return js;
}
