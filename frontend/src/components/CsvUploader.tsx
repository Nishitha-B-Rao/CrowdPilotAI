"use client";

import { API_URL } from "@/lib/config";

import { useState } from "react";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardStore } from "@/store/dashboardStore";

interface CsvUploaderProps {
  onUploadSuccess: () => void;
}

export function CsvUploader({ onUploadSuccess }: CsvUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const setStadiumState = useDashboardStore((state) => state.setStadiumState);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus("idle");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/v1/upload/csv`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const updatedState = await res.json();
      setStadiumState(updatedState);

      setStatus("success");
      onUploadSuccess(); // Trigger a refresh in the parent component
      
      // Reset status immediately so user isn't waiting
      setTimeout(() => setStatus("idle"), 500);
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      setErrorMessage((err as Error).message || "Failed to process CSV");
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden group border border-white/5">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-bold tracking-tight text-white flex items-center">
          <UploadCloud size={18} className="mr-2 text-indigo-400" /> Data Ingestion
        </h3>
        <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
          CSV Upload
        </span>
      </div>

      <div className="relative z-10 mt-2">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            ) : status === "success" ? (
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
            ) : status === "error" ? (
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-indigo-400 mb-2 opacity-70" />
            )}
            
            <p className="mb-2 text-sm text-white/70">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">Crowd Density CSV (max 10MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileUpload} 
            disabled={isUploading}
          />
        </label>

        {status === "error" && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-red-400 text-xs mt-3 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20"
          >
            {errorMessage}
          </motion.p>
        )}
      </div>
    </div>
  );
}
