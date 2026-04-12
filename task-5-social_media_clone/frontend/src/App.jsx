import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/auth/AuthPage';
import LoadingScene from './components/three/LoadingScene';
import AnimatedBackground from './components/three/AnimatedBackground';
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import MobileBottomNav from './components/layout/MobileBottomNav';
import RightSidebar from './components/layout/RightSidebar';
import Stories from './components/feed/Stories';
import StoryViewer from './components/feed/StoryViewer';
import Post from './components/feed/Post';
import PostDetail from './components/feed/PostDetail';
import CreatePostModal from './components/feed/CreatePostModal';
import EditPostModal from './components/profile/EditPostModal';
import ProfileView from './components/profile/ProfileView';
import EditProfileModal from './components/profile/EditProfileModal';
import ExploreView from './components/views/ExploreView';
import ReelsView from './components/views/ReelsView';
import MessagesView from './components/views/MessagesView';
import NotificationsView from './components/views/NotificationsView';
import SearchView from './components/views/SearchView';
import api from './api';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  
  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState(null);
  const [viewingCommentsFor, setViewingCommentsFor] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const postsData = await api.getPosts();
        setPosts(Array.isArray(postsData) ? postsData : []);
        
        const storiesData = await api.getStories();
        const formattedStories = [
          { id: 0, user: { username: user.username, avatar: user.avatar }, is_user: true },
          ...(Array.isArray(storiesData) ? storiesData : []).map(s => ({ ...s, has_unseen: true }))
        ];
        setStories(formattedStories);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoadingContent(false);
      }
    }
    loadData();
  }, [user]);

  const handleLikeToggle = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (loadingContent) {
    return <LoadingScene />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return (
          <>
            <main className="w-full max-w-[470px] lg:max-w-[470px] px-0 md:px-4 pt-0 md:pt-8 flex flex-col items-center pb-20 md:pb-0 z-10 relative">
              <div className="w-full max-w-[630px] md:max-w-full overflow-hidden">
                <Stories stories={stories} onStoryClick={setViewingStoryIndex} />
                <div className="w-full space-y-4">
                  {posts.map((post) => (
                    <Post 
                      key={post.id} 
                      post={post} 
                      isLiked={likedPosts.has(post.id) || post.is_liked}
                      onLikeToggle={handleLikeToggle}
                      onPostDelete={handleDeletePost}
                      onPostEdit={setEditingPost}
                      onOpenComments={setViewingCommentsFor}
                    />
                  ))}
                </div>
              </div>
            </main>
            <div className="hidden lg:block w-[320px] pl-8 pt-8 mr-4 xl:mr-16 animate-slide-up-fade z-10 relative" style={{ animationDelay: '150ms' }}>
              <RightSidebar userProfile={user} />
            </div>
          </>
        );
      case 'search': return <SearchView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'explore': return <ExploreView />;
      case 'reels': return <ReelsView />;
      case 'messages': return <MessagesView userProfile={user} />;
      case 'notifications': return <NotificationsView />;
      case 'profile': return <ProfileView userProfile={user} onOpenEdit={() => setIsEditProfileOpen(true)} />;
      default: return <div className="text-white mt-10">View not found</div>;
    }
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative">
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <MobileHeader setCurrentView={setCurrentView} />
        
        <div className="flex justify-center md:justify-start">
          <Sidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
            userProfile={user}
            onOpenCreate={() => setIsCreatePostOpen(true)}
          />
          
          <div className="flex-1 md:ml-20 xl:ml-64 flex justify-center mt-14 md:mt-0">
            {renderView()}
          </div>
        </div>
        
        <MobileBottomNav 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          userProfile={user}
          onOpenCreate={() => setIsCreatePostOpen(true)}
        />
      </div>

      {/* Modals */}
      {isEditProfileOpen && (
        <EditProfileModal 
          userProfile={user} 
          setUserProfile={() => {}} 
          onClose={() => setIsEditProfileOpen(false)} 
        />
      )}
      
      {isCreatePostOpen && (
        <CreatePostModal 
          userProfile={user}
          onPost={handleAddPost}
          onClose={() => setIsCreatePostOpen(false)}
        />
      )}

      {editingPost && (
        <EditPostModal 
          post={editingPost}
          onUpdate={handleUpdatePost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {viewingStoryIndex !== null && (
        <StoryViewer 
          stories={stories}
          initialIndex={viewingStoryIndex}
          onClose={() => setViewingStoryIndex(null)}
        />
      )}

      {viewingCommentsFor && (
        <PostDetail 
          post={viewingCommentsFor}
          onClose={() => setViewingCommentsFor(null)}
        />
      )}
    </div>
  );
}

function AppWithAuth() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScene />;
  }
  
  if (!user) {
    return <AuthPage />;
  }
  
  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}
