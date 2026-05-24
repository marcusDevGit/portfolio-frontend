import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "Marcus Phellypp - Desenvolvedor Full-Stack",
  description = "Desenvolvedor focado em React, Node.js e TypeScript. Construindo interfaces modernas e APIs robustas com foco em segurança e escalabilidade.",
  image = "https://portfolio-frontend-liart-pi.vercel.app/og-image.png",
  url = "https://portfolio-frontend-liart-pi.vercel.app",
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
