import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('vibegram_tokens') || 'null');
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

// Handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = JSON.parse(localStorage.getItem('vibegram_tokens') || 'null');
      if (tokens?.refresh) {
        try {
          const response = await axios.post(`${API_BASE_URL}/../api/token/refresh/`, {
            refresh: tokens.refresh,
          });
          const newTokens = { ...tokens, access: response.data.access };
          localStorage.setItem('vibegram_tokens', JSON.stringify(newTokens));
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('vibegram_tokens');
          localStorage.removeItem('vibegram_user');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  // --- Auth ---
  async register(data) {
    const res = await axiosInstance.post('/auth/register/', data);
    return res.data;
  },

  async login(data) {
    const res = await axiosInstance.post('/auth/login/', data);
    return res.data;
  },

  async getMe() {
    const res = await axiosInstance.get('/auth/me/');
    return res.data;
  },

  async updateAvatar(formData) {
    const res = await axiosInstance.patch('/auth/avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // --- Posts ---
  async getPosts() {
    const res = await axiosInstance.get('/posts/feed/');
    return res.data;
  },

  async getPost(postId) {
    const res = await axiosInstance.get(`/posts/${postId}/`);
    return res.data;
  },

  async createPost(formData) {
    const res = await axiosInstance.post('/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updatePost(postId, data) {
    const res = await axiosInstance.patch(`/posts/${postId}/`, data);
    return res.data;
  },

  async deletePost(postId) {
    await axiosInstance.delete(`/posts/${postId}/`);
  },

  async likePost(postId) {
    const res = await axiosInstance.post(`/posts/${postId}/like/`);
    return res.data;
  },

  async unlikePost(postId) {
    const res = await axiosInstance.post(`/posts/${postId}/unlike/`);
    return res.data;
  },

  // --- Comments ---
  async getComments(postId) {
    const res = await axiosInstance.get(`/posts/${postId}/comments/`);
    return res.data;
  },

  async createComment(postId, text) {
    const res = await axiosInstance.post('/comments/', { post: postId, text });
    return res.data;
  },

  async deleteComment(commentId) {
    await axiosInstance.delete(`/comments/${commentId}/`);
  },

  // --- Users ---
  async getUser(userId) {
    const res = await axiosInstance.get(`/users/${userId}/`);
    return res.data;
  },

  async updateUser(userId, data) {
    const res = await axiosInstance.patch(`/users/${userId}/`, data);
    return res.data;
  },

  async getUserPosts(userId) {
    const res = await axiosInstance.get(`/users/${userId}/posts/`);
    return res.data;
  },

  async searchUsers(query) {
    const res = await axiosInstance.get(`/users/?search=${query}`);
    return res.data;
  },

  async followUser(userId) {
    const res = await axiosInstance.post(`/users/${userId}/follow/`);
    return res.data;
  },

  async unfollowUser(userId) {
    const res = await axiosInstance.post(`/users/${userId}/unfollow/`);
    return res.data;
  },

  // --- Stories ---
  async getStories() {
    const res = await axiosInstance.get('/stories/');
    return res.data;
  },

  async createStory(formData) {
    const res = await axiosInstance.post('/stories/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default api;
