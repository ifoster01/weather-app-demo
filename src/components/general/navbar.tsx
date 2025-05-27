import Image from 'next/image';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function Navbar() {
  return (
    <nav className="p-4 max-w-6xl mx-auto">
      {/* Desktop Navbar - visible on md screens and up */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Weather.io" width={40} height={40} />
          <h1 className="text-2xl font-bold">Weather.io</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Help</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p>This button doesn&apos;t currently work.</p>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button>Sign Out</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p>This button doesn&apos;t currently work.</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Mobile Navbar - visible below md screens */}
      <div className="md:hidden flex justify-between items-center">
        {/* Logo and Title on the left for mobile */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Weather.io" width={32} height={32} />
          <h1 className="text-xl font-bold">Weather.io</h1>
        </div>

        {/* Drawer on the right for mobile */}
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" className="p-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="fixed top-0 right-0 h-full w-[250px] mt-0 rounded-none bg-background z-50">
            <DrawerHeader className="p-4 border-b">
              <DrawerTitle className="flex items-center gap-2 text-lg">
                <Image
                  src="/logo.svg"
                  alt="Weather.io"
                  width={28}
                  height={28}
                />
                <span>Weather.io</span>
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    Help
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>This button doesn&apos;t currently work.</p>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full justify-start text-left">
                    Sign Out
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>This button doesn&apos;t currently work.</p>
                </PopoverContent>
              </Popover>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
