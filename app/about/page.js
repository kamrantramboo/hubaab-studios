'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function AboutPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const { data, error } = await supabase
          .from('studio_info')
          .select('*')
          .eq('id', 1)
          .single();

        if (!error && data) {
          // Parse JSON if they come as strings (depends on how Supabase returns JSONB in some clients)
          const parseJSON = (val) => typeof val === 'string' ? JSON.parse(val) : val;
          setInfo({
            ...data,
            services: parseJSON(data.services) || [],
            clients: parseJSON(data.clients) || [],
            industry: parseJSON(data.industry) || [],
            press: parseJSON(data.press) || [],
          });
        }
      } catch (err) {
        console.error('Error fetching studio info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.skeletonIntro}></div>
        </div>
      </div>
    );
  }

  // Fallback if no data
  const intro = info?.intro || 'hubaab studio is a cinematic production studio specializing in cinematic videos and photography.';
  const services = info?.services || [];
  const clients = info?.clients || [];
  const industry = info?.industry || [];
  const press = info?.press || [];

  return (
    <div className={styles.page}>
      {/* Intro — Bodeyco-style large text */}
      <section className={styles.introSection}>
        <div className="container">
          <p className={styles.introText}>{intro}</p>
        </div>
      </section>

      <div className="container">
        {/* Services — matching Bodeyco layout */}
        {services.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.servicesGrid}>
              {services.map((service, i) => (
                <div key={i} className={styles.serviceItem}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info — Clients + Industry side by side */}
        <section className={styles.section}>
          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h2 className={styles.sectionTitle}>Clients</h2>
              <div className={styles.clientsGrid}>
                {clients.length > 0 ? clients.map((client, i) => (
                  <span key={i} className={styles.clientName}>{client}</span>
                )) : (
                  <span className={styles.clientName} style={{ color: 'var(--text-dim)' }}>Client list coming soon</span>
                )}
              </div>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.sectionTitle}>Industry</h2>
              <div className={styles.industryList}>
                {industry.length > 0 ? industry.map((item) => (
                  <span key={item} className={styles.industryTag}>{item}</span>
                )) : (
                  <span className={styles.industryTag}>Cinematic Production</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Press */}
        {press.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Press</h2>
            <div className={styles.pressList}>
              {press.map((p, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{p}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
