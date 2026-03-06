'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.log('Project not found or Supabase not connected');
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className={`${styles.page} light-theme`}>
        <div className="container">
          <div className={styles.skeletonHero}></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`${styles.page} light-theme`}>
        <div className="container">
          <div className="empty-state">
            <h3>Project not found</h3>
            <p>This project may have been removed or doesn't exist.</p>
            <Link href="/work" className="btn btn-outline" style={{ marginTop: 24 }}>
              ← Back to Work
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} light-theme`}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          {project.video_url ? (
            <div className={styles.heroMediaWrapper}>
              <video
                src={project.video_url}
                className={styles.heroMedia}
                autoPlay
                muted={isMuted}
                loop
                playsInline
              />
              <button 
                className={styles.miniSoundToggle}
                onClick={() => setIsMuted(!isMuted)}
              >
                {!isMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>
                ) : (
                  <div className={styles.mutedIconWrapper}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  </div>
                )}
              </button>
            </div>
          ) : project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className={styles.heroMedia}
            />
          ) : (
            <div className={styles.heroPlaceholder}>
              <span>{project.client || project.title}</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <div className={styles.metaLeft}>
            <h1 className={styles.title}>{project.client}</h1>
            <h2 className={styles.subtitle}>{project.title}</h2>
          </div>
          <div className={styles.metaRight}>
            {project.services && (
              <div className={styles.metaItem}>
                <span className="label">Services</span>
                <p>{project.services}</p>
              </div>
            )}
            <div className={styles.metaItem}>
              <span className="label">Category</span>
              <p>{project.category}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className={styles.description}>
            <p>{project.description}</p>
          </div>
        )}

        {/* Media Gallery */}
        {project.media_urls && project.media_urls.length > 0 && (
          <div className={styles.gallery}>
            {project.media_urls.map((url, i) => (
              <div key={i} className={styles.galleryItem}>
                <img src={url} alt={`${project.title} - ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className={styles.backRow}>
          <Link href="/work" className="btn-ghost">
            ← All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
