import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';

export function EmergencyPanic() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  // Get user location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => console.error('Location error:', error)
      );
    }
  };

  const panicMutation = useMutation({
    mutationFn: async () => {
      const locationData = location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: Date.now()
      } : null;

      return apiRequest('POST', '/api/panic-alert', {
        userId: user?.id,
        location: locationData
      });
    },
    onSuccess: () => {
      toast({
        title: "🚨 Emergency Alert Sent",
        description: "Emergency services and school administration have been notified.",
      });
      setIsModalOpen(true);
    },
    onError: (error) => {
      toast({
        title: "Emergency Alert Failed",
        description: "Please call 911 immediately if this is an emergency.",
        variant: "destructive",
      });
    }
  });

  const handlePanicClick = () => {
    getLocation();
    panicMutation.mutate();
  };

  const callEmergency = () => {
    window.location.href = 'tel:911';
  };

  return (
    <>
      <Button
        onClick={handlePanicClick}
        disabled={panicMutation.isPending}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 relative animate-pulse"
        size="icon"
      >
        <AlertTriangle className="h-5 w-5" />
        <span className="sr-only">Emergency Panic Button</span>
        {panicMutation.isPending && (
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
        )}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Emergency Alert Activated
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Emergency services and school administration have been notified. Help is on the way.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {location && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin className="mr-2 h-4 w-4 text-red-500" />
                  Your location has been shared with emergency responders
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                onClick={callEmergency}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 911
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="px-4"
              >
                Close
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              If this was activated accidentally, please contact the main office immediately.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
