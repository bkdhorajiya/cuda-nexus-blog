import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export function getSortedPostsData() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.filter(name => name.endsWith('.md')).map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const contentText = matterResult.content || '';
    const readingTime = Math.max(1, Math.ceil(contentText.split(/\s+/).length / 200));

    return {
      id,
      title: matterResult.data.title as string,
      date: matterResult.data.date as string,
      excerpt: matterResult.data.excerpt as string,
      tags: matterResult.data.tags || [],
      readingTime,
      ...(matterResult.data as { [key: string]: any })
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter(name => name.endsWith('.md')).map((fileName) => {
    return {
      slug: fileName.replace(/\.md$/, '')
    };
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    slug,
    content: matterResult.content,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    excerpt: matterResult.data.excerpt as string,
    tags: matterResult.data.tags || [],
    readingTime: Math.max(1, Math.ceil((matterResult.content || '').split(/\s+/).length / 200)),
    ...(matterResult.data as { [key: string]: any })
  };
}
