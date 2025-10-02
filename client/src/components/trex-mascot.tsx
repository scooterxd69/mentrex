import trexImage from "@assets/Full-body cartoonish_1759425586383.png";

interface TRexMascotProps {
  size?: number;
  animate?: "wave" | "point" | "nod" | "bounce" | "none";
  className?: string;
}

export default function TRexMascot({ size = 80, animate = "none", className = "" }: TRexMascotProps) {
  const getAnimationClass = () => {
    switch (animate) {
      case "wave":
        return "animate-trex-wave";
      case "point":
        return "animate-trex-point";
      case "nod":
        return "animate-trex-nod";
      case "bounce":
        return "animate-trex-bounce";
      default:
        return "";
    }
  };

  return (
    <>
      <img
        src={trexImage}
        alt="Mentor T-Rex"
        className={`inline-block ${getAnimationClass()} ${className}`}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      
      <style>{`
        @keyframes trex-wave {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.05); }
          75% { transform: rotate(10deg) scale(1.05); }
        }
        
        @keyframes trex-point {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        
        @keyframes trex-nod {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        @keyframes trex-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        
        .animate-trex-wave {
          animation: trex-wave 2s ease-in-out infinite;
          transform-origin: center bottom;
        }
        
        .animate-trex-point {
          animation: trex-point 1.5s ease-in-out infinite;
        }
        
        .animate-trex-nod {
          animation: trex-nod 2s ease-in-out infinite;
        }

        .animate-trex-bounce {
          animation: trex-bounce 1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
