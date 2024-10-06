import { Home, Book, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-20 bg-white shadow-md flex flex-col items-center py-4 space-y-8">
      <Link href="/" className="flex flex-col items-center">
        <Home size={28} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link href="/learned" className="flex flex-col items-center">
        <GraduationCap size={28} />
        <span className="text-xs mt-1">Learned</span>
      </Link>
      {/* Add other navigation items as needed */}
    </aside>
  );
};

export default Sidebar;