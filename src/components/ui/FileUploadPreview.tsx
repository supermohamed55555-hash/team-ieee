import React, { useRef, useState } from 'react';
import { UploadCloud, File, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { FileAttachment } from '../../lib/types';
import { formatFileSize } from '../../lib/utils';
import { Button } from './button';

interface FileUploadPreviewProps {
  files: FileAttachment[];
  onChange: (files: FileAttachment[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
}

export const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({
  files,
  onChange,
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setErrorMessage(null);

    if (files.length + incomingFiles.length > maxFiles) {
      setErrorMessage(`الحد الأقصى المسموح به هو ${maxFiles} ملفات فقط.`);
      return;
    }

    const newAttachments: FileAttachment[] = [];

    Array.from(incomingFiles).forEach((file) => {
      if (file.size > maxSizeBytes) {
        setErrorMessage(`الملف "${file.name}" يتجاوز الحجم المسموح به (10 ميجابايت).`);
        return;
      }

      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

      newAttachments.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl,
      });
    });

    onChange([...files, ...newAttachments]);
  };

  const handleRemove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-3 ${
          dragOver
            ? 'border-[#065E5A] bg-[#065E5A]/10'
            : 'border-[#065E5A]/30 hover:border-[#065E5A] hover:bg-emerald-50/30 bg-white'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        aria-label="رفع الملفات والمرفقات"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.svg,.zip"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-full bg-[#065E5A]/10 flex items-center justify-center text-[#065E5A]">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            انقر لرفع الملفات أو اسحبها وأفلتها هنا
          </p>
          <p className="text-xs text-slate-500 mt-1">
            صيغ مقبولة: PDF, AI, PSD, PNG, JPG, SVG (حد أقصى 10 ميجابايت)
          </p>
          <p className="text-xs text-amber-600 font-medium mt-1">
            * تنبيه: الرفع تجريبي للعرض والمعاينة الفورية ولا يتم حفظ الملفات على خوادم سحابية.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Files List Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">
            الملفات المرفقة ({files.length}/{maxFiles}):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => {
              const isImg = !!file.previewUrl;
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {isImg ? (
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                        {file.name.endsWith('.pdf') ? (
                          <File className="w-5 h-5 text-rose-500" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                    onClick={() => handleRemove(file.id)}
                    aria-label={`حذف الملف ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
