
import type { Vehicle, GalleryImage, VehicleDataInput } from './types';
import { unstable_noStore as noStore } from 'next/cache';
import { vehicles as initialVehicles } from './vehicles';
import placeholderImagesData from './placeholder-images.json';

// In-memory data stores
let vehicles: Vehicle[] = initialVehicles.map(v => ({
    ...v,
    imageUrl: placeholderImagesData.placeholderImages.find(img => img.id === v.image)?.imageUrl || ''
}));
let galleryImages: GalleryImage[] = placeholderImagesData.placeholderImages
    .filter(img => img.id.startsWith('culture-'))
    .map(img => ({ ...img }));

// --- Vehicle Functions ---

export async function fetchVehicles(filters?: { type?: string, price?: string }): Promise<Vehicle[]> {
    noStore();
    let filteredVehicles = [...vehicles];

    if (filters?.type && filters.type !== 'all') {
        filteredVehicles = filteredVehicles.filter(v => v.type === filters.type);
    }

    if (filters?.price && filters.price !== 'all') {
        const [min, max] = filters.price.split('-').map(Number);
        filteredVehicles = filteredVehicles.filter(v => {
            if (max) {
                return v.price >= min && v.price <= max;
            }
            return v.price >= min;
        });
    }
    
    return filteredVehicles;
}

export async function fetchVehicleById(id: string | number): Promise<Vehicle | null> {
    noStore();
    const vehicleId = typeof id === 'string' ? parseInt(id) : id;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle || null;
}

export async function fetchAllVehicleIds() {
    noStore();
    return vehicles.map(v => ({ id: v.id.toString() }));
}

export async function fetchFeaturedVehicles(count = 4) {
    noStore();
    return [...vehicles].sort((a, b) => b.price - a.price).slice(0, count);
}

export async function createVehicle(vehicleData: VehicleDataInput): Promise<Vehicle> {
    noStore();
    const maxId = vehicles.reduce((max, v) => Math.max(max, v.id), 0);
    const newVehicle: Vehicle = {
        id: maxId + 1,
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        price: vehicleData.price || 0,
        description: vehicleData.description || '',
        type: vehicleData.type || 'Sedan',
        imageUrl: vehicleData.imageUrl || '',
    };
    vehicles.push(newVehicle);
    return newVehicle;
}

export async function updateVehicle(id: string | number, vehicleData: VehicleDataInput): Promise<Vehicle> {
    noStore();
    const vehicleId = typeof id === 'string' ? parseInt(id) : id;
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
        throw new Error("Vehicle not found");
    }
    const updatedVehicle = { ...vehicles[vehicleIndex], ...vehicleData };
    vehicles[vehicleIndex] = updatedVehicle as Vehicle;
    return updatedVehicle as Vehicle;
}

export async function deleteVehicle(id: string | number): Promise<void> {
    noStore();
    const vehicleId = typeof id === 'string' ? parseInt(id) : id;
    vehicles = vehicles.filter(v => v.id !== vehicleId);
}


// --- Gallery Functions ---

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
    noStore();
    return [...galleryImages];
}

export async function addGalleryImage(imageData: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    noStore();
    const newImage: GalleryImage = {
        id: `gallery-${Date.now()}-${Math.random()}`,
        ...imageData,
    };
    galleryImages.push(newImage);
    return newImage;
}

export async function deleteGalleryImage(id: string): Promise<void> {
    noStore();
    galleryImages = galleryImages.filter(img => img.id !== id);
}
