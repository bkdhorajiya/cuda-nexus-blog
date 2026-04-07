import Link from 'next/link';

export default function VectorAddPost() {
  return (
    <article className="container" style={{ maxWidth: '800px', marginTop: '60px', marginBottom: '80px' }}>
      <Link href="/" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        ← Back to Home
      </Link>
      
      <header style={{ marginBottom: '48px' }}>
        <span className="post-card-date">May 15, 2026</span>
        <h1 style={{ fontSize: '3rem', margin: '16px 0 24px', lineHeight: 1.2 }}>
          Vector Addition: The "Hello World" of CUDA
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Start your journey into GPU programming by dissecting the fundamental vectorAdd sample.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.05rem' }}>
        <p>
          If you are learning C++, your first program is <code>printf(&quot;Hello World&quot;)</code>. In the world of massive parallel programming with NVIDIA GPUs, the equivalent is <strong>Vector Addition</strong>.
        </p>
        
        <h2 style={{ fontSize: '1.8rem', marginTop: '32px' }}>The CUDA Kernel</h2>
        <p>
          A CUDA kernel is a function executed on the GPU. It is defined using the <code>__global__</code> declaration specifier. Each thread that executes this kernel performs one element of the vector addition.
        </p>

        <div className="code-block">
          <pre><code>{`__global__ void vectorAdd(const float *A, const float *B, float *C, int numElements)
{
    int i = blockDim.x * blockIdx.x + threadIdx.x;

    if (i < numElements)
    {
        C[i] = A[i] + B[i];
    }
}
`}</code></pre>
        </div>

        <h3 style={{ fontSize: '1.4rem', marginTop: '24px' }}>How Threads Map to Data</h3>
        <p>
          The magic happens in the line <code>int i = blockDim.x * blockIdx.x + threadIdx.x;</code>. CUDA launches threads in groups called <strong>blocks</strong>, which are organized into a <strong>grid</strong>. This formula gives us a globally unique identifier <code>i</code> for the current thread, allowing it to process exactly one index of our arrays <code>A</code>, <code>B</code>, and <code>C</code>.
        </p>

        <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '12px' }}>💡 Key Takeaway</h4>
          <p style={{ margin: 0 }}>
            There are no explicit loops inside the kernel for iterating through the arrays. The loop is replaced by the massive parallelism of the GPU launching millions of threads simultaneously!
          </p>
        </div>
      </div>
    </article>
  );
}
