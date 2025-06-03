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
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FlickChat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messageRef = collection(db, 'chats', chatId, 'messages');

    await setDoc(
      doc(db, 'chats', chatId),
      {
        users: [currentUser.uid, selectedUser.uid],
      },
      { merge: true }
    );

    await addDoc(messageRef, {
      sender: currentUser.uid,
      text: message,
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen">

      {/* Navbar with profile pic */}
      <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow">
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
          className={`md:w-1/3 w-full ${
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
                    {user.username}
                  </li>
                ))}
            </ul>
          )}
        </aside>

        <main className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <header className="bg-gray-200 px-3 py-4 border-b flex justify-between items-center">
            <h2 className="text-base md:text-lg font-semibold">
              Chat with {selectedUser?.username || 'Select a user'}
            </h2>
            <button
              className="md:hidden text-sm text-blue-600 underline"
              onClick={() => setSelectedUser(null)}
            >
              Back
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg text-sm break-words ${
                  msg.sender === currentUser?.uid
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-200 text-black'
                } max-w-[85%]`}
              >
                {msg.text}
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
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                disabled={!selectedUser}
              >
                Send
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default FlickChat;
