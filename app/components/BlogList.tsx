'use client';

import { useState } from 'react';
import Link from 'next/link';

type Post = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tags?: string[];
  readingTime?: number;
};

export default function BlogList({ posts }: { posts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract unique tags natively
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag ? post.tags?.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <input 
          type="text" 
          placeholder="Search articles by keywords..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
        />
        
        {allTags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '8px', fontWeight: 600 }}>Filter topics:</span>
            {activeTag && (
              <button 
                onClick={() => setActiveTag(null)} 
                style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#fff', padding: '4px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              >
                Clear ✕
              </button>
            )}
            {allTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => setActiveTag(tag)}
                style={{ 
                  background: activeTag === tag ? 'var(--accent)' : 'rgba(255,255,255,0.05)', 
                  border: '1px solid ' + (activeTag === tag ? 'var(--accent)' : 'var(--border-color)'),
                  color: activeTag === tag ? '#000' : '#fff', 
                  padding: '4px 12px', 
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: activeTag === tag ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="post-grid" style={{ marginTop: '0' }}>
        {filteredPosts.map(({ id, date, title, excerpt, tags, readingTime }) => (
          <div className="glass-panel post-card" key={id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="post-card-date">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              {readingTime && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>⏱ {readingTime} min read</span>}
            </div>
            
            <h3 className="post-card-title">{title}</h3>
            
            {tags && tags.length > 0 && (
               <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                 {tags.map(t => (
                   <span key={t} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: '#ccc', fontFamily: 'var(--font-mono)' }}>#{t}</span>
                 ))}
               </div>
            )}

            <p className="post-card-excerpt">{excerpt}</p>
            <Link href={`/blog/${id}`} className="post-card-link">
              Read Article <span style={{ color: 'var(--accent)' }}>→</span>
            </Link>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="glass-panel post-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <h3 style={{ marginBottom: '16px' }}>No articles match your search.</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
