'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPoll(formData: FormData) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const question = formData.get('question') as string;
  const options = formData.getAll('option') as string[];

  if (!question || options.length < 2) {
    return { error: 'Question and at least two options are required.' };
  }

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ question, user_id: user.id })
    .select()
    .single();

  if (pollError) {
    console.error('Error creating poll:', pollError);
    return { error: 'Failed to create poll.' };
  }

  const pollOptions = options.map(optionText => ({
    poll_id: poll.id,
    option_text: optionText,
  }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(pollOptions);

  if (optionsError) {
    console.error('Error creating poll options:', optionsError);
    return { error: 'Failed to create poll options.' };
  }

  revalidatePath('/polls');
  return { success: true, message: 'Poll created successfully!' };
}