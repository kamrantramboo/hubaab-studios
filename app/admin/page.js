'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const tabs = ['Projects', 'News', 'Careers', 'Inquiries', 'Studio Info'];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Projects');
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, activeTab]);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setUser(session.user);
  }

  async function fetchData() {
    setLoading(true);
    const table = activeTab.toLowerCase().replace(' ', '_');
    
    if (table === 'studio_info') {
      const { data: result, error } = await supabase.from(table).select('*').eq('id', 1).single();
      if (!error) setData(result ? [result] : []);
    } else {
      let query = supabase.from(table).select('*');
      
      if (table === 'projects') {
        query = query.order('sort_order', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: result, error } = await query;
      if (!error) setData(result || []);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const table = activeTab.toLowerCase().replace(' ', '_');
    if (table === 'studio_info') return; // Cannot delete studio info
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  }

  async function handleSave(formData) {
    const table = activeTab.toLowerCase().replace(' ', '_');
    
    // Auto-generate slug if missing
    if (!formData.slug && formData.title) {
      formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase.from(table).update(formData).eq('id', editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from(table).insert([formData]);
      error = insertError;
    }
    
    if (error) {
      alert(`Error saving: ${error.message}`);
      return;
    }

    setShowForm(false);
    setEditingItem(null);
    fetchData();
  }

  function handleEdit(item) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleAdd() {
    setEditingItem(null);
    setShowForm(true);
  }

  if (!user) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Hubaab</h2>
          <span className={styles.sidebarSubtitle}>Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin-nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setShowForm(false); }}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>{activeTab}</h1>
          {activeTab !== 'Inquiries' && activeTab !== 'Studio Info' && (
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add {activeTab.slice(0, -1)}
            </button>
          )}
        </div>

        {/* Mobile tabs */}
        <div className={styles.mobileTabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setShowForm(false); }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Edit Form */}
        {showForm && (
          <AdminForm
            type={activeTab}
            item={editingItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
          />
        )}

        {/* Data Table */}
        {!showForm && (
          loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : data.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  {getColumns(activeTab).map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    {getColumns(activeTab).map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(item[col.key], item) : (
                          typeof item[col.key] === 'boolean' ? (
                            <span className={`badge ${item[col.key] ? 'badge-success' : 'badge-warning'}`}>
                              {item[col.key] ? 'Yes' : 'No'}
                            </span>
                          ) : (
                            String(item[col.key] || '—').substring(0, 60)
                          )
                        )}
                      </td>
                    ))}
                    <td>
                      <div className={styles.actions}>
                        {(activeTab !== 'Inquiries' && activeTab !== 'Studio Info') && (
                          <button className={styles.editBtn} onClick={() => handleEdit(item)}>Edit</button>
                        )}
                        {activeTab === 'Studio Info' && (
                          <button className={styles.editBtn} onClick={() => handleEdit(item)}>Edit Info</button>
                        )}
                        {activeTab !== 'Studio Info' && (
                          <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>No {activeTab.toLowerCase()} yet</h3>
              <p>Click the button above to add one</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function getColumns(tab) {
  switch (tab) {
    case 'Projects':
      return [
        { key: 'title', label: 'Title' },
        { key: 'client', label: 'Client' },
        { key: 'category', label: 'Category' },
        { key: 'featured', label: 'Featured' },
        { key: 'is_vertical', label: 'Vertical' },
        { key: 'video_alignment', label: 'Align' },
        { key: 'sort_order', label: 'Order' },
      ];
    case 'News':
      return [
        { key: 'title', label: 'Title' },
        { key: 'published', label: 'Published' },
        { key: 'published_at', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
      ];
    case 'Careers':
      return [
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'active', label: 'Active' },
      ];
    case 'Inquiries':
      return [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'company', label: 'Company' },
        { key: 'status', label: 'Status', render: (v) => (
          <span className={`badge ${v === 'new' ? 'badge-success' : v === 'responded' ? 'badge-warning' : 'badge-error'}`}>
            {v || 'new'}
          </span>
        )},
      ];
    case 'Studio Info':
      return [
        { key: 'intro', label: 'Intro' },
      ];
    default: return [];
  }
}

function AdminForm({ type, item, onSave, onCancel }) {
  const [form, setForm] = useState(item || getDefaultForm(type));

  function update(field, value, type) {
    let finalValue = value;
    if (type === 'number') finalValue = parseInt(value, 10) || 0;
    setForm(prev => ({ ...prev, [field]: finalValue }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className={styles.formPanel}>
      <h2 className={styles.formTitle}>
        {item ? 'Edit' : 'Add'} {type.slice(0, -1)}
      </h2>
      <form onSubmit={handleSubmit}>
        {getFormFields(type).map((field) => (
          <div className="form-group" key={field.key}>
            <label className="form-label">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                className="form-input form-textarea"
                value={form[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value, field.type)}
                placeholder={field.placeholder}
              />
            ) : field.type === 'checkbox' ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form[field.key] || false}
                  onChange={(e) => update(field.key, e.target.checked, field.type)}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{field.placeholder}</span>
              </label>
            ) : field.type === 'select' ? (
              <select
                className="form-select"
                value={form[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value, field.type)}
              >
                {field.options.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                className="form-input"
                value={form[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value, field.type)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        <div className={styles.formActions}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}

function getDefaultForm(type) {
  switch (type) {
    case 'Projects':
      return { title: '', client: '', slug: '', category: 'Cinematic', description: '', services: '', thumbnail_url: '', video_url: '', featured: false, is_vertical: false, video_alignment: 'top center', sort_order: 0 };
    case 'News':
      return { title: '', slug: '', excerpt: '', content: '', image_url: '', published: false, published_at: '' };
    case 'Careers':
      return { title: '', slug: '', type: 'Freelance / Contract', description: '', active: true };
    default:
      return {};
  }
}

function getFormFields(type) {
  switch (type) {
    case 'Projects':
      return [
        { key: 'title', label: 'Title', placeholder: 'Project title' },
        { key: 'client', label: 'Client', placeholder: 'Client name' },
        { key: 'slug', label: 'Slug', placeholder: 'url-friendly-slug' },
        { key: 'category', label: 'Category', type: 'select', options: ['Cinematic', 'Commercial', 'Music', 'Fashion', 'Editorial', 'Film', 'Documentary'] },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Project description...' },
        { key: 'services', label: 'Services', placeholder: 'e.g. Production, Post-Production, Color Grading' },
        { key: 'thumbnail_url', label: 'Thumbnail URL', placeholder: 'https://...' },
        { key: 'video_url', label: 'Video URL', placeholder: 'https://...' },
        { key: 'featured', label: 'Featured', type: 'checkbox', placeholder: 'Show on home page' },
        { key: 'is_vertical', label: 'Vertical Layout', type: 'checkbox', placeholder: 'This is a portrait/vertical video' },
        { key: 'video_alignment', label: 'Video Crop Focus', type: 'select', options: ['top center', 'center center', 'bottom center'] },
        { key: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '0' },
      ];
    case 'News':
      return [
        { key: 'title', label: 'Title', placeholder: 'Article title' },
        { key: 'slug', label: 'Slug', placeholder: 'url-friendly-slug' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short summary...' },
        { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Full article content...' },
        { key: 'image_url', label: 'Image URL', placeholder: 'https://...' },
        { key: 'published', label: 'Published', type: 'checkbox', placeholder: 'Make visible on site' },
        { key: 'published_at', label: 'Published Date', type: 'date' },
      ];
    case 'Careers':
      return [
        { key: 'title', label: 'Job Title', placeholder: 'e.g. Cinematographer' },
        { key: 'slug', label: 'Slug', placeholder: 'url-friendly-slug' },
        { key: 'type', label: 'Employment Type', placeholder: 'e.g. Freelance / Contract' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Role description...' },
        { key: 'active', label: 'Active', type: 'checkbox', placeholder: 'Show on careers page' },
      ];
    case 'Studio Info':
      return [
        { key: 'intro', label: 'Studio Intro', type: 'textarea', placeholder: 'Studio description...' },
        { key: 'services', label: 'Services (JSON)', type: 'textarea', placeholder: '[{"title": "...", "desc": "..."}]' },
        { key: 'clients', label: 'Clients (JSON Array)', type: 'textarea', placeholder: '["Client 1", "Client 2"]' },
        { key: 'industry', label: 'Industry Tags (JSON Array)', type: 'textarea', placeholder: '["Fashion", "Film"]' },
        { key: 'press', label: 'Press (JSON Array)', type: 'textarea', placeholder: '["Press 1", "Press 2"]' },
      ];
    default:
      return [];
  }
}
