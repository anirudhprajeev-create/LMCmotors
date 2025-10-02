
'use client';
import Image from 'next/image';
import { useActionState } from 'react-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Vehicle } from '@/lib/types';
import { submitInquiry, prebookVehicle } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Send, CalendarCheck, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { timeSlots, formatPrice } from '@/lib/utils';
import { SubmitButton } from './submit-button';

type VehicleDetailsClientProps = {
  vehicle: Vehicle;
};


export default function VehicleDetailsClient({ vehicle }: VehicleDetailsClientProps) {
    const { toast } = useToast();
    
    const initialInquiryState = { message: null, errors: {} };
    const [inquiryState, inquiryDispatch] = useActionState(submitInquiry, initialInquiryState);

    const initialPrebookState = { message: null, errors: {} };
    const [prebookState, prebookDispatch] = useActionState(prebookVehicle, initialPrebookState);
    const [isPrebookDialogOpen, setIsPrebookDialogOpen] = useState(false);

    useEffect(() => {
        if (inquiryState.message?.startsWith('Success')) {
          toast({
            title: 'Inquiry Sent!',
            description: inquiryState.message,
          });
        } else if (inquiryState.message?.startsWith('Error')) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: inquiryState.message,
          });
        }
    }, [inquiryState, toast]);

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

    const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
        const url = window.location.href;
        const text = `Check out this ${vehicle.make} ${vehicle.model} from LMC Motors!`;
        let shareUrl = '';

        if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        } else if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                toast({ title: 'Link Copied!', description: 'URL copied to your clipboard.' });
            });
            return;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card className="overflow-hidden">
            <div className="relative aspect-video w-full">
              <Image
                src={vehicle.imageUrl}
                alt={`Image of ${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Card>
        </div>
        <div className="md:col-span-2">
            <h1 className="mb-2 font-headline text-3xl font-bold md:text-4xl">
              {vehicle.make} {vehicle.model}
            </h1>
            <div className="mb-4 flex items-center gap-4">
                <p className="text-3xl font-bold text-primary">{formatPrice(vehicle.price)}</p>
            </div>
             <p className="prose max-w-none text-card-foreground mb-4">
                {vehicle.description}
              </p>
            <div className='flex items-center gap-4 mb-4'>
                <Dialog open={isPrebookDialogOpen} onOpenChange={setIsPrebookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg"><CalendarCheck className="mr-2 h-4 w-4" /> Pre-book Vehicle</Button>
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
                                <Label htmlFor="prebook-ingame-name">In-Game Name</Label>
                                <Input id="prebook-ingame-name" name="inGameName" placeholder="Your In-Game Name" required />
                                {prebookState.errors?.inGameName && <p className="text-sm text-destructive">{prebookState.errors.inGameName[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prebook-discord-id">Discord ID</Label>
                                <Input id="prebook-discord-id" name="discordId" placeholder="Your Discord ID" required />
                                {prebookState.errors?.discordId && <p className="text-sm text-destructive">{prebookState.errors.discordId[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prebook-ingame-number">In-Game Number</Label>
                                <Input id="prebook-ingame-number" name="inGameNumber" placeholder="Your In-Game Number" />
                                {prebookState.errors?.inGameNumber && <p className="text-sm text-destructive">{prebookState.errors.inGameNumber[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prebook-pickup-time">Pickup Time</Label>
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
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">Share:</p>
                <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}><Twitter className="h-5 w-5"/></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}><Facebook className="h-5 w-5"/></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('copy')}><LinkIcon className="h-5 w-5"/></Button>
            </div>
        </div>
      </div>
      <div className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Inquire about this vehicle</h3>
            <form action={inquiryDispatch}>
                <input type="hidden" name="vehicle" value={`${vehicle.make} ${vehicle.model}`} />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your Name" required />
                         {inquiryState.errors?.name && <p className="text-sm text-destructive">{inquiryState.errors.name[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Your Email" required />
                         {inquiryState.errors?.email && <p className="text-sm text-destructive">{inquiryState.errors.email[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" placeholder="I'm interested in this vehicle..." required />
                         {inquiryState.errors?.message && <p className="text-sm text-destructive">{inquiryState.errors.message[0]}</p>}
                    </div>
                    <SubmitButton label="Send Inquiry" icon={<Send className="mr-2 h-4 w-4" />} />
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
