import { Helmet } from "react-helmet-async";
import type { City } from "@/data/mockData";

interface CityListSchemaProps {
  cities: City[];
  totalStores: number;
}

export function CityListSchema({ cities, totalStores }: CityListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://vapefinder.com/us/#collectionpage",
    name: "Vape Shops in United States",
    description: `Browse ${totalStores.toLocaleString()}+ vape shops across ${cities.length} major US cities. Find the best vape stores with reviews, hours, and inventory near you.`,
    url: "https://vapefinder.com/us",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://vapefinder.com/#website"
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cities.map((city, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "City",
          name: city.name,
          url: `https://vapefinder.com/us/${city.slug}`,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: city.state
          }
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
