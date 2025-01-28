import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay for better text visibility */}
      <iframe
        src="https://player.vimeo.com/video/1051211621?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1"
        className="absolute top-50% left-50% min-w-full min-h-full w-auto h-auto object-cover"
        style={{
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Background Video"
      />
    </div>
  );
};

export default VideoBackground;