
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useActionState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vehicleRecommendations, VehicleRecommendationsOutput } from '@/ai/flows/ai-powered-vehicle-recommendations';
import { prebookVehicle } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CalendarCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatPrice } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';
import { Label } from './ui/label';
import { timeSlots } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import type { VehicleType } from '@/lib/types';

const vehicleTypes: VehicleType[] = ['Sedan', 'Sports', 'SUV', 'Coupe', 'Off-road', 'Supercars', 'Limited', 'S', 'A', 'B', 'C', 'In-game'];
// Create a Zod enum from the array
const vehicleTypeEnum = z.enum(vehicleTypes as [string, ...string[]]);

const formSchema = z.object({
  budget: z.coerce.number().min(1000, "Budget must be at least $1,000"),
  type: vehicleTypeEnum,
});

function PrebookDialog({ model, price }: { model: string, price: number }) {
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
    <Dialog open={isPrebookDialogOpen} onOpenChange={setIsPrebookDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><CalendarCheck className="mr-2 h-4 w-4" /> Pre-book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pre-book this Vehicle</DialogTitle>
          <DialogDescription>
            Secure your chance to own the {model}. Fill out the form below.
          </DialogDescription>
        </DialogHeader>
        <form action={prebookDispatch}>
            <input type="hidden" name="vehicle" value={model} />
            <input type="hidden" name="price" value={price} />
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
  )
}

export default function FinderForm() {
  const [recommendations, setRecommendations] = useState<VehicleRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 25000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await vehicleRecommendations(values);
      setRecommendations(result);
    } catch (e) {
      setError('An error occurred while getting recommendations. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-64">
                          {vehicleTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Finding your perfect match...</p>
              <p className="text-sm text-muted-foreground">Our AI is analyzing your preferences.</p>
            </div>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {recommendations && (
          <div>
            <h3 className="mb-4 text-2xl font-bold">AI Recommendations</h3>
            <div className="space-y-4">
            {recommendations.recommendations.length > 0 ? (
                recommendations.recommendations.map((rec, index) => (
                    <Card key={index} className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-lg">{rec.model}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <p className="font-semibold text-primary">{formatPrice(rec.price)}</p>
                                </div>
                                <PrebookDialog model={rec.model} price={rec.price} />
                            </div>
                            <Separator className="my-2" />
                            <p className="text-sm">{rec.description}</p>
                        </CardContent>
                    </Card>
                ))
             ) : (
                <p>No recommendations found matching your criteria.</p>
             )}
            </div>
          </div>
        )}
        {!isLoading && !recommendations && !error && (
             <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-lg font-medium">Your results will appear here</p>                    <p className="text-sm text-muted-foreground">Fill out the form to get started.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
