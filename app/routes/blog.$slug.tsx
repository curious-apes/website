import { useLoaderData } from 'react-router'
import type { LoaderFunctionArgs, MetaFunction } from 'react-router'
import BlogPostPage from '../../src/components/BlogPostPage'
import { getBlogBySlug } from '../../src/lib/blogs'
import { buildMeta } from '../lib/meta'

// Fetched server-side on every request → fresh content + real OG tags in the
// initial HTML, which is what makes social link previews work.
export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug as string
  const post = await getBlogBySlug(slug)
  if (!post || post.status !== 'published') {
    throw new Response('Post not found', { status: 404 })
  }
  return { post, origin: new URL(request.url).origin }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: 'Post not found — Curious Apes' }]
  const { post, origin } = data
  return buildMeta(
    {
      title: post.seoTitle || `${post.title} | Curious Apes`,
      description: post.seoDescription || post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.ogImage || undefined,
      type: 'article',
    },
    origin,
  )
}

export default function BlogPostRoute() {
  const { post } = useLoaderData<typeof loader>()
  return <BlogPostPage post={post} />
}
