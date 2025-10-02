
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getImageById } from '@/lib/placeholder-images';
import VehicleCard from '@/components/vehicle-card';
import LocationMap from '@/components/location-map';
import { ArrowRight } from 'lucide-react';
import { fetchFeaturedVehicles } from '@/lib/data';

export default async function Home() {
  const heroImage = getImageById('hero');
  const featuredVehicles = await fetchFeaturedVehicles(4);

  return (
    <div className="flex flex-col">
      <section className="relative h-[70vh] w-full text-white">
        <Image
          src={heroImage?.imageUrl || ''}
          alt={heroImage?.description || 'LMC Motors dealership'}
          fill
          className="object-cover"
          quality={100}
          data-ai-hint={heroImage?.imageHint}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-6xl lg:text-7xl [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            Your Dream Car Awaits
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-md md:text-xl [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            Discover a curated selection of high-quality vehicles at LMC Motors.
          </p>
          <Button asChild className="mt-12" size="lg" variant="gradient">
            <Link href="/vehicles">
              Explore Inventory <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">
            Featured Vehicles
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/vehicles">View All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="location" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">
            Visit Our Showroom
          </h2>
          <LocationMap />
        </div>
      </section>
    </div>
  );
}

