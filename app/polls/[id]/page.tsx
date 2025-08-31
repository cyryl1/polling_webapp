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
      // In a real application, you would send the vote to the server here.
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
          <p className="text-lg text-gray-600">Your response has been recorded.</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{poll.question}</h1>
          <div className="flex flex-col space-y-2">
            {poll.options.map((option) => (
              <label key={option.id} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="poll-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <span className="ml-2 text-lg">{option.text}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className={`mt-6 px-4 py-2 rounded-md transition-all duration-200 ${
              selectedOption === null 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {selectedOption === null ? 'Select an option' : 'Vote'}
          </button>
        </>
      )}
    </div>
  );
}