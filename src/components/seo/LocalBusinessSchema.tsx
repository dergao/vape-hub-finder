import { Helmet } from "react-helmet-async";
import type { VapeStore } from "@/data/mockData";

interface LocalBusinessSchemaProps {
  store: VapeStore;
}

export function LocalBusinessSchema({ store }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://vapefinder.com/us/${store.city.toLowerCase().replace(/\s+/g, '-')}/${store.slug}`,
    name: store.name,
    description: store.description,
    image: store.imageUrl,
    telephone: store.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.zipCode,
      addressCountry: "US"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.coordinates.lat,
      longitude: store.coordinates.lng
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: store.rating,
      reviewCount: store.reviewCount,
      bestRating: 5,
      worstRating: 1
    },
    openingHoursSpecification: Object.entries(store.hours)
      .filter(([_, hours]) => hours !== null)
      .map(([day, hours]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens: hours!.open,
        closes: hours!.close
      })),
    priceRange: "$$"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
