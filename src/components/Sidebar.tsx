import { Home, Compass, Users, Video, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-20 bg-white shadow-md flex flex-col items-center py-4 space-y-8">
      <div className="flex flex-col items-center">
        <Home size={28} />
        <span className="text-xs mt-1">For You</span>
      </div>
      <div className="flex flex-col items-center">
        <Compass size={28} />
        <span className="text-xs mt-1">Explore</span>
      </div>
      <div className="flex flex-col items-center">
        <Users size={28} />
        <span className="text-xs mt-1">Following</span>
      </div>
      <div className="flex flex-col items-center">
        <Video size={28} />
        <span className="text-xs mt-1">LIVE</span>
      </div>
      <div className="flex flex-col items-center">
        <User size={28} />
        <span className="text-xs mt-1">Profile</span>
      </div>
    </aside>
  );
};

export default Sidebar;