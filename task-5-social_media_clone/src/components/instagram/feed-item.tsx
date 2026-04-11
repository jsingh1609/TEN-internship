// src/components/instagram/feed-item.tsx

import React, { useState } from 'react'
import { cn, formatTimeAgo } from '@/lib/utils'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { Post, User } from '@/types'

interface FeedItemProps {
  post: Post
  onProfileClick: (user: User) => void
  onUpdate: (updates: Partial<Post>) => void
}

export function FeedItem({ post, onProfileClick, onUpdate }: FeedItemProps) {
  const [liked, setLiked] = useState(post.isLiked)
  const [saved, setSaved] = useState(post.isSaved)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [score, setScore] = useState(post.score || 0)

  const images = Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl]

  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1)
    
    if (newLiked) {
      setScore(score + 10)
    }

    onUpdate({ isLiked: newLiked, likes: newLiked ? likeCount + 1 : likeCount - 1 })
  }

  const handleSave = () => {
    const newSaved = !saved
    setSaved(newSaved)
    
    if (newSaved) {
      setScore(score + 3)
    }

    onUpdate({ isSaved: newSaved })
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setScore(score + 5)
      setComment('')
      // Add comment logic here
    }
  }

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (!liked) {
      handleLike()
      // Show heart animation
      const heart = document.createElement('div')
      heart.className = 'absolute inset-0 flex items-center justify-center pointer-events-none z-50'
      heart.innerHTML = '<div class="text-8xl animate-ping">❤️</div>'
      e.currentTarget.appendChild(heart)
      setTimeout(() => heart.remove(), 1000)
    }
  }

  return (
    <Card className="overflow-hidden border-zinc-800 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onProfileClick(post.user)}
        >
          <Avatar className="h-10 w-10 border-2 border-pink-500">
            <AvatarImage src={post.avatar} />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{post.username}</span>
              {post.verified && (
                <svg className="h-4 w-4 fill-blue-500" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </div>
            {post.location && (
              <span className="text-xs text-zinc-500">{post.location}</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Image Carousel */}
      <div className="relative aspect-square bg-zinc-900" onDoubleClick={handleDoubleTap}>
        <img
          src={images[currentImageIndex]}
          alt="Post"
          className="h-full w-full object-cover"
        />

        {/* Score Badge */}
        {score > 0 && (
          <Badge className="absolute right-4 top-4 bg-gradient-to-r from-purple-600 to-pink-600">
            🏆 {score}
          </Badge>
        )}

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70"
                onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {currentImageIndex < images.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70"
                onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-all',
                    idx === currentImageIndex
                      ? 'bg-white w-2'
                      : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleLike}
              onContextMenu={(e) => {
                e.preventDefault()
                setShowReactionPicker(!showReactionPicker)
              }}
            >
              <Heart 
                className={cn(
                  'h-6 w-6 transition-all',
                  liked && 'fill-red-600 text-red-600 scale-110'
                )}
              />
            </Button>

            {/* Reaction Picker */}
            {showReactionPicker && (
              <div className="absolute left-4 top-full z-50 mt-2 flex gap-2 rounded-full bg-zinc-900 p-2 shadow-xl border border-zinc-800">
                {['❤️', '🔥', '👏', '😮', '😂'].map((emoji) => (
                  <button
                    key={emoji}
                    className="text-2xl transition-transform hover:scale-125"
                    onClick={() => {
                      setScore(score + 5)
                      setShowReactionPicker(false)
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Bookmark 
              className={cn(
                'h-6 w-6',
                saved && 'fill-current'
              )}
            />
          </Button>
        </div>

        {/* Likes */}
        <div className="mt-2">
          <span className="text-sm font-semibold">{likeCount.toLocaleString()} likes</span>
        </div>

        {/* Caption */}
        <div className="mt-2">
          <span className="text-sm">
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </span>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.hashtags.map((tag) => (
                <span key={tag} className="text-sm text-blue-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View Comments */}
        {post.comments.length > 0 && !showComments && (
          <button
            className="mt-2 text-sm text-zinc-500 hover:text-zinc-400"
            onClick={() => setShowComments(true)}
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {post.comments.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-semibold mr-2">{c.username}</span>
                {c.text}
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2">
          <span className="text-xs text-zinc-500 uppercase">
            {formatTimeAgo(post.timestamp)}
          </span>
        </div>

        {/* Add Comment */}
        <form onSubmit={handleComment} className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-4">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!comment.trim()}
            className="text-blue-500 hover:text-blue-400"
          >
            Post
          </Button>
        </form>
      </div>
    </Card>
  )
}
