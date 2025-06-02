import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const avatarOptions = [
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=15',
  'https://i.pravatar.cc/150?img=25',
  'https://i.pravatar.cc/150?img=36',
];

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setPhotoURL(user?.photoURL || '');
    setNewDisplayName(user?.displayName || '');
    setSelectedAvatar(user?.photoURL || '');
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');

    try {
      await updateProfile(user, { displayName: newDisplayName, photoURL: selectedAvatar });
      setDisplayName(newDisplayName);
      setPhotoURL(selectedAvatar);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) return <p className="text-center mt-10">Please log in to view your profile.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="flex flex-col items-center mb-6">
        <img
          src={photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4 border"
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
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <label className="block font-semibold">
          Username
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}

      <button
        onClick={handleSignOut}
        className="mt-6 w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
