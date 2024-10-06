import Image from 'next/image';

const TopNav = () => {
  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Image src="/tiktok-logo.png" alt="TikTok Logo" width={28} height={28} />
        <h1 className="ml-2 text-lg font-bold">EnglishTok</h1>
      </div>
      <div className="flex-1 max-w-2xl mx-6">
        <input 
          type="text" 
          placeholder="Search"
          className="w-full px-3 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <button className="bg-red-500 text-white px-4 py-1.5 text-sm rounded-full hover:bg-red-600 transition">
        Log in
      </button>
    </nav>
  );
};

export default TopNav;