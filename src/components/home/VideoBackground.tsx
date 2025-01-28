const VideoBackground = () => {
  return (
    <div className="fixed inset-0 -mt-8 -mb-12 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10 bg-[radial-gradient(rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[length:4px_4px]"></div>
      <iframe
        src="https://player.vimeo.com/video/1051211621?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
        className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] absolute"
        allow="autoplay; fullscreen"
        loading="eager"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '120%',
          minHeight: '120%',
          width: 'auto',
          height: 'auto',
        }}
      />
    </div>
  );
};

export default VideoBackground;