'use client';

import Giscus from '@giscus/react';
import { usePathname } from 'next/navigation';

export default function Comments() {
  const pathname = usePathname();

  return (
    <div className="glass-panel" style={{ marginTop: '64px', padding: '32px', background: 'rgba(5, 5, 5, 0.4)' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        Community Feedback
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
        Feel free to leave a "Like" reaction or start a discussion below! (Sign-in via GitHub)
      </p>
      <Giscus
        id="comments"
        repo="bkdhorajiya/cuda-nexus-blog"
        repoId="R_kgDOR7_jzg"
        category="General"
        categoryId="DIC_kwDOR7_jzs4Cl4cK" 
        mapping="pathname"
        term={pathname}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark_dimmed"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
