import { adminDb } from './firebase-admin';
import type { Vehicle } from '../src/lib/types';

export async function fetchVehicleById(id: string): Promise<Vehicle | null> {
  const docRef = adminDb.collection('vehicles').doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return null;
  const data = docSnap.data();
  // Defensive: ensure all Vehicle fields are present
  if (!data || !data.make || !data.model || !data.price || !data.description || !data.type || !data.imageUrl) return null;
  return {
    id: docSnap.id,
    make: data.make,
    model: data.model,
    price: data.price,
    description: data.description,
    type: data.type,
    imageUrl: data.imageUrl,
  };
}

export async function fetchAllVehicleIds(): Promise<Vehicle[]> {
  const snapshot = await adminDb.collection('vehicles').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Vehicle[];
}
