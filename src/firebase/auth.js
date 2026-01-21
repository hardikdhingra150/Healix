import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { auth, db } from './config';
  
  export const registerUser = async (email, password, name, userType) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: name });
  
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        userType: userType,
        createdAt: new Date().toISOString()
      });
  
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };