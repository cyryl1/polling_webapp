import { createPoll } from '../app/polls/create/actions';
import { createClient } from '../lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { id: 'test-poll-id', question: 'Test Question', user_id: 'test-user-id', created_at: '2023-01-01T00:00:00Z' }, error: null }))
        }))
      }))
    }))
  }))
}));

// Mock Next.js functions
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('createPoll', () => {
  it('should create a poll successfully with valid input', async () => {
    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');
    formData.append('option', 'Blue');

    const result = await createPoll(formData);

    expect(result).toEqual({ success: true, message: 'Poll created successfully!' });
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
  });

  it('should return an error if question is missing', async () => {
    const formData = new FormData();
    formData.append('option', 'Red');
    formData.append('option', 'Blue');

    const result = await createPoll(formData);

    expect(result).toEqual({ success: false, error: 'Question and at least two options are required.' });
  });

  it('should return an error if less than two options are provided', async () => {
    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');

    const result = await createPoll(formData);

    expect(result).toEqual({ success: false, error: 'Question and at least two options are required.' });
  });

  it('should handle Supabase errors during poll creation', async () => {
    const { createClient: mockCreateClient } = jest.requireMock('../lib/supabase');
    mockCreateClient.mockImplementationOnce(() => ({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
      },
      from: jest.fn((tableName) => {
        if (tableName === 'polls') {
          return {
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: null, error: new Error('Supabase poll insert error') }))
              }))
            }))
          };
        }
        return {
          insert: jest.fn(() => Promise.resolve({ error: null }))
        };
      })
    }));

    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');
    formData.append('option', 'Blue');

    const result = await createPoll(formData);

    expect(result).toEqual({ success: false, error: 'Supabase poll insert error' });
  });

  it('should handle Supabase errors during poll options creation', async () => {
    const { createClient: mockCreateClient } = jest.requireMock('../lib/supabase');
    mockCreateClient.mockImplementationOnce(() => ({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
      },
      from: jest.fn((tableName) => {
        if (tableName === 'poll_options') {
          return {
            insert: jest.fn(() => Promise.resolve({ error: new Error('Supabase poll options insert error') }))
          };
        }
        return {
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: { id: 'test-poll-id', question: 'Test Question', user_id: 'test-user-id', created_at: '2023-01-01T00:00:00Z' }, error: null }))
            }))
          }))
        };
      })
    }));

    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');
    formData.append('option', 'Blue');

    const result = await createPoll(formData);

    expect(result).toEqual({ success: false, error: 'Supabase poll options insert error' });
  });
});