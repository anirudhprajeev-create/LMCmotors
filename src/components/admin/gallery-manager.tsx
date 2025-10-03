
'use client';
import { useState, useEffect } from 'react';
import type { GalleryImage } from '@/lib/types';
import { Button } from '../ui/button';
import { PlusCircle, Trash2, Loader2, ServerCrash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
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
import { useToast } from '@/hooks/use-toast';
import { fetchGalleryImages, addGalleryImage, deleteGalleryImage } from '@/lib/data';

function GalleryImageForm({ onFormSubmit }: { onFormSubmit: () => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const imageData = {
            description: formData.get('description') as string,
            imageUrl: formData.get('imageUrl') as string,
            imageHint: formData.get('imageHint') as string,
        };

        try {
            await addGalleryImage(imageData);
            toast({ title: 'Success!', description: 'Image added to gallery.' });
            setIsOpen(false);
            onFormSubmit();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error Adding Image', description: error.message });
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Image</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                 <DialogHeader>
                    <DialogTitle>Add New Gallery Image</DialogTitle>
                    <DialogDescription>
                        Fill out the form to add a new image to the gallery.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" name="description" required /></div>
                    <div className="space-y-2"><Label htmlFor="imageUrl">Image URL</Label><Input id="imageUrl" name="imageUrl" required /></div>
                    <div className="space-y-2"><Label htmlFor="imageHint">Image Hint (e.g. 'team photo')</Label><Input id="imageHint" name="imageHint" required /></div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Add Image</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteImageDialog({ imageId, onDeleted }: { imageId: string, onDeleted: () => void }) {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteGalleryImage(imageId);
            toast({ title: 'Success!', description: 'Image deleted successfully.' });
            onDeleted();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error Deleting Image', description: error.message });
        }
    };
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="absolute right-2 top-2 z-10 opacity-80 hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the image from your gallery.
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


export default function GalleryManager() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const refreshData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchGalleryImages();
            setImages(data);
        } catch (err: any) {
            setError("Could not load gallery images. Please check your connection and permissions.");
            console.error(err);
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
                <p className="ml-4 text-lg">Loading Gallery Data...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="flex justify-center py-8">
                <Alert variant="destructive" className="max-w-md text-center">
                     <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Failed to Load Gallery</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex justify-end mb-4">
                <GalleryImageForm onFormSubmit={refreshData} />
            </div>
            {images.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {images.map((image) => (
                        <Card key={image.id} className="overflow-hidden relative group">
                            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DeleteImageDialog imageId={image.id} onDeleted={refreshData} />
                            </div>
                            <CardContent className="p-0">
                                <div className="relative aspect-video">
                                    <Image 
                                        src={image.imageUrl} 
                                        alt={image.description}
                                        fill
                                        className="object-cover w-full h-full"
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-medium">No Images in Gallery</h3>
                    <p className="text-muted-foreground mt-2">Click "Add New Image" to get started.</p>
                </div>
            )}
        </div>
    );
}
