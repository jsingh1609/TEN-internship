// src/components/instagram/instagram-app.tsx

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  MessageCircle, 
  Heart, 
  PlusSquare,
  Menu,
  Settings,
  Bookmark,
  Moon,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FeedItem } from './feed-item'
import { Stories } from './stories'
import { ProfileModal } from './profile-modal'
import { NotificationsPanel } from './notifications-panel'
import { CreatePostModal } from './create-post-modal'
import { MessagingPanel } from './messaging-panel'
import { ExploreGrid } from './explore-grid'
import { ReelsViewer } from './reels-viewer'
import { mockPosts, mockStories, mockNotifications, mockUsers } from '@/lib/data'
import type { User, Post } from '@/types'

export function InstagramApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'explore' | 'reels' | 'messages'>('home')
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showMessaging, setShowMessaging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>(mockPosts)

  const unreadNotifications = mockNotifications.filter(n => !n.read).length
  const unreadMessages = 2 // Mock data

  const handleProfileClick = (user: User) => {
    setSelectedProfile(user)
  }

  const handlePostUpdate = (postId: string, updates: Partial<Post>) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, ...updates } : p))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <h1 className="font-billabong text-3xl tracking-wide">
              Instagram
            </h1>

            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-lg border-zinc-800 bg-zinc-900 pl-10 focus:border-zinc-700"
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'relative',
                  activeTab === 'home' && 'bg-zinc-900'
                )}
                onClick={() => setActiveTab('home')}
              >
                <Home className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setActiveTab('search')}
              >
                <Search className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  activeTab === 'explore' && 'bg-zinc-900'
                )}
                onClick={() => setActiveTab('explore')}
              >
                <Compass className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  activeTab === 'reels' && 'bg-zinc-900'
                )}
                onClick={() => setActiveTab('reels')}
              >
                <Film className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowMessaging(!showMessaging)}
              >
                <MessageCircle className="h-6 w-6" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-600 p-0 text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Heart className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-600 p-0" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreatePost(true)}
              >
                <PlusSquare className="h-6 w-6" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                    <Moon className="mr-2 h-4 w-4" />
                    Switch appearance
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        {activeTab === 'home' && (
          <div className="mx-auto max-w-2xl px-4">
            {/* Stories */}
            <Stories stories={mockStories} />

            {/* Feed */}
            <div className="mt-6 space-y-6">
              {posts.map((post) => (
                <FeedItem
                  key={post.id}
                  post={post}
                  onProfileClick={handleProfileClick}
                  onUpdate={(updates) => handlePostUpdate(post.id, updates)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="mx-auto max-w-6xl px-4">
            <ExploreGrid />
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="mx-auto max-w-md">
            <ReelsViewer />
          </div>
        )}
      </main>

      {/* Modals & Panels */}
      {selectedProfile && (
        <ProfileModal
          user={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {showNotifications && (
        <NotificationsPanel
          notifications={mockNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSubmit={(data) => {
            console.log('New post:', data)
            setShowCreatePost(false)
          }}
        />
      )}

      {showMessaging && (
        <MessagingPanel
          onClose={() => setShowMessaging(false)}
        />
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-black md:hidden">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('home')}
          >
            <Home className={cn('h-6 w-6', activeTab === 'home' && 'fill-current')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('search')}
          >
            <Search className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCreatePost(true)}
          >
            <PlusSquare className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('reels')}
          >
            <Film className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </nav>
    </div>
  )
}
