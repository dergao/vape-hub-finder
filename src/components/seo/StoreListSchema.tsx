import { Helmet } from "react-helmet-async";
import type { VapeStore, City } from "@/data/mockData";

interface StoreListSchemaProps {
  city: City;
  stores: VapeStore[];
}

export function StoreListSchema({ city, stores }: StoreListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://vapefinder.com/us/${city.slug}/#collectionpage`,
    name: `Vape Shops in ${city.name}, ${city.state}`,
    description: `Find the best vape shops in ${city.name}, ${city.state}. Browse ${city.storeCount} stores with reviews, hours, and inventory.`,
    url: `https://vapefinder.com/us/${city.slug}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://vapefinder.com/#website"
    },
    about: {
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: city.state
      }
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stores.length,
      itemListElement: stores.slice(0, 20).map((store, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "LocalBusiness",
          "@id": `https://vapefinder.com/us/${city.slug}/${store.slug}`,
          name: store.name,
          url: `https://vapefinder.com/us/${city.slug}/${store.slug}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: store.address,
            addressLocality: city.name,
            addressRegion: store.state,
            postalCode: store.zipCode,
            addressCountry: "US"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: store.coordinates.lat,
            longitude: store.coordinates.lng
          },
          aggregateRating: store.reviewCount > 0 ? {
            "@type": "AggregateRating",
            ratingValue: store.rating,
            reviewCount: store.reviewCount,
            bestRating: 5,
            worstRating: 1
          } : undefined,
          telephone: store.phone
        }
      }))
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
