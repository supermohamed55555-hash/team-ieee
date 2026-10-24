import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Check, Layers } from 'lucide-react';

interface InteractiveCustomizerProps {
  reducedMotion?: boolean;
  onCustomizeProduct?: (productType: string, placement: string, color: string) => void;
}

export const InteractiveCustomizer: React.FC<InteractiveCustomizerProps> = ({
  reducedMotion = false,
  onCustomizeProduct,
}) => {
  const navigate = useNavigate();
  const [productType, setProductType] = useState<'tshirt' | 'cap' | 'mug'>('tshirt');
  const [placement, setPlacement] = useState<string>('الصدر');
  const [colorHex, setColorHex] = useState<string>('#073B35');
  const [colorName, setColorName] = useState<string>('أخضر يوزرسيف الداكن');

  const colorOptions = [
    { name: 'أخضر يوزرسيف الداكن', hex: '#073B35' },
    { name: 'أسود ملكي', hex: '#111111' },
    { name: 'أبيض ناصع', hex: '#FFFFFF' },
    { name: 'بيج صحراوي', hex: '#E6DCC8' },
  ];

  const handleProductSwitch = (type: 'tshirt' | 'cap' | 'mug') => {
    setProductType(type);
    if (type === 'tshirt') setPlacement('الصدر');
    if (type === 'cap') setPlacement('واجهة الكاب');
    if (type === 'mug') setPlacement('الواجهة الأمامية');
  };

  return (
    <div className="bg-white border border-[#073B35]/15 rounded-2xl overflow-hidden shadow-sm">
      {/* Top Header Bar */}
      <div className="bg-[#073B35]/5 px-4 py-3 border-b border-[#073B35]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0B5F55]" />
          <span className="text-xs font-bold text-[#073B35]">
            معاينة موضع الطباعة والتطريز التفاعلية
          </span>
          <span className="text-[11px] text-[#073B35]/60 font-medium">
            (حركة تفاعلية موجهة)
          </span>
        </div>

        {/* Product Type Tabs */}
        <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 rounded-lg">
          <button
            onClick={() => handleProductSwitch('tshirt')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              productType === 'tshirt'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:text-[#073B35]'
            }`}
          >
            تيشيرت / هودي
          </button>
          <button
            onClick={() => handleProductSwitch('cap')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              productType === 'cap'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:text-[#073B35]'
            }`}
          >
            كاب مطرز
          </button>
          <button
            onClick={() => handleProductSwitch('mug')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              productType === 'mug'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:text-[#073B35]'
            }`}
          >
            مج سيراميك
          </button>
        </div>
      </div>

      {/* Main Visual Display & Controls */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Canvas (Col 1-7) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-6 bg-[#F6F1E7]/50 rounded-xl relative border border-[#073B35]/10 min-h-[300px]">
          {/* T-Shirt Canvas */}
          {productType === 'tshirt' && (
            <svg
              viewBox="0 0 240 220"
              className="w-full max-w-[260px] h-auto drop-shadow-md transition-all duration-300"
              aria-label="معاينة تيشيرت"
            >
              {/* T-shirt Silhouette */}
              <path
                d="M 80 20 C 100 35, 140 35, 160 20 L 220 50 L 195 95 L 170 80 L 170 200 L 70 200 L 70 80 L 45 95 L 20 50 Z"
                fill={colorHex}
                stroke="#073B35"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Collar detail */}
              <path
                d="M 80 20 C 100 40, 140 40, 160 20"
                fill="none"
                stroke={colorHex === '#FFFFFF' ? '#CCCCCC' : 'rgba(255,255,255,0.2)'}
                strokeWidth="2"
              />

              {/* Placement 1: الصدر */}
              {placement === 'الصدر' && (
                <g>
                  <rect
                    x="90"
                    y="70"
                    width="60"
                    height="50"
                    rx="4"
                    fill="none"
                    stroke="#E3A92F"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className={reducedMotion ? '' : 'animate-pulse'}
                  />
                  <text
                    x="120"
                    y="100"
                    fill="#E3A92F"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo"
                  >
                    موضع الصدر
                  </text>
                </g>
              )}

              {/* Placement 2: الظهر */}
              {placement === 'الظهر' && (
                <g>
                  <rect
                    x="85"
                    y="60"
                    width="70"
                    height="75"
                    rx="4"
                    fill="none"
                    stroke="#E3A92F"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className={reducedMotion ? '' : 'animate-pulse'}
                  />
                  <text
                    x="120"
                    y="102"
                    fill="#E3A92F"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo"
                  >
                    موضع الظهر الكامل
                  </text>
                </g>
              )}

              {/* Placement 3: جيب أمامي */}
              {placement === 'جيب أمامي' && (
                <g>
                  <rect
                    x="80"
                    y="65"
                    width="32"
                    height="32"
                    rx="3"
                    fill="none"
                    stroke="#E3A92F"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className={reducedMotion ? '' : 'animate-pulse'}
                  />
                  <text
                    x="96"
                    y="84"
                    fill="#E3A92F"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo"
                  >
                    شعار جيب
                  </text>
                </g>
              )}

              {/* Placement 4: الكم الأيمن */}
              {placement === 'الكم' && (
                <g>
                  <rect
                    x="35"
                    y="60"
                    width="26"
                    height="30"
                    rx="3"
                    fill="none"
                    stroke="#E3A92F"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className={reducedMotion ? '' : 'animate-pulse'}
                  />
                  <text
                    x="48"
                    y="78"
                    fill="#E3A92F"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo"
                  >
                    الكم
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* Cap Canvas */}
          {productType === 'cap' && (
            <svg
              viewBox="0 0 240 180"
              className="w-full max-w-[260px] h-auto drop-shadow-md transition-all duration-300"
              aria-label="معاينة كاب"
            >
              {/* Cap Visor & Crown */}
              <ellipse cx="120" cy="135" rx="85" ry="25" fill="#073B35" opacity="0.3" />
              <path
                d="M 50 120 C 50 50, 190 50, 190 120 Z"
                fill={colorHex}
                stroke="#073B35"
                strokeWidth="2"
              />
              <path
                d="M 40 120 C 50 155, 190 155, 200 120 C 180 135, 60 135, 40 120 Z"
                fill={colorHex}
                stroke="#073B35"
                strokeWidth="2"
              />
              <circle cx="120" cy="50" r="5" fill="#E3A92F" />

              {/* Placement: واجهة الكاب */}
              {placement === 'واجهة الكاب' && (
                <g>
                  <rect
                    x="85"
                    y="75"
                    width="70"
                    height="32"
                    rx="4"
                    fill="none"
                    stroke="#E3A92F"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className={reducedMotion ? '' : 'animate-pulse'}
                  />
                  <text
                    x="120"
                    y="95"
                    fill="#E3A92F"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo"
                  >
                    تطريز 3D الواجهة
                  </text>
                </g>
              )}

              {placement === 'الجانب' && (
                <g>
                  <rect
                    x="55"
                    y="80"
                    width="30"
                    height="28"
                    rx="3"
                    fill="none"
                    stroke="#E3A92F"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className={reducedMotion ? '' : 'animate-pulse'}
                  />
                  <text
                    x="70"
                    y="97"
                    fill="#E3A92F"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Cairo"
                  >
                    الجانب
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* Mug Canvas */}
          {productType === 'mug' && (
            <svg
              viewBox="0 0 240 200"
              className="w-full max-w-[260px] h-auto drop-shadow-md transition-all duration-300"
              aria-label="معاينة مج"
            >
              {/* Mug Body */}
              <ellipse cx="110" cy="40" rx="60" ry="12" fill={colorHex} stroke="#073B35" strokeWidth="2" />
              <rect x="50" y="40" width="120" height="110" fill={colorHex} stroke="#073B35" strokeWidth="2" />
              <ellipse cx="110" cy="150" rx="60" ry="12" fill={colorHex} stroke="#073B35" strokeWidth="2" />
              
              {/* Gold Handle */}
              <path
                d="M 170 55 C 210 55, 210 135, 170 135"
                fill="none"
                stroke="#E3A92F"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Placement: الواجهة الأمامية */}
              <g>
                <rect
                  x="70"
                  y="70"
                  width="80"
                  height="65"
                  rx="4"
                  fill="none"
                  stroke="#E3A92F"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className={reducedMotion ? '' : 'animate-pulse'}
                />
                <text
                  x="110"
                  y="106"
                  fill="#E3A92F"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="Cairo"
                >
                  طباعة سيراميك دقيقة
                </text>
              </g>
            </svg>
          )}

          {/* Live indicator tag */}
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[11px] text-[#073B35] font-semibold border border-[#073B35]/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E3A92F]"></span>
            <span>{placement}</span>
            <span>·</span>
            <span>{colorName}</span>
          </div>
        </div>

        {/* Configuration Controls (Col 8-12) */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-[#073B35] block mb-2">
              اختر موضع الطباعة / التطريز:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {productType === 'tshirt' && (
                <>
                  <button
                    onClick={() => setPlacement('الصدر')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'الصدر'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    منتصف الصدر (أمامي)
                  </button>
                  <button
                    onClick={() => setPlacement('الظهر')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'الظهر'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    الظهر بالكامل (خلفي)
                  </button>
                  <button
                    onClick={() => setPlacement('جيب أمامي')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'جيب أمامي'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    شعار جيب صغير
                  </button>
                  <button
                    onClick={() => setPlacement('الكم')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'الكم'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    طباعة على الكم
                  </button>
                </>
              )}

              {productType === 'cap' && (
                <>
                  <button
                    onClick={() => setPlacement('واجهة الكاب')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'واجهة الكاب'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    الواجهة (تطريز 3D)
                  </button>
                  <button
                    onClick={() => setPlacement('الجانب')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'الجانب'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    الجانب الأيمن / الأيسر
                  </button>
                </>
              )}

              {productType === 'mug' && (
                <>
                  <button
                    onClick={() => setPlacement('الواجهة الأمامية')}
                    className="px-3 py-2 text-xs font-bold rounded-lg border border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] text-right cursor-default"
                  >
                    واجهة المج (كاليجرافي)
                  </button>
                  <button
                    onClick={() => setPlacement('طباعة محيطية كاملة')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-right transition-colors cursor-pointer ${
                      placement === 'طباعة محيطية كاملة'
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    طباعة محيطية 360°
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <span className="text-xs font-bold text-[#073B35] block mb-2">
              اختر لون الخامة:
            </span>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setColorHex(c.hex);
                    setColorName(c.name);
                  }}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    colorHex === c.hex ? 'scale-110 border-[#E3A92F] shadow-sm' : 'border-black/10'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {colorHex === c.hex && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        c.hex === '#FFFFFF' || c.hex === '#E6DCC8' ? 'text-[#073B35]' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
              <span className="text-xs text-[#073B35]/80 font-medium mr-2">
                {colorName}
              </span>
            </div>
          </div>

          {/* Direct CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                const serviceQuery =
                  productType === 'tshirt' ? 'clothing-hoodies' : productType === 'cap' ? 'caps-embroidery' : 'mugs-promotional-gifts';
                if (onCustomizeProduct) {
                  onCustomizeProduct(serviceQuery, placement, colorName);
                } else {
                  navigate(`/request?service=${serviceQuery}&color=${encodeURIComponent(colorName)}&placement=${encodeURIComponent(placement)}`);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B5F55] hover:bg-[#073B35] text-white font-bold rounded-xl text-xs md:text-sm transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <span>اطلب بالمواصفات دي الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-[#073B35]/60 text-center mt-2">
              {reducedMotion
                ? 'وضع الثبات مفعل لراحتك البصرية'
                : 'الأنيميشن يوضح موقع الطباعة بدقة للمصمم والورشة'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
