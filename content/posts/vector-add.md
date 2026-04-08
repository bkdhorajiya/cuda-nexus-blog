---
title: "Vector Addition: The \"Hello World\" of CUDA"
date: "2026-05-15"
excerpt: "Start your journey into GPU programming by dissecting the fundamental vectorAdd sample. Understand thread blocks, grids, and global memory allocation."
---

If you are learning C++, your first program is `printf("Hello World")`. In the world of massive parallel programming with NVIDIA GPUs, the equivalent is **Vector Addition**.

## The CUDA Kernel

A CUDA kernel is a function executed on the GPU. It is defined using the `__global__` declaration specifier. Each thread that executes this kernel performs one element of the vector addition.

```cpp
__global__ void vectorAdd(const float *A, const float *B, float *C, int numElements)
{
    int i = blockDim.x * blockIdx.x + threadIdx.x;

    if (i < numElements)
    {
        C[i] = A[i] + B[i];
    }
}
```

### How Threads Map to Data

The magic happens in the line `int i = blockDim.x * blockIdx.x + threadIdx.x;`. CUDA launches threads in groups called **blocks**, which are organized into a **grid**. This formula gives us a globally unique identifier `i` for the current thread, allowing it to process exactly one index of our arrays `A`, `B`, and `C`.

<br/>

> **💡 Key Takeaway**  
> There are no explicit loops inside the kernel for iterating through the arrays. The loop is replaced by the massive parallelism of the GPU launching millions of threads simultaneously!
