'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PollForm from '@/components/polls/poll-form';
import { createPoll } from './actions';
import { useToast } from '@/components/ui/use-toast';

/**
 * Renders the page for creating a new poll.
 * This component provides a form for users to input a poll question and options,
 * handles form submission, and displays toast notifications for success or error.
 */
export default function CreatePollPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: { title: string; description: string; options: { id: string; text: string; }[]; }) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('question', data.title);
    data.options.forEach(option => formData.append('option', option.text));

    const result = await createPoll(formData);
    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result?.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      router.push('/polls');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <PollForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Create Poll"
          submittingLabel="Creating Poll..."
        />
      </CardContent>
    </Card>
  );
}