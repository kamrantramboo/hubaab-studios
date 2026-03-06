'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unmutedVideoIndex, setUnmutedVideoIndex] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRefs = useRef([]);
  const sectionRefs = useRef([]);
  const projectItemRefs = useRef([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const query = `*[_type == "project" && featured == true] | order(sortOrder asc) {
          _id,
          title,
          client,
          slug,
          category,
          "thumbnail_url": thumbnail.asset->url,
          "video_url": videoUrl,
          video_alignment,
          sortOrder
        }`;
        
        const data = await sanityFetch({ query });
        setProjects(data || []);
      } catch (err) {
        console.log('Sanity not connected yet — showing empty state');
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

  const toggleMute = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    // If clicking the currently unmuted video, mute it. Otherwise, unmute this specific video.
    setUnmutedVideoIndex(prevIndex => prevIndex === index ? null : index);
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
      <button 
        className={styles.desktopSoundToggle} 
        onClick={(e) => toggleMute(e, activeIndex)}
      >
        {unmutedVideoIndex === activeIndex ? "MUTE" : "UNMUTE"}
      </button>

      {/* Main Scrolling Feed of 100vh Videos */}
      <div className={styles.feedWrapper}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          return (
            <div 
              key={`section-${project._id}`} 
              className={styles.projectBlock}
              ref={(el) => (sectionRefs.current[i] = el)}
              data-index={i}
            >
              <div className={styles.videoWrapper}>
                {project.video_url ? (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    muted={unmutedVideoIndex !== i}
                    loop
                    playsInline
                    autoPlay={i === 0} 
                    preload="metadata"
                    poster={project.thumbnail_url}
                    src={project.video_url}
                    className={styles.videoField}
                    style={{ objectPosition: project.video_alignment || 'center center' }}
                    onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                  />
                ) : project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.title} className={styles.videoField} />
                ) : <div className={styles.placeholderBg} />}
                
                {/* Mobile UI Overlay directly on video */}
                <button 
                  className={styles.mobileSoundToggle} 
                  onClick={(e) => toggleMute(e, i)}
                >
                  {unmutedVideoIndex === i ? "MUTE" : "UNMUTE"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FIXED UNIFIED LIST OVERLAY (Mobile & Desktop) */}
      <div className={styles.projectListOverlay}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          return (
            <Link 
              key={`link-${project._id}`} 
              href={`/work/${project.slug?.current || project.slug}`}
              className={`${styles.listItem} ${isActive ? styles.activeListItem : ''}`}
              ref={(el) => (projectItemRefs.current[i] = el)}
            >
              {isActive && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ transform: `scaleX(${videoProgress / 100})` }} />
                </div>
              )}
              <div className={styles.listContent}>
                <span className={styles.listTitle}>
                  {project.title} <span className={styles.separator}>—</span> <span className={styles.listClient}>{project.client}</span>
                </span>
                <span className={styles.listCategory}>{project.category}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
