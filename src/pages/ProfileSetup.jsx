import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const avatarOptions = [
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=15',
  'https://i.pravatar.cc/150?img=25',
  'https://i.pravatar.cc/150?img=36',
];

const ProfileSetup = () => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const uid = location.state?.uid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid || !username || !selectedAvatar) {
      alert('Please enter a username and select an avatar.');
      return;
    }

    setLoading(true);
    try {
      // Save user profile in Firestore
      await setDoc(doc(db, 'users', uid), {
        username,
        photoURL: selectedAvatar,
        createdAt: new Date(),
      });

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: selectedAvatar,
        });
      }

      navigate('/profile'); // Redirect to profile page
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Something went wrong while saving your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-2.5 bg-gray-100 px-4">
      <div className="bg-white shadow-md p-6 rounded max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Set Up Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {avatarOptions.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Avatar ${idx + 1}`}
                onClick={() => setSelectedAvatar(url)}
                className={`h-20 w-20 rounded-full cursor-pointer border-4 ${
                  selectedAvatar === url ? 'border-green-600' : 'border-transparent'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
