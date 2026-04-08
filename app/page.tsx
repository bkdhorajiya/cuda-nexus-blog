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
          Welcome to my learning log! As a fresher getting started with NVIDIA CUDA, I'm documenting my journey through GPU programming, deciphering interesting code samples, and sharing whatever I learn along the way.
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
