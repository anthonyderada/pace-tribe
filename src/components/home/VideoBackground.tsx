import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text visibility */}
      <iframe
        src="https://player.vimeo.com/video/1051211621?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
        className="absolute top-50% left-50% min-w-[100vw] min-h-[100vh] w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        allow="autoplay; fullscreen"
        loading="eager"
        style={{ 
          width: '177.77777778vh',
          height: '56.25vw',
        }}
      />
    </div>
  );
};

export default VideoBackground;