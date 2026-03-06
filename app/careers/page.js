'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity';
import styles from './page.module.css';

export default function CareersPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const query = `*[_type == "career" && active == true] | order(_createdAt desc)`;
        const data = await sanityFetch({ query });
        setRoles(data || []);
      } catch (err) {
        console.log('Sanity not connected yet');
        setRoles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}


        {/* Open Roles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Roles</h2>

          {loading ? (
            <div className={styles.loadingList}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : roles.length > 0 ? (
            <div className={styles.rolesList}>
              {roles.map((role) => (
                <div key={role._id} className="career-card">
                  <h3 className="career-title">{role.title}</h3>
                  <span className="career-type">{role.type}</span>
                  {role.description && (
                    <p className="career-desc">{role.description}</p>
                  )}
                  <Link 
                    href={`/apply?role=${encodeURIComponent(role.title)}`} 
                    className="btn btn-outline"
                  >
                    Apply
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No open roles</h3>
              <p>Check back soon for new opportunities</p>
            </div>
          )}
        </section>

        {/* Community */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Community</h2>
          <div className={styles.community}>
            <p>
              {/* User will add their own copy */}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
