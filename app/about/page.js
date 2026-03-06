import styles from './page.module.css';

export const metadata = {
  title: 'About — Hubaab Studios',
  description: 'Hubaab Studios is a cinematic production studio specializing in cinematic videos and photography.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Intro — Bodeyco-style large text */}
      <section className={styles.introSection}>
        <div className="container">
          <p className={styles.introText}>
            Hubaab Studios is a cinematic production studio working across film, commercial, 
            music, and fashion. We have a passion for creating beautiful work rooted in 
            storytelling, brought to life through thoughtful collaboration, craft, and 
            end-to-end creative, production, and post-production services.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Services — matching Bodeyco layout */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Services</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceItem}>
              <h3 className={styles.serviceTitle}>Creative</h3>
              <p className={styles.serviceDesc}>
                We work with brands and agencies to develop creative rooted in storytelling. 
                Through our in-house team and studio partners, our creative process spans 
                concept development, creative direction, art direction, and graphic and 
                motion design.
              </p>
            </div>
            <div className={styles.serviceItem}>
              <h3 className={styles.serviceTitle}>Production</h3>
              <p className={styles.serviceDesc}>
                We serve as a full-service production partner for image and motion projects. 
                We manage all aspects of production including budgeting, scheduling, crew and 
                talent sourcing, casting, location management, and on-set execution.
              </p>
            </div>
            <div className={styles.serviceItem}>
              <h3 className={styles.serviceTitle}>Post-Production</h3>
              <p className={styles.serviceDesc}>
                We offer full post-production and finishing services including editing, color, 
                VFX, sound, and music. Finishing is treated as the final stage of production, 
                with hands-on oversight to ensure consistency and quality through delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Info — Clients + Industry side by side */}
        <section className={styles.section}>
          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h2 className={styles.sectionTitle}>Clients</h2>
              <div className={styles.clientsGrid}>
                {/* User will add their actual clients */}
                <span className={styles.clientName}>Client names will appear here</span>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.sectionTitle}>Industry</h2>
              <div className={styles.industryList}>
                {['Cinematic', 'Commercial', 'Branded Content', 'Music', 'Fashion', 'Editorial', 'Film', 'Documentary'].map((item) => (
                  <span key={item} className={styles.industryTag}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Press */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Press</h2>
          <div className={styles.pressList}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Press mentions will appear here</p>
          </div>
        </section>
      </div>
    </div>
  );
}
