const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-black">
      {/* Base video overlay */}
      <div className="absolute inset-0 bg-black/95" />
      
      {/* Paper texture overlay using repeating gradients */}
      <div 
        className="absolute inset-0 bg-transparent" 
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.01) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.01) 1px,
              transparent 1px
            ),
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.02) 4px,
              transparent 4px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.02) 4px,
              transparent 4px
            )
          `,
          backgroundSize: '15px 15px, 15px 15px, 90px 90px, 90px 90px',
          opacity: 0.15,
        }}
      />
      
      {/* Map-like navigation grid */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.015) 0px,
              rgba(255, 255, 255, 0.015) 1px,
              transparent 1px,
              transparent 4px
            )
          `,
          backgroundSize: '8px 8px',
          opacity: 0.2,
        }}
      />

      {/* Paper texture noise */}
      <div 
        className="absolute inset-0"
        style={{
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }}
      />

      {/* Top vignette */}
      <div 
        className="absolute top-0 left-0 w-full h-16 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)'
        }}
      />

      {/* Bottom vignette */}
      <div 
        className="absolute bottom-0 left-0 w-full h-48 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) -30%, transparent 100%)'
        }}
      />

      {/* Video iframe */}
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