import Image from 'next/image';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Weather.io" width={40} height={40} />
        <h1 className="text-2xl font-bold">Weather.io</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">Help</Button>
        <Button>Sign Out</Button>
      </div>
    </nav>
  );
}
