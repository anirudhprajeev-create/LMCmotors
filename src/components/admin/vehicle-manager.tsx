
'use client';
import { useState, useEffect } from 'react';
import type { Vehicle, VehicleType } from '@/lib/types';
import { Button } from '../ui/button';
import { PlusCircle, Edit, Trash2, Loader2, ServerCrash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/lib/data';

const vehicleTypes: VehicleType[] = ['Sedan', 'Sports', 'SUV', 'Coupe', 'Off-road', 'Supercars', 'Limited', 'S', 'A', 'B', 'C', 'In-game'];

function VehicleForm({ vehicle, onFormSubmit }: { vehicle?: Vehicle | null, onFormSubmit: () => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const imageUrl = formData.get('imageUrl') as string;
        if (!imageUrl) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please add an image URL.' });
            return;
        }

        const data: any = {
            make: formData.get('make'),
            model: formData.get('model'),
            price: Number(formData.get('price')),
            type: formData.get('type'),
            description: formData.get('description'),
            imageUrl: imageUrl,
        };
        
        try {
            if (vehicle) {
                await updateVehicle(vehicle.id, data);
                toast({ title: 'Success!', description: 'Vehicle updated successfully.' });
            } else {
                await createVehicle(data);
                toast({ title: 'Success!', description: 'Vehicle added successfully.' });
            }
            setIsOpen(false);
            onFormSubmit();
        } catch(error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {vehicle ? (
                     <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                ) : (
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Vehicle</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                 <DialogHeader>
                    <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
                    <DialogDescription>
                        {vehicle ? 'Update the details for this vehicle.' : 'Fill out the form to add a new vehicle to the inventory.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-1">
                    {/* Form fields */}
                    <div className="space-y-2"><Label>Make</Label><Input name="make" defaultValue={vehicle?.make} required /></div>
                    <div className="space-y-2"><Label>Model</Label><Input name="model" defaultValue={vehicle?.model} required /></div>
                    <div className="space-y-2"><Label>Price</Label><Input name="price" type="number" defaultValue={vehicle?.price} required /></div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select name="type" defaultValue={vehicle?.type} required>
                            <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                            <SelectContent>
                                {vehicleTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2"><Label>Image URL</Label><Input name="imageUrl" defaultValue={vehicle?.imageUrl} placeholder="https://..." required /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea name="description" defaultValue={vehicle?.description} required /></div>
                    
                    <DialogFooter className="pt-4">
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">{vehicle ? 'Save Changes' : 'Add Vehicle'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteVehicleDialog({ vehicleId, onDeleted }: { vehicleId: number, onDeleted: () => void }) {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteVehicle(vehicleId);
            toast({ title: 'Success!', description: 'Vehicle deleted successfully.' });
            onDeleted();
        } catch(error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the vehicle from your inventory.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function VehicleManager() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchVehicles();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message || "Could not load vehicle data.");
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        refreshData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Loading Vehicle Data...</p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="flex justify-center py-8">
                <Alert variant="destructive" className="max-w-md text-center">
                     <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Failed to Load Vehicles</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }


    return (
        <div className="mt-6">
            <div className="flex justify-end mb-4">
                <VehicleForm onFormSubmit={refreshData} />
            </div>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.map(vehicle => (
                            <TableRow key={vehicle.id}>
                                <TableCell>{vehicle.id}</TableCell>
                                <TableCell className="font-medium">{vehicle.make} {vehicle.model}</TableCell>
                                <TableCell>{vehicle.type}</TableCell>
                                <TableCell>{formatPrice(vehicle.price)}</TableCell>
                                <TableCell className="text-right">
                                    <VehicleForm vehicle={vehicle} onFormSubmit={refreshData} />
                                    <DeleteVehicleDialog vehicleId={vehicle.id} onDeleted={refreshData} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
