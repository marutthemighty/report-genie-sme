
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
      description: 'Comprehensive guides and API references',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      action: () => window.open('https://docs.reportai.com', '_blank')
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      color: 'bg-green-50 text-green-600 border-green-200',
      action: () => window.open('https://tutorials.reportai.com', '_blank')
    },
    {
      title: 'API Reference',
      description: 'Technical documentation for developers',
      icon: Code,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      action: () => window.open('https://api.reportai.com/docs', '_blank')
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and get help',
      icon: MessageCircle,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      action: () => window.open('https://community.reportai.com', '_blank')
    }
  ];

  const faqs = [
    {
      question: 'How do I create my first report?',
      answer: 'Click the "Create Report" button in the sidebar or dashboard, select your data source, choose a report type, and configure your settings. Our AI will generate insights automatically.'
    },
    {
      question: 'What data sources are supported?',
      answer: 'We support major e-commerce platforms like Shopify, WooCommerce, analytics tools like Google Analytics, and social media platforms like Facebook and Instagram.'
    },
    {
      question: 'How accurate are the AI predictions?',
      answer: 'Our AI models are trained on vast datasets and typically achieve 85-95% accuracy. Accuracy improves over time as the system learns from your specific data patterns.'
    },
    {
      question: 'Can I export my reports?',
      answer: 'Yes, you can export reports in multiple formats including PDF, Excel, and CSV. Premium users also get access to automated report scheduling.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption, comply with GDPR and CCPA regulations, and never share your data with third parties.'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Mail,
      contact: 'support@reportai.com',
      action: () => window.location.href = 'mailto:support@reportai.com'
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      contact: '+1 (555) 123-4567',
      action: () => window.location.href = 'tel:+15551234567'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
              <p className="text-gray-600 dark:text-gray-300">Find answers, get help, and learn how to use ReportAI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-auto p-4 flex flex-col items-center gap-3 ${action.color}`}
                      onClick={action.action}
                    >
                      <Icon className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs opacity-70">{action.description}</div>
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
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
                  <Search className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {contactOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="flex items-center justify-between p-4 h-auto"
                        onClick={option.action}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="font-medium">{option.title}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{option.contact}</div>
                      </Button>
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
                <FileText className="w-5 h-5" />
                Submit Support Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Textarea
                    placeholder="Please describe your issue in detail..."
                    rows={4}
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    required
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
