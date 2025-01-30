const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-[1200px] -z-10 overflow-hidden bg-black">
      {/* Base video overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.01) 0px,
            rgba(255, 255, 255, 0.01) 1px,
            transparent 1px,
            transparent 4px
          )`,
        }}
      />

      {/* Video container */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://player.vimeo.com/video/1051222940?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1&controls=0&muted=1"
          className="w-full h-full md:scale-[1.2] scale-[4] origin-center"
          allow="autoplay; fullscreen"
          style={{
            position: 'absolute',
            top: '-200px',
            left: 0,
            objectFit: 'cover',
            opacity: '0.75',
            filter: 'grayscale(100%) brightness(30%)',
            transformOrigin: 'center center',
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;