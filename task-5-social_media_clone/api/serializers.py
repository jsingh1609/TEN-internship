from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Post, Comment, Like, Story, Follow, Message


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    posts_count = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'bio', 
                  'avatar', 'followers_count', 'following_count', 'posts_count']
        read_only_fields = ['id']
    
    def get_posts_count(self, obj):
        return obj.posts.count()
    
    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar_file:
            if request:
                return request.build_absolute_uri(obj.avatar_file.url)
            return obj.avatar_file.url
        return obj.avatar


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user serializer for nested relationships"""
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']
    
    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar_file:
            if request:
                return request.build_absolute_uri(obj.avatar_file.url)
            return obj.avatar_file.url
        return obj.avatar


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""
    user = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'text', 'created_at']
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model"""
    user = UserMinimalSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    time_ago = serializers.ReadOnlyField()
    recent_comments = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    image_file = serializers.ImageField(write_only=True, required=False)
    
    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'image_file', 'caption', 'location', 'likes_count', 
                  'comments_count', 'created_at', 'time_ago', 'is_liked', 'recent_comments']
        read_only_fields = ['id', 'created_at', 'likes_count', 'comments_count']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image_file:
            if request:
                return request.build_absolute_uri(obj.image_file.url)
            return obj.image_file.url
        return obj.image
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False
    
    def get_recent_comments(self, obj):
        comments = obj.comments.all()[:3]
        return CommentSerializer(comments, many=True, context=self.context).data


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for Like model"""
    user = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['id', 'created_at']


class StorySerializer(serializers.ModelSerializer):
    """Serializer for Story model"""
    user = UserMinimalSerializer(read_only=True)
    is_expired = serializers.ReadOnlyField()
    image = serializers.SerializerMethodField()
    image_file = serializers.ImageField(write_only=True, required=False)
    
    class Meta:
        model = Story
        fields = ['id', 'user', 'image', 'image_file', 'created_at', 'expires_at', 'is_expired']
        read_only_fields = ['id', 'created_at', 'expires_at']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image_file:
            if request:
                return request.build_absolute_uri(obj.image_file.url)
            return obj.image_file.url
        return obj.image


class FollowSerializer(serializers.ModelSerializer):
    """Serializer for Follow model"""
    follower = UserMinimalSerializer(read_only=True)
    following = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model"""
    sender = UserMinimalSerializer(read_only=True)
    receiver = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'text', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at']
