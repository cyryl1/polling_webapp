'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface PollOption {
  id: string;
  text: string;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
}

const mockPolls: Record<string, PollData> = {
  '1': {
    id: '1',
    question: 'What is your favorite color?',
    options: [
      { id: '1', text: 'Red' },
      { id: '2', text: 'Blue' },
      { id: '3', text: 'Green' },
    ],
  },
  '2': {
    id: '2',
    question: 'Best Programming Language?',
    options: [
      { id: '1', text: 'JavaScript' },
      { id: '2', text: 'Python' },
      { id: '3', text: 'TypeScript' },
      { id: '4', text: 'Java' },
    ],
  },
};

/**
 * Renders a single poll page, allowing users to view the poll question and options, and cast their vote.
 * It uses mock data for demonstration purposes and handles the local state for selected options and voting status.
 */
export default function PollPage() {
  const params = useParams();
  const pollId = params.id as string;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [poll, setPoll] = useState<PollData | null>(null);

  useEffect(() => {
    if (pollId) {
      setPoll(mockPolls[pollId] || null);
    }
  }, [pollId]);

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
      // TODO: In a real application, this is where the vote would be sent to the server.
      // This currently only logs the vote to the console.
      console.log(`Voted for option: ${selectedOption} on poll ${pollId}`);
    }
  };

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-4">Thank you for voting!</h1>
        <p>Results coming soon...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {hasVoted ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Thank you for voting!</h1>
          <p className="text-lg text-gray-600">Results coming soon...</p>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">{poll.question}</h1>
          <div className="flex flex-col space-y-2 mb-4">
            {poll.options.map((option) => (
              <label key={option.id} className="inline-flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="poll-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <span className="ml-3 text-lg text-gray-800">{option.text}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 transition-colors duration-200"
          >
            Vote
          </button>
        </div>
      )}
    </div>
  );
}