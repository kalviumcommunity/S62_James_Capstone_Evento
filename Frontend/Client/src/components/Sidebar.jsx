// import React from 'react';
// import { Search, Star, Users, MessageCircle, User, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { SignOutButton } from '@clerk/clerk-react';


// const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();

//   const navigationItems = [
//     { id: 'discover', label: 'Discover Events', icon: Search },
//     // { id: 'curated', label: 'For You', icon: Star },
//     // { id: 'friends', label: 'Friends Activity', icon: Users },
//     // { id: 'community', label: 'Community', icon: MessageCircle }
//   ];

//   const handleProfileClick = () => {
//     navigate("/signIn");
//   };

//   return (
//     <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 lg:z-auto`}>
//       <div className="flex items-center justify-between p-6 border-b">
//         <h1 className="text-2xl font-bold text-purple-600">Evento</h1>
//         <button 
//           onClick={() => setSidebarOpen(false)}
//           className="lg:hidden hover:bg-gray-100 p-1 rounded-md transition-colors"
//         >
//           <X className="w-6 h-6" />
//         </button>
//       </div>
      
//       <nav className="mt-6">
//         <div className="px-6 mb-4">
//           <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h2>
//         </div>
        
//         {navigationItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => {
//               setActiveTab(item.id);
//               setSidebarOpen(false);
//             }}
//             className={`w-full flex items-center px-6 py-3 text-left hover:bg-purple-50 transition-colors ${
//               activeTab === item.id 
//                 ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600' 
//                 : 'text-gray-700 hover:text-purple-600'
//             }`}
//           >
//             <item.icon className="w-5 h-5 mr-3" />
//             {item.label}
//           </button>
//         ))}
//       </nav>
      
//       <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
//         <div 
//           onClick={handleProfileClick}
//           className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
//         >
//           <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//             <User className="w-5 h-5 text-purple-600" />
//           </div>
//           <div>
//             <p className="font-medium text-gray-800">James R Jacob</p>
//             <p className="text-sm text-gray-500">Christ University</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import React from 'react';
import { Search, Star, Users, MessageCircle, User, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'discover', label: 'Discover Events', icon: Search },
    // { id: 'curated', label: 'For You', icon: Star },
    // { id: 'friends', label: 'Friends Activity', icon: Users },
    // { id: 'community', label: 'Community', icon: MessageCircle }
  ];

  const handleProfileClick = () => {
    navigate("/signIn");
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 lg:z-auto`}>
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold text-purple-600">Evento</h1>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden hover:bg-gray-100 p-1 rounded-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h2>
        </div>
        
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-purple-50 transition-colors ${
              activeTab === item.id 
                ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600' 
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="px-6 mt-6">
        <SignOutButton>
          <button className="flex items-center w-full text-left text-red-600 hover:text-red-800 font-medium">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </SignOutButton>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
        <div 
          onClick={handleProfileClick}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">James R Jacob</p>
            <p className="text-sm text-gray-500">Christ University</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
