
import { Card, CardContent } from "@/components/ui/card";
import { fetchGalleryImages } from "@/lib/data";
import Image from "next/image";

export default async function GalleryPage() {
    const images = await fetchGalleryImages();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="font-headline text-4xl font-bold md:text-5xl">LMC Gallery</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    A glimpse into our team and work culture at LMC Motors.
                </p>
            </div>
            <div className="mt-12">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {images.map((image) => (
                        <Card key={image.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-video">
                                    <Image 
                                        src={image.imageUrl} 
                                        alt={image.description}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={image.imageHint}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
