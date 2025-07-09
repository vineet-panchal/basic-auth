import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const Posts = ({ onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setError('');
      const data = await apiService.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts. Your token might have expired.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
      onLogout(); // Logout anyway
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const username = apiService.getUsername();

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Welcome, {username}!</h2>
        <div className="header-buttons">
          <button onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing...' : 'Refresh Posts'}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleRefresh} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">No posts found for {username}</div>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>By: {post.username}</small>
            </div>
          ))
        )}
      </div>

      <div className="token-info">
        <p><strong>Note:</strong> Access tokens expire every 15 seconds. The app will automatically refresh them using the refresh token.</p>
      </div>
    </div>
  );
};

export default Posts;