
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, CarFront, GalleryHorizontal, LogOut, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/actions';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/vehicles', label: 'Vehicles', icon: CarFront },
  { href: '/gallery', label: 'LMC Gallery', icon: GalleryHorizontal },
];

function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" className="w-full justify-start gap-2 p-2 text-lg font-medium text-destructive hover:text-destructive">
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </form>
  )
}

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  const NavLinks = ({ className, linkClassName }: { className?: string, linkClassName?: (href: string) => string }) => (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            linkClassName ? linkClassName(link.href) : (pathname === link.href ? 'text-primary' : 'text-muted-foreground')
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 shadow-lg backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://cdn.discordapp.com/attachments/1083757528749453394/1422857574579048540/Image.png?ex=68df8461&is=68de32e1&hm=7bd06cd4f78b9a70ea985d10138054ee6ace83956e28657296e607620e6a0cb2&" alt="LMC Motors Logo" width={40} height={40} className="h-10 w-10" />
            <span className="hidden text-lg font-semibold sm:inline-block">LMC Motors</span>
          </Link>
          <div className="hidden md:flex">
             {!isLoginPage && <NavLinks />}
          </div>
        </div>
        
        <div className="hidden items-center gap-4 md:flex">
            {isClient && isAdminPage && !isLoginPage && (
               <form action={logout}>
                <Button type="submit" variant="outline">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </form>
            )}
        </div>

        <div className="flex items-center md:hidden">
          {!isLoginPage && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-8 flex flex-col gap-4">
                  {isClient && isAdminPage ? (
                    <>
                      <Link href="/admin/dashboard" className="flex items-center gap-2 rounded-md p-2 text-lg font-medium hover:bg-accent"><ShieldCheck className="h-5 w-5" />Dashboard</Link>
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 rounded-md p-2 text-lg font-medium hover:bg-accent"
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
