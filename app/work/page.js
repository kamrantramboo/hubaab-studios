'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity';
import styles from './page.module.css';

const categories = ['All', 'Cinematic', 'Commercial', 'Music', 'Fashion', 'Editorial', 'Film'];

export default function WorkPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    async function fetchProjects() {
      try {
        const query = `*[_type == "project"] | order(sortOrder asc) {
          _id,
          title,
          client,
          slug,
          category,
          "thumbnail_url": thumbnail.asset->url,
          "video_url": videoUrl,
          is_vertical,
          sortOrder
        }`;
        
        const data = await sanityFetch({ query });
        setProjects(data || []);
      } catch (err) {
        console.log('Sanity not connected yet');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);



  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className={`${styles.page} light-theme`}>
      <div className="container">

        {/* Filter Bar */}
        <div className={`${styles.filterBar} animate-fade-in-up stagger-1`}>
          <div className={styles.filterLabel}>Type</div>
          <div className={styles.filterOptions}>
            {categories.map((cat, i) => (
              <span key={cat}>
                <button
                  className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
                {i < categories.length - 1 && <span className={styles.comma}>, </span>}
              </span>
            ))}
          </div>
          <div className={styles.filterViews}>
            <button 
              className={`${styles.filterBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <span className={styles.comma}>, </span>
            <button 
              className={`${styles.filterBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>

        {/* Projects Grid / List */}
        {loading ? (
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeleton}></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <div className={styles.grid}>
              {filtered.map((project) => (
                <Link
                  key={project._id}
                  href={`/work/${project.slug?.current || project.slug}`}
                  className={`${styles.projectCard} ${project.is_vertical ? styles.isVertical : ''}`}
                >
                  <div 
                    className={styles.thumbnailWrapper}
                    onMouseEnter={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video) video.play();
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video) {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }}
                  >
                    {project.video_url ? (
                      <>
                        <video
                          src={project.video_url}
                          poster={project.thumbnail_url}
                          className={styles.thumbnail}
                          muted
                          loop
                          playsInline
                        />
                      </>
                    ) : project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className={styles.thumbnail}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.placeholder}>{project.client || project.title}</div>
                    )}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.client}>{project.client}</div>
                    <div className={styles.title}>"{project.title}"</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.listView}>
              {filtered.map((project) => (
                <Link
                  key={project._id}
                  href={`/work/${project.slug?.current || project.slug}`}
                  className={styles.listRow}
                >
                  <div 
                    className={styles.listThumb}
                    onMouseEnter={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video) video.play();
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video) {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }}
                  >
                    {project.video_url ? (
                      <>
                        <video
                          src={project.video_url}
                          poster={project.thumbnail_url}
                          className={styles.listThumbMedia}
                          muted
                          loop
                          playsInline
                        />
                      </>
                    ) : project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className={styles.listThumbMedia}
                      />
                    ) : (
                      <div className={styles.placeholder}>—</div>
                    )}
                  </div>
                  <div className={`${styles.listCol} ${styles.listClient}`}>
                    {project.client}
                  </div>
                  <div className={`${styles.listCol} ${styles.listTitle}`}>
                    "{project.title}"
                  </div>
                  <div className={`${styles.listCol} ${styles.listCategory}`}>
                    {project.category}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Projects will appear here once added via the admin dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
