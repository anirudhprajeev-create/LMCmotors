
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from '@/components/ui/icons';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const [isAdminVisible, setIsAdminVisible] = useState(true);

  useEffect(() => {
    // This logic ensures the admin link is not shown on admin pages.
    if (pathname.startsWith('/admin')) {
      setIsAdminVisible(false);
    } else {
      setIsAdminVisible(true);
    }
  }, [pathname]);


  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24">
              <Image 
                src="https://cdn.discordapp.com/attachments/1083757528749453394/1422857574579048540/Image.png?ex=68df8461&is=68de32e1&hm=7bd06cd4f78b9a70ea985d10138054ee6ace83956e28657296e607620e6a0cb2&" 
                alt="LMC Motors Logo" 
                fill
                className="object-contain" 
              />
            </div>
            <div className="relative h-24 w-24">
              <Image 
                src="https://cdn.discordapp.com/attachments/1233726185243021382/1422828741922390016/image.png?ex=68df6986&is=68de1806&hm=eb0e8c13d3b40a501172b00b8183d448540f4f62ea4b9aa5534f061606bccc6c&" 
                alt="Second Logo" 
                fill
                className="object-contain" 
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-foreground/80 [text-shadow:0_1px_2px_var(--tw-shadow-color)] shadow-black/50">
              © LMC Group since 2022
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">developed by MIST LMC</p>
                {isAdminVisible && <Link href="/admin/login" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Admin</Link>}
             </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://discord.gg/YNvTVA5p" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <DiscordIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
