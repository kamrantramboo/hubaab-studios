'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);
  const sectionRef = useRef(null);

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

  return (
    <>
      {/* Showcase Section — Integrated snapping experience */}
      <section className={styles.showcase} ref={sectionRef}>
        {loading ? (
          <div className={styles.loadingState}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeleton}></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            {/* Fullscreen video items */}
            <div className={styles.videoList}>
              {projects.map((project, i) => (
                <Link
                  href={`/work/${project.slug}`}
                  key={project.id}
                  className={`${styles.videoItem} ${project.is_vertical ? styles.isVertical : ''}`}
                  data-item={project.title}
                  style={{ '--video-align': project.video_alignment || 'top center' }}
                >
                  <div className={styles.videoEmbed}>
                    {project.video_url ? (
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        data-index={i}
                        muted
                        loop
                        playsInline
                        autoPlay={i === 0}
                        preload="metadata"
                        src={project.video_url}
                        className={styles.video}
                        style={{ objectPosition: project.video_alignment || 'top center' }}
                      />
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
              ))}
            </div>
          </>
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
