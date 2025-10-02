import { notFound } from 'next/navigation';
import { fetchVehicleById, fetchAllVehicleIds } from '@/lib/data';
import VehicleDetailsClient from '@/components/vehicle-details-client';
import type { Metadata } from 'next'

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle = await fetchVehicleById(params.id);
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

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await fetchVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <VehicleDetailsClient vehicle={vehicle} />
    </div>
  );
}

export async function generateStaticParams() {
    const ids = await fetchAllVehicleIds();
    return ids.map((item) => ({
      id: item.id.toString(),
    }))
}
