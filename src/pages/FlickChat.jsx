import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const FlickChat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteId, setShowDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid) {
        setCurrentUser(user);
        await setDoc(
          doc(db, 'users', user.uid),
          {
            username: user.displayName || 'Anonymous',
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const userList = snapshot.docs
          .map(doc => ({ uid: doc.id, ...doc.data() }))
          .filter(user => user.uid !== currentUser?.uid);
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [selectedUser, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDelete = async (messageId) => {
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    await updateDoc(messageRef, {
      deleted: true,
      text: "",
    });
  };

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messageRef = collection(db, 'chats', chatId, 'messages');

    await setDoc(
      doc(db, 'chats', chatId),
      { users: [currentUser.uid, selectedUser.uid] },
      { merge: true }
    );

    await addDoc(messageRef, {
      sender: currentUser.uid,
      username: currentUser.displayName || 'Anonymous',
      avatar: currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y',
      text: message,
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar with Instagram gradient */}
      <nav className="flex justify-between items-center text-white px-6 py-3 shadow bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
        <h1 className="text-xl font-semibold">FlickChat</h1>
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              <img
                src={currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">
                Hello, <strong>{currentUser.displayName || 'User'}</strong>
              </span>
            </>
          ) : (
            <span className="text-sm italic">Guest</span>
          )}
        </div>
      </nav>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <aside
          className={`md:w-1/3 w-full h-full ${
            selectedUser ? 'hidden md:block' : 'block'
          } bg-gray-100 px-3 py-4 border-r overflow-y-auto`}
        >
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          <input
            type="text"
            className="w-full mb-4 px-3 py-2 border rounded text-sm"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {users.length === 0 ? (
            <p className="text-sm">No other users available.</p>
          ) : (
            <ul className="space-y-2">
              {selectedUser && (
                <li
                  key={selectedUser.uid}
                  className="p-3 rounded cursor-pointer bg-blue-200 text-sm"
                  onClick={() => setSelectedUser(selectedUser)}
                >
                  {selectedUser.username}
                </li>
              )}
              {users
                .filter(
                  (user) =>
                    user.uid !== selectedUser?.uid &&
                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <li
                    key={user.uid}
                    className="p-3 rounded cursor-pointer hover:bg-blue-100 text-sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex gap-1 items-center space-y-1">
                      <img src={user.photoURL} className="w-10 h-10 rounded-full" />
                      {user.username}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-gray-200 px-3 py-4 border-b flex justify-between items-center">
            <div className="flex">
              <span className="text-base md:text-lg font-semibold">
                {selectedUser ? (
                  selectedUser.photoURL ? (
                    <div className="flex gap-1 items-center space-y-1">
                      <img
                        src={selectedUser.photoURL}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <h1 className="text-sm font-semibold">{selectedUser.username}</h1>
                    </div>
                  ) : (
                    <span>Select a user</span>
                  )
                ) : (
                  <span>Select a user</span>
                )}
              </span>
            </div>
            <button
              className="md:hidden text-sm text-blue-600 underline"
              onClick={() => setSelectedUser(null)}
            >
              Back
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-white min-h-0">
            {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setShowDeleteId(msg.id)}
               className={`group flex items-end space-x-2 max-w-[85%] ${
             msg.sender === currentUser?.uid ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                   }`}
                   >

                <img
                  src={msg.avatar}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div
                  className={`relative p-3 rounded-lg text-sm break-words ${
                    msg.sender === currentUser?.uid
                      ? 'bg-gradient-to-r from-gray-500 to-pink-400 text-black'
                      : 'bg-gray-200 bg-gradient-to-r from-orange-400 to-pink-950 text-white'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">{msg.username}</div>

                  {msg.deleted ? (
                    <div className="italic text-gray-900">This message was deleted</div>
                  ) : (
                    <div>{msg.text}</div>
                  )}

                  {msg.timestamp && (
                    <div className="text-[10px] mt-1 opacity-70">
                      {formatDistanceToNow(new Date(msg.timestamp.seconds * 1000), { addSuffix: true })}
                    </div>
                  )}

                 {msg.sender === currentUser?.uid && !msg.deleted && (
                 <button
                  className={`absolute top-1 right-1 z-10 px-2 py-1 text-xs rounded-md bg-red-100 text-red-700 shadow-sm transition-opacity duration-300 ease-in-out
                  ${showDeleteId === msg.id ? 'opacity-100' : 'opacity-0'}
                   md:group-hover:opacity-100`}
                   onClick={() => handleDelete(msg.id)}
                    >                  
                   Delete
                 </button>

                  )}

                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <footer className="px-3 py-4 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border rounded text-sm"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={!selectedUser}
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-2 rounded text-sm hover:opacity-90 flex items-center gap-1"
                disabled={!selectedUser}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Send</span>
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default FlickChat;
