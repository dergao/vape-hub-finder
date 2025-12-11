import { Helmet } from "react-helmet-async";
import type { Review, VapeStore } from "@/data/mockData";

interface ReviewSchemaProps {
  store: VapeStore;
  reviews: Review[];
}

export function ReviewSchema({ store, reviews }: ReviewSchemaProps) {
  if (reviews.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://vapefinder.com/us/${store.city.toLowerCase().replace(/\s+/g, '-')}/${store.slug}#business`,
    name: store.name,
    review: reviews.map(review => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.userName
      },
      datePublished: review.date,
      reviewBody: review.content,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: store.rating,
      reviewCount: store.reviewCount,
      bestRating: 5,
      worstRating: 1
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
