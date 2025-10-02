import FinderForm from '@/components/finder-form';

export default function FinderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">AI-Powered Vehicle Finder</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us what you're looking for, and our smart assistant will find the best options from our inventory.
        </p>
      </div>
      <div className="mt-12">
        <FinderForm />
      </div>
    </div>
  );
}
