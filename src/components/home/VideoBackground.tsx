const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay for better text visibility */}
      <iframe
        src="https://player.vimeo.com/video/1051222940?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
        className="w-full h-full scale-[1.5]"
        allow="autoplay; fullscreen"
        loading="eager"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
      />
    </div>
  );
};

export default VideoBackground;