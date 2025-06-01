import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const CommentSection = ({ mediaId }) => {
  const [user] = useAuthState(auth);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'comments', mediaId, 'commentList'),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const temp = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(temp);
    });

    return () => unsub();
  }, [mediaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || comment.trim() === '') return;

   await addDoc(collection(db, 'comments', mediaId, 'commentList'), {
  text: comment,
  userId: user.uid,
  userName: user.displayName || user.email.split('@')[0],
  userPhoto:
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${(user.email || 'User')
      .split('@')[0]
      .replace(/[^a-zA-Z]/g, '')}&background=random`,
  timestamp: new Date()
});
    setComment('');
  };

  const handleDelete = async (commentId) => {
    await deleteDoc(doc(db, 'comments', mediaId, 'commentList', commentId));
  };

  return (
    <div className="mt-8 max-w-[800px] flex flex-col py-4 mx-auto">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4 ">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-4 text-sm text-gray-600">Please log in to comment.</p>
      )}

  <div className="space-y-4 ">
  {comments.length === 0 ? (
    <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
  ) : (
    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
      {comments.map((c) => (
        <div key={c.id} className=" p-3 rounded bg-white shadow">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={c.userPhoto}
              alt={c.userName}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold">{c.userName}</span>
            <span className="text-xs text-gray-500 ml-auto">
              {new Date(c.timestamp.toDate()).toLocaleString()}
            </span>
          </div>
          <p className="ml-10">{c.text}</p>
          {user?.uid === c.userId && (
            <button
              onClick={() => handleDelete(c.id)}
              className="ml-10 mt-1 text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
};

export default CommentSection;
