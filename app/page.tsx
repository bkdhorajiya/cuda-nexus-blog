import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div>
      <section className="hero-section container">
        <h1 className="hero-title">
          Master Modern GPU Programming
        </h1>
        <p className="hero-subtitle">
          In-depth explanations, performance optimization techniques, and sample code breakdowns for NVIDIA CUDA. Let's make massive parallel processing accessible.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {allPostsData.length > 0 && (
            <Link href={`/blog/${allPostsData[0].id}`} className="btn-primary">
              Read the Articles
            </Link>
          )}
          <a href="https://github.com/nvidia/cuda-samples" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            CUDA Samples GitHub
          </a>
        </div>
      </section>

      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem' }}>Latest Articles</h2>
        </div>
        
        <div className="post-grid">
          {allPostsData.map(({ id, date, title, excerpt }) => (
            <div className="glass-panel post-card" key={id}>
              <span className="post-card-date">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <h3 className="post-card-title">{title}</h3>
              <p className="post-card-excerpt">{excerpt}</p>
              <Link href={`/blog/${id}`} className="post-card-link">
                Read Article <span style={{ color: 'var(--accent)' }}>→</span>
              </Link>
            </div>
          ))}

          {allPostsData.length === 0 && (
            <div className="glass-panel post-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <h3 style={{ marginBottom: '16px' }}>No articles yet.</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Write and publish your first post using the editor!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
