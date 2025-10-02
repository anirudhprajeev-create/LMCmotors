import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { vehicles } from '../lib/vehicles';
import placeholderImagesData from '../lib/placeholder-images.json';

// This is the Firebase configuration for your app
const firebaseConfig = {
  "projectId": "studio-6136093379-11c92",
  "appId": "1:796012307965:web:ac1c23e9519b1b0d6ca594",
  "apiKey": "AIzaSyD1TtPHsrgt6uVzXEB9cPF8YXTwTznVehY",
  "authDomain": "studio-6136093379-11c92.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "796012307965"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

async function seedVehicles() {
    const vehiclesCollection = collection(db, 'vehicles');
    const existingVehicles = await getDocs(vehiclesCollection);

    if (!existingVehicles.empty) {
        console.log('Vehicles collection already contains data. Deleting existing data...');
        const batch = writeBatch(db);
        existingVehicles.docs.forEach((doc) => {
        batch.delete(doc.ref);
        });
        await batch.commit();
        console.log('Existing vehicle data deleted.');
    }

    console.log('Seeding database with initial vehicle data...');
    const vehiclePromises = vehicles.map(async (vehicle) => {
        const vehicleDocRef = doc(db, 'vehicles', vehicle.id.toString());
        await setDoc(vehicleDocRef, vehicle);
        console.log(`Added vehicle: ${vehicle.make} ${vehicle.model}`);
    });

    await Promise.all(vehiclePromises);
    console.log('Vehicle seeding completed.');
}

async function seedGallery() {
    const galleryCollection = collection(db, 'gallery');
    const existingImages = await getDocs(galleryCollection);

     if (!existingImages.empty) {
        console.log('Gallery collection already contains data. Deleting existing data...');
        const batch = writeBatch(db);
        existingImages.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log('Existing gallery data deleted.');
    }

    console.log('Seeding database with initial gallery data...');
    const cultureImages = placeholderImagesData.placeholderImages.filter(img => img.id.startsWith('culture-'));
    
    const galleryPromises = cultureImages.map(async (image) => {
        // We can use the existing ID or let Firestore generate one. Let's use the existing one for consistency.
        const imageDocRef = doc(db, 'gallery', image.id);
        const { id, ...imageData } = image; // Don't store the id field inside the document itself
        await setDoc(imageDocRef, imageData);
        console.log(`Added gallery image: ${image.description}`);
    });

    await Promise.all(galleryPromises);
    console.log('Gallery seeding completed.');
}


async function seedDatabase() {
  await seedVehicles();
  await seedGallery();

  console.log('Database seeding completed successfully!');
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
