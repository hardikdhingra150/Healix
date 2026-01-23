import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './config';

/**
 * Listen to patient health records in real-time
 * @param {string} patientId - The patient's user ID
 * @param {function} callback - Function to call when data changes
 * @param {number} limitCount - Number of records to fetch
 * @returns {function} Unsubscribe function
 */
export const listenToPatientRecords = (patientId, callback, limitCount = 30) => {
  const q = query(
    collection(db, 'healthRecords'),
    where('patientId', '==', patientId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const records = [];
    snapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    callback(records);
  }, (error) => {
    console.error('Error listening to records:', error);
  });

  return unsubscribe;
};

/**
 * Listen to all patients in real-time
 * @param {function} callback - Function to call when data changes
 * @returns {function} Unsubscribe function
 */
export const listenToAllPatients = (callback) => {
  const q = query(
    collection(db, 'users'),
    where('userType', '==', 'patient')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const patients = [];
    snapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });
    callback(patients);
  }, (error) => {
    console.error('Error listening to patients:', error);
  });

  return unsubscribe;
};