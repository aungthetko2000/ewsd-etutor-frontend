import React, { useState, useCallback, useRef } from 'react';
import { Upload, File, X, FileText, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (uploadedFiles: FileList | File[]) => {
    const newFiles = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...newFiles, ...prev]);

    newFiles.forEach(file => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += Math.random() * 30;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          setFiles(prev =>
            prev.map(f =>
              f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f
            )
          );
        } else {
          setFiles(prev =>
            prev.map(f =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 400);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={20} />;
    if (type.startsWith('video/')) return <Film size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Document Upload
        </h1>
        <p className="text-zinc-500 mt-2">
          Upload and manage your course materials and student records.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-12 text-center
        ${isDragging
            ? 'border-zinc-900 bg-zinc-900/5'
            : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50'
          }`}
      >

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />

        <div className="flex flex-col items-center">

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-zinc-100 text-zinc-400">
            <Upload size={32} />
          </div>

          <h3 className="text-lg font-bold text-zinc-900 mb-1">
            {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
          </h3>

          <p className="text-sm text-zinc-500">
            Support for PDF, DOCX, JPG, PNG and MP4 (Max 50MB)
          </p>

        </div>
      </div>

      {/* File List */}
      <div className="mt-10 space-y-3">

        {files.map((file) => (

          <motion.div
            key={file.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4"
          >

            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-50 text-zinc-400">

              {file.status === 'uploading'
                ? <Loader2 size={20} className="animate-spin" />
                : getFileIcon(file.type)
              }

            </div>

            <div className="flex-1">

              <div className="flex justify-between mb-1">

                <p className="text-sm font-semibold">
                  {file.name}
                </p>

                <button onClick={() => removeFile(file.id)}>
                  <X size={16} />
                </button>

              </div>

              {/* progress bar */}

              {file.status === 'uploading' && (
                <div className="w-full bg-zinc-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}

            </div>

          </motion.div>

        ))}

        {files.length === 0 && (

          <div className="text-center py-12 bg-zinc-50 rounded-3xl border">

            <File size={20} className="mx-auto mb-3 text-zinc-300" />

            <p className="text-sm text-zinc-400">
              No documents uploaded yet
            </p>

          </div>

        )}

      </div>

    </div>
  );
}