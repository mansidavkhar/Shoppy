import React, { useState } from 'react';
import profile_pic from '../Assets/profile_dummy_pic.png';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  
  // Sample data - replace with your actual data
  const followers = [
    { id: 1, name: "User 1", avatar: "/api/placeholder/50/50" },
    { id: 2, name: "User 2", avatar: "/api/placeholder/50/50" }
  ];
  
  const following = [
    { id: 1, name: "User 3", avatar: "/api/placeholder/50/50" },
    { id: 2, name: "User 4", avatar: "/api/placeholder/50/50" }
  ];

  const posts = [
    { id: 1, image: "/api/placeholder/300/300" },
    { id: 2, image: "/api/placeholder/300/300" },
    { id: 3, image: "/api/placeholder/300/300" },
    { id: 4, image: "/api/placeholder/300/300" }
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Add your follow/unfollow API call here
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        {/* Profile Image */}
        <div className="relative w-32 h-32 mb-4">
          <img
            src= {profile_pic} //"/api/placeholder/128/128"
            alt="Profile"
            className="rounded-full object-cover w-full h-full border-4 border-red-400"
          />
        </div>

        {/* Username and Follow Button */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-semibold">USERNAME</h1>
          <button
            onClick={handleFollow}
            className="bg-pink-100 p-1 rounded-full hover:bg-pink-200 transition-colors"
          >
            <span className="text-xl leading-none">+</span>
          </button>
        </div>

        {/* Followers/Following Count */}
        <div className="flex gap-6 text-sm">
          <button
            onClick={() => setShowFollowers(true)}
            className="hover:underline"
          >
            {followers.length} Followers
          </button>
          <button
            onClick={() => setShowFollowing(true)}
            className="hover:underline"
          >
            {following.length} Following
          </button>
        </div>
      </div>

       {/* Posts Grid */}
       <div className="mt-8">
        <h2 className="text-center font-semibold mb-4">Posts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-8">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-red-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={post.image}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>


      {/* Followers Modal */}
      <Modal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
      >
        <div className="space-y-4">
          {followers.map((follower) => (
            <div key={follower.id} className="flex items-center gap-3">
              <img
                src={follower.avatar}
                alt={follower.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{follower.name}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Following Modal */}
      <Modal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="Following"
      >
        <div className="space-y-4">
          {following.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;