'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Octokit } from '@octokit/rest';

export default function Editor() {
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('# Getting Started\n\nWrite your markdown here!');
  const [status, setStatus] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handlePublish = async () => {
    if (!token) {
      setStatus('Please enter your GitHub Personal Access Token!');
      return;
    }
    if (!title || !content || !excerpt) {
      setStatus('Please fill in the title, excerpt, and content before publishing.');
      return;
    }

    setStatus('Publishing securely to GitHub...');
    setIsPublishing(true);
    
    try {
      const octokit = new Octokit({ auth: token });
      const slug = generateSlug(title);
      const date = new Date().toISOString().split('T')[0];
      
      const fileContent = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
---

${content}`;

      const path = `content/posts/${slug}.md`;
      const owner = 'bkdhorajiya'; // Pulled statically since it's personal
      const repo = 'cuda-nexus-blog';

      // Verify if file exists to update vs create
      let sha;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });
        if (!Array.isArray(data)) sha = data.sha;
      } catch (e) {
        // Safe to ignore, file doesn't exist yet
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Blog: Published "${title}" via Studio Editor`,
        content: btoa(unescape(encodeURIComponent(fileContent))),
        sha,
      });

      setStatus('Success! Your post has been committed. GitHub Actions is now rebuilding the site live!');
      setTitle('');
      setExcerpt('');
      setContent('# New Post\n\nWrite your next masterpiece...');
    } catch (error: any) {
      setStatus(`Failed: ${error.message}. Is your token valid and authorized?`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Studio Editor</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Write posts in Markdown. Publishing dynamically pushes your code natively to GitHub.
      </p>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>1. GitHub Personal Access Token <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '8px', fontSize: '0.9rem' }}>(Requires "repo" scope. Kept strictly local to your browser.)</span></label>
          <input 
            type="password" 
            value={token} 
            onChange={(e) => setToken(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
            placeholder="ghp_xxxxxxxxxxxx"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>2. Post Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-outfit)' }}
            placeholder="CUDA Memory Optimization Patterns"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>3. Short Excerpt</label>
          <input 
            type="text" 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
            placeholder="Learn how to optimize global memory loads with shared memory tiling."
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>4. Markdown Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', height: '600px', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', resize: 'vertical' }}
          />
        </div>

        {/* Live Preview */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Live Preview</label>
          <div className="glass-panel" style={{ padding: '24px', height: '600px', overflowY: 'auto' }}>
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
                h1: ({node, ...props}: any) => <h1 style={{ fontSize: '2.5rem', marginTop: '32px' }} {...props} />,
                h2: ({node, ...props}: any) => <h2 style={{ fontSize: '1.8rem', marginTop: '32px' }} {...props} />,
                h3: ({node, ...props}: any) => <h3 style={{ fontSize: '1.4rem', marginTop: '32px' }} {...props} />,
                p: ({node, ...props}: any) => <p style={{ lineHeight: 1.7, marginBottom: '16px' }} {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button 
          onClick={handlePublish} 
          disabled={isPublishing}
          className="btn-primary"
          style={{ opacity: isPublishing ? 0.7 : 1, cursor: isPublishing ? 'not-allowed' : 'pointer' }}
        >
          {isPublishing ? 'Publishing...' : 'Publish to GitHub'}
        </button>
        {status && <span style={{ color: status.includes('Success') ? 'var(--accent)' : '#ff6b6b', fontWeight: 500 }}>{status}</span>}
      </div>
    </div>
  );
}
