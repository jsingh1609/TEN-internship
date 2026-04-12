from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """Extended User model with profile information"""
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.URLField(max_length=500, blank=True, default='https://picsum.photos/seed/default/150/150')
    avatar_file = models.ImageField(upload_to='avatars/', blank=True, null=True)
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    
    @property
    def avatar_url(self):
        """Return file-based avatar URL if available, otherwise URL field"""
        if self.avatar_file:
            return self.avatar_file.url
        return self.avatar
    
    def __str__(self):
        return self.username


class Post(models.Model):
    """Instagram-style post model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    image = models.URLField(max_length=1000, blank=True)
    image_file = models.ImageField(upload_to='posts/', blank=True, null=True)
    caption = models.TextField(max_length=2200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    @property
    def image_url(self):
        """Return file-based image URL if available, otherwise URL field"""
        if self.image_file:
            return self.image_file.url
        return self.image
    
    def __str__(self):
        return f"Post by {self.user.username} - {self.created_at}"
    
    @property
    def time_ago(self):
        """Calculate time ago string"""
        now = timezone.now()
        diff = now - self.created_at
        
        if diff.days > 7:
            return self.created_at.strftime('%B %d, %Y')
        elif diff.days > 0:
            return f"{diff.days} DAY{'S' if diff.days > 1 else ''} AGO"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} HOUR{'S' if hours > 1 else ''} AGO"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} MINUTE{'S' if minutes > 1 else ''} AGO"
        else:
            return "JUST NOW"


class Comment(models.Model):
    """Comment model for posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(max_length=2200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.id}"


class Like(models.Model):
    """Like model for posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} likes {self.post.id}"


class Story(models.Model):
    """Story model (24-hour expiring content)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    image = models.URLField(max_length=1000, blank=True)
    image_file = models.ImageField(upload_to='stories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Stories'
    
    @property
    def image_url(self):
        if self.image_file:
            return self.image_file.url
        return self.image
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def __str__(self):
        return f"Story by {self.user.username} - {self.created_at}"


class Follow(models.Model):
    """Follow relationship model"""
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"


class Message(models.Model):
    """Direct message model"""
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    text = models.TextField(max_length=2200)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"
