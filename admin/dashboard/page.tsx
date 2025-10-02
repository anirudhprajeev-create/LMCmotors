
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleManager from "@/components/admin/vehicle-manager";
import GalleryManager from "@/components/admin/gallery-manager";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manage your website content</p>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vehicles">Vehicle Inventory</TabsTrigger>
          <TabsTrigger value="gallery">Gallery Images</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles">
          <VehicleManager />
        </TabsContent>
        <TabsContent value="gallery">
          <GalleryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
