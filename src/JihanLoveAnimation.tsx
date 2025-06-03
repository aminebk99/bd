import React, { useState, useEffect } from 'react';
import { Heart, Gift, Sparkles, Star } from 'lucide-react';

interface Particle {
  id: number;
  angle: number;
  speed: number;
  color: string;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

interface FireworkParticleProps {
  particle: Particle;
  explosion: Explosion;
}

interface FloatingElementProps {
  delay: number;
  size?: string;
  position?: string;
}

const JihanLoveAnimation: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  const createExplosion = (x: number, y: number): void => {
    const newExplosion: Explosion = {
      id: Date.now() + Math.random(),
      x,
      y,
      particles: Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 30) * (Math.PI / 180),
        speed: 2 + Math.random() * 3,
        color: ['#ff6b9d', '#c44569', '#f8b500', '#3742fa', '#70a1ff'][Math.floor(Math.random() * 5)]
      }))
    };
    
    setExplosions(prev => [...prev, newExplosion]);
    
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
    }, 2000);
  };

  const createRandomFireworks = (): number => {
    const interval = setInterval(() => {
      if (showFireworks) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);
        createExplosion(x, y);
      }
    }, 800);
    
    return interval;
  };

  const startAnimation = (): void => {
    // Initial boom effect
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createExplosion(
          window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          window.innerHeight / 2 + (Math.random() - 0.5) * 200
        );
      }, i * 200);
    }
    
    setIsAnimating(true);
    setCurrentPhase(1);
    setShowFireworks(true);
  };

  useEffect(() => {
    let fireworksInterval: number | undefined;
    
    if (showFireworks) {
      fireworksInterval = createRandomFireworks();
    }
    
    return () => {
      if (fireworksInterval) clearInterval(fireworksInterval);
    };
  }, [showFireworks]);

  useEffect(() => {
    if (!isAnimating) return;

    const phases = [
      { duration: 2000, phase: 1 },
      { duration: 3000, phase: 2 },
      { duration: 3000, phase: 3 },
      { duration: 4000, phase: 4 },
      { duration: 3000, phase: 5 },
    ];

    let timeoutId: number;
    let currentIndex = 0;

    const nextPhase = (): void => {
      if (currentIndex < phases.length - 1) {
        currentIndex++;
        setCurrentPhase(phases[currentIndex].phase);
        timeoutId = setTimeout(nextPhase, phases[currentIndex].duration);
      }
    };

    timeoutId = setTimeout(nextPhase, phases[0].duration);

    return () => clearTimeout(timeoutId);
  }, [isAnimating]);

  const FireworkParticle: React.FC<FireworkParticleProps> = ({ particle, explosion }) => {
    const x = explosion.x + Math.cos(particle.angle) * particle.speed * 50;
    const y = explosion.y + Math.sin(particle.angle) * particle.speed * 50;
    
    return (
      <div
        className="absolute w-2 h-2 rounded-full animate-ping"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          backgroundColor: particle.color,
          animationDuration: '1s'
        }}
      />
    );
  };

  const FloatingHeart: React.FC<FloatingElementProps> = ({ 
    delay, 
    size = 'w-6 h-6', 
    position = 'top-1/4 left-1/4' 
  }) => (
    <div 
      className={`absolute ${position} animate-bounce text-pink-500 z-20`}
      style={{ animationDelay: `${delay}ms`, animationDuration: '2s' }}
    >
      <Heart className={`${size} fill-current drop-shadow-lg`} />
    </div>
  );

  const FloatingStar: React.FC<FloatingElementProps> = ({ 
    delay, 
    position = 'top-1/3 right-1/4' 
  }) => (
    <div 
      className={`absolute ${position} animate-spin text-yellow-400 z-20`}
      style={{ animationDelay: `${delay}ms`, animationDuration: '3s' }}
    >
      <Star className="w-4 h-4 fill-current drop-shadow-lg" />
    </div>
  );

  const FloatingSparkle: React.FC<FloatingElementProps> = ({ 
    delay, 
    position = 'top-2/3 left-1/3' 
  }) => (
    <div 
      className={`absolute ${position} animate-pulse text-purple-400 z-20`}
      style={{ animationDelay: `${delay}ms`, animationDuration: '1.5s' }}
    >
      <Sparkles className="w-5 h-5 drop-shadow-lg" />
    </div>
  );

  const resetAnimation = (): void => {
    setIsAnimating(false);
    setCurrentPhase(0);
    setShowFireworks(false);
    setExplosions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Fireworks explosions */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {explosions.map((explosion: Explosion) => (
          <div key={explosion.id}>
            {explosion.particles.map((particle: Particle) => (
              <FireworkParticle
                key={particle.id}
                particle={particle}
                explosion={explosion}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 30 }).map((_, i: number) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: ['#ffffff', '#ffd700', '#ff69b4', '#87ceeb'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {showFireworks && (
        <div className="absolute inset-0 overflow-hidden z-5">
          {Array.from({ length: 5 }).map((_, i: number) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animation: `shootingStar 3s linear infinite`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-20 text-center max-w-2xl mx-auto">
        {!isAnimating ? (
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 font-serif drop-shadow-2xl">
                ✨ For My Beautiful Jihan ✨
              </h1>
              <div className="absolute -top-4 -right-4 animate-spin-slow">
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-bounce">
                <Heart className="w-6 h-6 text-pink-400 fill-current" />
              </div>
            </div>
            
            <button
              onClick={startAnimation}
              className="group relative px-16 py-8 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 hover:scale-110 transform animate-pulse"
            >
              <span className="relative z-10 flex items-center gap-4">
                <Heart className="w-8 h-8 group-hover:animate-pulse fill-current" />
                💥 Click for Magic Boom! 💥
                <Sparkles className="w-8 h-8 group-hover:animate-spin" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-700 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
            </button>
          </div>
        ) : (
          <div className="space-y-8 relative">
            {/* Floating decorations */}
            {isAnimating && (
              <>
                <FloatingHeart delay={0} position="top-0 left-0" />
                <FloatingHeart delay={500} position="top-0 right-0" size="w-8 h-8" />
                <FloatingHeart delay={1000} position="bottom-0 left-1/4" />
                <FloatingHeart delay={1500} position="bottom-0 right-1/4" size="w-10 h-10" />
                <FloatingStar delay={200} position="top-1/4 left-1/4" />
                <FloatingStar delay={800} position="top-1/4 right-1/4" />
                <FloatingStar delay={1200} position="bottom-1/4 left-1/3" />
                <FloatingSparkle delay={400} position="top-1/3 left-1/6" />
                <FloatingSparkle delay={900} position="top-1/3 right-1/6" />
                <FloatingSparkle delay={1400} position="bottom-1/3 center" />
              </>
            )}

            {/* Phase 1: Hearts floating */}
            {currentPhase >= 1 && (
              <div className="animate-fade-in">
                <div className="flex justify-center items-center space-x-4 mb-8">
                  {Array.from({ length: 7 }).map((_, i: number) => (
                    <Heart 
                      key={i}
                      className={`w-12 h-12 text-pink-400 fill-current animate-bounce drop-shadow-lg`}
                      style={{ 
                        animationDelay: `${i * 200}ms`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Phase 2: Name reveal */}
            {currentPhase >= 2 && (
              <div className="animate-fade-in space-y-4">
                <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent font-serif animate-pulse drop-shadow-2xl">
                  Jihan
                </h1>
                <p className="text-3xl text-pink-200 font-light drop-shadow-lg">
                  💖 From Agadir with Endless Love 💖
                </p>
                <div className="text-4xl animate-bounce">
                  🌹✨🌹
                </div>
              </div>
            )}

            {/* Phase 3: Birthday message */}
            {currentPhase >= 3 && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-center items-center space-x-4 flex-wrap">
                  <Gift className="w-16 h-16 text-yellow-400 animate-bounce" />
                  <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
                    Happy 21st Birthday!
                  </h2>
                  <Gift className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="text-8xl animate-bounce" style={{ animationDelay: '1s' }}>
                  🎉🎂🎈🎊🥳
                </div>
                <p className="text-2xl text-yellow-200 font-semibold drop-shadow-lg">
                  21 Years of Pure Magic! ✨
                </p>
              </div>
            )}

            {/* Phase 4: Love message */}
            {currentPhase >= 4 && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-10 border-2 border-pink-500/50 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 animate-pulse" />
                  <div className="relative z-10">
                    <p className="text-3xl md:text-4xl text-white font-light leading-relaxed mb-6">
                      ✨ You light up my world like fireworks in the sky ✨
                    </p>
                    <p className="text-2xl md:text-3xl text-pink-200 mb-6">
                      💖 Every day with you is a grand celebration 💖
                    </p>
                    <p className="text-xl md:text-2xl text-purple-200 mb-6">
                      🌟 21 years of being absolutely incredible! 🌟
                    </p>
                    <p className="text-lg md:text-xl text-yellow-200">
                      🎆 You deserve all the fireworks in the world! 🎆
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 5: Final celebration */}
            {currentPhase >= 5 && (
              <div className="animate-fade-in space-y-8">
                <div className="text-9xl animate-pulse">
                  💕🎊💖🎆💕
                </div>
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/30">
                  <h3 className="text-4xl font-bold text-white mb-4">
                    🎉 Forever & Always 🎉
                  </h3>
                  <p className="text-2xl text-pink-200">
                    My heart explodes with joy for you! 💥💖
                  </p>
                </div>
                <button
                  onClick={resetAnimation}
                  className="mt-8 px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-110 transform transition-all duration-500 shadow-2xl hover:shadow-purple-500/50"
                >
                  🎆 Create More Magic! 🎆
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes shootingStar {
          0% { transform: translateX(-100px) translateY(-100px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px); opacity: 0; }
        }
        
        .animate-fade-in {
          animation: fade-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default JihanLoveAnimation;