# 🚀 ADVANCED ACTIVE FEATURES

## New Interactive Features Added

### 1. **Live Streaming** 📡
### 2. **Video Calls** 📞
### 3. **Polls & Quizzes** 📊
### 4. **AR Filters** 🎭
### 5. **Collaborative Posts** 👥
### 6. **Voice Messages** 🎤
### 7. **Story Reactions** 😍
### 8. **Interactive Stickers** ✨
### 9. **Shopping Integration** 🛍️
### 10. **Activity Challenges** 🏆

---

## Implementation Files

### 1. Live Streaming Component

**File:** `src/components/instagram/live-stream.tsx`

```tsx
import React, { useState, useRef, useEffect } from 'react'
import { Video, VideoOff, Mic, MicOff, X, Eye, Heart, MessageCircle, Gift, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface LiveComment {
  id: string
  username: string
  avatar: string
  text: string
  timestamp: number
}

interface LiveStreamProps {
  streamId: string
  username: string
  avatar: string
  onEnd: () => void
}

export function LiveStream({ streamId, username, avatar, onEnd }: LiveStreamProps) {
  const [viewers, setViewers] = useState(0)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState<LiveComment[]>([])
  const [comment, setComment] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 10 - 3)))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-scroll comments
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight
    }
  }, [comments])

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setComments([...comments, {
        id: Date.now().toString(),
        username: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        text: comment,
        timestamp: Date.now()
      }])
      setComment('')
    }
  }

  const handleLike = () => {
    setLikes(likes + 1)
    setShowHearts(true)
    setTimeout(() => setShowHearts(false), 1000)
  }

  const handleEndStream = () => {
    if (window.confirm('Are you sure you want to end this live stream?')) {
      onEnd()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Stream */}
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted={isMuted}
        />

        {isCameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <VideoOff className="h-24 w-24 text-zinc-600" />
          </div>
        )}

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-pink-500">
                <AvatarImage src={avatar} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{username}</p>
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-xs">
                  LIVE
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-black/50 backdrop-blur-sm">
                <Eye className="mr-1 h-3 w-3" />
                {viewers}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 backdrop-blur-sm"
                onClick={handleEndStream}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <div
            ref={commentsRef}
            className="max-h-64 space-y-2 overflow-y-auto scrollbar-hide"
          >
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-2 rounded-lg bg-black/50 p-2 backdrop-blur-sm"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback>{c.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs">
                    <span className="font-semibold">{c.username}</span>{' '}
                    <span className="text-zinc-300">{c.text}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Hearts */}
        {showHearts && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-heart"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  bottom: '20%',
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <Heart className="h-8 w-8 fill-red-500 text-red-500" />
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <form onSubmit={handleSendComment} className="mb-4 flex gap-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border-white/20 bg-white/10 backdrop-blur-sm"
            />
            <Button type="submit" variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={handleLike}>
              <Heart className="h-5 w-5" />
            </Button>
          </form>

          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-sm"
              onClick={() => setIsCameraOff(!isCameraOff)}
            >
              {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-sm"
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-sm"
            >
              <Gift className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-heart {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(1);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: float-heart 2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
```

### 2. Story Polls & Quizzes

**File:** `src/components/instagram/story-interactive.tsx`

```tsx
import React, { useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
}

interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

interface Quiz {
  id: string
  question: string
  options: QuizOption[]
}

export function StoryPoll({ poll }: { poll: Poll }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId)
      setHasVoted(true)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={hasVoted}
            className={cn(
              "w-full relative rounded-lg border-2 p-3 text-left transition-all",
              hasVoted
                ? selectedOption === option.id
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-white/20 bg-white/5"
                : "border-white/20 hover:border-white/40 hover:bg-white/10"
            )}
          >
            {hasVoted && (
              <div
                className="absolute inset-0 bg-white/10 rounded-lg"
                style={{ width: `${option.percentage}%` }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <span>{option.text}</span>
              {hasVoted && <span className="font-semibold">{option.percentage}%</span>}
            </div>
          </button>
        ))}
      </div>
      {hasVoted && (
        <p className="mt-4 text-sm text-zinc-400">{poll.totalVotes} votes</p>
      )}
    </Card>
  )
}

export function StoryQuiz({ quiz }: { quiz: Quiz }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (optionId: string) => {
    setSelectedOption(optionId)
    setShowResult(true)
  }

  const isCorrect = quiz.options.find(o => o.id === selectedOption)?.isCorrect

  return (
    <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg border-white/20 p-6">
      <h3 className="text-lg font-semibold mb-4">{quiz.question}</h3>
      <div className="space-y-3">
        {quiz.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option.id)}
            disabled={showResult}
            className={cn(
              "w-full rounded-lg border-2 p-3 text-left transition-all",
              showResult
                ? option.isCorrect
                  ? "border-green-500 bg-green-500/20"
                  : selectedOption === option.id
                  ? "border-red-500 bg-red-500/20"
                  : "border-white/20 bg-white/5"
                : "border-white/20 hover:border-white/40 hover:bg-white/10"
            )}
          >
            <div className="flex items-center justify-between">
              <span>{option.text}</span>
              {showResult && option.isCorrect && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 text-center">
          <p className={cn(
            "font-semibold",
            isCorrect ? "text-green-400" : "text-red-400"
          )}>
            {isCorrect ? "Correct! 🎉" : "Wrong answer! 😅"}
          </p>
        </div>
      )}
    </Card>
  )
}
```

### 3. Voice Messages

**File:** `src/components/instagram/voice-message.tsx`

```tsx
import React, { useState, useRef } from 'react'
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function VoiceMessageRecorder({ onSend }: { onSend: (audio: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
    } catch (err) {
      console.error('Failed to start recording:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob)
      setAudioBlob(null)
      setDuration(0)
    }
  }

  const handleDiscard = () => {
    setAudioBlob(null)
    setDuration(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2">
      {!audioBlob ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full",
              isRecording && "bg-red-500 hover:bg-red-600"
            )}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-mono">{formatTime(duration)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <VoiceMessagePlayer audioUrl={URL.createObjectURL(audioBlob)} />
          <Button variant="ghost" size="icon" onClick={handleSend}>
            <Play className="h-5 w-5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDiscard}>
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      )}
    </div>
  )
}

export function VoiceMessagePlayer({ audioUrl }: { audioUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-1">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget
          setProgress((audio.currentTime / audio.duration) * 100)
        }}
        onEnded={() => setIsPlaying(false)}
      />
      <Button variant="ghost" size="icon" onClick={togglePlay}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="flex-1 flex items-center gap-2">
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  )
}
```

### 4. Shopping Integration

**File:** `src/components/instagram/shopping.tsx`

```tsx
import React, { useState } from 'react'
import { ShoppingBag, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
}

interface ShoppingTagProps {
  products: Product[]
  imageUrl: string
}

export function ShoppingPost({ products, imageUrl }: ShoppingTagProps) {
  const [showProducts, setShowProducts] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      <div className="relative">
        <img src={imageUrl} alt="Product" className="w-full" />
        
        {/* Shopping Bag Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={() => setShowProducts(true)}
        >
          <ShoppingBag className="h-5 w-5 text-black" />
        </Button>

        {/* Product Tags */}
        {products.map((product, idx) => (
          <button
            key={product.id}
            className="absolute w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
            style={{
              left: `${30 + idx * 20}%`,
              top: `${40 + idx * 10}%`
            }}
            onClick={() => setSelectedProduct(product)}
          >
            <ShoppingBag className="h-3 w-3 text-black" />
          </button>
        ))}
      </div>

      {/* Products Sheet */}
      {showProducts && (
        <Card className="mt-4 p-4 border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Products in this post</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowProducts(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-sm text-zinc-400">${product.price}</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Product Detail */}
      {selectedProduct && (
        <Dialog open onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="bg-black border-zinc-800">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full rounded-lg"
              />
              <p className="text-2xl font-bold">${selectedProduct.price}</p>
              <p className="text-zinc-400">{selectedProduct.description}</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
```

### 5. Activity Challenges

**File:** `src/components/instagram/challenges.tsx`

```tsx
import React, { useState } from 'react'
import { Trophy, Target, Zap, Award, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface Challenge {
  id: string
  title: string
  description: string
  target: number
  current: number
  points: number
  icon: React.ReactNode
  color: string
}

export function ChallengesPanel() {
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Social Butterfly',
      description: 'Post 5 times this week',
      target: 5,
      current: 3,
      points: 100,
      icon: <Zap className="h-5 w-5" />,
      color: 'from-yellow-600 to-orange-600'
    },
    {
      id: '2',
      title: 'Engagement Master',
      description: 'Get 1000 likes',
      target: 1000,
      current: 650,
      points: 250,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-pink-600 to-purple-600'
    },
    {
      id: '3',
      title: 'Story Teller',
      description: 'Post stories for 7 days straight',
      target: 7,
      current: 4,
      points: 150,
      icon: <Target className="h-5 w-5" />,
      color: 'from-blue-600 to-cyan-600'
    }
  ])

  return (
    <Card className="p-6 border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Active Challenges</h2>
        <Trophy className="h-6 w-6 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progress = (challenge.current / challenge.target) * 100

          return (
            <Card key={challenge.id} className="p-4 border-zinc-800 bg-zinc-900/50">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${challenge.color}`}>
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-zinc-400">{challenge.description}</p>
                    </div>
                    <Badge className="bg-yellow-600">
                      +{challenge.points} pts
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Progress</span>
                      <span className="font-semibold">
                        {challenge.current} / {challenge.target}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {progress === 100 && (
                    <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                      <Award className="mr-2 h-4 w-4" />
                      Claim Reward
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
```

---

## Additional Features Documentation

See `ADVANCED_FEATURES.md` for:
- Video calling implementation
- AR filters integration  
- Collaborative posts
- Story reactions
- Interactive stickers
- Real-time notifications
- Push notifications
- Offline mode
- Dark/Light theme toggle
- Accessibility features

All components are fully typed with TypeScript and use shadcn/ui!
