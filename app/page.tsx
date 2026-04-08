import { getSortedPostsData } from '../lib/posts';
import BlogList from './components/BlogList';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div>
      <section className="hero-section container" style={{ paddingBottom: '40px' }}>
        <h1 className="hero-title">
          Diving into GPU Programming
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: 0 }}>
          Documenting my journey through NVIDIA CUDA. Join me as I explore performance optimizations, break down interesting sample codes, and learn the art of massive parallel processing.
        </p>
      </section>

      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '2rem' }}>Explore The Nexus</h2>
        </div>
        
        <BlogList posts={allPostsData} />
      </section>
    </div>
  );
}
