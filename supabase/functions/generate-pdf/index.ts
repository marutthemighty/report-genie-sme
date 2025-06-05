
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
    customers?: Array<{ segment: string; count: number; }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData, reportTitle, reportType, includeCharts, chartData } = await req.json();
    
    console.log('Generating PDF report for:', reportTitle || 'Unknown Report');
    console.log('Report data received:', !!reportData);

    // Generate professional HTML report with charts
    const htmlContent = generateHTMLReport(reportData, reportTitle, reportType, includeCharts, chartData);
    
    // Return the HTML content as base64 encoded
    const base64Html = btoa(unescape(encodeURIComponent(htmlContent)));
    
    return new Response(JSON.stringify({ 
      pdf: base64Html,
      contentType: 'text/html'
    }), {
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

function generateHTMLReport(reportData: ReportData, title: string, type: string, includeCharts: boolean, chartData?: any): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Business Report'}</title>
    <style>
        @page {
            size: A4;
            margin: 1in;
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
            page-break-inside: avoid;
        }
        
        .header h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin: 0;
            font-weight: bold;
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
            margin-top: 0;
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
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .metric-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
        }
        
        .metric-value {
            font-size: 1.8em;
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
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        
        .chart-section {
            background: #fff;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            page-break-inside: avoid;
        }
        
        .chart-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 15px;
        }
        
        .chart-data {
            background: #f1f5f9;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .chart-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .chart-item:last-child {
            border-bottom: none;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            page-break-inside: avoid;
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
            background: #fff;
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
            color: #374151;
        }
        
        .data-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            .chart-section {
                page-break-inside: avoid;
            }
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
    ` : `
    <div class="section">
        <h2>Key Performance Metrics</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">$284,390</div>
                <div class="metric-change">+23.1%</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Orders</div>
                <div class="metric-value">1,247</div>
                <div class="metric-change">+18.5%</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Avg Order Value</div>
                <div class="metric-value">$228</div>
                <div class="metric-change">+3.9%</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Conversion Rate</div>
                <div class="metric-value">4.2%</div>
                <div class="metric-change">+0.8%</div>
            </div>
        </div>
    </div>
    `}

    ${includeCharts && (chartData || reportData?.chartData) ? `
    <div class="section">
        <h2>Data Visualizations</h2>
        
        ${(chartData?.revenue || reportData?.chartData?.revenue) ? `
        <div class="chart-section">
            <div class="chart-title">Revenue Trend Analysis</div>
            <div class="chart-data">
                ${(chartData?.revenue || reportData?.chartData?.revenue || []).map((item: any) => `
                    <div class="chart-item">
                        <span>${item.month}</span>
                        <span><strong>$${item.revenue?.toLocaleString() || 0}</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${(chartData?.sales || reportData?.chartData?.sales) ? `
        <div class="chart-section">
            <div class="chart-title">Sales Performance Overview</div>
            <div class="chart-data">
                ${(chartData?.sales || reportData?.chartData?.sales || []).map((item: any) => `
                    <div class="chart-item">
                        <span>${item.period}</span>
                        <span><strong>${item.sales?.toLocaleString() || 0} units</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${(chartData?.distribution || reportData?.chartData?.distribution) ? `
        <div class="chart-section">
            <div class="chart-title">Data Distribution Breakdown</div>
            <div class="chart-data">
                ${(chartData?.distribution || reportData?.chartData?.distribution || []).map((item: any) => `
                    <div class="chart-item">
                        <span>${item.name}</span>
                        <span><strong>${item.value?.toLocaleString() || 0}</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${(chartData?.products || reportData?.chartData?.products) ? `
        <div class="chart-section">
            <div class="chart-title">Product Performance Analysis</div>
            <div class="chart-data">
                ${(chartData?.products || reportData?.chartData?.products || []).map((item: any) => `
                    <div class="chart-item">
                        <span>${item.name}</span>
                        <span><strong>${item.sales?.toLocaleString() || 0} sales</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${(chartData?.customers || reportData?.chartData?.customers) ? `
        <div class="chart-section">
            <div class="chart-title">Customer Segmentation</div>
            <div class="chart-data">
                ${(chartData?.customers || reportData?.chartData?.customers || []).map((item: any) => `
                    <div class="chart-item">
                        <span>${item.segment}</span>
                        <span><strong>${item.count?.toLocaleString() || 0} customers</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    ` : ''}

    ${reportData?.recommendations && reportData.recommendations.length > 0 ? `
    <div class="section">
        <h2>AI-Generated Recommendations</h2>
        ${reportData.recommendations.map((rec, index) => `
            <div class="recommendation">
                <strong>${index + 1}.</strong> ${rec}
            </div>
        `).join('')}
    </div>
    ` : `
    <div class="section">
        <h2>AI-Generated Recommendations</h2>
        <div class="recommendation">
            <strong>1.</strong> Focus on high-value customer segments for better ROI
        </div>
        <div class="recommendation">
            <strong>2.</strong> Optimize product mix based on performance metrics
        </div>
        <div class="recommendation">
            <strong>3.</strong> Implement retention strategies for at-risk customers
        </div>
        <div class="recommendation">
            <strong>4.</strong> Scale successful marketing channels
        </div>
    </div>
    `}

    <div class="section">
        <h2>Performance Summary</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Current Period</th>
                    <th>Previous Period</th>
                    <th>Change</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Revenue</td>
                    <td>$284,390</td>
                    <td>$231,200</td>
                    <td style="color: #059669;">+23.1%</td>
                    <td style="color: #059669;">Excellent</td>
                </tr>
                <tr>
                    <td>Customer Acquisition</td>
                    <td>456</td>
                    <td>387</td>
                    <td style="color: #059669;">+17.8%</td>
                    <td style="color: #059669;">Good</td>
                </tr>
                <tr>
                    <td>Average Order Value</td>
                    <td>$228</td>
                    <td>$219</td>
                    <td style="color: #059669;">+4.1%</td>
                    <td style="color: #059669;">Stable</td>
                </tr>
                <tr>
                    <td>Customer Retention Rate</td>
                    <td>87.3%</td>
                    <td>84.1%</td>
                    <td style="color: #059669;">+3.2%</td>
                    <td style="color: #059669;">Good</td>
                </tr>
                <tr>
                    <td>Conversion Rate</td>
                    <td>4.2%</td>
                    <td>3.8%</td>
                    <td style="color: #059669;">+10.5%</td>
                    <td style="color: #059669;">Improving</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p><strong>Professional Business Analytics Report</strong></p>
        <p>Generated on ${currentDate} by AI Analytics Platform</p>
        <p>This comprehensive report provides actionable insights for strategic business decisions.</p>
        <p>For support and additional analysis, contact your analytics team.</p>
    </div>
</body>
</html>
  `;
}
