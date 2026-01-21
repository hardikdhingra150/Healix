import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc,
    query,
    where,
    orderBy
  } from 'firebase/firestore';
  import { db } from './config';
  
  export const addHealthRecord = async (patientId, healthData) => {
    try {
      const docRef = await addDoc(collection(db, 'healthRecords'), {
        patientId,
        ...healthData,
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  export const getPatientHealthRecords = async (patientId) => {
    try {
      const q = query(
        collection(db, 'healthRecords'),
        where('patientId', '==', patientId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      
      return records;
    } catch (error) {
      throw error;
    }
  };
  
  export const getUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  };
  
  export const getAllPatients = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('userType', '==', 'patient')
      );
      
      const querySnapshot = await getDocs(q);
      const patients = [];
      querySnapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() });
      });
      
      return patients;
    } catch (error) {
      throw error;
    }
  };