// pages/polls/[id].tsx

import { useRouter } from 'next/router';
import { useState } from 'react';

const mockPollData = {
  id: '1',
  question: 'What is your favorite color?',
  options: [
    { id: '1', text: 'Red' },
    { id: '2', text: 'Blue' },
    { id: '3', text: 'Green' },
  ],
};

const PollPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  if (!id) {
    return <p>Loading poll...</p>;
  }

  const poll = mockPollData; // In a real app, fetch poll data based on 'id'

  const handleVote = () => {
    // In a real app, send vote to backend
    setHasVoted(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{poll.question}</h1>

      {!hasVoted ? (
        <div className="space-y-2">
          {poll.options.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                id={option.id}
                name="poll-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              <label htmlFor={option.id}>{option.text}</label>
            </div>
          ))}
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Vote
          </button>
        </div>
      ) : (
        <div className="text-lg font-semibold text-green-600">
          Thank you for voting!
        </div>
      )}
    </div>
  );
};

export default PollPage;