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
  limit,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

const FlickChat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [localToast, setLocalToast] = useState(null);
  const [sharedMovieInfo, setSharedMovieInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadStatus, setUnreadStatus] = useState({});
  const lastToastMsgIdRef = useRef({}); // For toast notification without opening chat

  // Auth listener
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

  // Fetch all users except current user
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

  // Update current user lastSeen timestamp every minute and on window focus
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);

    const updateLastSeen = () => {
      updateDoc(userRef, {
        lastSeen: serverTimestamp(),
      }).catch(console.error);
    };

    updateLastSeen();

    const interval = setInterval(updateLastSeen, 60000);
    window.addEventListener('focus', updateLastSeen);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', updateLastSeen);
    };
  }, [currentUser]);

  // Subscribe to messages for selected user
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    // Listen for messages realtime
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      // Mark unread messages as read if current user is recipient and message is unread
      const unreadMessages = msgs.filter(
        (msg) =>
          msg.sender !== currentUser.uid &&
          (!msg.readBy || !msg.readBy.includes(currentUser.uid))
      );

      // Update readBy field for unread messages
      if (unreadMessages.length > 0) {
        const batchPromises = unreadMessages.map((msg) =>
          updateDoc(doc(db, 'chats', chatId, 'messages', msg.id), {
            readBy: [...(msg.readBy || []), currentUser.uid],
          }).catch(console.error)
        );
        await Promise.all(batchPromises);
      }
    });

    return unsubscribe;
  }, [selectedUser, currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sharing movie/series via URL params (existing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shareId = params.get('shareId');
    const type = params.get('type');
    const to = params.get('to');
    if (shareId && type && to && currentUser) {
      const sentKey = `sharedMessageSent_${shareId}_${to}`;
      const findUser = users.find(u => u.uid === to);
      if (findUser) setSelectedUser(findUser);
      const shareUrl = `${window.location.origin}/${type}/${shareId}`;
      const text = `Check this ${type === 'movie' ? 'movie' : 'series'}: ${shareUrl}`;
      setSharedMovieInfo({ to, text, sentKey, shareId, type });
    }
  }, [location.search, currentUser, users]);

  // Auto-send shared message once on chat open
  useEffect(() => {
    if (
      sharedMovieInfo &&
      selectedUser?.uid === sharedMovieInfo.to &&
      message === ''
    ) {
      const autoSend = async () => {
        const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
        const messageRef = collection(db, 'chats', chatId, 'messages');
        await setDoc(doc(db, 'chats', chatId), {
          users: [currentUser.uid, selectedUser.uid],
        }, { merge: true });

        await addDoc(messageRef, {
          sender: currentUser.uid,
          username: currentUser.displayName || 'Anonymous',
          avatar: currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y',
          text: sharedMovieInfo.text,
          timestamp: serverTimestamp(),
          shared: {
            shareId: sharedMovieInfo.shareId,
            type: sharedMovieInfo.type,
            posterUrl: sharedMovieInfo.posterUrl || '', // Add posterUrl if available
          },
          readBy: [currentUser.uid], // Mark as read by sender immediately
        });

        localStorage.setItem(sharedMovieInfo.sentKey, 'true');
        setLocalToast('Shared successfully!');
        setSharedMovieInfo(null);
        setTimeout(() => setLocalToast(null), 3000);
      };
      autoSend();
    }
  }, [sharedMovieInfo, selectedUser, message, currentUser]);

  // Detect unread messages per user for sidebar and sort users with unread on top
  useEffect(() => {
    if (!currentUser || users.length === 0) return;

    const unsubscribes = [];
    setUnreadStatus({});

    users.forEach((user) => {
      const chatId = [currentUser.uid, user.uid].sort().join('_');
      const msgRef = collection(db, 'chats', chatId, 'messages');
      const q = query(msgRef, orderBy('timestamp', 'desc'), limit(1));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const msgDoc = snapshot.docs[0];
          const msg = msgDoc.data();
          // Check if message is unread for current user
          const isUnread = msg.sender !== currentUser.uid && !(msg.readBy || []).includes(currentUser.uid);
          setUnreadStatus(prev => ({ ...prev, [user.uid]: isUnread }));

          // Toast for new unread message if not already shown and chat is not open
          if (
            isUnread &&
            lastToastMsgIdRef.current[user.uid] !== msgDoc.id &&
            (!selectedUser || selectedUser.uid !== user.uid)
          ) {
            toast.success(`📩 New message from ${user.username || 'Someone'}`);
            lastToastMsgIdRef.current[user.uid] = msgDoc.id;
          }
        } else {
          setUnreadStatus(prev => ({ ...prev, [user.uid]: false }));
        }
      });

      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [users, currentUser, selectedUser]);

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !selectedUser) return;
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messageRef = collection(db, 'chats', chatId, 'messages');
    await setDoc(doc(db, 'chats', chatId), {
      users: [currentUser.uid, selectedUser.uid],
    }, { merge: true });

    await addDoc(messageRef, {
      sender: currentUser.uid,
      username: currentUser.displayName || 'Anonymous',
      avatar: currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y',
      text: message,
      timestamp: serverTimestamp(),
      readBy: [currentUser.uid], // Mark sent message as read by sender
    });

    setMessage('');
  };

  const handleDelete = async (id) => {
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messageRef = doc(db, 'chats', chatId, 'messages', id);
    try {
      await updateDoc(messageRef, { deleted: true, text: '' });
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          {part}
        </a>
      ) : part
    );
  };

  const getUserStatus = (lastSeen) => {
    if (!lastSeen) return 'Offline';
    const seenTime = lastSeen.toDate();
    const diff = new Date() - seenTime;
    if (diff < 2 * 60 * 1000) return 'Online';
    return `Last seen ${formatDistanceToNow(seenTime, { addSuffix: true })}`;
  };

  // Sort users: unread on top, then by username
  const sortedUsers = [...users].sort((a, b) => {
    const aUnread = unreadStatus[a.uid] ? 1 : 0;
    const bUnread = unreadStatus[b.uid] ? 1 : 0;
    if (aUnread !== bUnread) return bUnread - aUnread;
    // fallback alphabetical
    return (a.username || '').localeCompare(b.username || '');
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden dark:bg-gray-red-900">
     <Navbar></Navbar>
    

    
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className={`md:w-1/3 w-full h-full max-h-screen ${selectedUser ? 'hidden md:block' : 'block'} bg-gray-100 dark:bg-gray-900 px-3 py-4 border-r overflow-y-auto`}>
          <h2 className="text-xl font-bold mb-4 dark:text-white"><span className='text-pink-500'>FlickChats</span></h2>
          <input
            type="text"
            className="w-full mb-4 px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:text-white"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="space-y-2">
            {sortedUsers
              .filter(user =>
                user.username?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user.uid}
                  className="p-3 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800 text-sm flex items-center justify-between"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium dark:text-white flex items-center gap-2">
                        {user.username}
                        {unreadStatus[user.uid] && (
                          <span className="w-3 h-3 rounded-full bg-green-500 inline-block animate-pulse" title="Unread message">
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{getUserStatus(user.lastSeen)}</span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </aside>

        {/* Main Chat */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-gray-200 dark:bg-gray-800 px-3 py-4 border-b flex items-center gap-4 fixed z-10 w-full">
            {selectedUser && (
              <button
                className="md:hidden text-lg font-bold text-gray-900 dark:text-white"
                onClick={() => setSelectedUser(null)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            {selectedUser && (
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp&f=y'}
                  alt={selectedUser.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-semibold text-sm dark:text-white">{selectedUser.username}</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getUserStatus(selectedUser.lastSeen)}</p>
                </div>
              </div>
            )}
          </header>

          <div
            className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-white dark:bg-gray-950"
            style={{ minHeight: 0 }}
          >
            {!selectedUser ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-lg font-medium">
                Select a user to start chatting
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setShowDeleteId(msg.id)}
                    className={`group flex items-end space-x-2 max-w-[85%] ${
                      msg.sender === currentUser?.uid ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`relative p-3 rounded-lg text-sm break-words ${
                        msg.sender === currentUser?.uid
                          ? 'bg-gradient-to-r from-gray-500 to-pink-400 text-black'
                          : 'bg-gradient-to-r from-orange-400 to-pink-900 text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs mb-1 flex items-center gap-1">
                        {msg.username}
                       
                      </div>

                      {msg.deleted ? (
                        <div className="italic text-gray-900 dark:text-gray-300">This message was deleted</div>
                      ) : (
                        <div>{renderMessageText(msg.text)}</div>
                      )}

                      {msg.shared && (
                        <>
                      {msg.deleted ? (
                           <div></div>
                      ) : (
                       <>
                       <div className="bg-gray-200 dark:bg-gray-700 h-60 w-full rounded-2xl mt-2">
                            <img
                              src={msg.shared.posterUrl}
                              alt=""
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          </div>
                          <button
                            onClick={() => navigate(`/${msg.shared.type}/${msg.shared.shareId}`)}
                            className="mt-2 text-xs bg-pink-600 text-white px-2 py-1 rounded hover:bg-pink-800"
                          >
                            Watch Now
                          </button>
                       </>

                      )}
                          
                        </>
                      )}

                      {msg.timestamp && (
                        <div className="text-[10px] mt-1 opacity-70 w-full flex justify-end">
                          {formatDistanceToNow(new Date(msg.timestamp.seconds * 1000), { addSuffix: true })}
                           {msg.sender === currentUser?.uid && msg.readBy?.includes(selectedUser?.uid) && (
                          <FontAwesomeIcon
                            icon={faCheckDouble}
                            className="text-blue-600 ml-5"
                            title="Read"
                          />
                        )}
                        </div>
                      )}

                      {msg.sender === currentUser?.uid && !msg.deleted && (
                        <button
                          className={`absolute top-1 right-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded shadow-sm transition-opacity ${
                            showDeleteId === msg.id ? 'opacity-100' : 'opacity-0'
                          } md:group-hover:opacity-100`}
                          onClick={() => handleDelete(msg.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <footer className="px-3 py-4 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border rounded text-sm dark:bg-gray-700 dark:text-white"
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

      {localToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {localToast}
        </div>
      )}
    </div>
  );
};

export default FlickChat;