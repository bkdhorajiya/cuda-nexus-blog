import Link from 'next/link';

export default function Home() {
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
          <Link href="/blog/vector-add" className="btn-primary">
            Read the Articles
          </Link>
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
          <div className="glass-panel post-card">
            <span className="post-card-date">May 15, 2026</span>
            <h3 className="post-card-title">Vector Addition: The "Hello World" of CUDA</h3>
            <p className="post-card-excerpt">
              Start your journey into GPU programming by dissecting the fundamental vectorAdd sample. Understand thread blocks, grids, and global memory allocation.
            </p>
            <Link href="/blog/vector-add" className="post-card-link">
              Read Article <span style={{ color: 'var(--accent)' }}>→</span>
            </Link>
          </div>

          <div className="glass-panel post-card">
            <span className="post-card-date">May 02, 2026</span>
            <h3 className="post-card-title">Optimizing Matrix Multiplication</h3>
            <p className="post-card-excerpt">
              A deep dive into shared memory tiling. Learn how to drastically reduce global memory bandwidth requirements by leveraging fast on-chip memory.
            </p>
            <Link href="/blog/matrix-multiplication" className="post-card-link" style={{ pointerEvents: 'none', opacity: 0.5 }}>
              Coming Soon
            </Link>
          </div>

          <div className="glass-panel post-card">
            <span className="post-card-date">April 28, 2026</span>
            <h3 className="post-card-title">Understanding Unified Memory</h3>
            <p className="post-card-excerpt">
              Drop the complex cudaMemcpy calls. Let's explore how Unified Memory simplifies memory management and when you should strictly avoid it.
            </p>
            <Link href="/blog/unified-memory" className="post-card-link" style={{ pointerEvents: 'none', opacity: 0.5 }}>
              Coming Soon
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
