'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMockUsers, addMockUser, resetMockUsers, logAuthState } from '@/lib/mock-auth-utils'
import { useAuth } from '@/lib/auth-context'

type MockUser = {
  id: string
  name: string
  email: string
  password: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<MockUser[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    // Load users on mount
    loadUsers()
  }, [])

  const loadUsers = () => {
    if (typeof window !== 'undefined') {
      const mockUsers = getMockUsers()
      setUsers(mockUsers)
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password) {
      alert('Please fill in all fields')
      return
    }
    
    const newUser: MockUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password
    }
    
    const success = addMockUser(newUser)
    
    if (success) {
      setName('')
      setEmail('')
      setPassword('')
      loadUsers()
      alert('User added successfully')
    } else {
      alert('Email already exists')
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all users to default?')) {
      resetMockUsers()
      loadUsers()
      alert('Users reset to default')
    }
  }

  const handleDebug = () => {
    logAuthState()
    alert('Auth state logged to console')
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please sign in to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Mock Authentication Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Mock User</CardTitle>
            <CardDescription>Create a new user for testing</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddUser}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit">Add User</Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mock Users</CardTitle>
            <CardDescription>Current users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="p-4 border rounded-md">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Password:</strong> {user.password}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={loadUsers}>Refresh</Button>
            <Button variant="destructive" onClick={handleReset}>Reset to Default</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <Button variant="outline" onClick={handleDebug}>Log Auth State to Console</Button>
      </div>
    </div>
  )
}