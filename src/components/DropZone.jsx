import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FileCode } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DropZone({ onFileSelect }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={cn(
                "w-full max-w-2xl mx-auto h-80 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden",
                isDragging
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10"
                    : "border-border bg-card/50 hover:bg-card hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
            />

            <div className="z-10 flex flex-col items-center space-y-4 text-center p-6">
                <div className={cn(
                    "p-4 rounded-full transition-colors duration-300",
                    isDragging ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    {isDragging ? <Upload className="size-8 animate-bounce" /> : <ImageIcon className="size-8" />}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                        {isDragging ? "Drop to upload" : "Upload a screenshot"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Drag & drop your UI screenshot here, or click to browse files.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <span>Supports PNG, JPG, WEBP</span>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
