import { useLoaderData } from 'react-router'
import type { MetaFunction } from 'react-router'
import App from '../../src/App'
import { getPublishedBlogs } from '../../src/lib/blogs'
import { buildMeta, originFromMatches } from '../lib/meta'

// Server-render the homepage's blog teaser too, so the entire page is in the
// initial HTML (View Source) and fully crawlable.
export async function loader() {
  const posts = await getPublishedBlogs()
  return { posts }
}

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Curious Apes — Creative & Tech Agency',
      description:
        'Curious Apes — A creative and technology agency crafting bold digital experiences for ambitious D2C brands.',
      path: '/',
    },
    originFromMatches(matches),
  )

export default function HomeRoute() {
  const { posts } = useLoaderData<typeof loader>()
  return <App blogPosts={posts} />
}
