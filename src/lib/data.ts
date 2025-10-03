'use server';
import type { Vehicle, GalleryImage, VehicleDataInput } from './types';
import { revalidatePath } from 'next/cache';
import { adminDb } from '../../lib/firebase-admin';
import { Query } from 'firebase-admin/firestore';

// --- Vehicle Functions ---

export async function fetchVehicles(filters?: { type?: string, price?: string }): Promise<Vehicle[]> {
    const vehiclesCollection = adminDb.collection('vehicles');
    let vehicleQuery: Query = vehiclesCollection;

    if (filters?.type && filters.type !== 'all') {
        vehicleQuery = vehicleQuery.where('type', '==', filters.type);
    }

    if (filters?.price && filters.price !== 'all') {
        const [min, max] = filters.price.split('-').map(Number);
        vehicleQuery = vehicleQuery.where('price', '>=', min);
        if (max) {
            vehicleQuery = vehicleQuery.where('price', '<=', max);
        }
    }

    if (filters?.price) {
        vehicleQuery = vehicleQuery.orderBy('price');
    } else {
        vehicleQuery = vehicleQuery.orderBy('make');
    }

    const querySnapshot = await vehicleQuery.get();
    const vehicles = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Vehicle, 'id'>;
        return {
            ...data,
            id: doc.id
        } as Vehicle;
    });

    return vehicles;
}

export async function fetchVehicleById(id: string | number): Promise<Vehicle | null> {
    const vehicleId = typeof id === 'string' ? id : id.toString();
    const vehicleDocRef = adminDb.collection('vehicles').doc(vehicleId);
    const vehicleSnapshot = await vehicleDocRef.get();

    if (!vehicleSnapshot.exists) {
        return null;
    }

    const data = vehicleSnapshot.data() as Omit<Vehicle, 'id'>;
    return {
        ...data,
        id: vehicleSnapshot.id
    } as Vehicle;
}

export async function fetchAllVehicleIds() {
    const vehiclesCollection = adminDb.collection('vehicles');
    const querySnapshot = await vehiclesCollection.get();
    return querySnapshot.docs.map(doc => ({ id: doc.id }));
}

export async function fetchFeaturedVehicles(count = 4) {
    const vehiclesCollection = adminDb.collection('vehicles');
    const q = vehiclesCollection.orderBy('price', 'desc').limit(count);
    const querySnapshot = await q.get();

    return querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Vehicle, 'id'>;
        return {
            ...data,
            id: doc.id
        } as Vehicle;
    });
}

export async function createVehicle(vehicleData: VehicleDataInput): Promise<Vehicle> {
    const vehiclesCollection = adminDb.collection('vehicles');

    // This method for auto-incrementing ID is not scalable but works for this app's purpose.
    const allVehiclesSnapshot = await vehiclesCollection.orderBy('id', 'desc').limit(1).get();
    const maxId = allVehiclesSnapshot.empty ? 0 : allVehiclesSnapshot.docs[0].data().id;
    const newId = maxId + 1;

    const newVehicleData = {
        id: newId.toString(),
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        price: vehicleData.price || 0,
        description: vehicleData.description || '',
        type: vehicleData.type || 'Sedan',
        imageUrl: vehicleData.imageUrl || '',
    };

    const docRef = vehiclesCollection.doc(newId.toString());
    await docRef.set(newVehicleData);

    revalidatePath('/admin/dashboard');
    revalidatePath('/vehicles');
    revalidatePath('/');

    return { ...newVehicleData } as Vehicle;
}

export async function updateVehicle(id: string | number, vehicleData: VehicleDataInput): Promise<Vehicle> {
    const vehicleId = typeof id === 'string' ? id : id.toString();
    const vehicleDocRef = adminDb.collection('vehicles').doc(vehicleId);

    const updateData: { [key: string]: any } = { ...vehicleData };
    delete updateData.id;

    await vehicleDocRef.update(updateData);

    revalidatePath('/admin/dashboard');
    revalidatePath('/vehicles');
    revalidatePath(`/vehicles/${vehicleId}`);
    revalidatePath('/');

    const updatedDoc = await vehicleDocRef.get();
    const data = updatedDoc.data() as Omit<Vehicle, 'id'>;
    return {
        ...data,
        id: updatedDoc.id
    } as Vehicle;
}

export async function deleteVehicle(id: string | number): Promise<void> {
    const vehicleId = typeof id === 'string' ? id : id.toString();
    const vehicleDocRef = adminDb.collection('vehicles').doc(vehicleId);
    await vehicleDocRef.delete();

    revalidatePath('/admin/dashboard');
    revalidatePath('/vehicles');
    revalidatePath('/');
}

// --- Gallery Functions ---

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
    const galleryCollection = adminDb.collection('gallery');
    const q = galleryCollection.orderBy('imageUrl');
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<GalleryImage, 'id'>;
        return {
            ...data,
            id: doc.id
        } as GalleryImage;
    });
}

export async function addGalleryImage(imageData: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    const galleryCollection = adminDb.collection('gallery');
    const docRef = await galleryCollection.add(imageData);

    revalidatePath('/admin/dashboard');
    revalidatePath('/gallery');

    return { id: docRef.id, ...imageData };
}

export async function deleteGalleryImage(id: string): Promise<void> {
    const imageDocRef = adminDb.collection('gallery').doc(id);
    await imageDocRef.delete();

    revalidatePath('/admin/dashboard');
    revalidatePath('/gallery');
}
