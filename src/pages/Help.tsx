
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Video, 
  Code, 
  MessageCircle, 
  Search, 
  Mail, 
  Phone,
  ExternalLink,
  FileText,
  Users,
  Zap
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TruncatedText } from '@/components/TruncatedText';
import { TruncatedButton } from '@/components/TruncatedButton';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    email: ''
  });
  const { toast } = useToast();

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Request Sent",
      description: "We'll get back to you within 24 hours.",
    });
    setSupportForm({ subject: '', message: '', email: '' });
  };

  const quickActions = [
    {
      title: 'Documentation',
      description: 'Comprehensive guides and API references for all features',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      action: () => window.open('https://docs.reportai.com', '_blank')
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for getting started and advanced features',
      icon: Video,
      color: 'bg-green-50 text-green-600 border-green-200',
      action: () => window.open('https://tutorials.reportai.com', '_blank')
    },
    {
      title: 'API Reference',
      description: 'Complete technical documentation for developers and integrations',
      icon: Code,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      action: () => window.open('https://api.reportai.com/docs', '_blank')
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users, share tips, and get help from the community',
      icon: MessageCircle,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      action: () => window.open('https://community.reportai.com', '_blank')
    }
  ];

  const faqs = [
    {
      question: 'How do I create my first report with AI-powered insights?',
      answer: 'Click the "Create Report" button in the sidebar or dashboard, select your data source, choose a report type, and configure your settings. Our AI will automatically generate insights, trends, and recommendations based on your data patterns.'
    },
    {
      question: 'What data sources and file formats are supported by the platform?',
      answer: 'We support major e-commerce platforms like Shopify, WooCommerce, analytics tools like Google Analytics, social media platforms like Facebook and Instagram, and file uploads including CSV, Excel, JSON, and direct database connections.'
    },
    {
      question: 'How accurate are the AI predictions and what methodology is used?',
      answer: 'Our AI models are trained on vast datasets and typically achieve 85-95% accuracy. We use advanced machine learning algorithms including neural networks and ensemble methods. Accuracy improves over time as the system learns from your specific data patterns and feedback.'
    },
    {
      question: 'Can I export my reports and schedule automated deliveries?',
      answer: 'Yes, you can export reports in multiple formats including PDF, Excel, CSV, and PowerPoint. Premium users also get access to automated report scheduling, email delivery, and integration with business intelligence tools.'
    },
    {
      question: 'What security measures are in place to protect my business data?',
      answer: 'We use enterprise-grade encryption (AES-256), comply with GDPR, CCPA, and SOC 2 regulations, implement zero-trust architecture, and never share your data with third parties. All data is processed in secure, isolated environments with regular security audits.'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get comprehensive help via email within 24 hours',
      icon: Mail,
      contact: 'support@reportai.com',
      action: () => window.location.href = 'mailto:support@reportai.com'
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance and urgent issues',
      icon: Phone,
      contact: '+1 (555) 123-4567',
      action: () => window.location.href = 'tel:+15551234567'
    },
    {
      title: 'Live Chat',
      description: 'Real-time chat with our support team during business hours',
      icon: MessageCircle,
      contact: 'Available 9 AM - 6 PM EST',
      action: () => toast({ title: "Live Chat", description: "Live chat will be available soon!" })
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-600 dark:text-gray-300 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">Help & Support</h1>
              <TruncatedText 
                text="Find answers, get help, and learn how to use ReportAI effectively"
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <TruncatedButton
                      key={index}
                      variant="outline"
                      className={`h-auto p-4 flex flex-col items-center gap-3 ${action.color}`}
                      onClick={action.action}
                      tooltip={`${action.title}: ${action.description}`}
                    >
                      <Icon className="w-8 h-8 flex-shrink-0" />
                      <div className="text-center min-w-0 w-full">
                        <div className="font-medium truncate">{action.title}</div>
                        <TruncatedText 
                          text={action.description}
                          className="text-xs opacity-70"
                          maxLines={2}
                        />
                      </div>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </TruncatedButton>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Search and FAQs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4">
                      <TruncatedText 
                        text={faq.question}
                        className="font-medium text-gray-900 dark:text-white mb-2"
                        maxLines={2}
                      />
                      <TruncatedText 
                        text={faq.answer}
                        className="text-sm text-gray-600 dark:text-gray-300"
                        maxLines={3}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">Contact Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {contactOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <TruncatedButton
                        key={index}
                        variant="outline"
                        className="flex items-center justify-between p-4 h-auto"
                        onClick={option.action}
                        tooltip={`${option.title}: ${option.description} - ${option.contact}`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <div className="text-left min-w-0 flex-1">
                            <div className="font-medium truncate">{option.title}</div>
                            <TruncatedText 
                              text={option.description}
                              className="text-xs text-gray-500"
                            />
                          </div>
                        </div>
                        <TruncatedText 
                          text={option.contact}
                          className="text-sm text-gray-600 ml-2"
                        />
                      </TruncatedButton>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Submit Support Request</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium mb-1 truncate">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium mb-1 truncate">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-medium mb-1 truncate">Detailed Message</label>
                  <Textarea
                    placeholder="Please describe your issue in detail..."
                    rows={4}
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    required
                    className="w-full resize-none"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Send Support Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Help;
