'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type PollInput = {
  question: string;
  options: string[];
};

type PollOperationResult = {
  success: boolean;
  message?: string;
  error?: string;
};

interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string; // Assuming a timestamp
}

/**
 * Retrieves the authenticated user from Supabase.
 * If no user is authenticated, it redirects to the sign-in page.
 * @param supabase - The Supabase client instance.
 * @returns The authenticated user object.
 */
const getAuthenticatedUser = async (supabase: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  return user;
};

/**
 * Validates the poll input to ensure a question is provided and at least two options exist.
 * @param input - The poll input object containing the question and options.
 * @returns A PollOperationResult object with an error message if validation fails, otherwise null.
 */
const validatePollInput = (input: PollInput): PollOperationResult | null => {
  if (!input.question || input.options.length < 2) {
    return { 
      success: false, 
      error: 'Question and at least two options are required.' 
    };
  }
  return null;
};

/**
 * Creates a new poll record in the 'polls' table.
 * @param supabase - The Supabase client instance.
 * @param question - The question for the poll.
 * @param userId - The ID of the user creating the poll.
 * @returns A Promise that resolves to the created Poll object.
 * @throws Error if the poll creation fails.
 */
const createPollRecord = async (supabase: any, question: string, userId: string): Promise<Poll> => {
  const { data: poll, error } = await supabase
    .from('polls')
    .insert({ question, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(`Failed to create poll: ${error.message}`);
  return poll;
};

/**
 * Creates poll options records in the 'poll_options' table for a given poll.
 * @param supabase - The Supabase client instance.
 * @param pollId - The ID of the poll to associate options with.
 * @param options - An array of strings, each representing a poll option.
 * @throws Error if the poll options creation fails.
 */
const createPollOptions = async (supabase: any, pollId: string, options: string[]) => {
  const pollOptions = options.map(optionText => ({
    poll_id: pollId,
    option_text: optionText,
  }));

  const { error } = await supabase
    .from('poll_options')
    .insert(pollOptions);

  if (error) throw new Error(`Failed to create poll options: ${error.message}`);
};

/**
 * Handles the core logic for poll creation, including user authentication, input validation,
 * and database insertion for the poll and its options.
 * @param formData - The FormData object containing the poll question and options.
 * @returns A Promise that resolves to a PollOperationResult indicating success or failure.
 */
async function handlePollCreation(formData: FormData): Promise<PollOperationResult> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const user = await getAuthenticatedUser(supabase);
    
    const input: PollInput = {
      question: formData.get('question') as string,
      options: formData.getAll('option') as string[]
    };
    
    const validationResult = validatePollInput(input);
    if (validationResult) return validationResult;
    
    const poll = await createPollRecord(supabase, input.question, user.id) as Poll;
    await createPollOptions(supabase, poll.id, input.options);
    
    revalidatePath('/polls');
    revalidatePath('/polls');
    return { success: true, message: 'Poll created successfully!' };
}

/**
 * Server Action to create a new poll.
 * This function orchestrates the poll creation process by calling `handlePollCreation`.
 * It includes error handling to catch and return any issues during the process.
 * @param formData - The FormData object containing the poll question and options.
 * @returns A Promise that resolves to a PollOperationResult indicating success or failure.
 */
export async function createPoll(formData: FormData): Promise<PollOperationResult> {
  try {
    return await handlePollCreation(formData);
  } catch (error) {
    console.error('Poll creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}