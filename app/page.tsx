'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Launch animation timing
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }, 3000); // 3 seconds for launch animation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {

    let animationId: number;
    let time = 0;
    let isHovered = false;
    let mouseX = 600;

    // Generate multiple wave paths with different characteristics
    const generateWavePaths = (animationTime: number, hoverMouseX: number, isMouseHover: boolean) => {
      const width = 1200;
      const height = 300;
      const centerY = height / 2;

      const waveConfigs = [
        { frequency: 0.015, amplitude: 20, speed: 0.02, offset: 0 },
        { frequency: 0.022, amplitude: 15, speed: 0.025, offset: Math.PI / 3 },
        { frequency: 0.018, amplitude: 12, speed: 0.018, offset: Math.PI / 2 },
        { frequency: 0.012, amplitude: 8, speed: 0.015, offset: Math.PI },
        { frequency: 0.025, amplitude: 6, speed: 0.03, offset: Math.PI * 1.5 }
      ];

      return waveConfigs.map((config, index) => {
        let path = `M 0 ${centerY}`;

        for (let x = 0; x <= width; x += 3) {
          // Continuous wave animation with unique characteristics
          const waveOffset = animationTime * config.speed + config.offset;
          let y = centerY + Math.sin(x * config.frequency + waveOffset) * config.amplitude;

          // Add hover amplification effect
          if (isMouseHover) {
            const distanceFromMouse = Math.abs(x - hoverMouseX);
            const hoverInfluence = Math.max(0, 1 - distanceFromMouse / 150);

            if (hoverInfluence > 0) {
              // Faster, more intense wave near cursor
              const hoverAmplitude = (80 - index * 12); // Higher amplitude
              const speedMultiplier = 2 + hoverInfluence * 2; // Faster near cursor
              const hoverFrequency = config.frequency * (2 + index * 0.5);
              const hoverWave = Math.sin(x * hoverFrequency + waveOffset * speedMultiplier) * hoverAmplitude * hoverInfluence;
              y += hoverWave;

              // Add secondary wave for more complexity
              const secondaryWave = Math.sin(x * hoverFrequency * 1.3 + waveOffset * speedMultiplier * 0.8) * (hoverAmplitude * 0.6) * hoverInfluence;
              y += secondaryWave;
            }
          }

          path += ` L ${x} ${y}`;
        }

        return path;
      });
    };

    // Animation loop
    const animate = () => {
      time += 1;
      const paths = generateWavePaths(time, mouseX, isHovered);

      paths.forEach((path, index) => {
        const audioWavePath = document.querySelector(`.audio-wave-path-${index + 1}`);
        if (audioWavePath) {
          (audioWavePath as SVGPathElement).setAttribute('d', path);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate mouse position as percentages
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Update mouse position for wave
      mouseX = (clientX / innerWidth) * 1200;

      // Check if mouse is over hero section
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        isHovered = clientX >= rect.left && clientX <= rect.right &&
                   clientY >= rect.top && clientY <= rect.bottom;
      }

      // Apply parallax to hero content
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        const x = xPercent * 3;
        const y = yPercent * 3;
        (heroContent as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    // Start animation
    animate();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="launch-screen">
        <div className="launch-content">
          <div className="launch-logo">
            <div className="logo-text">
              <span className="logo-letter">J</span>
              <span className="logo-letter">U</span>
              <span className="logo-letter">D</span>
              <span className="logo-letter">E</span>
            </div>
            <div className="logo-subtitle">Sound Designer</div>
          </div>

          {/* Loading progress */}
          <div className="loading-progress">
            <div className="progress-bar-container">
              <div className="progress-bar-fill"></div>
            </div>
            <p className="loading-text">Preparing the Experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`main-container ${showContent ? 'content-visible' : 'content-hidden'}`}>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Audio Wave */}
        <div className="audio-wave-container">
          <svg className="audio-wave-svg" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <path className="audio-wave-path-1" d="" stroke="rgba(163, 191, 217, 0.6)" strokeWidth="2" fill="none" />
            <path className="audio-wave-path-2" d="" stroke="rgba(77, 108, 140, 0.4)" strokeWidth="1.5" fill="none" />
            <path className="audio-wave-path-3" d="" stroke="rgba(163, 191, 217, 0.3)" strokeWidth="1" fill="none" />
            <path className="audio-wave-path-4" d="" stroke="rgba(77, 108, 140, 0.2)" strokeWidth="0.8" fill="none" />
            <path className="audio-wave-path-5" d="" stroke="rgba(163, 191, 217, 0.15)" strokeWidth="0.6" fill="none" />
          </svg>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Jude Wade
          </h1>
          <p className="hero-subtitle">
            Sound Designer & Audio Engineer
          </p>
          <p className="hero-description">
            Creating immersive audio experiences for film, games, and interactive media.
            Transforming stories through sound design, music composition, and audio post-production.
          </p>
          <div className="hero-buttons">
            <a href="#portfolio" className="hero-button-primary">
              View Work
            </a>
            <a href="#contact" className="hero-button-secondary">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-title">
            Work
          </h2>

          <div className="portfolio-video-container">
            <video
              className="portfolio-video"
              controls
              playsInline
              preload="metadata"
              poster="/image.png"
            >
              <source src={process.env.NEXT_PUBLIC_VIDEO_MP4 || '/jude_wade_reel.mp4'} type="video/mp4" />
              <source src={process.env.NEXT_PUBLIC_VIDEO_WEBM || '/jude_wade_reel.webm'} type="video/webm" />
              Your browser does not support the video tag
            </video>
          </div>
        </div>  
        <div>
            <a href="https://youtu.be/c99RnINHh-Y" target="_blank">
              <button className="hero-button-primary">
                Watch on YouTube
              </button>
            </a>
        </div>
      </section>

      {/* Resume & Certifications Section */}
      <section id="resume" className="resume-section">
        <div className="resume-container">
          <h2 className="resume-title">
            Resume & Certifications
          </h2>

          <div className="resume-content">
            {/* Resume Preview */}
            <div className="resume-preview">
              <h3 className="resume-subtitle">Professional Resume</h3>
              <div className="resume-viewer">
                <img
                  src="/Jude_Wade_Resume_2026.png"
                  alt="Jude Wade Resume"
                  className="resume-image"
                />
              </div>
              <div className="resume-actions">
                <a href="/Jude-Wade-Resume-2026.pdf" className="resume-button" download>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download PDF
                </a>
                <a href="/Jude-Wade-Resume-2026.pdf" className="resume-button resume-button-secondary" target="_blank">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Open Full View
                </a>
              </div>
            </div>

            {/* Certifications */}
            <div className="certifications">
              <h3 className="resume-subtitle">Professional Certifications</h3>
              <div className="certifications-grid">
                <a href="/protools.avif" target="_blank" className="certification-item">
                  <img
                    src="/protools.avif"
                    alt="Pro Tools Certified"
                    className="certification-badge"
                  />
                </a>

                <a href="/Certificatenoexpiration_Wellfordsignature20250918-32-6z7jji-1.png" target="_blank" className="certification-item">
                  <img
                    src="/Certificatenoexpiration_Wellfordsignature20250918-32-6z7jji-1.png"
                    alt="Audio Engineering Society Member"
                    className="certification-badge"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="about-title">
            About Me
          </h2>
          <p className="about-description">
            I am a SCAD Alumni that is passionate about creating compelling soundscapes,
            that enhance storytelling and user experience. I try to bring stories to life through carefully crafted audio design.
          </p>

          <div className="skills-grid">
            <div className="skill-item">
              <div className="skill-icon icon-accent">
                <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
              <h3 className="skill-title">Music Composition</h3>
              <p className="skill-description">Original scores and soundtracks</p>
            </div>

            <div className="skill-item">
              <div className="skill-icon icon-hover">
                <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                </svg>
              </div>
              <h3 className="skill-title">Sound Design</h3>
              <p className="skill-description">Custom audio effects and atmospheres</p>
            </div>

            <div className="skill-item">
              <div className="skill-icon icon-accent">
                <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              </div>
              <h3 className="skill-title">Audio Engineering</h3>
              <p className="skill-description">Mixing, mastering, and post-production</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">
            Let&apos;s Create Together
          </h2>

          <div className="contact-buttons">
            <a href="mailto:judewadesounddesign@gmail.com" className="contact-button-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Email Me
            </a>
            <a href="https://www.linkedin.com/in/jude-wade-21ab98234/" className="contact-button-secondary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Jude Wade. All rights reserved.</p>
      </footer>
    </div>
  );
}
