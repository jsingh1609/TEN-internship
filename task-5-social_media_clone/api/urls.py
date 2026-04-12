from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, PostViewSet, CommentViewSet, 
    StoryViewSet, FollowViewSet, MessageViewSet,
    register_view, login_view, me_view, update_avatar
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'follows', FollowViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('auth/register/', register_view, name='register'),
    path('auth/login/', login_view, name='login'),
    path('auth/me/', me_view, name='me'),
    path('auth/avatar/', update_avatar, name='update_avatar'),
    path('', include(router.urls)),
]
