// src/types/index.ts

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  verified: boolean;
  bio?: string;
  website?: string;
  isFollowing?: boolean;
  stats: UserStats;
  posts?: Post[];
}

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  user: User;
  username: string;
  avatar: string;
  verified: boolean;
  location?: string;
  imageUrl: string | string[];
  caption: string;
  hashtags?: string[];
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: string;
  comments: Comment[];
  score?: number;
  type?: 'photo' | 'video' | 'reel' | 'carousel';
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNewStory: boolean;
  image: string;
  video?: string;
  time: string;
  isLive?: boolean;
}

export interface Notification {
  id: string;
  username: string;
  avatar: string;
  text: string;
  time: string;
  read: boolean;
  postThumbnail?: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag';
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'voice' | 'video';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  timestamp: string;
}

export interface Reaction {
  id: string | number;
  type: 'love' | 'fire' | 'clap' | 'wow' | 'laugh' | 'score';
  position?: {
    x: number;
    y: number;
  };
}

export interface CreatePostData {
  images: File[];
  caption: string;
  location?: string;
  tags?: string[];
  altText?: string[];
}

export interface SearchResult {
  type: 'user' | 'hashtag' | 'location';
  data: User | Hashtag | Location;
}

export interface Hashtag {
  name: string;
  postCount: number;
  trending?: boolean;
}

export interface Location {
  name: string;
  postCount: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Reel {
  id: string;
  user: User;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  audio?: {
    name: string;
    author: string;
  };
}

export interface LiveStream {
  id: string;
  user: User;
  title: string;
  viewerCount: number;
  thumbnail: string;
  startedAt: string;
}
