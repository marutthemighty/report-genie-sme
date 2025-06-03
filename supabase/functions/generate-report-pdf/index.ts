
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData, csvData } = await req.json();
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    console.log('Generating report for:', reportData.name);
    console.log('CSV data length:', csvData?.length || 0);

    // Analyze the CSV data with Gemini
    let dataAnalysis = '';
    if (csvData && csvData.length > 0) {
      const prompt = `You are a professional data analyst. Analyze this ${reportData.report_type} dataset and provide:

1. Executive Summary (2-3 paragraphs)
2. Key Findings (5-7 bullet points)
3. Detailed Analysis (multiple sections with insights)
4. Recommendations (3-5 actionable items)
5. Statistical Insights (trends, patterns, correlations)

Dataset preview:
${csvData.slice(0, 1000)}...

Report Type: ${reportData.report_type}
Data Source: ${reportData.data_source}
Date Range: ${reportData.date_range}

Provide a comprehensive, professional analysis suitable for a business report.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      dataAnalysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis could not be generated.';
    }

    // Generate HTML report content
    const htmlContent = generateHTMLReport(reportData, dataAnalysis, csvData);

    // Return the HTML content (in a real implementation, you'd convert to PDF)
    return new Response(JSON.stringify({ 
      htmlContent,
      analysis: dataAnalysis,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-report-pdf function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateHTMLReport(reportData: any, analysis: string, csvData?: string): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.name}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            font-size: 28px;
            margin: 0;
        }
        .header .subtitle {
            color: #666;
            font-size: 16px;
            margin: 10px 0;
        }
        .meta-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
        }
        .meta-info h3 {
            margin-top: 0;
            color: #2563eb;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .meta-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .meta-label {
            font-weight: bold;
            color: #475569;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #2563eb;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            font-size: 20px;
        }
        .section h3 {
            color: #475569;
            font-size: 16px;
            margin-top: 20px;
        }
        .analysis-content {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            white-space: pre-wrap;
            line-height: 1.8;
        }
        .data-preview {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
            max-height: 200px;
            overflow-y: auto;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .highlight-box h4 {
            color: #1e40af;
            margin-top: 0;
        }
        @media print {
            body { margin: 0; padding: 15mm; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${reportData.name}</h1>
        <div class="subtitle">${reportData.report_type} Analysis Report</div>
        <div class="subtitle">Generated on ${currentDate}</div>
    </div>

    <div class="meta-info">
        <h3>Report Overview</h3>
        <div class="meta-grid">
            <div class="meta-item">
                <span class="meta-label">Report Type:</span>
                <span>${reportData.report_type}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Data Source:</span>
                <span>${reportData.data_source}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Date Range:</span>
                <span>${reportData.date_range}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Generated At:</span>
                <span>${new Date().toLocaleString()}</span>
            </div>
        </div>
    </div>

    ${csvData ? `
    <div class="section">
        <h2>Dataset Information</h2>
        <div class="highlight-box">
            <h4>Data Quality Assessment</h4>
            <p>Dataset successfully processed and analyzed. The following preview shows the first few rows of your data:</p>
        </div>
        <div class="data-preview">${csvData.slice(0, 500)}${csvData.length > 500 ? '...\n\n[Dataset continues...]' : ''}</div>
    </div>
    ` : ''}

    <div class="section">
        <h2>Professional Analysis</h2>
        <div class="analysis-content">${analysis || 'Analysis is being generated...'}</div>
    </div>

    <div class="section">
        <h2>Report Specifications</h2>
        <div class="highlight-box">
            <h4>Analysis Methodology</h4>
            <p>This report was generated using advanced AI analytics to examine your ${reportData.report_type.toLowerCase()} data. 
            The analysis includes statistical evaluation, trend identification, and strategic recommendations based on industry best practices.</p>
        </div>
        
        <h3>Technical Details</h3>
        <ul>
            <li><strong>Analysis Engine:</strong> Google Gemini AI</li>
            <li><strong>Processing Date:</strong> ${currentDate}</li>
            <li><strong>Report Format:</strong> Professional Business Analysis</li>
            <li><strong>Data Processing:</strong> ${csvData ? 'Custom Dataset Analysis' : 'Template-based Analysis'}</li>
        </ul>
    </div>

    <div class="footer">
        <p>This report was generated by AI Analytics Platform</p>
        <p>Report ID: ${reportData.id || 'N/A'} | Confidential Business Document</p>
    </div>
</body>
</html>`;
}
