from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Post, Comment, Like, Story, Follow, Message


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model"""
    list_display = ['username', 'email', 'first_name', 'last_name', 'followers_count', 'following_count']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('bio', 'avatar', 'followers_count', 'following_count')}),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin interface for Post model"""
    list_display = ['id', 'user', 'caption_preview', 'likes_count', 'comments_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['caption', 'user__username']
    
    def caption_preview(self, obj):
        return obj.caption[:50] + '...' if len(obj.caption) > 50 else obj.caption
    caption_preview.short_description = 'Caption'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin interface for Comment model"""
    list_display = ['id', 'user', 'post', 'text_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['text', 'user__username']
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Comment'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    """Admin interface for Like model"""
    list_display = ['id', 'user', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username']


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    """Admin interface for Story model"""
    list_display = ['id', 'user', 'created_at', 'expires_at', 'is_expired']
    list_filter = ['created_at', 'expires_at']
    search_fields = ['user__username']


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    """Admin interface for Follow model"""
    list_display = ['id', 'follower', 'following', 'created_at']
    list_filter = ['created_at']
    search_fields = ['follower__username', 'following__username']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin interface for Message model"""
    list_display = ['id', 'sender', 'receiver', 'text_preview', 'is_read', 'created_at']
    list_filter = ['created_at', 'is_read']
    search_fields = ['sender__username', 'receiver__username', 'text']
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Message'
