const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="relative w-full h-full">
        <iframe
          src="https://player.vimeo.com/video/1051211621?background=1&autoplay=1&loop=1&byline=0&title=0&transparent=1&controls=0"
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
          }}
        />
      </div>
    </div>
  );
};

export default VideoBackground;