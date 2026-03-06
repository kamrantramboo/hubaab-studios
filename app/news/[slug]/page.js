'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        console.log('Article not found or Supabase not connected');
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) fetchArticle();
  }, [params.slug]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.skeleton}></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className="empty-state">
            <h3>Article not found</h3>
            <Link href="/news" className="btn btn-outline" style={{ marginTop: 24 }}>
              ← Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.date}>{formatDate(article.published_at)}</span>
          <h1 className={styles.title}>{article.title}</h1>
        </div>

        {article.image_url && (
          <div className={styles.heroImage}>
            <img src={article.image_url} alt={article.title} />
          </div>
        )}

        <div className={styles.content}>
          <div dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br/>') || '' }} />
        </div>

        <div className={styles.backRow}>
          <Link href="/news" className="btn-ghost">
            ← All News
          </Link>
        </div>
      </div>
    </div>
  );
}
