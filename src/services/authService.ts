import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from '../types';

// Helper to convert Firebase User to our App User
const mapUser = (fbUser: FirebaseUser): User => ({
  id: fbUser.uid,
  name: fbUser.displayName || 'Мастер',
  username: fbUser.email ? fbUser.email.split('@')[0] : 'user',
  avatar: (fbUser.displayName || 'U')[0].toUpperCase()
});

// Helper to normalize login to email (allows entering just "username")
const toEmail = (login: string) => {
    return login.includes('@') ? login : `${login}@serviceplan.local`;
};

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    const email = toEmail(username);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(userCredential.user);
  },

  register: async (name: string, username: string, password: string): Promise<User> => {
    const email = toEmail(username);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return mapUser(userCredential.user);
  },

  logout: async () => {
    await signOut(auth);
  },

  subscribe: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(fbUser ? mapUser(fbUser) : null);
    });
  }
};