import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle2 } from 'lucide-react';

export const BrandVideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="w-full relative overflow-hidden bg-black py-0">
      {/* Full-width Built-in Video Experience */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[700px] flex items-center justify-center bg-black group">
        <video
          ref={videoRef}
          src="/videos/Brand_images_forming_mosaic_logo_20261024114503.mp4"
          playsInline
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          onClick={togglePlay}
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Big Center Play/Pause button on Pause */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E3A92F] text-[#073B35] shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-30"
            aria-label="تشغيل الفيديو"
          >
            <Play className="w-8 h-8 fill-current ms-1" />
          </button>
        )}

        {/* Bottom Floating Minimal Bar */}
        <div className="absolute bottom-5 inset-x-6 sm:inset-x-12 z-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer text-white"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer text-white"
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-xs sm:text-sm font-bold text-white/90 hidden sm:inline-block ms-1">
              أسرار وتفاصيل الطباعة والتطريز المباشر
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFullscreen}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer text-white"
              title="شاشة كاملة"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Built-in Highlights Full Width Ribbon */}
      <div className="bg-[#052925] border-t border-emerald-900/40 py-3.5 px-6 sm:px-12 text-xs">
        <div className="container mx-auto flex flex-wrap items-center justify-around gap-4 text-emerald-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E3A92F] shrink-0" />
            <span className="font-bold">أحدث ماكينات التطريز والطباعة الرقمية</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E3A92F] shrink-0" />
            <span className="font-bold">فحص جودة يدوي دقيق لكل قطعة قبل التسليم</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E3A92F] shrink-0" />
            <span className="font-bold">استلام من مقر أسوان أو شحن سريع لجميع المحافظات</span>
          </div>
        </div>
      </div>
    </section>
  );
};
