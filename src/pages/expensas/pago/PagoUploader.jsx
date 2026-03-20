import React, { useRef, useState } from "react";
import { FiUpload, FiFile, FiX, FiAlertCircle } from "react-icons/fi";
import { validateFile, formatFileSize, ALLOWED_EXTENSIONS, MAX_SIZE_MB } from "./PagoConstants";

export default function PagoUploader({ archivo, onArchivoChange, enviando, onEnviar }) {
  const inputRef        = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState(null);

  const handleFile = (file) => {
    const err = validateFile(file);
    if (err) { setError(err); onArchivoChange(null); return; }
    setError(null);
    onArchivoChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setError(null);
    onArchivoChange(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="font-['Raleway'] text-[12px] font-semibold text-[#2d3250] m-0">
        Comprobante de pago
      </p>

      {/* Drop zone */}
      {!archivo && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-2
            px-4 py-8 rounded-[14px] border-2 border-dashed
            cursor-pointer touch-manipulation
            transition-all duration-200
            ${dragging
              ? "border-[#5b9ea0] bg-[rgba(91,158,160,0.08)]"
              : "border-[#b0cfd0] bg-[rgba(240,244,248,0.5)] hover:border-[#5b9ea0] hover:bg-[rgba(91,158,160,0.04)]"
            }
          `}
        >
          <div className="w-10 h-10 rounded-xl bg-[rgba(91,158,160,0.10)] border border-[rgba(91,158,160,0.2)] flex items-center justify-center">
            <FiUpload size={18} className="text-[#5b9ea0]" />
          </div>
          <div className="text-center">
            <p className="font-['Raleway'] text-[13px] font-semibold text-[#2d3250] m-0 mb-[2px]">
              Arrastrá tu archivo o <span className="text-[#2a6b6e]">hacé clic para seleccionar</span>
            </p>
            <p className="font-['Raleway'] text-[11px] text-[#5b7a8a] m-0">
              {ALLOWED_EXTENSIONS.join(", ").toUpperCase()} · máx. {MAX_SIZE_MB} MB
            </p>
          </div>
        </div>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={handleChange}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-[9px] rounded-[10px] bg-[rgba(185,28,28,0.06)] border border-[rgba(185,28,28,0.18)]">
          <FiAlertCircle size={13} className="text-[#b91c1c] flex-shrink-0" />
          <span className="font-['Raleway'] text-[12px] text-[#b91c1c]">{error}</span>
        </div>
      )}

      {/* Archivo seleccionado */}
      {archivo && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-[rgba(42,107,110,0.06)] border border-[rgba(42,107,110,0.18)]">
          <div className="w-9 h-9 rounded-[9px] bg-[rgba(42,107,110,0.10)] border border-[rgba(42,107,110,0.2)] flex items-center justify-center flex-shrink-0">
            <FiFile size={16} className="text-[#2a6b6e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-['Raleway'] text-[12px] font-semibold text-[#2d3250] m-0 truncate">
              {archivo.name}
            </p>
            <p className="font-['Raleway'] text-[11px] text-[#5b7a8a] m-0">
              {formatFileSize(archivo.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Eliminar archivo"
            className="flex-shrink-0 bg-transparent border-none p-1 cursor-pointer text-[#5b7a8a] hover:text-[#b91c1c] transition-colors duration-150"
          >
            <FiX size={15} />
          </button>
        </div>
      )}

      {/* Botón enviar */}
      <button
        type="button"
        onClick={onEnviar}
        disabled={!archivo || enviando}
        className="
          w-full py-[13px] rounded-xl border-none
          font-['Raleway'] text-[13px] font-bold tracking-[0.08em] text-white
          bg-[#2a6b6e] shadow-[0_4px_20px_rgba(42,107,110,0.25)]
          cursor-pointer touch-manipulation
          transition-all duration-[180ms]
          hover:enabled:bg-[#235b5e] hover:enabled:shadow-[0_6px_28px_rgba(42,107,110,0.40)] hover:enabled:-translate-y-px
          active:enabled:scale-[0.97]
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <span className="flex items-center justify-center gap-2">
          {enviando && (
            <span className="w-[14px] h-[14px] rounded-full border-2 border-[rgba(255,255,255,0.35)] border-t-white animate-spin flex-shrink-0" />
          )}
          {enviando ? "Enviando..." : "Enviar Comprobante"}
        </span>
      </button>
    </div>
  );
}