import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Settings } from 'lucide-react';

interface TemplateBuilderProps {
  value: any;
  onChange: (template: any) => void;
}

const TemplateBuilder = ({ value, onChange }: TemplateBuilderProps) => {
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  const [template, setTemplate] = useState({
    layout: value?.layout || 'standard',
    charts: value?.charts || [],
    filters: value?.filters || [],
    sections: value?.sections || ['summary', 'metrics', 'charts'],
    theme: value?.theme || 'professional'
  });

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'scatter', label: 'Scatter Plot' }
  ];

  const layoutOptions = [
    { value: 'standard', label: 'Standard Layout' },
    { value: 'dashboard', label: 'Dashboard Style' },
    { value: 'executive', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed Analysis' }
  ];

  const sectionOptions = [
    { value: 'summary', label: 'Executive Summary' },
    { value: 'metrics', label: 'Key Metrics' },
    { value: 'charts', label: 'Data Visualizations' },
    { value: 'trends', label: 'Trend Analysis' },
    { value: 'recommendations', label: 'AI Recommendations' },
    { value: 'appendix', label: 'Detailed Appendix' }
  ];

  const updateTemplate = (updates: any) => {
    const newTemplate = { ...template, ...updates };
    setTemplate(newTemplate);
    onChange(newTemplate);
  };

  const addChart = (type: string) => {
    const newChart = {
      id: `chart_${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      dataSource: 'auto'
    };
    updateTemplate({ charts: [...template.charts, newChart] });
  };

  const removeChart = (chartId: string) => {
    updateTemplate({ charts: template.charts.filter((c: any) => c.id !== chartId) });
  };

  const toggleSection = (section: string) => {
    const sections = template.sections.includes(section)
      ? template.sections.filter((s: string) => s !== section)
      : [...template.sections, section];
    updateTemplate({ sections });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Report Template Configuration
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={mode === 'visual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('visual')}
            >
              <Eye className="w-4 h-4 mr-1" />
              Visual
            </Button>
            <Button
              variant={mode === 'json' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('json')}
            >
              <Code className="w-4 h-4 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'visual' ? (
          <>
            {/* Layout Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Layout</Label>
              <Select value={template.layout} onValueChange={(value) => updateTemplate({ layout: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {layoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Report Sections</Label>
              <div className="grid grid-cols-2 gap-3">
                {sectionOptions.map((section) => (
                  <div key={section.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={section.value}
                      checked={template.sections.includes(section.value)}
                      onCheckedChange={() => toggleSection(section.value)}
                    />
                    <Label htmlFor={section.value} className="text-sm">
                      {section.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Data Visualizations</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {chartTypes.map((chart) => (
                  <Button
                    key={chart.value}
                    variant="outline"
                    size="sm"
                    onClick={() => addChart(chart.value)}
                  >
                    Add {chart.label}
                  </Button>
                ))}
              </div>
              
              {template.charts.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Selected Charts:</Label>
                  <div className="flex flex-wrap gap-2">
                    {template.charts.map((chart: any) => (
                      <Badge key={chart.id} variant="secondary" className="flex items-center gap-1">
                        {chart.title}
                        <button
                          onClick={() => removeChart(chart.id)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Theme</Label>
              <Select value={template.theme} onValueChange={(value) => updateTemplate({ theme: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="colorful">Colorful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm font-medium">JSON Configuration</Label>
            <Textarea
              value={JSON.stringify(template, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setTemplate(parsed);
                  onChange(parsed);
                } catch (error) {
                  // Invalid JSON, keep current value
                }
              }}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Advanced users can directly edit the JSON configuration
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateBuilder;
