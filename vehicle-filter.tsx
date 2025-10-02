
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { VehicleType } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

const vehicleTypes: VehicleType[] = ['Sedan', 'Sports', 'SUV', 'Coupe', 'Off-road', 'Supercars', 'Limited', 'S', 'A', 'B', 'C', 'In-game'];

const priceRanges = [
    { value: 'all', label: 'Show All' },
    { value: '0-25000', label: '$0 - $25,000' },
    { value: '25000-50000', label: '$25,000 - $50,000' },
    { value: '50000-100000', label: '$50,000+' },
];

export default function VehicleFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicleType, setVehicleType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (vehicleType !== 'all') {
      params.append('type', vehicleType);
    }
    if (priceRange !== 'all') {
      params.append('price', priceRange);
    }
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="rounded-lg bg-card p-4 shadow-lg backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger>
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-64">
                <SelectItem value="all">Show All Types</SelectItem>
                {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full" onClick={handleSearch}>
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </div>
  );
}
