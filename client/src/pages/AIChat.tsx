import { AIChat } from '@/components/AIChat';

export default function AIChatPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <AIChat isStandalone={true} />
    </div>
  );
}
