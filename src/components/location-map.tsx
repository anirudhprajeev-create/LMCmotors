import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationMap() {
  const coordinates = "-82.157949, -78.830521";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-8">
          <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <MapPin className="text-primary" />
            Our Showroom
          </h3>
          <p className="mb-6 text-lg text-muted-foreground">LMC Motors Pillbox Hill 8172, near Legion Square</p>
          <Button asChild>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="mr-2 h-4 w-4" /> Get Directions
            </a>
          </Button>
        </div>
        <div className="relative min-h-[300px] w-full">
           <Image
                src="https://cdn.discordapp.com/attachments/1083757528749453394/1422866358567178300/Generated_Image_October_01_2025_-_1_55PM.png?ex=68de3b0f&is=68dce98f&hm=db541a2b180525759efe803c789ba39049883bda6a70b2822f3744cdb590b15d&"
                alt="Map showing dealership location"
                fill
                className="object-cover"
                data-ai-hint="map location"
            />
        </div>
      </div>
    </Card>
  );
}
