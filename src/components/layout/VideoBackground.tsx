const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/80" />
      <div 
        className="absolute inset-0 bg-black opacity-95" 
        style={{
          backgroundImage: 'radial-gradient(rgb(0, 0, 0) 8px, transparent 8px)', // Pure black dots
          backgroundSize: '24px 24px', // Grid spacing
          filter: 'contrast(150%)', // Increased contrast to make dots more visible
        }}
      />
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
            opacity: '0.5',
            filter: 'grayscale(100%) brightness(40%)',
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;