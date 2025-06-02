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
    <div className="mt-8 flex flex-col py-4 px-4 justify-center">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4">Comments</h2>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2 mb-4 max-w-3xl "
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="flex-1 p-2 border rounded resize-none text-sm md:text-base"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm md:text-base h-10"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-4 text-sm text-gray-600">Please log in to comment.</p>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto pr-1 md:pr-2 space-y-4">
            {comments.map((c) => (
              <CommentWithReplies
                key={c.id}
                mediaId={mediaId}
                comment={c}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentWithReplies = ({ mediaId, comment, currentUser }) => {
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'comments', mediaId, 'commentList', comment.id, 'replies'),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const temp = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReplies(temp);
    });

    return () => unsub();
  }, [mediaId, comment.id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || replyText.trim() === '') return;

    await addDoc(
      collection(db, 'comments', mediaId, 'commentList', comment.id, 'replies'),
      {
        text: replyText,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        userPhoto:
          currentUser.photoURL ||
          `https://ui-avatars.com/api/?name=${(currentUser.email || 'User')
            .split('@')[0]
            .replace(/[^a-zA-Z]/g, '')}&background=random`,
        timestamp: new Date()
      }
    );
    setReplyText('');
    setShowReplyForm(false);
  };

  const handleDeleteReply = async (replyId) => {
    await deleteDoc(
      doc(db, 'comments', mediaId, 'commentList', comment.id, 'replies', replyId)
    );
  };

  return (
    <div className="p-3 rounded bg-white shadow text-sm md:text-base">
      <div className="flex items-center gap-2 mb-1">
        <img
          src={comment.userPhoto}
          alt={comment.userName}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold">{comment.userName}</span>
        <span className="text-xs text-gray-500 ml-auto">
          {comment.timestamp?.toDate
            ? comment.timestamp.toDate().toLocaleString()
            : new Date(comment.timestamp).toLocaleString()}
        </span>
      </div>
      <p className="ml-10 break-words">{comment.text}</p>

      {currentUser?.uid === comment.userId && (
        <button
          onClick={() => deleteDoc(doc(db, 'comments', mediaId, 'commentList', comment.id))}
          className="ml-10 mt-1 text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      )}

      {/* Reply toggle button */}
      <button
        onClick={() => setShowReplyForm((prev) => !prev)}
        className="ml-10 mt-2 text-sm text-blue-600 hover:underline"
      >
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>

      {/* Reply form */}
      {showReplyForm && currentUser && (
        <form onSubmit={handleReplySubmit} className="ml-10 mt-2 flex gap-2">
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 p-2 border rounded resize-none text-sm md:text-base"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded text-sm md:text-base h-10"
          >
            Reply
          </button>
        </form>
      )}

      {/* Replies */}
      <div className="ml-10 mt-4 space-y-2">
        {replies.map((r) => (
          <div key={r.id} className="flex items-start gap-2">
            <img
              src={r.userPhoto}
              alt={r.userName}
              className="w-6 h-6 rounded-full mt-1"
            />
            <div className="bg-gray-100 rounded p-2 flex-1 text-sm md:text-base break-words">
              <div className="flex justify-between">
                <span className="font-semibold">{r.userName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {r.timestamp?.toDate
                    ? r.timestamp.toDate().toLocaleString()
                    : new Date(r.timestamp).toLocaleString()}
                </span>
              </div>
              <p>{r.text}</p>
              {currentUser?.uid === r.userId && (
                <button
                  onClick={() => handleDeleteReply(r.id)}
                  className="mt-1 text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
