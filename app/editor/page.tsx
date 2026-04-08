'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Octokit } from '@octokit/rest';

export default function Editor() {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('# Getting Started\n\nWrite your blog post here!');
  const [status, setStatus] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    // Automatically log the user in if they've provided a token previously
    const savedToken = localStorage.getItem('cms_secret_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      localStorage.setItem('cms_secret_token', token);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_secret_token');
    setToken('');
    setIsLoggedIn(false);
  };
  
  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handlePublish = async () => {
    if (!title || !content || !excerpt) {
      setStatus('Please fill in the title, excerpt, and content before publishing.');
      return;
    }

    setStatus('Publishing...');
    setIsPublishing(true);
    
    try {
      // Background abstraction using Octokit
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
      const owner = 'bkdhorajiya'; 
      const repo = 'cuda-nexus-blog';

      let sha;
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path });
        if (!Array.isArray(data)) sha = data.sha;
      } catch (e) {
        // Safe to ignore if file is new
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Publish post: ${title}`,
        content: btoa(unescape(encodeURIComponent(fileContent))),
        sha,
      });

      setStatus('Published successfully! Your post will be live globally in a few moments.');
      setTitle('');
      setExcerpt('');
      setContent('# New Post\n\n');
      
      setTimeout(() => setStatus(''), 7000); // Clear success message naturally
    } catch (error: any) {
      setStatus(`Failed to publish to server. Check your connection or token.`);
      
      // If the authentication failed completely, push the user back to the login screen
      if (error.status === 401) {
          handleLogout(); 
      }
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ marginTop: '100px', marginBottom: '80px', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>Studio Login</h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
            Enter your secure publisher token to access the CMS.
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="password" 
              value={token} 
              onChange={(e) => setToken(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
              placeholder="Publisher Token"
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '4px' }}>Create Post</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Write and format your content. It will be published instantly.</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
      </div>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-secondary)' }}>Post Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-outfit)', fontWeight: 600, outline: 'none', borderBottom: '1px solid var(--border-color)' }}
            placeholder="Type your title here..."
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-secondary)' }}>Short Excerpt</label>
          <input 
            type="text" 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)}
            style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', color: '#fff', fontSize: '1.1rem', outline: 'none', borderBottom: '1px solid var(--border-color)' }}
            placeholder="A brief summary of your article..."
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Write Markdown</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', height: '600px', padding: '24px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '1rem', resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
          />
        </div>

        {/* Live Preview */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Preview</label>
          <div className="glass-panel" style={{ padding: '32px', height: '600px', overflowY: 'auto', background: '#050505' }}>
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

      <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'rgba(5, 5, 5, 0.8)', borderTop: '1px solid var(--border-color)', position: 'sticky', bottom: 0 }}>
        <button 
          onClick={handlePublish} 
          disabled={isPublishing}
          className="btn-primary"
          style={{ opacity: isPublishing ? 0.7 : 1, cursor: isPublishing ? 'not-allowed' : 'pointer', fontSize: '1.1rem', padding: '12px 32px' }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Post'}
        </button>
        {status && <span style={{ color: status.includes('successfully') ? 'var(--accent)' : '#ff6b6b', fontWeight: 500 }}>{status}</span>}
      </div>
    </div>
  );
}
