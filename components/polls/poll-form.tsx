'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'

type PollOption = {
  id: string
  text: string
}

type PollFormProps = {
  initialData?: {
    title: string
    description: string
    options: PollOption[]
  }
  onSubmit: (data: {
    title: string
    description: string
    options: PollOption[]
  }) => void
  isSubmitting: boolean
  submitLabel: string
  submittingLabel: string
}

export default function PollForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Create Poll',
  submittingLabel = 'Creating Poll...'
}: PollFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [options, setOptions] = useState<PollOption[]>(
    initialData?.options || [
      { id: '1', text: '' },
      { id: '2', text: '' },
    ]
  )

  const handleOptionChange = (id: string, value: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text: value } : option
    ))
  }

  const addOption = () => {
    const newId = (options.length + 1).toString()
    setOptions([...options, { id: newId, text: '' }])
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) return // Minimum 2 options required
    setOptions(options.filter(option => option.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!title.trim()) return
    if (options.filter(option => option.text.trim()).length < 2) return
    
    onSubmit({
      title,
      description,
      options: options.filter(option => option.text.trim())
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Poll Title</Label>
          <Input
            id="title"
            placeholder="Enter poll title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Enter poll description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          <Label>Poll Options</Label>
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                required
              />
              {options.length > 2 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeOption(option.id)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="w-full mt-2"
          >
            Add Option
          </Button>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </CardFooter>
    </form>
  )
}