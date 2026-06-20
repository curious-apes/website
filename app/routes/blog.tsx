import { useLoaderData } from 'react-router'
import type { MetaFunction } from 'react-router'
import BlogPage from '../../src/components/BlogPage'
import { getPublishedBlogs } from '../../src/lib/blogs'
import { buildMeta, originFromMatches } from '../lib/meta'

// Server-render the post list so /blog is crawlable and paints instantly.
export async function loader() {
  try {
    return { posts: await getPublishedBlogs() }
  } catch (err) {
    console.error('blog loader: failed to load blogs', err)
    return { posts: [] }
  }
}

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Blog — Strategies & Playbooks | Curious Apes',
      description:
        'Real growth strategies and playbooks for Indian D2C brands — Meta & Google Ads, CRO, retention, and creative.',
      path: '/blog',
    },
    originFromMatches(matches),
  )

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>()
  return <BlogPage posts={posts} />
}
