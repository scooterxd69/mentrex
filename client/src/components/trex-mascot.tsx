interface TRexMascotProps {
  size?: number;
  animate?: "wave" | "point" | "nod" | "none";
  className?: string;
}

export default function TRexMascot({ size = 80, animate = "none", className = "" }: TRexMascotProps) {
  const getAnimationClass = () => {
    switch (animate) {
      case "wave":
        return "animate-wave";
      case "point":
        return "animate-point";
      case "nod":
        return "animate-nod";
      default:
        return "";
    }
  };

  return (
    <div className={`inline-block ${getAnimationClass()} ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <g className="trex-body">
          <ellipse cx="50" cy="65" rx="18" ry="22" fill="#4CAF50" />
          <circle cx="50" cy="40" r="16" fill="#4CAF50" />
          <ellipse cx="50" cy="42" rx="18" ry="14" fill="#66BB6A" />
          <ellipse cx="36" cy="64" rx="5" ry="3" fill="#66BB6A" />
          <ellipse cx="64" cy="64" rx="5" ry="3" fill="#66BB6A" />
          <path d="M 45 35 Q 40 30 35 32" stroke="#2E7D32" strokeWidth="2" fill="none" className={animate === "wave" ? "animate-arm-wave" : ""} />
          <path d="M 55 35 Q 60 30 65 32" stroke="#2E7D32" strokeWidth="2" fill="none" className={animate === "point" ? "animate-arm-point" : ""} />
        </g>
        
        <g className="trex-face">
          <circle cx="44" cy="38" r="3" fill="#1B5E20" />
          <circle cx="56" cy="38" r="3" fill="#1B5E20" />
          <circle cx="45" cy="38.5" r="1" fill="white" />
          <circle cx="57" cy="38.5" r="1" fill="white" />
          <path d="M 40 48 Q 50 52 60 48" stroke="#FF9800" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        <g className="trex-details">
          <path d="M 44 28 L 46 24 L 48 28" fill="#FF9800" />
          <path d="M 50 26 L 52 22 L 54 26" fill="#FF9800" />
          <path d="M 56 28 L 58 24 L 60 28" fill="#FF9800" />
          <rect x="35" y="85" width="8" height="10" rx="2" fill="#4CAF50" />
          <rect x="57" y="85" width="8" height="10" rx="2" fill="#4CAF50" />
          <ellipse cx="38" cy="94" rx="4" ry="2" fill="#2E7D32" />
          <ellipse cx="61" cy="94" rx="4" ry="2" fill="#2E7D32" />
        </g>

        <g className="trex-tail">
          <path d="M 32 70 Q 20 75 18 85" stroke="#4CAF50" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 32 70 Q 20 75 18 85" stroke="#66BB6A" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        
        @keyframes point {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes nod {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        @keyframes arm-wave {
          0%, 100% { transform: rotate(0deg); transform-origin: 45px 35px; }
          50% { transform: rotate(-20deg); transform-origin: 45px 35px; }
        }

        @keyframes arm-point {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        .animate-point {
          animation: point 1.5s ease-in-out infinite;
        }
        
        .animate-nod {
          animation: nod 2s ease-in-out infinite;
        }

        .animate-arm-wave {
          animation: arm-wave 1s ease-in-out infinite;
        }

        .animate-arm-point {
          animation: arm-point 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
