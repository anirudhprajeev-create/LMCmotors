import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import VehicleDetailsClient from '@/components/vehicle-details-client';
import type { Metadata } from 'next'

type Props = {
    params: { id: string }
}

  const docRef = adminDb.collection('vehicles').doc(params.id);
  const docSnap = await docRef.get();
  const vehicle = docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found'
    }
  }

  return {
    title: `${vehicle.make} ${vehicle.model} | LMC MotorShowcase`,
    description: vehicle.description,
  }
}

  const docRef = adminDb.collection('vehicles').doc(params.id);
  const docSnap = await docRef.get();
  const vehicle = docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <VehicleDetailsClient vehicle={vehicle} />
    </div>
  );
}

    const snapshot = await adminDb.collection('vehicles').get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
    }));
