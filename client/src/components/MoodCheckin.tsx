import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { insertMoodCheckinSchema } from '@shared/schema';
import { Heart, Bot } from 'lucide-react';

const moodOptions = [
  { value: 'very-sad', emoji: '😢', label: 'Very Sad' },
  { value: 'sad', emoji: '😕', label: 'Sad' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'great', emoji: '😊', label: 'Great' },
] as const;

const formSchema = insertMoodCheckinSchema.extend({
  mood: z.enum(['very-sad', 'sad', 'okay', 'good', 'great']),
  energyLevel: z.number().min(1).max(5),
  journalEntry: z.string().optional(),
});

export function MoodCheckin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEnergy, setSelectedEnergy] = useState<number>(3);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user?.id,
      mood: 'okay',
      energyLevel: 3,
      journalEntry: '',
    },
  });

  const moodMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest('POST', '/api/mood-checkins', data);
    },
    onSuccess: () => {
      toast({
        title: "Mood Check-in Submitted",
        description: "Thank you for sharing how you're feeling today.",
      });
      form.reset();
      setIsOpen(false);
      setSelectedMood('');
      setSelectedEnergy(3);
      queryClient.invalidateQueries({ queryKey: ['/api/mood-checkins'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit mood check-in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    moodMutation.mutate({
      ...data,
      mood: selectedMood as any,
      energyLevel: selectedEnergy,
    });
  };

  const openAIChat = () => {
    setIsOpen(false);
    // Navigate to AI chat (implement based on your routing)
    window.location.hash = '#ai-chat';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="text-green-600 h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Daily
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mood Check-in</h3>
            <p className="text-sm text-gray-600 mb-4">Share how you're feeling today</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Start Check-in
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Mood Check-in</DialogTitle>
          <DialogDescription>
            Share how you're feeling today. Your responses help us understand your wellness journey.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Mood Selection */}
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                How are you feeling today?
              </FormLabel>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-3 rounded-lg border-2 transition-colors text-center ${
                      selectedMood === mood.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div className={`text-xs ${
                      selectedMood === mood.value ? 'text-green-600 font-medium' : 'text-gray-600'
                    }`}>
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Journal Entry */}
            <FormField
              control={form.control}
              name="journalEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell us more (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Share what's on your mind... Your thoughts are private and secure."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Energy Level */}
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                Energy Level
              </FormLabel>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedEnergy(level)}
                    className={`w-8 h-8 rounded-full transition-colors ${
                      selectedEnergy === level
                        ? level <= 2 ? 'bg-red-400' : level === 3 ? 'bg-yellow-400' : 'bg-green-400'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={moodMutation.isPending || !selectedMood}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {moodMutation.isPending ? 'Submitting...' : 'Submit Check-in'}
              </Button>
              <Button
                type="button"
                onClick={openAIChat}
                variant="outline"
                className="px-4"
              >
                <Bot className="mr-2 h-4 w-4" />
                Chat with AI
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
