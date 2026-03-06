'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const desktopVideoRefs = useRef([]);
  const mobileVideoRefs = useRef([]);
  const projectItemRefs = useRef([]);
  const isWheelLocked = useRef(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.log('Supabase not connected yet — showing empty state');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Intersection observer for mobile scrolling autoplay
  useEffect(() => {
    if (window.innerWidth >= 768) return; 

    const videos = mobileVideoRefs.current.filter(Boolean);
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const idx = parseInt(video.dataset.index, 10);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.play().catch(() => {});
            setActiveIndex(idx);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px' }
    );

    videos.forEach((v) => observer.observe(v));
    return () => videos.forEach((v) => observer.unobserve(v));
  }, [projects]);

  // Desktop Global Scroll Handler (Reels-style snapping)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (projects.length === 0) return;

    const handleWheel = (e) => {
      // Ignore background trackpad momentum or if we're mid-transition
      if (isWheelLocked.current) return;
      if (Math.abs(e.deltaY) < 20) return;

      let nextIndex = activeIndex;
      if (e.deltaY > 0) {
        // Scrolling down
        nextIndex = Math.min(activeIndex + 1, projects.length - 1);
      } else {
        // Scrolling up
        nextIndex = Math.max(activeIndex - 1, 0);
      }

      if (nextIndex !== activeIndex) {
        isWheelLocked.current = true;
        changeDesktopActive(nextIndex);
        
        // Lock wheel for 800ms to allow smooth visual crossfade
        setTimeout(() => {
          isWheelLocked.current = false;
        }, 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIndex, projects]);

  const toggleGlobalMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUnmuted(!isUnmuted);
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const changeDesktopActive = (idx) => {
    if (activeIndex !== idx) {
      setVideoProgress(0); 
    }
    setActiveIndex(idx);
    
    if (desktopVideoRefs.current[idx]) {
      desktopVideoRefs.current[idx].play().catch(() => {});
    }
    
    desktopVideoRefs.current.forEach((vid, i) => {
      if (i !== idx && vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    // Programmatically scroll the UI list down so the user sees the active item
    if (projectItemRefs.current[idx]) {
      projectItemRefs.current[idx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleMouseEnter = (idx) => {
    if (window.innerWidth >= 768 && activeIndex !== idx && !isWheelLocked.current) {
      changeDesktopActive(idx);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.skeleton}></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={styles.emptyHero}>
        <p className={styles.emptyText}>Featured projects will appear here</p>
        <span className={styles.emptySubtext}>
          Add projects via the admin dashboard and mark them as featured
        </span>
      </div>
    );
  }

  return (
    <section className={styles.homeContainer}>
      <button className={styles.desktopSoundToggle} onClick={toggleGlobalMute}>
        {isUnmuted ? "MUTE" : "UNMUTE"}
      </button>

      {/* DESKTOP BACKGROUND LAYER: Purely visuals, isolated Z-index */}
      <div className={styles.desktopBgLayer}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          return (
            <div key={`bg-${project.id}`} className={`${styles.desktopBgWrapper} ${isActive ? styles.activeBg : ''}`}>
              {project.video_url ? (
                <video
                  ref={(el) => (desktopVideoRefs.current[i] = el)}
                  muted={!isUnmuted || !isActive}
                  loop
                  playsInline
                  autoPlay={i === 0} 
                  preload="metadata"
                  src={project.video_url}
                  className={styles.bgVideoField}
                  style={{ objectPosition: project.video_alignment || 'center center' }}
                  onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                />
              ) : project.thumbnail_url ? (
                <img src={project.thumbnail_url} alt={project.title} className={styles.bgVideoField} />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* SCROLLABLE LIST LAYER: Interactive text on Desktop, full feed on Mobile */}
      <div className={styles.listWrapper}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          
          return (
            <div 
              key={project.id} 
              ref={(el) => (projectItemRefs.current[i] = el)}
              className={`${styles.projectBlock} ${isActive ? styles.activeBlock : ''}`}
              onMouseEnter={() => handleMouseEnter(i)}
            >
              {/* MOBILE VIDEO WRAPPER: Hidden cleanly on desktop */}
              <div className={styles.mobileVideoWrapper}>
                {project.video_url ? (
                  <video
                    ref={(el) => (mobileVideoRefs.current[i] = el)}
                    data-index={i}
                    muted={!isUnmuted || !isActive}
                    loop
                    playsInline
                    autoPlay={i === 0} 
                    preload="metadata"
                    src={project.video_url}
                    className={styles.videoField}
                    style={{ objectPosition: project.video_alignment || 'center center' }}
                  />
                ) : project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.title} className={styles.videoField} />
                ) : <div className={styles.placeholderBg} />}
                
                <button className={styles.mobileSoundToggle} onClick={toggleGlobalMute}>
                  {isUnmuted ? "MUTE" : "UNMUTE"}
                </button>
              </div>
              
              <Link href={`/work/${project.slug}`} className={styles.projectInfo}>
                {isActive && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ transform: `scaleX(${videoProgress / 100})` }} />
                  </div>
                )}
                <div className={styles.infoContent}>
                  <span className={styles.titleInfo}>
                    {project.title} <span className={styles.separator}>—</span> <span className={styles.client}>{project.client}</span>
                  </span>
                  <span className={styles.category}>{project.category}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
