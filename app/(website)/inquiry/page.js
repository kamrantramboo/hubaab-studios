'use client';

import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity';
import styles from './page.module.css';

const serviceOptions = [
  'Cinematic Video',
  'Commercial Photography',
  'Social Media Reels',
  'Brand Identity',
  'Production Support',
  'Post-Production'
];

export default function InquiryPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    services: [],
    company: '',
    role: '',
    industry: '',
    projectDescription: '',
    budget: '',
    timeline: '',
  });

  const [budgetOptions, setBudgetOptions] = useState([
    { value: 'Under $5k', label: 'Under $5,000' },
    { value: '$5k-$15k', label: '$5,000 – $15,000' },
    { value: '$15k-$50k', label: '$15,000 – $50,000' },
    { value: '$50k-$100k', label: '$50,000 – $100,000' },
    { value: '$100k+', label: '$100,000+' }
  ]);

  useEffect(() => {
    try {
      // Roughly detect if user is in India to convert to INR
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && (tz.includes('Kolkata') || tz.includes('Calcutta'))) {
        setBudgetOptions([
          { value: 'Under ₹5L', label: 'Under ₹5,00,000' },
          { value: '₹5L-₹15L', label: '₹5,00,000 – ₹15,00,000' },
          { value: '₹15L-₹50L', label: '₹15,00,000 – ₹50,00,000' },
          { value: '₹50L-₹1Cr', label: '₹50,00,000 – ₹1,00,00,000' },
          { value: '₹1Cr+', label: '₹1,00,00,000+' }
        ]);
      }
    } catch (e) {
      // Default to USD safely
    }
  }, []);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (service) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return form.name && form.email;
      case 2: return form.services.length > 0;
      case 3: return true;
      case 4: return form.projectDescription;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong. Please try emailing us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.success}>
            <h1>Thank you</h1>
            <p>We&apos;ve received your inquiry and will be in touch soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="animate-fade-in-up">Start a Project</h1>
          <p className={`${styles.headerDesc} animate-fade-in-up stagger-1`}>
            Have a project in mind? Use the form below to share details about your upcoming shoot, campaign, or creative needs.
          </p>
          <p className={`${styles.headerAlt} animate-fade-in-up stagger-2`}>
            If you prefer to reach out directly, you can also email us at{' '}
            <a href="mailto:info@hubaabstudios.com">info@hubaabstudios.com</a>
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator animate-fade-in-up stagger-3">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
              onClick={() => step > s && setStep(s)}
            >
              <span className="dot"></span>
              Step 0{s}
            </button>
          ))}
        </div>

        {/* Form Steps */}
        <div className={styles.formArea}>
          {step === 1 && (
            <div className={styles.stepContent} key="step1">
              <h2 className={styles.stepTitle}>About You</h2>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent} key="step2">
              <h2 className={styles.stepTitle}>How can we help?</h2>
              <p className={styles.stepDesc}>Select all services that apply</p>
              <div className="checkbox-group">
                {serviceOptions.map((service) => (
                  <label
                    key={service}
                    className={`checkbox-label ${form.services.includes(service) ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.services.includes(service)}
                      onChange={() => toggleService(service)}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent} key="step3">
              <h2 className={styles.stepTitle}>About Your Business</h2>
              <div className="form-group">
                <label className="form-label">Company / Brand</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your company name"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your Role</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Creative Director, Founder"
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fashion, Music, Tech"
                  value={form.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepContent} key="step4">
              <h2 className={styles.stepTitle}>About Your Project</h2>
              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Tell us about your project, vision, and creative goals..."
                  value={form.projectDescription}
                  onChange={(e) => updateField('projectDescription', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Budget Range</label>
                <select
                  className="form-select"
                  value={form.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                >
                  <option value="">Select a range</option>
                  {budgetOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Timeline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. March 2026, ASAP, Flexible"
                  value={form.timeline}
                  onChange={(e) => updateField('timeline', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={styles.formNav}>
            {step > 1 && (
              <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
            <div className={styles.spacer}></div>
            {step < 4 ? (
              <button
                className="btn btn-primary"
                onClick={() => canProceed() && setStep(step + 1)}
                disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.4 }}
              >
                Continue →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                style={{ opacity: canProceed() && !submitting ? 1 : 0.4 }}
              >
                {submitting ? 'Sending...' : 'Submit Inquiry'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
