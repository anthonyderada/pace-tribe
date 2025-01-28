const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="relative w-full h-full">
        <iframe
          src="https://player.vimeo.com/video/1051211621?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1"
          allow="autoplay; fullscreen"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;