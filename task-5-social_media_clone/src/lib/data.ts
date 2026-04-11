// src/lib/data.ts

import type { User, Post, Story, Notification, Conversation, Message, Reel } from '@/types'

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'creative_studio',
    name: 'Creative Studio',
    avatar: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400',
    verified: true,
    bio: '🎨 Design & Creative Agency\n📍 San Francisco, CA\n✉️ hello@creative.studio',
    website: 'https://creative.studio',
    isFollowing: false,
    stats: {
      posts: 324,
      followers: 12500,
      following: 892
    }
  },
  {
    id: '2',
    username: 'abstract_mind',
    name: 'Abstract Mind',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    verified: false,
    bio: '✨ Digital artist & creator\n🌍 Exploring the abstract',
    stats: {
      posts: 156,
      followers: 8920,
      following: 432
    }
  },
  {
    id: '3',
    username: 'visual_architect',
    name: 'Visual Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    verified: true,
    bio: '🏗️ Building visual experiences\n💼 Available for projects',
    stats: {
      posts: 89,
      followers: 15600,
      following: 234
    }
  },
  {
    id: '4',
    username: 'design_daily',
    name: 'Design Daily',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    verified: false,
    bio: '📱 UI/UX Designer\n🎓 Design tips daily',
    stats: {
      posts: 445,
      followers: 23400,
      following: 567
    }
  }
]

export const mockPosts: Post[] = [
  {
    id: '1',
    user: mockUsers[0],
    username: 'creative_studio',
    avatar: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400',
    verified: true,
    location: 'San Francisco, CA',
    imageUrl: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800'
    ],
    caption: 'Exploring creative design patterns ✨ Building beautiful interfaces that users love.',
    hashtags: ['design', 'creative', 'art', 'webdesign', 'ui'],
    likes: 1247,
    isLiked: false,
    isSaved: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    score: 45,
    comments: [
      {
        id: '1',
        username: 'design_lover',
        text: 'Incredible work! 🔥',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 12
      },
      {
        id: '2',
        username: 'webdev_pro',
        text: 'Love the color palette!',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        likes: 8
      }
    ],
    type: 'carousel'
  },
  {
    id: '2',
    user: mockUsers[1],
    username: 'abstract_mind',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    verified: false,
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
    caption: 'Distortion as a language. Every ripple tells a story.',
    hashtags: ['abstract', 'digitalart', 'generativeart'],
    likes: 892,
    isLiked: true,
    isSaved: false,
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    score: 30,
    comments: [
      {
        id: '3',
        username: 'art_enthusiast',
        text: 'This is mesmerizing!',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        likes: 5
      }
    ],
    type: 'photo'
  },
  {
    id: '3',
    user: mockUsers[2],
    username: 'visual_architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    verified: true,
    location: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800',
    caption: 'When shaders breathe life into static imagery 🎨',
    hashtags: ['shader', 'webgl', 'threejs', 'interactive'],
    likes: 2103,
    isLiked: false,
    isSaved: true,
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    score: 60,
    comments: [],
    type: 'photo'
  }
]

export const mockStories: Story[] = [
  {
    id: '1',
    username: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    hasNewStory: false,
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    time: new Date(Date.now() - 7200000).toISOString(),
    isLive: false
  },
  {
    id: '2',
    username: 'creative_studio',
    avatar: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400',
    hasNewStory: true,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    time: new Date(Date.now() - 18000000).toISOString(),
    isLive: true
  },
  {
    id: '3',
    username: 'design_daily',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    hasNewStory: true,
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
    time: new Date(Date.now() - 28800000).toISOString(),
    isLive: false
  },
  {
    id: '4',
    username: 'abstract_mind',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    hasNewStory: true,
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
    time: new Date(Date.now() - 43200000).toISOString(),
    isLive: false
  }
]

export const mockNotifications: Notification[] = [
  {
    id: '1',
    username: 'design_daily',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    text: 'liked your post',
    time: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    postThumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100',
    type: 'like'
  },
  {
    id: '2',
    username: 'creative_studio',
    avatar: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400',
    text: 'started following you',
    time: new Date(Date.now() - 18000000).toISOString(),
    read: false,
    type: 'follow'
  },
  {
    id: '3',
    username: 'visual_architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    text: 'commented: "Amazing work! 🔥"',
    time: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    postThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    type: 'comment'
  },
  {
    id: '4',
    username: 'abstract_mind',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    text: 'mentioned you in a comment',
    time: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    type: 'mention'
  }
]

export const mockMessages: Message[] = [
  {
    id: '1',
    sender: mockUsers[0],
    content: 'Hey! Love your latest design work!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    type: 'text'
  },
  {
    id: '2',
    sender: mockUsers[1],
    content: 'Thanks! Would love to collaborate sometime',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    type: 'text'
  }
]

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [mockUsers[0]],
    lastMessage: mockMessages[0],
    unreadCount: 2,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    participants: [mockUsers[1]],
    lastMessage: mockMessages[1],
    unreadCount: 0,
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
]

export const mockReels: Reel[] = [
  {
    id: '1',
    user: mockUsers[0],
    videoUrl: 'https://example.com/reel1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    caption: 'Quick design tutorial 🎨',
    likes: 5420,
    comments: 234,
    shares: 89,
    views: 12500,
    audio: {
      name: 'Original Audio',
      author: 'creative_studio'
    }
  },
  {
    id: '2',
    user: mockUsers[1],
    videoUrl: 'https://example.com/reel2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400',
    caption: 'Abstract motion graphics',
    likes: 3210,
    comments: 156,
    shares: 45,
    views: 8900,
    audio: {
      name: 'Electronic Vibes',
      author: 'artist_name'
    }
  }
]
