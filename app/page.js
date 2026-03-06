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
  const videoRefs = useRef([]);

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
  // Desktop relies on hover events instead
  useEffect(() => {
    if (window.innerWidth >= 768) return; 

    const videos = videoRefs.current.filter(Boolean);
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

  const handleMouseEnter = (idx) => {
    if (window.innerWidth >= 768) {
      if (activeIndex !== idx) {
        setVideoProgress(0); // Reset progress when switching
      }
      setActiveIndex(idx);
      
      // Play the newly active video instantly
      if (videoRefs.current[idx]) {
        videoRefs.current[idx].play().catch(() => {});
      }
      
      // Pause others to save resources
      videoRefs.current.forEach((vid, i) => {
        if (i !== idx && vid) {
          vid.pause();
          vid.currentTime = 0; // Optional: restart logic
        }
      });
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
      {/* Desktop Sound Toggle */}
      <button className={styles.desktopSoundToggle} onClick={toggleGlobalMute}>
        {isUnmuted ? "MUTE" : "UNMUTE"}
      </button>

      <div className={styles.listWrapper}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          
          return (
            <div 
              key={project.id} 
              className={`${styles.projectBlock} ${isActive ? styles.activeBlock : ''}`}
              onMouseEnter={() => handleMouseEnter(i)}
            >
              <div className={styles.videoWrapper}>
                {project.video_url ? (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    data-index={i}
                    muted={!isUnmuted || !isActive}
                    loop
                    playsInline
                    autoPlay={i === 0} 
                    preload="metadata"
                    src={project.video_url}
                    className={styles.videoField}
                    style={{ objectPosition: project.video_alignment || 'center center' }}
                    onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                  />
              ) : project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className={styles.videoField}
                  loading="lazy"
                />
              ) : (
                <div className={styles.placeholderBg} />
              )}
              
              {/* Mobile Sound Toggle inside the wrapper so it overlays the video */}
              <button 
                className={styles.mobileSoundToggle} 
                onClick={toggleGlobalMute}
              >
                {isUnmuted ? "MUTE" : "UNMUTE"}
              </button>
              
              {/* Project Info Overlay */}
              <Link href={`/work/${project.slug}`} className={styles.projectInfo}>
                {isActive && (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ transform: `scaleX(${videoProgress / 100})` }}
                    />
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
          </div>
        );
      })}
      </div>
    </section>
  );
}
