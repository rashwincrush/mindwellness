import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { insertAnonymousReportSchema } from '@shared/schema';
import { Shield, Camera, Mic, FileText, Phone, AlertTriangle } from 'lucide-react';

const reportTypes = [
  { value: 'bullying', label: 'Bullying or harassment' },
  { value: 'safety', label: 'Safety concern' },
  { value: 'mental-health', label: 'Mental health concern' },
  { value: 'substance', label: 'Substance abuse' },
  { value: 'other', label: 'Other concern' },
] as const;

const formSchema = insertAnonymousReportSchema.extend({
  reportType: z.enum(['bullying', 'safety', 'mental-health', 'substance', 'other']),
  description: z.string().min(10, 'Please provide at least 10 characters'),
  isEmergency: z.boolean().default(false),
  attachments: z.array(z.any()).optional(),
});

export function AnonymousReport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: 'other',
      description: '',
      isEmergency: false,
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Handle file uploads first if there are any
      let attachmentUrls: string[] = [];
      
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((file) => {
          formData.append('files', file);
        });

        const uploadResponse = await apiRequest('POST', '/api/upload', formData);
        const uploadResult = await uploadResponse.json();
        attachmentUrls = uploadResult.urls;
      }

      return apiRequest('POST', '/api/anonymous-reports', {
        ...data,
        attachments: attachmentUrls.length > 0 ? { files: attachmentUrls } : null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted Successfully",
        description: "Your anonymous report has been received. Thank you for helping keep our school safe.",
      });
      form.reset();
      setAttachments([]);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/anonymous-reports'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    reportMutation.mutate(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'document') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
      toast({
        title: "File Added",
        description: `${files.length} file(s) attached to your report.`,
      });
    }
  };

  const startAudioRecording = () => {
    setIsRecording(true);
    // Simplified audio recording - in production, implement proper audio recording
    toast({
      title: "Audio Recording",
      description: "Audio recording feature would be implemented here with proper media capture.",
    });
    setTimeout(() => setIsRecording(false), 3000);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="text-purple-600 h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Secure
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe Reporting</h3>
            <p className="text-sm text-gray-600 mb-4">Report concerns anonymously</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Report Safely
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anonymous Safe Reporting</DialogTitle>
          <DialogDescription>
            Your report is completely anonymous and helps keep our school community safe.
          </DialogDescription>
        </DialogHeader>

        {/* Privacy Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="text-purple-600 mt-1 h-5 w-5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Your Privacy is Protected</h4>
              <p className="text-sm text-gray-600">
                Reports are completely anonymous. No personal information is collected or stored.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Type Selection */}
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of concern would you like to report?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      {reportTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={type.value} id={type.value} />
                          <Label htmlFor={type.value} className="text-sm cursor-pointer">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Report Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe the situation</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Please provide as much detail as you feel comfortable sharing..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Attachments */}
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                Attach evidence (optional)
              </FormLabel>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Photo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={(e) => handleFileUpload(e, 'photo')}
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="text-gray-400 h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Photo</p>
                  </label>
                </div>

                {/* Audio Recording */}
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer ${
                    isRecording ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  onClick={startAudioRecording}
                >
                  <Mic className={`h-8 w-8 mx-auto mb-2 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                  <p className="text-xs text-gray-500">
                    {isRecording ? 'Recording...' : 'Voice'}
                  </p>
                </div>

                {/* Document Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    id="document-upload"
                    onChange={(e) => handleFileUpload(e, 'document')}
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <FileText className="text-gray-400 h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Document</p>
                  </label>
                </div>
              </div>

              {/* Show attached files */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Toggle */}
            <FormField
              control={form.control}
              name="isEmergency"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      This is an emergency situation requiring immediate attention
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={reportMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Shield className="mr-2 h-4 w-4" />
              {reportMutation.isPending ? 'Submitting...' : 'Submit Anonymous Report'}
            </Button>
          </form>
        </Form>

        {/* Help Resources */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Need immediate help?</h4>
          <div className="space-y-2">
            <a
              href="tel:988"
              className="flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <Phone className="mr-2 h-4 w-4" />
              Crisis Hotline: 988
            </a>
            <a
              href="tel:911"
              className="flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency: 911
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
