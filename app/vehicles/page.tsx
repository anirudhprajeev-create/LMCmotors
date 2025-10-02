
'use client';
import { useSearchParams } from 'next/navigation';
import VehicleCard from '@/components/vehicle-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SearchX, Loader2 } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { useEffect, useState, Suspense } from 'react';
import { fetchVehicles } from '@/lib/data';
import VehicleFilter from '@/components/vehicle-filter';

function VehiclesContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const price = searchParams.get('price');
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchVehicles({ type: type || undefined, price: price || undefined })
            .then(vehicles => {
                setFilteredVehicles(vehicles);
                setIsLoading(false);
            });
    }, [type, price]);

    return (
        <>
            <div className="mb-8">
                <VehicleFilter />
            </div>
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center">
                    <Alert className="max-w-md text-center">
                         <SearchX className="h-4 w-4" />
                        <AlertTitle>No Vehicles Found</AlertTitle>
                        <AlertDescription>
                            Sorry, no vehicles match your current search criteria. Try adjusting your filters.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </>
    );
}

export default function VehiclesPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-8 text-center font-headline text-4xl font-bold md:text-5xl">
                Our Inventory
            </h1>
            <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
                <VehiclesContent />
            </Suspense>
        </div>
    );
}
