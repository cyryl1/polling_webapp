'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ProtectedRoute from '@/components/auth/protected-route'

// Mock poll data types
type Option = {
  id: string
  text: string
  votes: number
}

type Poll = {
  id: string
  title: string
  description: string
  createdAt: string
  options: Option[]
  totalVotes: number
}

export default function PollPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPoll = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockPoll: Poll = {
            id: params.id,
            title: params.id === '1' ? 'Favorite Programming Language' : 'Sample Poll',
            description: 'Please select your preferred option',
            createdAt: new Date().toISOString(),
            options: [
              { id: '1', text: 'JavaScript', votes: 15 },
              { id: '2', text: 'Python', votes: 12 },
              { id: '3', text: 'TypeScript', votes: 8 },
              { id: '4', text: 'Java', votes: 7 },
            ],
            totalVotes: 42
          }
          setPoll(mockPoll)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching poll:', error)
        setIsLoading(false)
      }
    }

    fetchPoll()
  }, [params.id])

  const handleVote = async () => {
    if (!selectedOption) return
    
    setIsSubmitting(true)
    
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      setTimeout(() => {
        // Update the poll with the new vote
        if (poll) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === selectedOption) {
              return { ...option, votes: option.votes + 1 }
            }
            return option
          })
          
          setPoll({
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1
          })
          
          setHasVoted(true)
          setIsSubmitting(false)
        }
      }, 1000)
    } catch (error) {
      console.error('Error submitting vote:', error)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!poll) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Poll not found</h2>
          <p className="mb-6">The poll you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              &larr; Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            <CardDescription>
              Created {new Date(poll.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="mb-6">{poll.description}</p>
            
            {!hasVoted ? (
              <div className="space-y-4">
                {poll.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${selectedOption === option.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    {option.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {poll.options.map((option) => {
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
                  Total votes: {poll.totalVotes}
                </p>
              </div>
            )}
          </CardContent>
          
          {!hasVoted && (
            <CardFooter>
              <Button 
                onClick={handleVote} 
                disabled={!selectedOption || isSubmitting} 
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  )
}