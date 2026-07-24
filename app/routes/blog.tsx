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
      title: 'Ecommerce Marketing, CRO & Growth Blog | Curious Apes',
      description:
        'Explore insights on eCommerce marketing, CRO, paid media, growth strategies, customer acquisition, and scaling D2C brands successfully.',
      path: '/blog',
    },
    originFromMatches(matches),
  )

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>()
  return <BlogPage posts={posts} />
}
