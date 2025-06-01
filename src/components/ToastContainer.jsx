import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// In useEffect:
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if (currentUser) toast.success(`Welcome ${currentUser.email}`);
    else toast.info('You are logged out');
  });
  return () => unsubscribe();
}, []);
