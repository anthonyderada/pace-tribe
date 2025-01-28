import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text visibility */}
      <iframe
        src="https://player.vimeo.com/video/1051211621?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1"
        className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[100vw] min-h-[100vh]"
        allow="autoplay; fullscreen"
        frameBorder="0"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default VideoBackground;