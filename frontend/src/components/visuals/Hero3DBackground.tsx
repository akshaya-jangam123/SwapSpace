import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, Laptop, Sparkles, ArrowLeftRight, Code, MessageSquare, CheckCircle, GraduationCap, Lightbulb, Compass, Zap, Flame, Shield } from 'lucide-react';

export const Hero3DBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse coords (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const parallaxLeft = {
    transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -10}px, 0px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
  };

  const parallaxRight = {
    transform: `translate3d(${mousePos.x * 14}px, ${mousePos.y * 12}px, 0px) rotateY(${-mousePos.x * 7}deg) rotateX(${mousePos.y * 7}deg)`,
  };

  const parallaxCenter = {
    transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0px)`,
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none perspective-container z-0"
      aria-hidden="true"
    >
      {/* 1. Ambient Lighting & Warm Color Mesh Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-peach-200/45 via-peach-100/30 to-transparent blur-3xl" />
      <div className="absolute top-[-5%] right-[-5%] w-[680px] h-[680px] rounded-full bg-gradient-to-bl from-lavender-200/50 via-lavender-100/25 to-transparent blur-3xl" />
      <div className="absolute bottom-[0%] left-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-sage-200/40 via-cream-200/30 to-transparent blur-3xl" />
      <div className="absolute top-[35%] right-[20%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-amber-200/35 via-peach-100/20 to-transparent blur-3xl" />

      {/* Subtle Studio Lighting Grid / Radial Ambient */}
      <div className="absolute inset-0 bg-mesh-warm opacity-80" />

      {/* 2. Delicate Constellation Network & Exchange Paths */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-35" 
        style={parallaxCenter}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="warmLineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1A987" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#BFA4DE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9EBFB0" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="glowDotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* Dynamic Curved Splines Connecting Left & Right Nodes */}
        <path
          d="M 120 220 Q 380 90, 640 180 T 1180 200"
          fill="none"
          stroke="url(#warmLineGrad1)"
          strokeWidth="1.5"
          strokeDasharray="6, 8"
          className="animate-pulse-glow"
        />
        <path
          d="M 80 480 C 320 540, 520 380, 880 440 S 1240 360, 1340 460"
          fill="none"
          stroke="url(#warmLineGrad1)"
          strokeWidth="1.2"
          strokeDasharray="4, 10"
        />

        {/* Connecting Micro Nodes */}
        <circle cx="280" cy="140" r="3.5" fill="#E87D4E" opacity="0.6" />
        <circle cx="560" cy="165" r="4.5" fill="#9B74C9" opacity="0.5" />
        <circle cx="890" cy="210" r="3.5" fill="#6E9684" opacity="0.6" />
        <circle cx="1060" cy="180" r="4" fill="#F59E0B" opacity="0.7" />
      </svg>

      {/* ========================================================================= */}
      {/* 3. LEFT 3D CLUSTER: Knowledge, Code, Learning & Creative Ideas           */}
      {/* ========================================================================= */}
      <div 
        className="absolute top-12 left-2 sm:left-6 lg:left-12 w-[340px] xl:w-[420px] h-[520px] transition-transform duration-700 ease-out preserve-3d"
        style={parallaxLeft}
      >
        {/* --- 3D OBJECT 1: ISOMETRIC LAPTOP (CODE & TECH SKILL EXCHANGE) --- */}
        <div 
          className="absolute top-20 left-0 w-64 xl:w-72 animate-float-slow"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(18deg) rotateY(-22deg) rotateZ(4deg)' }}
        >
          {/* Ambient Drop Shadow underneath laptop */}
          <div className="absolute -bottom-8 left-4 w-60 h-16 bg-stone-900/15 rounded-full blur-xl transform scale-y-50" />

          {/* Laptop Screen (Tilted Up) */}
          <div 
            className="w-full h-44 rounded-t-2xl bg-gradient-to-b from-stone-800 via-stone-850 to-stone-900 p-2 border-[2.5px] border-stone-700/80 shadow-2xl relative overflow-hidden"
            style={{ 
              transformOrigin: 'bottom center',
              transform: 'rotateX(-28deg)',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.25)' 
            }}
          >
            {/* Screen Bezel Gloss Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
            
            {/* Web Camera Dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600 mx-auto mb-1.5 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-indigo-400" />
            </div>

            {/* Realistic IDE Display on Laptop */}
            <div className="w-full h-[122px] rounded-lg bg-[#1E1E2E] p-2.5 font-mono text-[10px] text-stone-200 shadow-inner relative overflow-hidden border border-stone-700/50">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-700/60 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400 shadow-xs" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
                </div>
                <span className="text-[9px] text-stone-400 font-sans font-medium flex items-center gap-1">
                  <Code className="w-2.5 h-2.5 text-indigo-400" /> swap_match.ts
                </span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-semibold">
                  Match 98%
                </span>
              </div>

              {/* Code Snippet */}
              <div className="space-y-1 text-[9px] leading-tight">
                <div className="text-stone-400">
                  <span className="text-purple-400">const</span> trade = {'{'}
                </div>
                <div className="pl-3 text-stone-300">
                  <span className="text-rose-300">give:</span> <span className="text-emerald-300">"Python & ML"</span>,
                </div>
                <div className="pl-3 text-stone-300">
                  <span className="text-rose-300">want:</span> <span className="text-amber-300">"UI / UX Design"</span>
                </div>
                <div className="text-stone-400">{'}'};</div>
              </div>

              {/* Glowing Status Ribbon */}
              <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[8px] text-indigo-300 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Ready to Swap</span>
              </div>
            </div>
          </div>

          {/* Laptop Base & Keyboard Chassis */}
          <div 
            className="w-full h-24 bg-gradient-to-b from-[#E6E1DA] via-[#DCD6CE] to-[#CBC4B8] rounded-b-2xl p-2 shadow-2xl relative border-t border-white/60"
            style={{
              boxShadow: '0 18px 30px -5px rgba(60,40,25,0.22), inset 0 2px 3px rgba(255,255,255,0.8)'
            }}
          >
            {/* Keyboard Deck Recess */}
            <div className="w-[92%] mx-auto h-11 bg-stone-300/60 rounded-md p-1 grid grid-cols-6 gap-0.5 shadow-inner border border-stone-400/30">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="bg-[#FAF8F5] rounded-[2px] shadow-xs border-b border-stone-400/40" />
              ))}
            </div>

            {/* Glass Trackpad */}
            <div className="w-16 h-7 mx-auto mt-1.5 rounded-md bg-stone-200/80 border border-stone-300/70 shadow-inner" />

            {/* Beveled Front Lip with Specular Highlight */}
            <div className="absolute -bottom-1.5 inset-x-2 h-1.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-b-md shadow-md" />
          </div>
        </div>

        {/* --- 3D OBJECT 2: LAYERED COLLEGE TEXTBOOKS (KNOWLEDGE SHARING) --- */}
        <div 
          className="absolute top-72 left-8 w-52 xl:w-56 animate-float-reverse"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(24deg) rotateY(18deg) rotateZ(-8deg)' }}
        >
          {/* Shadow below book stack */}
          <div className="absolute -bottom-4 left-2 w-48 h-12 bg-stone-900/20 rounded-full blur-lg" />

          {/* Book 1 (Bottom - Emerald Sage Knowledge Book) */}
          <div className="relative w-full h-8 bg-gradient-to-r from-[#2B4C3F] via-[#3D6B58] to-[#2B4C3F] rounded-r-md shadow-lg border-l-4 border-amber-400 flex items-center justify-between px-3 text-white">
            <span className="text-[9px] font-bold tracking-widest uppercase opacity-90">Data Structures</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
            {/* White Pages Texture */}
            <div className="absolute right-0 top-1 bottom-1 w-2.5 bg-gradient-to-l from-stone-100 to-stone-300 border-l border-stone-400 rounded-r-xs" />
          </div>

          {/* Book 2 (Middle - Warm Terracotta Peach Skill Book, slightly rotated) */}
          <div 
            className="relative w-[96%] h-8 -mt-1 bg-gradient-to-r from-[#C25E3E] via-[#DE7350] to-[#C25E3E] rounded-r-md shadow-md border-l-4 border-amber-300 flex items-center justify-between px-3 text-white"
            style={{ transform: 'rotateZ(4deg) translateX(4px)' }}
          >
            <span className="text-[9px] font-bold tracking-widest uppercase opacity-90">Calculus & Stats</span>
            {/* Dangling Silk Bookmark Ribbon */}
            <div className="absolute -bottom-3 right-6 w-3 h-6 bg-amber-400 shadow-md rounded-b-xs transform rotate-6 border-t border-amber-600" />
            {/* Page texture */}
            <div className="absolute right-0 top-1 bottom-1 w-2.5 bg-gradient-to-l from-stone-100 to-stone-300 border-l border-stone-400 rounded-r-xs" />
          </div>

          {/* Book 3 (Top - Cream & Gold Masterclass Notebook) */}
          <div 
            className="relative w-[92%] h-7 -mt-1 bg-gradient-to-r from-[#FAF6ED] via-[#FFFDF9] to-[#EFE7D8] rounded-r-md shadow-lg border-l-4 border-indigo-600 flex items-center justify-between px-3 text-stone-800 border-t border-white"
            style={{ transform: 'rotateZ(-3deg) translateX(8px)' }}
          >
            <span className="text-[8.5px] font-black tracking-wider uppercase text-indigo-900 flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5 text-indigo-600" /> Notes & Lab
            </span>
            <div className="w-12 h-1 bg-indigo-200 rounded-full" />
            {/* Page texture */}
            <div className="absolute right-0 top-0.5 bottom-0.5 w-2 bg-gradient-to-l from-stone-200 to-stone-300 rounded-r-xs" />
          </div>
        </div>

        {/* --- 3D OBJECT 3: GLOWING 3D IDEA BULB (IDEAS & SKILLS) --- */}
        <div 
          className="absolute top-4 left-44 w-20 h-28 animate-float-drift"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateZ(12deg)' }}
        >
          {/* Bulb Radiant Glow Halo */}
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-amber-400/30 blur-xl animate-pulse-glow" />

          {/* 3D Glass Bulb Dome */}
          <div 
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100/90 via-amber-300/80 to-amber-500/90 p-2 shadow-3d-glow-warm relative border border-amber-200/90 backdrop-blur-xs flex items-center justify-center"
            style={{
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45), inset 0 4px 10px rgba(255, 255, 255, 0.9), inset 0 -4px 8px rgba(217, 119, 6, 0.4)'
            }}
          >
            {/* Glass Glare Reflection Line */}
            <div className="absolute top-2 left-2.5 w-4 h-6 rounded-full bg-white/80 transform -rotate-45 blur-[0.5px]" />

            {/* Glowing Filament Loop */}
            <div className="w-6 h-6 rounded-t-full border-2 border-amber-100 flex items-center justify-center shadow-xs">
              <Lightbulb className="w-4 h-4 text-white fill-amber-200 animate-pulse" />
            </div>
          </div>

          {/* Brass Metallic Socket Base */}
          <div className="w-8 mx-auto -mt-2 space-y-0.5 relative z-10">
            <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-xs shadow-xs" />
            <div className="h-1.5 bg-gradient-to-r from-amber-800 via-amber-500 to-amber-800 rounded-xs shadow-xs" />
            <div className="h-1 bg-stone-900 rounded-b-md mx-auto w-5" />
          </div>
        </div>

        {/* --- 3D FLOATING SKILL CARD (P2P PEER CARD) --- */}
        <div 
          className="absolute -bottom-6 left-12 glass-warm px-3.5 py-2.5 rounded-2xl shadow-3d-ambient border border-white/90 flex items-center gap-2.5 animate-float-quick"
          style={{ transform: 'rotateX(8deg) rotateY(-10deg) rotateZ(3deg)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-black text-stone-800 flex items-center gap-1">
              <span>Full-Stack Dev</span>
              <span className="text-indigo-600">⇄</span>
              <span className="text-emerald-700">Figma</span>
            </div>
            <div className="text-[9px] text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Campus Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RIGHT 3D CLUSTER: Peer Exchange, Community, Graduation & Swapping     */}
      {/* ========================================================================= */}
      <div 
        className="absolute top-10 right-2 sm:right-6 lg:right-12 w-[340px] xl:w-[420px] h-[520px] transition-transform duration-700 ease-out preserve-3d"
        style={parallaxRight}
      >
        {/* --- 3D OBJECT 4: 3D GRADUATION CAP (ACADEMIC MILESTONE & SUCCESS) --- */}
        <div 
          className="absolute top-6 right-20 w-44 xl:w-48 animate-float-slow"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(28deg) rotateY(-18deg) rotateZ(14deg)' }}
        >
          {/* Ambient Shadow */}
          <div className="absolute top-20 left-2 w-40 h-12 bg-stone-900/20 rounded-full blur-xl transform scale-y-60" />

          {/* 3D Mortarboard Rhombus Top */}
          <div 
            className="w-36 h-36 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 rounded-xl shadow-2xl relative border border-stone-700/70 transform rotate-45 flex items-center justify-center"
            style={{
              boxShadow: '0 15px 35px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.2)'
            }}
          >
            {/* Beveled Center Gold Rivet */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-md border border-amber-200 z-20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-100" />
            </div>

            {/* Silk Fabric Shading Sheen */}
            <div className="absolute inset-2 rounded-lg bg-gradient-to-tr from-white/10 via-transparent to-black/30 pointer-events-none" />

            {/* Flowing Gold Tassel String & Drape */}
            <div 
              className="absolute top-1/2 left-1/2 w-16 h-28 pointer-events-none z-10"
              style={{ transformOrigin: 'top left', transform: 'rotate(-45deg)' }}
            >
              {/* String */}
              <div className="w-1 h-16 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full ml-1.5 shadow-sm transform -rotate-12" />
              {/* Tassel Fringe Cluster */}
              <div className="w-4 h-10 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 rounded-b-md shadow-lg border-t-2 border-amber-300 -mt-1 ml-0 flex flex-col justify-end p-0.5">
                <div className="h-0.5 bg-amber-800 rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* Skull Cap Base Cylinder under Mortarboard */}
          <div className="w-24 h-10 -mt-14 mx-auto bg-gradient-to-b from-stone-800 to-stone-950 rounded-b-full shadow-2xl border-t border-stone-700" />
        </div>

        {/* --- 3D OBJECT 5: 3D PEER-TO-PEER SWAP TOKEN / DYNAMIC EXCHANGE BADGE --- */}
        <div 
          className="absolute top-52 right-4 w-48 xl:w-52 animate-float-reverse"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(24deg) rotateZ(-6deg)' }}
        >
          {/* Outer Ambient Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl animate-pulse-glow" />

          {/* 3D Gold / Champagne Medallion */}
          <div 
            className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-[#FFF8EE] via-[#F6E2C7] to-[#DFBA8E] p-3 shadow-3d-ambient border-2 border-white relative flex items-center justify-center"
            style={{
              boxShadow: '0 20px 40px -8px rgba(180, 120, 60, 0.35), inset 0 4px 8px rgba(255, 255, 255, 0.9), inset 0 -6px 12px rgba(160, 100, 40, 0.3)'
            }}
          >
            {/* Inner Ring with Relief Chamfer */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#FAEDE0] to-[#FFFFFF] p-2 flex flex-col items-center justify-center shadow-inner border border-amber-300/40 relative">
              {/* Dynamic 3D Curved Exchange Arrows */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-7 h-7 text-amber-300 animate-pulse" />
              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-amber-900 mt-1">
                Zero-Cash Swap
              </span>
            </div>

            {/* Orbiting Micro Node */}
            <div className="absolute -top-1.5 right-4 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>
        </div>

        {/* --- 3D OBJECT 6: FROSTED GLASS CHAT & PEER COMMUNITY BUBBLE --- */}
        <div 
          className="absolute top-28 right-44 glass-warm px-4 py-3 rounded-2xl shadow-3d-glow-lavender border border-white/90 animate-float-drift"
          style={{ transform: 'rotateX(12deg) rotateY(16deg) rotateZ(-4deg)' }}
        >
          {/* Glass Gloss Sheen */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-[10px] font-bold text-stone-700">Peer Exchange Chat</span>
          </div>
          
          {/* Interactive Chat Bubble Dots */}
          <div className="bg-white/80 rounded-xl p-2 border border-stone-100 shadow-inner flex items-center gap-1.5">
            <span className="text-[9.5px] text-stone-600 font-medium">"Deal! Let's swap at library"</span>
            <div className="flex items-center gap-1 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>

        {/* --- 3D OBJECT 7: PHYSICAL ITEM SWAP CARD (COLLEGE RESOURCES) --- */}
        <div 
          className="absolute -bottom-4 right-14 glass-warm px-3.5 py-2.5 rounded-2xl shadow-3d-ambient border border-white/90 flex items-center gap-2.5 animate-float-quick"
          style={{ transform: 'rotateX(6deg) rotateY(12deg) rotateZ(-2deg)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-black text-stone-800 flex items-center gap-1">
              <span>TI-84 Calc</span>
              <span className="text-emerald-600">⇄</span>
              <span className="text-indigo-600">Lab Kit</span>
            </div>
            <div className="text-[9px] text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Campus Pickup Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FLOATING 3D SPARKLE STARS & AMBIENT COMMUNITY PARTICLES               */}
      {/* ========================================================================= */}
      {/* Star 1 (Left Top) */}
      <div className="absolute top-16 left-[22%] text-amber-400 animate-twinkle opacity-70">
        <Sparkles className="w-5 h-5 drop-shadow-sm" />
      </div>

      {/* Star 2 (Right Mid) */}
      <div className="absolute top-24 right-[25%] text-purple-400 animate-twinkle opacity-70" style={{ animationDelay: '1.2s' }}>
        <Sparkles className="w-6 h-6 drop-shadow-sm" />
      </div>

      {/* Star 3 (Bottom Left) */}
      <div className="absolute bottom-16 left-[18%] text-emerald-500 animate-twinkle opacity-60" style={{ animationDelay: '0.8s' }}>
        <Sparkles className="w-4 h-4 drop-shadow-sm" />
      </div>

      {/* Star 4 (Bottom Right) */}
      <div className="absolute bottom-20 right-[20%] text-amber-500 animate-twinkle opacity-60" style={{ animationDelay: '1.8s' }}>
        <Sparkles className="w-5 h-5 drop-shadow-sm" />
      </div>
    </div>
  );
};
