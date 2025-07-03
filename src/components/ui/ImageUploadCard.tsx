"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { ImageUploadCardProps } from "@/interfaces/global";

// Allowed MIME types for images, PDFs, and Word docs
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  onFileUpload,
  className = "",
  multiple = false,
}) => {
  // Variables
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ["dragenter", "dragover"].forEach((eventName) =>
      window.addEventListener(eventName, preventDefaults)
    );

    return () => {
      ["dragenter", "dragover"].forEach((eventName) =>
        window.removeEventListener(eventName, preventDefaults)
      );
    };
  }, []);

  // Verify allowed file type
  const isAllowedFile = useCallback(
    (file: File) => ALLOWED_TYPES.includes(file.type),
    []
  );

  // Handle upload image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedFiles = Array.from(files).filter(isAllowedFile);

    if (allowedFiles.length === 0) {
      alert("Only images, PDF, and Word documents are allowed.");
      return;
    }

    if (multiple) {
      onFileUpload?.(allowedFiles);
    } else {
      onFileUpload?.(allowedFiles[0]);
    }
  };

  const handleDragEnter = useCallback(() => {
    dragCounter.current++;
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      dragCounter.current = 0;

      const files = e.dataTransfer.files;
      if (!files) return;

      const allowedFiles = Array.from(files).filter(isAllowedFile);

      if (allowedFiles.length === 0) {
        return;
      }

      if (multiple) {
        onFileUpload?.(allowedFiles);
      } else {
        onFileUpload?.(allowedFiles[0]);
      }
    },
    [onFileUpload, multiple, isAllowedFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={`relative w-full h-[250px] bg-white rounded-lg flex items-center justify-center text-center cursor-pointer transition-all focus:outline-none focus:ring dashed-border 
        ${dragActive ? "bg-blue-50" : ""}
        ${className}`}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p className="text-gray-500 z-10 pointer-events-none">
        Drag files here or{" "}
        <span>
          <u>upload</u>
        </span>
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
        multiple={multiple}
      />
    </div>
  );
};

export default ImageUploadCard;
