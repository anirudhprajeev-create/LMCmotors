
export type VehicleType = 'Sedan' | 'Sports' | 'SUV' | 'Coupe' | 'Off-road' | 'Supercars' | 'Limited' | 'S' | 'A' | 'B' | 'C' | 'In-game';

export type Vehicle = {
    id: number;
    make: string;
    model: string;
    price: number;
    description: string;
    type: VehicleType;
    imageUrl: string;
  };

export type VehicleDataInput = Partial<Omit<Vehicle, 'id'>>;

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type GalleryImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
