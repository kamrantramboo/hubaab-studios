'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

function ApplyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleFromUrl = searchParams.get('role') || '';
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    role_title: roleFromUrl,
    name: '',
    email: '',
    portfolio_url: '',
    resume_url: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert([form]);

      if (error) throw error;
      setSubmitted(true);
      
      // Redirect back to careers after 3 seconds
      setTimeout(() => {
        router.push('/careers');
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="empty-state animate-fade-in">
        <div className={styles.successIcon}>✓</div>
        <h3>Application Sent</h3>
        <p>Thank you for your interest in hubaab studio. We've received your application and will be in touch if there's a fit.</p>
        <p style={{ marginTop: '20px', fontSize: '0.65rem' }}>Redirecting you back to careers...</p>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper + " animate-fade-in"}>
      <h1 className={styles.formTitle}>Application</h1>
      <p className={styles.roleSub}>Applying for: <strong>{roleFromUrl}</strong></p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            required 
            className="form-input" 
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            required 
            className="form-input" 
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Portfolio URL / Website</label>
          <input 
            type="url" 
            className="form-input" 
            placeholder="https://"
            value={form.portfolio_url}
            onChange={(e) => setForm({...form, portfolio_url: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Resume / CV Link (Dropbox, Drive, etc.)</label>
          <input 
            type="url" 
            className="form-input" 
            placeholder="https://"
            value={form.resume_url}
            onChange={(e) => setForm({...form, resume_url: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tell us about yourself</label>
          <textarea 
            className="form-input form-textarea" 
            placeholder="Briefly describe your experience and why you'd like to join hubaab..."
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className={`${styles.page} light-theme`}>
      <div className="container">
        <Suspense fallback={<div className="empty-state">Loading...</div>}>
          <ApplyForm />
        </Suspense>
      </div>
    </div>
  );
}
