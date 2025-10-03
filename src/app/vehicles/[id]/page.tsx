import { notFound } from 'next/navigation';
import VehicleDetailsClient from '@/components/vehicle-details-client';
import type { Metadata } from 'next';
import { fetchVehicleById, fetchAllVehicleIds } from '../../../../lib/data-admin';
import type { Vehicle } from '../../../lib/types';


type Props = {
  params: { id: string }
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const vehicle: Vehicle | null = await fetchVehicleById(params.id);
    if (!vehicle) {
      return {
        title: 'Vehicle Not Found',
      };
    }
    return {
      title: `${vehicle.make} ${vehicle.model} | LMC MotorShowcase`,
      description: vehicle.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Vehicle | LMC MotorShowcase',
    };
  }
}


export default async function VehiclePage({ params }: Props) {
  const vehicle: Vehicle | null = await fetchVehicleById(params.id);
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
  const vehicles: Vehicle[] = await fetchAllVehicleIds();
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}
