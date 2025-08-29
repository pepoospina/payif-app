import { getFirestore } from 'firebase-admin/firestore';

export const resetUsers = async () => {
  /** DO NOT DELETE */
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      'Test can only run on emulator. It will delete all current data'
    );
  }

  if (!process.env.FIRESTORE_EMULATOR_HOST.includes('127.0.0.1')) {
    throw new Error(
      'Test can only run on emulator. It will delete all current data'
    );
  }

  const db = getFirestore();
  const usersCollection = db.collection('users');

  // Get all documents in the users collection
  const snapshot = await usersCollection.get();

  // Delete each document
  const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
  await Promise.all(deletePromises);
};

export const resetDB = async (testThreads?: string[][]) => {
  /** DO NOT DELETE */
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      'Test can only run on emulator. It will delete all current data'
    );
  }

  if (!process.env.FIRESTORE_EMULATOR_HOST.includes('127.0.0.1')) {
    throw new Error(
      'Test can only run on emulator. It will delete all current data'
    );
  }

  const db = getFirestore();

  const collections = await db.listCollections();
  await Promise.all(
    collections.map(async (collection) => {
      return db.recursiveDelete(collection);
    })
  );
};
