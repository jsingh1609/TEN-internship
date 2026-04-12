from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import User, Post, Story, Comment, Like, Follow


class Command(BaseCommand):
    help = 'Populate database with demo data for Vibegram'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating demo data...')
        
        # Create users
        users_data = [
            {
                'username': 'intern_vibecode',
                'email': 'intern@vibecode.com',
                'first_name': 'Vibecode',
                'last_name': 'Intern',
                'bio': 'Django Developer 🐍 | React Enthusiast ⚛️\nBuilding cool things at Vibecode.\n📍 Lucknow, UP',
                'avatar': 'https://picsum.photos/seed/current/150/150'
            },
            {
                'username': 'tech_guru',
                'email': 'tech@example.com',
                'first_name': 'Tech',
                'last_name': 'Guru',
                'bio': 'Technology enthusiast | Full Stack Developer',
                'avatar': 'https://picsum.photos/seed/2/150/150'
            },
            {
                'username': 'react.devs',
                'email': 'react@example.com',
                'first_name': 'React',
                'last_name': 'Devs',
                'bio': 'React community | Building amazing UIs',
                'avatar': 'https://picsum.photos/seed/3/150/150'
            },
            {
                'username': 'django_masters',
                'email': 'django@example.com',
                'first_name': 'Django',
                'last_name': 'Masters',
                'bio': 'Python & Django experts',
                'avatar': 'https://picsum.photos/seed/4/150/150'
            },
            {
                'username': 'design_inspo',
                'email': 'design@example.com',
                'first_name': 'Design',
                'last_name': 'Inspiration',
                'bio': 'UI/UX Designer | Minimalist',
                'avatar': 'https://picsum.photos/seed/5/150/150'
            },
            {
                'username': 'python_dev',
                'email': 'python@example.com',
                'first_name': 'Python',
                'last_name': 'Developer',
                'bio': 'Python enthusiast | Open source contributor',
                'avatar': 'https://picsum.photos/seed/201/150/150'
            },
        ]
        
        users = {}
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            users[user.username] = user
        
        # Create posts
        posts_data = [
            {
                'user': 'react.devs',
                'image': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
                'caption': 'Building the future of the web with React hooks! ⚛️ #webdev #frontend',
                'location': 'Silicon Valley, CA',
                'likes_count': 1243,
                'comments_count': 42
            },
            {
                'user': 'django_masters',
                'image': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
                'caption': 'Just launched the new REST API for the internship project. Models and views are looking clean. 🐍 #backend #django',
                'location': 'Python Headquarters',
                'likes_count': 892,
                'comments_count': 15
            },
            {
                'user': 'design_inspo',
                'image': 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop',
                'caption': 'Minimalist desk setups are always a vibe. ✨ Workspace inspiration for the weekend.',
                'location': 'Tokyo, Japan',
                'likes_count': 5431,
                'comments_count': 108
            },
            {
                'user': 'intern_vibecode',
                'image': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
                'caption': 'Working on the Instagram clone for my Vibecode internship! Django + React = 💪',
                'location': 'Lucknow, UP',
                'likes_count': 234,
                'comments_count': 18
            },
            {
                'user': 'tech_guru',
                'image': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
                'caption': 'Coffee and code. The perfect combination ☕️👨‍💻',
                'location': 'Tech Hub',
                'likes_count': 567,
                'comments_count': 23
            },
        ]
        
        created_posts = []
        for post_data in posts_data:
            username = post_data.pop('user')
            post, created = Post.objects.get_or_create(
                user=users[username],
                image=post_data['image'],
                defaults=post_data
            )
            if created:
                self.stdout.write(f'Created post by {username}')
            created_posts.append(post)
        
        # Create stories
        stories_data = [
            {'user': 'tech_guru', 'image': 'https://picsum.photos/seed/story1/500/800'},
            {'user': 'react.devs', 'image': 'https://picsum.photos/seed/story2/500/800'},
            {'user': 'django_masters', 'image': 'https://picsum.photos/seed/story3/500/800'},
            {'user': 'design_inspo', 'image': 'https://picsum.photos/seed/story4/500/800'},
        ]
        
        for story_data in stories_data:
            username = story_data.pop('user')
            story, created = Story.objects.get_or_create(
                user=users[username],
                image=story_data['image'],
                defaults={'expires_at': timezone.now() + timedelta(hours=24)}
            )
            if created:
                self.stdout.write(f'Created story for {username}')
        
        # Create some comments
        comments_data = [
            {'post': created_posts[0], 'user': 'django_masters', 'text': 'React hooks are amazing! 🚀'},
            {'post': created_posts[0], 'user': 'intern_vibecode', 'text': 'Learning so much from your posts!'},
            {'post': created_posts[1], 'user': 'react.devs', 'text': 'Django REST framework is the best!'},
            {'post': created_posts[2], 'user': 'tech_guru', 'text': 'Love this setup! 😍'},
            {'post': created_posts[3], 'user': 'react.devs', 'text': 'Great work on the clone! Keep it up 💪'},
        ]
        
        for comment_data in comments_data:
            username = comment_data.pop('user')
            comment, created = Comment.objects.get_or_create(
                user=users[username],
                **comment_data
            )
            if created:
                self.stdout.write(f'Created comment by {username}')
        
        # Create some follows
        follow_pairs = [
            ('intern_vibecode', 'react.devs'),
            ('intern_vibecode', 'django_masters'),
            ('intern_vibecode', 'design_inspo'),
            ('react.devs', 'intern_vibecode'),
            ('django_masters', 'intern_vibecode'),
            ('tech_guru', 'intern_vibecode'),
        ]
        
        for follower_username, following_username in follow_pairs:
            follow, created = Follow.objects.get_or_create(
                follower=users[follower_username],
                following=users[following_username]
            )
            if created:
                # Update counts
                users[follower_username].following_count += 1
                users[follower_username].save()
                users[following_username].followers_count += 1
                users[following_username].save()
                self.stdout.write(f'{follower_username} follows {following_username}')
        
        # Create some likes
        like_data = [
            (created_posts[0], 'intern_vibecode'),
            (created_posts[0], 'django_masters'),
            (created_posts[1], 'intern_vibecode'),
            (created_posts[1], 'react.devs'),
            (created_posts[2], 'intern_vibecode'),
        ]
        
        for post, username in like_data:
            like, created = Like.objects.get_or_create(
                post=post,
                user=users[username]
            )
            if created:
                self.stdout.write(f'{username} liked post {post.id}')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with demo data!'))
