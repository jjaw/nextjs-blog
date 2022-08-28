import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'
import { remark } from 'remark'; //render markdown content
import html from 'remark-html';

// process.cwd() is current working directory.
// path.join joins current wokring directory with the POSTS directory
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id, 
      ...matterResult.data,
    };
  });
  // Sort psots by date
  return allPostsData.sort(({ date: a}, {date: b}) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //    {  
  //      params: {
  //        id: 'ssg-ssr'
  //      }
  //    },
  //    {
  //      params: {
  //        id: 'pre-rendering'
  //      }
  //    }
  //  ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// We need to fetch necessary data to render the post with the given 'id'
// Needs to be an 'async' function in order to use 'await' for remark()
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  // 'await' available due to 'async' keyword
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}