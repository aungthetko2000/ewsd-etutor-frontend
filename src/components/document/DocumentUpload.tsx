import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Film, ChevronLeft, ChevronRight, Plus, Check, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  previewUrl?: string;
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (uploadedFiles: FileList | File[]) => {
    const newFiles = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type,
      status: 'uploading' as const,
      progress: 0,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...newFiles, ...prev]);

    newFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f));
        } else {
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress } : f));
        }
      }, 400);
    });
  };

  const previewFiles = files.slice(0, 5); // Increased preview count

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900 p-6 md:p-12 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto">
        
        {/* --- DYNAMIC HEADER BENTO --- */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-4">
                <Cloud size={14} /> SYSTEM ONLINE
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
                Gallery<span className="text-indigo-600">.</span>Core
              </h1>
              <p className="text-slate-500 font-medium max-w-md">The next-generation asset pipeline for high-performance creative teams.</p>
            </div>
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group relative overflow-hidden bg-slate-900 text-white rounded-[2.5rem] p-8 flex flex-col items-start justify-between transition-all hover:bg-indigo-600 active:scale-95"
          >
            <div className="bg-white/10 p-3 rounded-2xl group-hover:rotate-90 transition-transform duration-500">
              <Plus size={28} />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold leading-tight">Drop Assets</p>
              <p className="text-slate-400 group-hover:text-white/80 transition-colors">Or click to browse</p>
            </div>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: IMMERSIVE VIEWER --- */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files && processFiles(e.dataTransfer.files); }}
              className={`relative aspect-video rounded-[3.5rem] overflow-hidden transition-all duration-500 border-4 shadow-2xl
                ${isDragging ? 'border-indigo-500 scale-[0.98] bg-indigo-50' : 'border-white bg-slate-200'}`}
            >
              <AnimatePresence mode="wait">
                {previewFiles.length > 0 ? (
                  <motion.div
                    key={previewFiles[currentIndex]?.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                  >
                    {previewFiles[currentIndex].previewUrl ? (
                      <img src={previewFiles[currentIndex].previewUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                        <FileText size={80} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-800">{previewFiles[currentIndex].name}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <Upload size={40} className="mb-4 opacity-20" />
                    <p className="font-semibold">Canvas awaits your data</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Minimal Navigation Bar */}
              {previewFiles.length > 1 && (
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <div className="flex gap-2 p-2 bg-black/20 backdrop-blur-xl rounded-2xl pointer-events-auto border border-white/10">
                    <NavBtn icon={<ChevronLeft size={20}/>} onClick={() => setCurrentIndex(c => Math.max(0, c - 1))} disabled={currentIndex === 0} />
                    <NavBtn icon={<ChevronRight size={20}/>} onClick={() => setCurrentIndex(c => Math.min(previewFiles.length - 1, c + 1))} disabled={currentIndex === previewFiles.length - 1} />
                  </div>
                  
                  <div className="px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl text-xs font-black tracking-widest text-slate-900 pointer-events-auto border border-white">
                    {currentIndex + 1} / {previewFiles.length}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT: THE FEED (QUEUE) --- */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-black text-slate-900 uppercase tracking-tighter text-sm">Processing Stack</h2>
              <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-md font-bold text-slate-500">{files.length}</span>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              <AnimatePresence mode="popLayout" initial={false}>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                        ${file.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {file.status === 'completed' ? <Check size={20} strokeWidth={3} /> : <FileIcon type={file.type} />}
                        
                        {/* Circle Progress Overlay */}
                        {file.status === 'uploading' && (
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="138" strokeDashoffset={138 - (138 * file.progress) / 100} className="text-indigo-500 opacity-20" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 truncate text-sm leading-tight">{file.name}</p>
                          <button onClick={() => setFiles(f => f.filter(x => x.id !== file.id))} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 rounded-lg text-rose-500 transition-all">
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                          {file.size} • <span className={file.status === 'completed' ? 'text-emerald-500' : 'text-indigo-500'}>{file.status}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && processFiles(e.target.files)} className="hidden" multiple />
    </div>
  );
}

const NavBtn = ({ icon, onClick, disabled }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className="p-2 hover:bg-white/20 rounded-xl text-white disabled:opacity-30 transition-all active:scale-90"
  >
    {icon}
  </button>
);

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <ImageIcon size={20} />;
  if (type.startsWith('video/')) return <Film size={20} />;
  return <FileText size={20} />;
}