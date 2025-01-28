const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/80" /> {/* Reduced dark overlay opacity from 90% to 80% */}
      <div 
        className="absolute inset-0 bg-black opacity-60" 
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.7) 4px, transparent 4px)', // Keeping dot size at 4px
          backgroundSize: '8px 8px' // Keeping spacing at 8px
        }}
      /> {/* Reduced dotted pattern opacity from 70% to 60% */}
      <div className="relative w-full h-full">
        <iframe
          src="https://player.vimeo.com/video/1051222940?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1&controls=0&muted=1"
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            aspectRatio: '16/9',
            opacity: '0.2', // Increased video opacity from 15% to 20%
            filter: 'grayscale(100%) brightness(40%)', // Increased brightness from 30% to 40%
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;