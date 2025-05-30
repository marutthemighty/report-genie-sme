
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  name: string;
  report_type: string;
  data_source: string;
  status: string;
  created_by: string;
  created_at: string;
  ai_summary?: string;
  generated_at: string;
  date_range: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: any) => {
    try {
      const newReport = {
        name: reportData.name || `${reportData.dataSource} ${reportData.type}`,
        report_type: reportData.type,
        data_source: reportData.dataSource,
        status: 'Generated',
        created_by: 'current-user-id', // This would be actual user ID in real app
        generated_at: new Date().toISOString(),
        date_range: reportData.dateRange || 'Last 30 days',
        ai_summary: `AI-generated insights for ${reportData.dataSource} ${reportData.type} report.`
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([newReport])
        .select()
        .single();

      if (error) throw error;

      setReports(prev => [data, ...prev]);
      
      toast({
        title: "Report Created",
        description: `${newReport.name} has been created successfully.`,
      });

      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
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
        description: "The report has been successfully deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    createReport,
    deleteReport,
    refetch: fetchReports
  };
};
