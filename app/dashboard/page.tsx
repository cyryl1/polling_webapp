'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ProtectedRoute from '@/components/auth/protected-route'

// Mock poll data type
type Poll = {
  id: string
  title: string
  description: string
  createdAt: string
  votesCount: number
}

export default function Dashboard() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPolls = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockPolls: Poll[] = [
            {
              id: '1',
              title: 'Favorite Programming Language',
              description: 'What programming language do you prefer to work with?',
              createdAt: new Date().toISOString(),
              votesCount: 42
            },
            {
              id: '2',
              title: 'Best Frontend Framework',
              description: 'Which frontend framework do you think is the best?',
              createdAt: new Date().toISOString(),
              votesCount: 36
            },
            {
              id: '3',
              title: 'Remote Work Preferences',
              description: 'Do you prefer working remotely or in an office?',
              createdAt: new Date().toISOString(),
              votesCount: 28
            },
          ]
          setPolls(mockPolls)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching polls:', error)
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [])

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Polls</h1>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : polls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <Link href={`/polls/${poll.id}`} key={poll.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{poll.title}</CardTitle>
                    <CardDescription>
                      Created {new Date(poll.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{poll.description}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">{poll.votesCount} votes</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No polls found</h3>
            <p className="text-muted-foreground mb-6">Create your first poll to get started</p>
            <Link href="/polls/create">
              <Button>Create New Poll</Button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}