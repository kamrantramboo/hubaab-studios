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
  const sectionRefs = useRef([]);
  const projectItemRefs = useRef([]);

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

  // Unified Intersection Observer for physical scrolling natively (Desktop & Mobile)
  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.dataset.index, 10);
          const video = videoRefs.current[idx];

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (video) video.play().catch(() => {});
            setActiveIndex(idx);
            
            // Programmatically auto-scroll the desktop sidebar text list
            if (window.innerWidth >= 768 && projectItemRefs.current[idx]) {
              projectItemRefs.current[idx].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
              });
            }
          } else {
            if (video) video.pause();
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
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

      {/* Main Scrolling Feed of 100vh Videos */}
      <div className={styles.feedWrapper}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          return (
            <div 
              key={`section-${project.id}`} 
              className={styles.projectBlock}
              ref={(el) => (sectionRefs.current[i] = el)}
              data-index={i}
            >
              <div className={styles.videoWrapper}>
                {project.video_url ? (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
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
                  <img src={project.thumbnail_url} alt={project.title} className={styles.videoField} />
                ) : <div className={styles.placeholderBg} />}
                
                {/* Mobile UI Overlay directly on video */}
                <button className={styles.mobileSoundToggle} onClick={toggleGlobalMute}>
                  {isUnmuted ? "MUTE" : "UNMUTE"}
                </button>
                <div className={styles.mobileProjectInfo}>
                  <div className={styles.infoContent}>
                    <span className={styles.titleInfo}>
                      {project.title} <span className={styles.separator}>—</span> <span className={styles.client}>{project.client}</span>
                    </span>
                    <span className={styles.category}>{project.category}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FIXED DESKTOP SIDEBAR TEXT LIST */}
      <div className={styles.desktopSidebar}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          return (
            <Link 
              key={`link-${project.id}`} 
              href={`/work/${project.slug}`}
              className={`${styles.sidebarItem} ${isActive ? styles.activeSidebarItem : ''}`}
              ref={(el) => (projectItemRefs.current[i] = el)}
            >
              {isActive && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ transform: `scaleX(${videoProgress / 100})` }} />
                </div>
              )}
              <div className={styles.sidebarContent}>
                <span className={styles.sidebarTitle}>
                  {project.title} <span className={styles.separator}>—</span> <span className={styles.sidebarClient}>{project.client}</span>
                </span>
                <span className={styles.sidebarCategory}>{project.category}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
