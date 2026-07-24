import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('blog', 'routes/blog.tsx'),
  route('blog/:slug', 'routes/blog.$slug.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('services/paid-media', 'routes/paid-media.tsx'),
  route('services/tech-cro', 'routes/tech-cro.tsx'),
  route('services/visuals-creative', 'routes/visuals.tsx'),
  route('services/growth-marketing', 'routes/growth.tsx'),
  route('services/ecommerce-performance-marketing', 'routes/ecommerce-performance-marketing.tsx'),
  route('thankyou', 'routes/thankyou.tsx'),
  route('sitemap.xml', 'routes/sitemap[.]xml.tsx'),
  route('admin/*', 'routes/admin.tsx'),
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig
