from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.utils import timezone
from .models import User, Post, Comment, Like, Story, Follow, Message
from .serializers import (
    UserSerializer, PostSerializer, CommentSerializer, 
    LikeSerializer, StorySerializer, FollowSerializer, MessageSerializer,
    RegisterSerializer
)


# --- Auth Views ---

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user and return JWT tokens"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data
        return Response({
            'user': user_data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login with username/password and return JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid credentials.'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.check_password(password):
        return Response(
            {'error': 'Invalid credentials.'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user, context={'request': request}).data
    return Response({
        'user': user_data,
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Get the currently authenticated user"""
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_avatar(request):
    """Update user avatar with file upload"""
    user = request.user
    if 'avatar_file' in request.FILES:
        user.avatar_file = request.FILES['avatar_file']
        user.save()
        return Response(UserSerializer(user, context={'request': request}).data)
    elif 'avatar' in request.data:
        user.avatar = request.data['avatar']
        user.save()
        return Response(UserSerializer(user, context={'request': request}).data)
    return Response({'error': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)


# --- ViewSets ---

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name']
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        """Get all posts by a specific user"""
        user = self.get_object()
        posts = Post.objects.filter(user=user)
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        """Get all followers of a user"""
        user = self.get_object()
        follows = Follow.objects.filter(following=user)
        serializer = FollowSerializer(follows, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        """Get all users that this user follows"""
        user = self.get_object()
        follows = Follow.objects.filter(follower=user)
        serializer = FollowSerializer(follows, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        """Follow a user"""
        target_user = self.get_object()
        if target_user == request.user:
            return Response({'error': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=target_user
        )
        if created:
            request.user.following_count += 1
            request.user.save()
            target_user.followers_count += 1
            target_user.save()
            return Response({'status': 'followed'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'already following'})
    
    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        """Unfollow a user"""
        target_user = self.get_object()
        try:
            follow = Follow.objects.get(follower=request.user, following=target_user)
            follow.delete()
            request.user.following_count = max(0, request.user.following_count - 1)
            request.user.save()
            target_user.followers_count = max(0, target_user.followers_count - 1)
            target_user.save()
            return Response({'status': 'unfollowed'})
        except Follow.DoesNotExist:
            return Response({'status': 'not following'}, status=status.HTTP_400_BAD_REQUEST)


class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for Post model"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'feed', 'comments']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Only allow editing own posts"""
        if serializer.instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own posts.")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Only allow deleting own posts"""
        if instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own posts.")
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like a post"""
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        
        if created:
            post.likes_count += 1
            post.save()
            return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status': 'already liked'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        """Unlike a post"""
        post = self.get_object()
        try:
            like = Like.objects.get(post=post, user=request.user)
            like.delete()
            post.likes_count = max(0, post.likes_count - 1)
            post.save()
            return Response({'status': 'unliked'}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            return Response({'status': 'not liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all comments for a post"""
        post = self.get_object()
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Get personalized feed - returns all posts unpaginated"""
        posts = Post.objects.all()[:20]
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for Comment model"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)
        # Update post comment count
        post = comment.post
        post.comments_count += 1
        post.save()
    
    def perform_destroy(self, instance):
        """Update comment count on delete"""
        post = instance.post
        post.comments_count = max(0, post.comments_count - 1)
        post.save()
        instance.delete()


class StoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Story model"""
    serializer_class = StorySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def get_queryset(self):
        """Filter out expired stories"""
        return Story.objects.filter(expires_at__gt=timezone.now())
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FollowViewSet(viewsets.ModelViewSet):
    """ViewSet for Follow model"""
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}


class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet for Message model"""
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    @action(detail=False, methods=['get'])
    def conversations(self, request):
        """Get list of conversations for the current user"""
        user = request.user
        
        sent_to = Message.objects.filter(sender=user).values_list('receiver', flat=True)
        received_from = Message.objects.filter(receiver=user).values_list('sender', flat=True)
        conversation_users = set(list(sent_to) + list(received_from))
        
        conversations = []
        for user_id in conversation_users:
            other_user = User.objects.get(id=user_id)
            last_message = Message.objects.filter(
                Q(sender=user, receiver=other_user) | Q(sender=other_user, receiver=user)
            ).order_by('-created_at').first()
            
            conversations.append({
                'user': {
                    'id': other_user.id,
                    'username': other_user.username,
                    'avatar': other_user.avatar_url
                },
                'last_message': MessageSerializer(last_message, context={'request': request}).data if last_message else None
            })
        
        return Response(conversations)
    
    @action(detail=False, methods=['get'])
    def with_user(self, request):
        """Get conversation with a specific user"""
        user = request.user
        other_user_id = request.query_params.get('user_id')
        
        if not other_user_id:
            return Response({'error': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        messages = Message.objects.filter(
            Q(sender=user, receiver_id=other_user_id) | 
            Q(sender_id=other_user_id, receiver=user)
        ).order_by('created_at')
        
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)
