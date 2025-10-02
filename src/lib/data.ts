
'use server';
import type { Vehicle, GalleryImage, VehicleDataInput } from './types';
import { revalidatePath } from 'next/cache';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, setDoc } from 'firebase/firestore';


// --- Vehicle Functions ---

export async function fetchVehicles(filters?: { type?: string, price?: string }): Promise<Vehicle[]> {
    const vehiclesCollection = collection(db, 'vehicles');
    let vehicleQuery;

    const queryConstraints = [];
    if (filters?.type && filters.type !== 'all') {
        queryConstraints.push(where('type', '==', filters.type));
    }
    
    if (filters?.price && filters.price !== 'all') {
        const [min, max] = filters.price.split('-').map(Number);
        queryConstraints.push(where('price', '>=', min));
        if (max) {
             queryConstraints.push(where('price', '<=', max));
        }
    }

    if(queryConstraints.length > 0) {
        // Firestore requires the first orderBy to be on the same field as the first range filter.
        if (filters?.price) {
           vehicleQuery = query(vehiclesCollection, ...queryConstraints, orderBy('price'));
        } else {
           vehicleQuery = query(vehiclesCollection, ...queryConstraints, orderBy('make'));
        }
    } else {
        vehicleQuery = query(vehiclesCollection, orderBy('make'));
    }
    
    const querySnapshot = await getDocs(vehicleQuery);
    const vehicles = querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id, 10),
        ...doc.data()
    })) as Vehicle[];
    
    return vehicles;
}

export async function fetchVehicleById(id: string | number): Promise<Vehicle | null> {
    const vehicleId = typeof id === 'string' ? id : id.toString();
    const vehicleDocRef = doc(db, 'vehicles', vehicleId);
    const vehicleSnapshot = await getDoc(vehicleDocRef);

    if (!vehicleSnapshot.exists()) {
        return null;
    }
    
    return { id: parseInt(vehicleSnapshot.id, 10), ...vehicleSnapshot.data() } as Vehicle;
}

export async function fetchAllVehicleIds() {
    const vehiclesCollection = collection(db, 'vehicles');
    const querySnapshot = await getDocs(vehiclesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id }));
}

export async function fetchFeaturedVehicles(count = 4) {
    const vehiclesCollection = collection(db, 'vehicles');
    const q = query(vehiclesCollection, orderBy('price', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id, 10),
        ...doc.data()
    })) as Vehicle[];
}

export async function createVehicle(vehicleData: VehicleDataInput): Promise<Vehicle> {
    const vehiclesCollection = collection(db, 'vehicles');

    // This method for auto-incrementing ID is not scalable but works for this app's purpose.
    const allVehiclesSnapshot = await getDocs(query(vehiclesCollection, orderBy('id', 'desc'), limit(1)));
    const maxId = allVehiclesSnapshot.empty ? 0 : allVehiclesSnapshot.docs[0].data().id;
    const newId = maxId + 1;

    const newVehicleData = {
        id: newId,
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        price: vehicleData.price || 0,
        description: vehicleData.description || '',
        type: vehicleData.type || 'Sedan',
        imageUrl: vehicleData.imageUrl || '',
    };
    
    const docRef = doc(db, 'vehicles', newId.toString());
    await setDoc(docRef, newVehicleData);

    revalidatePath('/admin/dashboard');
    revalidatePath('/vehicles');
    revalidatePath('/');

    return { ...newVehicleData } as Vehicle;
}

export async function updateVehicle(id: string | number, vehicleData: VehicleDataInput): Promise<Vehicle> {
    const vehicleId = typeof id === 'string' ? id : id.toString();
    const vehicleDocRef = doc(db, 'vehicles', vehicleId);
    
    const updateData: { [key: string]: any } = { ...vehicleData };
    delete updateData.id;

    await updateDoc(vehicleDocRef, updateData);
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/vehicles');
    revalidatePath(`/vehicles/${vehicleId}`);
    revalidatePath('/');
    
    const updatedDoc = await getDoc(vehicleDocRef);
    return { id: parseInt(updatedDoc.id, 10), ...updatedDoc.data() } as Vehicle;
}


export async function deleteVehicle(id: string | number): Promise<void> {
    const vehicleId = typeof id === 'string' ? id : id.toString();
    const vehicleDocRef = doc(db, 'vehicles', vehicleId);
    await deleteDoc(vehicleDocRef);
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/vehicles');
    revalidatePath('/');
}


// --- Gallery Functions ---

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
    const galleryCollection = collection(db, 'gallery');
    const q = query(galleryCollection, orderBy('imageUrl'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as GalleryImage[];
}

export async function addGalleryImage(imageData: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    const galleryCollection = collection(db, 'gallery');
    const docRef = await addDoc(galleryCollection, imageData);
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/gallery');
    
    return { id: docRef.id, ...imageData };
}

export async function deleteGalleryImage(id: string): Promise<void> {
    const imageDocRef = doc(db, 'gallery', id);
    await deleteDoc(imageDocRef);

    revalidatePath('/admin/dashboard');
    revalidatePath('/gallery');
}
