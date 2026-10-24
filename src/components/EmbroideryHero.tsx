import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type ProductOption = 'tshirt' | 'totebag' | 'hoodie';
type ShapeOption = 'words' | 'shapes' | 'image' | 'flower';
type ColorOption = 'white' | 'black' | 'green';

export const EmbroideryHero: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductOption>('tshirt');
  const [selectedShape, setSelectedShape] = useState<ShapeOption>('image');
  const [selectedColor, setSelectedColor] = useState<ColorOption>('black');

  const productsList = [
    {
      id: 'tshirt' as ProductOption,
      num: '01',
      title: 'تيشيرت عادي',
      serviceQuery: 'clothing-hoodies',
    },
    {
      id: 'totebag' as ProductOption,
      num: '02',
      title: 'شنطة توت باج بسوستة',
      serviceQuery: 'stickers-labels',
    },
    {
      id: 'hoodie' as ProductOption,
      num: '03',
      title: 'هودي ميلتون أوفر سايز',
      serviceQuery: 'clothing-hoodies',
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-72px)] lg:max-h-[820px] flex flex-col justify-center py-2 sm:py-3 lg:py-4 bg-[#F6F1E7] text-[#073B35] select-none border-b border-[#d9d2c3]/70">
      {/* Subtle Warm Paper Dot Texture */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0B5F55 1.5px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-1/4 -start-24 w-80 h-80 bg-[#0B5F55]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 -end-24 w-80 h-80 bg-[#E3A92F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1080px] xl:max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-between my-auto">
        
        {/* ─────────────────────────────────────────────────────────────
            1. Top Header Area (Compact & Grand with Twin Symmetrical Feathers)
        ───────────────────────────────────────────────────────────── */}
        <div className="text-center max-w-4xl mx-auto space-y-1.5 mb-3 sm:mb-4 lg:mb-5">
          {/* Eyebrow Kicker Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0B5F55]/10 border border-[#0B5F55]/20 text-[#0B5F55] text-xs sm:text-sm font-black tracking-wide shadow-2xs">
            <span>أفكارك، مطبوعة في أسوان.</span>
          </div>

          {/* Main Headline flanked by Symmetrical Two Feathers */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-4 pt-1">
            <h1 className="text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#073B35] font-display flex items-center justify-center gap-1.5 sm:gap-4 leading-tight">
              {/* Right Feather in RTL */}
              <img
                src="/feather-logo-green.png"
                alt="ريشة يوزرسيف"
                className="h-[22px] sm:h-[45px] lg:h-[55px] w-auto object-contain inline-block shrink-0 drop-shadow-xs"
              />

              <span className="flex items-center justify-center gap-1.5 sm:gap-3 whitespace-nowrap">
                <span>خلّيك مختلف،</span>
                <span className="text-[#0B5F55]">خلّيك يوزرسيف.</span>
              </span>

              {/* Left Feather in RTL (mirrored) */}
              <img
                src="/feather-logo-green.png"
                alt="ريشة يوزرسيف"
                className="h-[22px] sm:h-[45px] lg:h-[55px] w-auto object-contain inline-block shrink-0 scale-x-[-1] drop-shadow-xs"
              />
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-[#4d6560] font-bold max-w-xl sm:max-w-2xl mx-auto leading-relaxed pt-0.5 px-3">
            رسمة بتحبها، كلمة بتعبّر عنك، حوّل فكرتك لحاجة تستخدمها كل يوم.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. Interactive Studio Stage (3 Columns: Viewport-Balanced)
        ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 w-full">
          
          {/* ═══════════════════════════════════════════════════════════
              COLUMN 1 (Right in RTL): Design Controls (جرّب شكل يعجبك)
          ═══════════════════════════════════════════════════════════ */}
          <div className="w-full max-w-[240px] sm:max-w-[250px] flex flex-col items-center lg:items-start order-2 lg:order-1 space-y-4">
            {/* Tool Category Label & 3 Option Buttons */}
            <div className="w-full">
              <span className="block text-sm sm:text-base font-black text-[#073B35] mb-2 sm:mb-2.5 text-center lg:text-start">
                جرّب شكل يعجبك
              </span>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                {/* 1. Words / Logo Button */}
                <button
                  onClick={() => setSelectedShape('words')}
                  className={`flex flex-col items-center justify-center p-2.5 sm:py-3.5 sm:px-1.5 min-h-[72px] sm:min-h-[76px] rounded-2xl border-[2.5px] border-[#073B35] transition-all cursor-pointer ${
                    selectedShape === 'words'
                      ? 'bg-[#0B5F55] text-white shadow-[4px_4px_0px_#073B35]'
                      : 'bg-white text-[#073B35] shadow-[4px_4px_0px_#073B35] hover:bg-[#F6F1E7]'
                  }`}
                  title="طباعة شعار يوزرسيف الرسمي"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                  </svg>
                  <span className="text-xs sm:text-sm font-black">الشعار</span>
                </button>

                {/* 2. Image Button (was أشكال) */}
                <button
                  onClick={() => setSelectedShape('image')}
                  className={`flex flex-col items-center justify-center p-2.5 sm:py-3.5 sm:px-1.5 min-h-[72px] sm:min-h-[76px] rounded-2xl border-[2.5px] border-[#073B35] transition-all cursor-pointer ${
                    selectedShape === 'image' || selectedShape === 'shapes'
                      ? 'bg-[#0B5F55] text-white shadow-[4px_4px_0px_#073B35]'
                      : 'bg-white text-[#073B35] shadow-[4px_4px_0px_#073B35] hover:bg-[#F6F1E7]'
                  }`}
                  title="تصميم صورة فنية"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-xs sm:text-sm font-black">صورة</span>
                </button>

                {/* 3. Flower / Pattern Button */}
                <button
                  onClick={() => setSelectedShape('flower')}
                  className={`flex flex-col items-center justify-center p-2.5 sm:py-3.5 sm:px-1.5 min-h-[72px] sm:min-h-[76px] rounded-2xl border-[2.5px] border-[#073B35] transition-all cursor-pointer ${
                    selectedShape === 'flower'
                      ? 'bg-[#0B5F55] text-white shadow-[4px_4px_0px_#073B35]'
                      : 'bg-white text-[#073B35] shadow-[4px_4px_0px_#073B35] hover:bg-[#F6F1E7]'
                  }`}
                  title="تصميم رسمة ووردة"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                    <path d="M12 22a4 4 0 0 0 4-4v-1a4 4 0 0 0-8 0v1a4 4 0 0 0 4 4z" />
                    <path d="M2 12a4 4 0 0 0 4 4h1a4 4 0 0 0 0-8H6a4 4 0 0 0-4 4z" />
                    <path d="M22 12a4 4 0 0 0-4-4h-1a4 4 0 0 0 0 8h1a4 4 0 0 0 4-4z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-black">وردة</span>
                </button>
              </div>
            </div>

            {/* Color Swatch Picker */}
            <div className="w-full">
              <span className="block text-sm sm:text-base font-black text-[#073B35] mb-2 sm:mb-2.5 text-center lg:text-start">
                اختار لونك
              </span>
              <div className="flex items-center gap-3 sm:gap-3.5 justify-center lg:justify-start">
                {/* White Swatch (Far right in RTL) */}
                <button
                  onClick={() => setSelectedColor('white')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-[2.5px] border-[#073B35] transition-all cursor-pointer ${
                    selectedColor === 'white'
                      ? 'ring-[3px] ring-offset-2 ring-[#0B5F55] shadow-md'
                      : 'hover:scale-105 opacity-90'
                  }`}
                  aria-label="اللون الأبيض"
                />

                {/* Black Swatch (Middle) */}
                <button
                  onClick={() => setSelectedColor('black')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111817] border-[2.5px] border-[#073B35] transition-all cursor-pointer ${
                    selectedColor === 'black'
                      ? 'ring-[3px] ring-offset-2 ring-[#0B5F55] shadow-md'
                      : 'hover:scale-105 opacity-90'
                  }`}
                  aria-label="اللون الأسود الداكن"
                />

                {/* Brand Green Swatch (Left in RTL) */}
                <button
                  onClick={() => setSelectedColor('green')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B5F55] border-[2.5px] border-[#073B35] transition-all cursor-pointer ${
                    selectedColor === 'green'
                      ? 'ring-[3px] ring-offset-2 ring-[#0B5F55] shadow-md'
                      : 'hover:scale-105 opacity-90'
                  }`}
                  aria-label="أخضر يوزرسيف"
                />
              </div>
            </div>

            {/* Action Button (خلّيه بتصميمك ↙) */}
            <div className="w-full pt-1">
              <Link to={`/request?service=${selectedProduct === 'totebag' ? 'stickers-labels' : 'clothing-hoodies'}`} className="block w-full">
                <button className="w-full bg-[#E3A92F] hover:bg-[#d89c25] active:translate-x-0.5 active:translate-y-0.5 text-[#073B35] font-black text-base sm:text-lg py-3 sm:py-3.5 px-5 rounded-2xl border-[2.5px] border-[#073B35] shadow-[4px_4px_0px_#073B35] transition-all cursor-pointer flex items-center justify-center gap-3">
                  <span>خلّيه بتصميمك</span>
                  <svg className="w-5 h-5 text-[#073B35] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" y1="7" x2="7" y2="17" />
                    <polyline points="17 17 7 17 7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              COLUMN 2 (Center): Product Mockup Stage with Realistic Embedded Print
          ═══════════════════════════════════════════════════════════ */}
          <div className="flex-1 flex items-center justify-center relative order-1 lg:order-2 min-h-[320px] sm:min-h-[380px] lg:min-h-[440px]">
            {/* Circular Orbit Ring */}
            <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[440px] lg:h-[440px] xl:w-[460px] xl:h-[460px] rounded-full border border-[#0B5F55]/20 pointer-events-none" />

            {/* Mockup Canvas */}
            <div className="relative w-80 sm:w-[380px] lg:w-[420px] h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center transition-all duration-300">
              
              {/* Product 1: T-Shirt */}
              {selectedProduct === 'tshirt' && (
                <div className="relative w-full h-full flex items-center justify-center scale-120 sm:scale-125 lg:scale-130 animate-in fade-in zoom-in-95 duration-200">
                  <img
                    src={
                      selectedColor === 'white'
                        ? '/products/tshirt-white-front-trans.png'
                        : selectedColor === 'green'
                        ? '/products/tshirt-green-front.png'
                        : '/products/tshirt-black-front-trans.png'
                    }
                    alt="تيشيرت مخصص"
                    className="w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(7,59,53,0.18)]"
                  />

                  {/* Dynamic Chest Print Area (Embedded & Stuck Naturally to Fabric) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-4 sm:-translate-y-6">
                    {/* Official Brand Calligraphy Logo (scaled an additional 10% smaller to fit the shirt chest) */}
                    {selectedShape === 'words' && (
                      <div className="flex items-center justify-center select-none w-[86px] sm:w-[110px] lg:w-[122px] transition-all">
                        <img
                          src={selectedColor === 'white' ? '/logo/logo-green.png' : '/logo/logo-white.png'}
                          alt="لوجو يوزرسيف الرسمي"
                          className={`w-full h-auto object-contain ${
                            selectedColor === 'white'
                              ? 'mix-blend-multiply opacity-90 contrast-110 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]'
                              : 'opacity-95 contrast-105 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                          }`}
                        />
                      </div>
                    )}

                    {/* Custom Image Print (Starry Night on T-shirt) */}
                    {(selectedShape === 'image' || selectedShape === 'shapes') && (
                      <div className="flex items-center justify-center select-none w-20 sm:w-24 lg:w-28 transition-all">
                        <div className="rounded-sm overflow-hidden shadow-md border border-black/20">
                          <img
                            src="/products/starry-night.jpg"
                            alt="لوحة فنية على التيشيرت"
                            className="w-full h-auto object-contain block drop-shadow-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Flower Graphic */}
                    {selectedShape === 'flower' && (
                      <div className="flex flex-col items-center justify-center select-none scale-100 sm:scale-110">
                        <svg
                          className={`w-16 h-16 sm:w-18 sm:h-18 ${
                            selectedColor === 'white' ? 'text-[#0B5F55]' : 'text-[#E3A92F]'
                          } drop-shadow-xs`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                          <path d="M12 22a4 4 0 0 0 4-4v-1a4 4 0 0 0-8 0v1a4 4 0 0 0 4 4z" />
                          <path d="M2 12a4 4 0 0 0 4 4h1a4 4 0 0 0 0-8H6a4 4 0 0 0-4 4z" />
                          <path d="M22 12a4 4 0 0 0-4-4h-1a4 4 0 0 0 0 8h1a4 4 0 0 0 4-4z" />
                        </svg>
                        <span
                          className={`text-[11px] sm:text-xs font-black mt-1.5 tracking-widest ${
                            selectedColor === 'white' ? 'text-[#0B5F55]' : 'text-[#E3A92F]'
                          }`}
                        >
                          FLOWER ART
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product 2: Tote Bag */}
              {selectedProduct === 'totebag' && (
                <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative w-full h-full flex items-center justify-center scale-115 sm:scale-125 -translate-y-2">
                    <img
                      src="/products/Tote_Bag_Mockup.png"
                      alt="شنطة توت باج مخصصة"
                      className={`w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(7,59,53,0.18)] transition-all duration-300 ${
                        selectedColor === 'black'
                          ? 'brightness-[0.25] contrast-[1.15]'
                          : selectedColor === 'green'
                          ? 'brightness-[0.55] sepia-[0.8] hue-rotate-[105deg] saturate-[2.8] contrast-[1.1]'
                          : ''
                      }`}
                    />

                    {/* Tote Bag Print */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="translate-y-[18%] flex items-center justify-center">
                        {selectedShape === 'words' && (
                          <div className="flex items-center justify-center select-none w-24 sm:w-28">
                            <img
                              src={selectedColor === 'white' ? '/logo/logo-green.png' : '/logo/logo-white.png'}
                              alt="لوجو يوزرسيف"
                              className="w-full h-auto object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                            />
                          </div>
                        )}
                        {(selectedShape === 'image' || selectedShape === 'shapes') && (
                          <div className="flex items-center justify-center select-none w-16 sm:w-20">
                            <div className="rounded-xs overflow-hidden shadow-sm border border-black/20">
                              <img
                                src="/products/starry-night.jpg"
                                alt="لوحة فنية على الشنطة"
                                className="w-full h-auto object-contain block"
                              />
                            </div>
                          </div>
                        )}
                        {selectedShape === 'flower' && (
                          <div className="flex flex-col items-center justify-center select-none scale-90">
                            <svg className={`w-12 h-12 ${selectedColor === 'white' ? 'text-[#0B5F55]' : 'text-[#E3A92F]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                              <path d="M12 22a4 4 0 0 0 4-4v-1a4 4 0 0 0-8 0v1a4 4 0 0 0 4 4z" />
                              <path d="M2 12a4 4 0 0 0 4 4h1a4 4 0 0 0 0-8H6a4 4 0 0 0-4 4z" />
                              <path d="M22 12a4 4 0 0 0-4-4h-1a4 4 0 0 0 0 8h1a4 4 0 0 0 4-4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product 3: Hoodie */}
              {selectedProduct === 'hoodie' && (
                <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative w-full h-full flex items-center justify-center scale-115 sm:scale-120">
                    <img
                      src={
                        selectedColor === 'white'
                          ? '/products/hoodie-white-front-trans.png'
                          : selectedColor === 'green'
                          ? '/products/hoodie-green-front.png'
                          : '/products/hoodie-black-front-trans.png'
                      }
                      alt="هودي مخصص"
                      className="w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(7,59,53,0.18)]"
                    />

                    {/* Hoodie Chest Print */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-4">
                      {selectedShape === 'words' && (
                        <div className="flex items-center justify-center select-none w-26 sm:w-32">
                          <img
                            src={selectedColor === 'white' ? '/logo/logo-green.png' : '/logo/logo-white.png'}
                            alt="لوجو يوزرسيف"
                            className="w-full h-auto object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
                          />
                        </div>
                      )}
                      {(selectedShape === 'image' || selectedShape === 'shapes') && (
                        <div className="flex items-center justify-center select-none w-18 sm:w-22">
                          <div className="rounded-sm overflow-hidden shadow-md border border-black/20">
                            <img
                              src="/products/starry-night.jpg"
                              alt="لوحة فنية على الهودي"
                              className="w-full h-auto object-contain block"
                            />
                          </div>
                        </div>
                      )}
                      {selectedShape === 'flower' && (
                        <svg className="w-12 h-12 text-[#E3A92F] drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                          <path d="M12 22a4 4 0 0 0 4-4v-1a4 4 0 0 0-8 0v1a4 4 0 0 0 4 4z" />
                          <path d="M2 12a4 4 0 0 0 4 4h1a4 4 0 0 0 0-8H6a4 4 0 0 0-4 4z" />
                          <path d="M22 12a4 4 0 0 0-4-4h-1a4 4 0 0 0 0 8h1a4 4 0 0 0 4-4z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              COLUMN 3 (Left in RTL): Product Selector Cards (اختار منتجك)
          ═══════════════════════════════════════════════════════════ */}
          <div className="w-full max-w-[240px] sm:max-w-[250px] flex flex-col items-center lg:items-end order-3 space-y-3">
            <div className="w-full">
              <span className="block text-sm sm:text-base font-black text-[#073B35] mb-2 sm:mb-2.5 text-center lg:text-end">
                اختار منتجك
              </span>

              {/* 3 Stacked Cards */}
              <div className="flex flex-col space-y-3 sm:space-y-3.5 w-full">
                {productsList.map((prod) => {
                  const isSelected = selectedProduct === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod.id)}
                      className={`w-full min-h-[50px] sm:min-h-[54px] py-2.5 sm:py-3 px-4 rounded-2xl border-[2.5px] border-[#073B35] flex items-center justify-between text-start transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#E3A92F] text-[#073B35] shadow-[4px_4px_0px_#073B35]'
                          : 'bg-white text-[#073B35] shadow-[4px_4px_0px_#073B35] hover:bg-[#faf7f0]'
                      }`}
                    >
                      {/* Visual Right in RTL: Arrow */}
                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#073B35] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="17" y1="7" x2="7" y2="17" />
                        <polyline points="17 17 7 17 7 7" />
                      </svg>

                      {/* Visual Middle & Left in RTL: Title + Number */}
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="font-black text-xs sm:text-sm lg:text-[14px] text-[#073B35]">
                          {prod.title}
                        </span>
                        <span className={`text-[11px] sm:text-xs font-mono font-bold shrink-0 ${
                          isSelected ? 'text-[#073B35]/80' : 'text-[#073B35]/60'
                        }`}>
                          {prod.num}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
