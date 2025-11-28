import React from 'react';

const UserAvatar = ({ avatarId, size = 'md', className = '' }) => {
  // Use DiceBear API for "Face" avatars (Notionists style)
  // We use the avatarId as the 'seed' to ensure the face is always the same for that ID
  const seed = avatarId || 'student';
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=e0e7ff,fae8ff,dbeafe,ffedd5&backgroundType=gradientLinear`;

  // Tailwind size mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative rounded-full overflow-hidden border border-gray-100 bg-white ${sizeClasses[size]} ${className}`}>
      <img 
        src={avatarUrl} 
        alt="User Avatar" 
        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
};

export default UserAvatar;
