import { getAllPostIds, getPostData } from '../../../lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Comments from '../../components/Comments';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths; 
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);
  
  if (!postData) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${postData.title} | CUDA Nexus`,
    description: postData.excerpt,
    keywords: postData.tags?.join(', '),
    openGraph: {
      title: postData.title,
      description: postData.excerpt,
      type: 'article',
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);

  if (!postData) {
    return notFound();
  }

  return (
    <article className="container" style={{ maxWidth: '800px', marginTop: '60px', marginBottom: '80px' }}>
      <Link href="/" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        ← Back to Home
      </Link>
      
      <header style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="post-card-date">{new Date(postData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>⏱ {postData.readingTime} min read</span>
        </div>
        <h1 style={{ fontSize: '3rem', margin: '16px 0 24px', lineHeight: 1.2 }}>
          {postData.title}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          {postData.excerpt}
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.05rem' }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="code-block">
                  <pre><code className={className} {...props}>
                    {children}
                  </code></pre>
                </div>
              ) : (
                <code className={className} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }} {...props}>
                  {children}
                </code>
              )
            },
            h2: ({node, ...props}: any) => <h2 style={{ fontSize: '1.8rem', marginTop: '32px' }} {...props} />,
            h3: ({node, ...props}: any) => <h3 style={{ fontSize: '1.4rem', marginTop: '24px' }} {...props} />,
            p: ({node, ...props}: any) => <p style={{ lineHeight: 1.7 }} {...props} />,
            blockquote: ({node, ...props}: any) => (
              <blockquote className="glass-panel" style={{ padding: '24px', marginTop: '24px', borderLeft: '4px solid var(--accent)' }} {...props} />
            )
          }}
        >
          {postData.content}
        </ReactMarkdown>
      </div>

      <Comments />
    </article>
  );
}
