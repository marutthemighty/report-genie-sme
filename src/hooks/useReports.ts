
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

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching reports for user:', user.id);
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
      
      console.log('Fetched reports:', data);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create reports.",
        variant: "destructive"
      });
      throw new Error('User not authenticated');
    }
    
    try {
      console.log('Creating report with data:', reportData);
      console.log('User ID:', user.id);
      
      const reportPayload = {
        name: reportData.name,
        report_type: reportData.type,
        data_source: reportData.dataSource,
        date_range: reportData.dateRange || 'Last 30 Days',
        status: 'Generated',
        created_by: user.id,
        generated_at: new Date().toISOString(),
        ai_summary: `AI-generated summary for ${reportData.name}: This report analyzes ${reportData.type?.toLowerCase() || 'business'} data from ${reportData.dataSource} over the ${reportData.dateRange?.toLowerCase() || 'last 30 days'} period.`,
        ai_prediction: 'Based on current trends, we predict continued growth in the coming months with opportunities for optimization in key performance areas.'
      };

      console.log('Report payload:', reportPayload);

      const { data, error } = await supabase
        .from('reports')
        .insert([reportPayload])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating report:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Handle specific error cases
        if (error.code === '23505') {
          throw new Error('A report with this name already exists. Please choose a different name.');
        } else if (error.code === '23503') {
          throw new Error('User authentication error. Please sign out and sign back in.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('No data returned from report creation');
      }

      console.log('Report created successfully:', data);
      setReports(prev => [data, ...prev]);
      
      toast({
        title: "Report Created",
        description: `${reportData.name} has been generated successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating report:', error);
      
      const errorMessage = error.message || 'An unexpected error occurred while creating the report.';
      
      toast({
        title: "Error Creating Report",
        description: errorMessage,
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
    if (user) {
      fetchReports();
    } else {
      setReports([]);
      setLoading(false);
    }
  }, [user]);

  return {
    reports,
    loading,
    createReport,
    deleteReport,
    refetch: fetchReports
  };
};
