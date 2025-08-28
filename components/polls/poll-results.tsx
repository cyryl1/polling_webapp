'use client'

import { Card, CardContent } from '@/components/ui/card'

type PollOption = {
  id: string
  text: string
  votes: number
}

type PollResultsProps = {
  options: PollOption[]
  totalVotes: number
}

export default function PollResults({ options, totalVotes }: PollResultsProps) {
  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const percentage = calculatePercentage(option.votes)
        
        return (
          <div key={option.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{option.text}</span>
              <span>{percentage}% ({option.votes} votes)</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )
      })}
      
      <p className="text-sm text-muted-foreground pt-2">
        Total votes: {totalVotes}
      </p>
    </div>
  )
}