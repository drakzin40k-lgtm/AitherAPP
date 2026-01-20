
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface ImageAdjusterProps {
  imageSrc: string;
  onConfirm: (croppedImage: string) => void;
  onCancel: () => void;
  title: string;
}

const ImageAdjuster: React.FC<ImageAdjusterProps> = ({ imageSrc, onConfirm, onCancel, title }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleConfirm = () => {
    const canvas = document.createElement('canvas');
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx && imageRef.current) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, size, size);
      
      // Desenhar circular mask
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      ctx.clip();

      const img = imageRef.current;
      const displaySize = 280; // Tamanho do círculo na UI
      const ratio = img.naturalWidth / img.width;
      
      const drawWidth = img.width * zoom;
      const drawHeight = img.height * zoom;
      
      // Calcular offsets baseados na posição da UI transposta para o canvas de 400px
      // A escala na UI é baseada em um container de 280px
      const scaleMultiplier = size / displaySize;
      
      const offsetX = (position.x + (drawWidth / 2)) * scaleMultiplier;
      const offsetY = (position.y + (drawHeight / 2)) * scaleMultiplier;

      ctx.drawImage(
        img,
        offsetX - (drawWidth * scaleMultiplier / 2),
        offsetY - (drawHeight * scaleMultiplier / 2),
        drawWidth * scaleMultiplier,
        drawHeight * scaleMultiplier
      );

      onConfirm(canvas.toDataURL('image/jpeg', 0.85));
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{title}</h3>
          <button onClick={onCancel} className="text-zinc-600 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 flex flex-col items-center gap-10">
          {/* Viewport de Ajuste */}
          <div 
            ref={containerRef}
            className="relative w-72 h-72 rounded-full border-4 border-blue-500/30 bg-zinc-900 overflow-hidden cursor-move touch-none group shadow-[0_0_50px_rgba(59,130,246,0.1)]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imageRef}
              src={imageSrc} 
              alt="Adjust"
              draggable={false}
              className="absolute pointer-events-none max-w-none origin-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                left: '50%',
                top: '50%',
                marginLeft: '-50%',
                marginTop: '-50%',
                width: '100%'
              }}
            />
            <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none rounded-full scale-110"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Move className="w-6 h-6 text-white/50" />
            </div>
          </div>

          {/* Controles de Zoom */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-2">
                <ZoomOut className="w-4 h-4 text-zinc-600" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Escala: {Math.round(zoom * 100)}%</span>
                <ZoomIn className="w-4 h-4 text-zinc-600" />
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageAdjuster;
