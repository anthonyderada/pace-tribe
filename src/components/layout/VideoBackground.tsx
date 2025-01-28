const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black/95" />
      <div 
        className="absolute inset-0 bg-transparent" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: '7px 7px',
          opacity: 0.15,
        }}
      />
      {/* Top vignette */}
      <div 
        className="absolute top-0 left-0 w-full h-48 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)'
        }}
      />
      {/* Bottom vignette */}
      <div 
        className="absolute bottom-0 left-0 w-full h-48 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
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
            opacity: '0.75',
            filter: 'grayscale(100%) brightness(30%)',
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;