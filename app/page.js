'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(true);
  const videoRefs = useRef([]);
  const sectionRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('sort_order', { ascending: true })
          .limit(7);

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

  // Intersection observer for video autoplay + active tracking
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const idx = parseInt(video.dataset.index, 10);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            video.play().catch(() => {});
            setActiveIndex(idx);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.4], rootMargin: '0px' }
    );

    videos.forEach((v) => observer.observe(v));
    return () => videos.forEach((v) => observer.unobserve(v));
  }, [projects]);

  // Track hero visibility for Navbar CTA
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        document.body.dataset.heroVisible = visible ? 'true' : 'false';
        setIsHeroActive(visible);
      },
      { threshold: 0.5 }
    );

    observer.observe(hero);
    return () => {
      observer.unobserve(hero);
      delete document.body.dataset.heroVisible;
    };
  }, []);

  const toggleGlobalMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUnmuted(!isUnmuted);
  };

  return (
    <>
      {/* Showcase Section — Integrated snapping experience */}
      <section className={styles.showcase} ref={sectionRef}>
        {/* Hero — first snap item */}
        <div className={styles.heroSnap} ref={heroRef}>
          <div className={styles.heroBg}>
            {projects[0]?.video_url && (
              <>
                <video
                  className={styles.heroVideo}
                  autoPlay
                  muted={!isUnmuted || !isHeroActive}
                  loop
                  playsInline
                  src={projects[0].video_url}
                />
                <button 
                  className={styles.miniSoundToggle}
                  onClick={toggleGlobalMute}
                  style={{ bottom: '40px', right: 'var(--container-padding)', opacity: 1, transform: 'none' }}
                >
                  {isUnmuted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>
                  ) : (
                    <div className={styles.mutedIconWrapper}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    </div>
                  )}
                </button>
              </>
            )}
            <div className={styles.heroOverlay}></div>
          </div>
          <div className={styles.heroContent}>
            <span className={styles.heroTagline}>A Cinematic Production Studio</span>
            <Link href="/inquiry" className={styles.heroCta}>
              Start a Project
            </Link>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeleton}></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          projects.slice(1).map((project, i) => (
            <Link
              href={`/work/${project.slug}`}
              key={project.id}
              className={`${styles.videoItem} ${project.is_vertical ? styles.isVertical : ''}`}
              data-item={project.title}
              style={{ '--video-align': project.video_alignment || 'top center' }}
            >
              <div className={styles.videoEmbed}>
                {project.video_url ? (
                  <>
                    <video
                      ref={(el) => (videoRefs.current[i] = el)}
                      data-index={i}
                      muted={!isUnmuted || activeIndex !== i || isHeroActive}
                      loop
                      playsInline
                      autoPlay={i === 0}
                      preload="metadata"
                      src={project.video_url}
                      className={styles.video}
                      style={{ objectPosition: project.video_alignment || 'top center' }}
                    />
                    <button 
                      className={styles.miniSoundToggle}
                      onClick={toggleGlobalMute}
                    >
                      {isUnmuted ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>
                      ) : (
                        <div className={styles.mutedIconWrapper}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                        </div>
                      )}
                    </button>
                  </>
                ) : project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className={styles.videoFallback}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.videoPlaceholder}>
                    <span>{project.client || project.title}</span>
                  </div>
                )}
              </div>
              {/* Overlay Title */}
              <div className={styles.videoOverlayInfo}>
                <h2 className={styles.videoClient}>{project.client}</h2>
                <p className={styles.videoTitle}>{project.title}</p>
                <p className={styles.videoCategory}>{project.category}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.emptyHero}>
            <p className={styles.emptyText}>Featured projects will appear here</p>
            <span className={styles.emptySubtext}>
              Add projects via the admin dashboard and mark them as featured
            </span>
          </div>
        )}
      </section>
    </>
  );
}
