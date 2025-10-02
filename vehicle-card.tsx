
'use client';
import { useState, useEffect, useActionState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, timeSlots } from '@/lib/utils';
import { CalendarCheck, Eye } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { prebookVehicle } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';

type VehicleCardProps = {
  vehicle: Vehicle;
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { toast } = useToast();
  
  const initialPrebookState = { message: null, errors: {} };
  const [prebookState, prebookDispatch] = useActionState(prebookVehicle, initialPrebookState);
  const [isPrebookDialogOpen, setIsPrebookDialogOpen] = useState(false);

  useEffect(() => {
    if (prebookState.message?.startsWith('Success')) {
      toast({
        title: 'Pre-booking Successful!',
        description: prebookState.message,
      });
      setIsPrebookDialogOpen(false);
    } else if (prebookState.message?.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: prebookState.message,
      });
    }
  }, [prebookState, toast]);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Link href={`/vehicles/${vehicle.id}`}>
            <Image
              src={vehicle.imageUrl || 'https://placehold.co/600x400/22252A/FFFFFF/png?text=No+Image'}
              alt={`Image of ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
            />
          </Link>
          <Badge variant="secondary" className="absolute right-2 top-2">{vehicle.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <CardTitle className="mb-2 text-lg font-bold">
          <Link href={`/vehicles/${vehicle.id}`} className="hover:underline">
            {vehicle.make} {vehicle.model}
          </Link>
        </CardTitle>
        <p className="my-4 flex-grow text-sm text-muted-foreground">{vehicle.description}</p>
        <p className="text-2xl font-semibold text-primary">{formatPrice(vehicle.price)}</p>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Dialog open={isPrebookDialogOpen} onOpenChange={setIsPrebookDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1"><CalendarCheck className="mr-2 h-4 w-4" /> Pre-book</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pre-book this Vehicle</DialogTitle>
              <DialogDescription>
                Secure your chance to own the {vehicle.make} {vehicle.model}. Fill out the form below.
              </DialogDescription>
            </DialogHeader>
            <form action={prebookDispatch}>
              <input type="hidden" name="vehicle" value={`${vehicle.make} ${vehicle.model}`} />
              <input type="hidden" name="price" value={vehicle.price} />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`prebook-ingame-name-${vehicle.id}`}>In-Game Name</Label>
                  <Input id={`prebook-ingame-name-${vehicle.id}`} name="inGameName" placeholder="Your In-Game Name" required />
                  {prebookState.errors?.inGameName && <p className="text-sm text-destructive">{prebookState.errors.inGameName[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`prebook-discord-id-${vehicle.id}`}>Discord ID</Label>
                  <Input id={`prebook-discord-id-${vehicle.id}`} name="discordId" placeholder="Your Discord ID" required />
                  {prebookState.errors?.discordId && <p className="text-sm text-destructive">{prebookState.errors.discordId[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`prebook-ingame-number-${vehicle.id}`}>In-Game Number</Label>
                  <Input id={`prebook-ingame-number-${vehicle.id}`} name="inGameNumber" placeholder="Your In-Game Number" />
                  {prebookState.errors?.inGameNumber && <p className="text-sm text-destructive">{prebookState.errors.inGameNumber[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`prebook-pickup-time-${vehicle.id}`}>Pickup Time</Label>
                    <Select name="pickupTime" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-64">
                          {timeSlots.map(time => <SelectItem key={`time-${time}`} value={time}>{time}</SelectItem>)}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    {prebookState.errors?.pickupTime && <p className="text-sm text-destructive">{prebookState.errors.pickupTime[0]}</p>}
                    <p className="text-xs text-muted-foreground">Pickup will be within 20 minutes of the selected time.</p>
                </div>
              </div>
              <DialogFooter className='pt-4'>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <SubmitButton label="Submit Pre-booking" icon={<CalendarCheck className="mr-2 h-4 w-4" />} />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
