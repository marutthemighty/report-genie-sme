
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  name: string;
  report_type: string;
  data_source: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  date_range: string;
  ai_summary?: string;
  ai_prediction?: string;
  template_layout?: any;
  generated_at: string;
}

interface ReportRow {
  id: string;
  name: string;
  report_type: string;
  data_source: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  date_range: string;
  ai_summary?: string;
  ai_prediction?: string;
  template_layout?: any;
  generated_at: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData: Report[] = (data || []).map((row: ReportRow) => ({
        ...row,
      }));
      
      setReports(transformedData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: any) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          name: reportData.name,
          report_type: reportData.type,
          data_source: reportData.dataSource,
          date_range: reportData.dateRange,
          status: 'Generated',
          created_by: user.id,
          generated_at: new Date().toISOString(),
          ai_summary: `AI-generated summary for ${reportData.name}`,
          ai_prediction: 'Based on current trends, we predict continued growth.'
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedData: Report = { ...data };
      setReports(prev => [transformedData, ...prev]);
      
      toast({
        title: "Report Created",
        description: `${reportData.name} has been generated successfully.`,
      });
      
      return transformedData;
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      setReports(prev => prev.filter(report => report.id !== reportId));
      
      toast({
        title: "Report Deleted",
        description: "Report has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  return {
    reports,
    loading,
    createReport,
    deleteReport,
    refetch: fetchReports
  };
};
