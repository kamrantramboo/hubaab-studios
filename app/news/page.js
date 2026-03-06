'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.log('Supabase not connected yet');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.page}>
      <div className="container">


        {loading ? (
          <div className={styles.loadingList}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonItem}></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className={styles.list}>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="news-card"
              >
                <span className="news-date">{formatDate(article.published_at)}</span>
                <div>
                  <h3 className="news-title">{article.title}</h3>
                  {article.excerpt && <p className="news-excerpt">{article.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No news yet</h3>
            <p>News and updates will appear here once published via the admin dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
