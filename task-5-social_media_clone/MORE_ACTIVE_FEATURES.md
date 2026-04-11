# 🎮 MORE ACTIVE FEATURES

## Additional Interactive Components

### 1. Drag & Drop Media Upload

**File:** `src/components/instagram/drag-drop-upload.tsx`

```tsx
import React, { useState, useCallback } from 'react'
import { Upload, X, Image, Film, Music } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video' | 'audio'
  progress: number
}

export function DragDropUpload({ onFilesUploaded }: { onFilesUploaded: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'audio',
      progress: 0
    }))

    setFiles(prev => [...prev, ...uploadedFiles])

    // Simulate upload progress
    uploadedFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id && f.progress < 100
            ? { ...f, progress: f.progress + 10 }
            : f
        ))
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 100 } : f
        ))
      }, 2000)
    })

    onFilesUploaded(newFiles)
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) URL.revokeObjectURL(file.preview)
      return prev.filter(f => f.id !== id)
    })
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all",
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-700 hover:border-zinc-600"
        )}
      >
        <Upload className={cn(
          "mx-auto h-12 w-12 mb-4 transition-colors",
          isDragging ? "text-blue-500" : "text-zinc-600"
        )} />
        <p className="text-lg font-medium mb-2">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-zinc-400 mb-4">
          or click to browse
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>Select Files</span>
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="relative overflow-hidden border-zinc-800">
              {file.type === 'image' && (
                <img src={file.preview} alt="" className="w-full h-32 object-cover" />
              )}
              {file.type === 'video' && (
                <div className="w-full h-32 bg-zinc-900 flex items-center justify-center">
                  <Film className="h-8 w-8 text-zinc-600" />
                </div>
              )}
              {file.type === 'audio' && (
                <div className="w-full h-32 bg-zinc-900 flex items-center justify-center">
                  <Music className="h-8 w-8 text-zinc-600" />
                </div>
              )}
              
              <div className="p-2">
                <p className="text-xs truncate mb-2">{file.file.name}</p>
                {file.progress < 100 && (
                  <Progress value={file.progress} className="h-1" />
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 2. Collaborative Stories

**File:** `src/components/instagram/collaborative-story.tsx`

```tsx
import React, { useState } from 'react'
import { Users, Plus, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { User } from '@/types'

interface CollaborativeStoryProps {
  onInvite: (users: User[]) => void
  friends: User[]
}

export function CollaborativeStory({ onInvite, friends }: CollaborativeStoryProps) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFriends = friends.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleUser = (user: User) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
  }

  const handleInvite = () => {
    onInvite(selectedUsers)
  }

  return (
    <Card className="p-6 border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">Create Collaborative Story</h3>
      </div>

      <Input
        type="text"
        placeholder="Search friends..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 border-zinc-800"
      />

      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {filteredFriends.map((user) => {
          const isSelected = selectedUsers.find(u => u.id === user.id)
          
          return (
            <button
              key={user.id}
              onClick={() => toggleUser(user)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium text-sm">{user.username}</p>
                  <p className="text-xs text-zinc-400">{user.name}</p>
                </div>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-blue-500 border-blue-500"
                  : "border-zinc-600"
              )}>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </button>
          )
        })}
      </div>

      {selectedUsers.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-zinc-400 mb-2">
            Selected {selectedUsers.length} friend{selectedUsers.length !== 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <Badge key={user.id} variant="secondary" className="gap-2">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={user.avatar} />
                </Avatar>
                {user.username}
                <button
                  onClick={() => toggleUser(user)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={selectedUsers.length === 0}
        onClick={handleInvite}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Collaborative Story
      </Button>
    </Card>
  )
}
```

### 3. Real-time Typing Indicator

**File:** `src/components/instagram/typing-indicator.tsx`

```tsx
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function TypingIndicator({ username }: { username: string }) {
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev % 3) + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span>{username} is typing</span>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full bg-zinc-400 transition-opacity",
              i <= dots ? "opacity-100" : "opacity-30"
            )}
          />
        ))}
      </div>
    </div>
  )
}
```

### 4. Advanced Story Reactions

**File:** `src/components/instagram/story-reactions.tsx`

```tsx
import React, { useState } from 'react'
import { Heart, Smile, Fire, ThumbsUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const REACTIONS = [
  { id: 'heart', icon: Heart, color: 'text-red-500', label: '❤️' },
  { id: 'smile', icon: Smile, color: 'text-yellow-500', label: '😊' },
  { id: 'fire', icon: Fire, color: 'text-orange-500', label: '🔥' },
  { id: 'thumbs', icon: ThumbsUp, color: 'text-blue-500', label: '👍' },
  { id: 'zap', icon: Zap, color: 'text-purple-500', label: '⚡' }
]

export function StoryReactions({ onReact }: { onReact: (reaction: string) => void }) {
  const [showReactions, setShowReactions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)

  const handleReact = (reactionId: string) => {
    setSelectedReaction(reactionId)
    onReact(reactionId)
    setShowReactions(false)

    // Show animation
    setTimeout(() => setSelectedReaction(null), 1000)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setShowReactions(!showReactions)}
      >
        <Heart className="h-6 w-6" />
      </Button>

      {showReactions && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-2 bg-zinc-900 rounded-full p-2 shadow-xl border border-zinc-800">
          {REACTIONS.map((reaction) => {
            const Icon = reaction.icon
            return (
              <button
                key={reaction.id}
                onClick={() => handleReact(reaction.id)}
                className="p-2 hover:scale-125 transition-transform"
              >
                <Icon className={cn("h-6 w-6", reaction.color)} />
              </button>
            )
          })}
        </div>
      )}

      {selectedReaction && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-ping">
            {REACTIONS.find(r => r.id === selectedReaction)?.label}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 5. Multi-account Switcher

**File:** `src/components/instagram/account-switcher.tsx`

```tsx
import React, { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface Account extends User {
  isActive: boolean
}

export function AccountSwitcher() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      username: 'main_account',
      name: 'Main Account',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      verified: true,
      isActive: true,
      stats: { posts: 150, followers: 5000, following: 300 }
    },
    {
      id: '2',
      username: 'business_account',
      name: 'Business',
      avatar: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=100',
      verified: false,
      isActive: false,
      stats: { posts: 89, followers: 12000, following: 150 }
    }
  ])

  const switchAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isActive: acc.id === id
    })))
  }

  return (
    <Card className="w-80 p-4 border-zinc-800">
      <h3 className="font-semibold mb-4">Switch Account</h3>
      
      <div className="space-y-2">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => switchAccount(account.id)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
              account.isActive
                ? "bg-zinc-900"
                : "hover:bg-zinc-900/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar className={cn(
                "h-10 w-10",
                account.isActive && "ring-2 ring-blue-500"
              )}>
                <AvatarImage src={account.avatar} />
                <AvatarFallback>{account.username[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="font-medium text-sm">{account.username}</p>
                  {account.verified && (
                    <svg className="h-3 w-3 fill-blue-500" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <p className="text-xs text-zinc-400">{account.name}</p>
              </div>
            </div>
            {account.isActive && (
              <Check className="h-5 w-5 text-blue-500" />
            )}
          </button>
        ))}
      </div>

      <Separator className="my-4 bg-zinc-800" />

      <Button variant="ghost" className="w-full justify-start gap-2">
        <Plus className="h-4 w-4" />
        Add Account
      </Button>
    </Card>
  )
}
```

### 6. Quick Reactions Toolbar

**File:** `src/components/instagram/quick-reactions.tsx`

```tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const QUICK_REACTIONS = ['❤️', '🔥', '👏', '😮', '😂', '💯', '🎉', '✨']

interface QuickReactionsProps {
  onReact: (emoji: string) => void
  className?: string
}

export function QuickReactions({ onReact, className }: QuickReactionsProps) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto scrollbar-hide", className)}>
      {QUICK_REACTIONS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          className="text-2xl hover:scale-125 transition-transform flex-shrink-0"
          onClick={() => onReact(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  )
}
```

### 7. Content Filters

**File:** `src/components/instagram/content-filters.tsx`

```tsx
import React, { useState } from 'react'
import { Sliders } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

interface FilterValues {
  brightness: number
  contrast: number
  saturation: number
  blur: number
}

export function ContentFilters({ onApply }: { onApply: (filters: FilterValues) => void }) {
  const [filters, setFilters] = useState<FilterValues>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  })

  const updateFilter = (key: keyof FilterValues, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const presets = [
    { name: 'Original', values: { brightness: 100, contrast: 100, saturation: 100, blur: 0 } },
    { name: 'Vintage', values: { brightness: 110, contrast: 90, saturation: 80, blur: 0 } },
    { name: 'B&W', values: { brightness: 100, contrast: 120, saturation: 0, blur: 0 } },
    { name: 'Vivid', values: { brightness: 105, contrast: 110, saturation: 130, blur: 0 } }
  ]

  return (
    <Card className="p-6 border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="h-5 w-5" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label className="text-sm">Brightness</Label>
          <Slider
            value={[filters.brightness]}
            onValueChange={(v) => updateFilter('brightness', v[0])}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm">Contrast</Label>
          <Slider
            value={[filters.contrast]}
            onValueChange={(v) => updateFilter('contrast', v[0])}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm">Saturation</Label>
          <Slider
            value={[filters.saturation]}
            onValueChange={(v) => updateFilter('saturation', v[0])}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm">Blur</Label>
          <Slider
            value={[filters.blur]}
            onValueChange={(v) => updateFilter('blur', v[0])}
            min={0}
            max={10}
            step={0.1}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => setFilters(preset.values)}
            className="text-xs"
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={() => onApply(filters)}
      >
        Apply Filters
      </Button>
    </Card>
  )
}
```

---

## Summary of ALL Active Features

✅ Live Streaming with comments
✅ Story Polls & Quizzes
✅ Voice Messages
✅ Shopping Integration
✅ Activity Challenges
✅ Drag & Drop Upload
✅ Collaborative Stories
✅ Typing Indicators
✅ Story Reactions
✅ Multi-account Switcher
✅ Quick Reactions
✅ Content Filters
✅ Video Calls (coming)
✅ AR Filters (coming)
✅ Push Notifications (coming)

All components are TypeScript + shadcn/ui ready!
