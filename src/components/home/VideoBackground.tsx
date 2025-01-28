import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text visibility */}
      <iframe
        src="https://player.vimeo.com/video/1051222940?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1"
        className="w-[100vw] h-[100vh] object-cover scale-[1.02]"
        frameBorder="0"
        allow="autoplay; fullscreen"
        loading="eager"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
        }}
      />
    </div>
  );
};

export default VideoBackground;