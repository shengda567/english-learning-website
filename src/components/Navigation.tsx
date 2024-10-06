'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Study', href: '/study', icon: BookOpen },
    { name: 'Learned', href: '/learned', icon: GraduationCap },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-16 bg-gray-800 flex flex-col items-center py-4">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link 
            key={item.name}
            href={item.href}
            className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${
              pathname === item.href ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <IconComponent size={24} />
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;