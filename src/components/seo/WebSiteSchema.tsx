import { Helmet } from "react-helmet-async";

interface WebSiteSchemaProps {
  totalStores: number;
  totalCities: number;
}

export function WebSiteSchema({ totalStores, totalCities }: WebSiteSchemaProps) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://vapefinder.com/#website",
      name: "VapeFinder",
      url: "https://vapefinder.com",
      description: `Find the best vape shops near you. Browse ${totalStores.toLocaleString()}+ verified stores across ${totalCities} major US cities.`,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://vapefinder.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://vapefinder.com/#organization",
      name: "VapeFinder",
      url: "https://vapefinder.com",
      logo: {
        "@type": "ImageObject",
        url: "https://vapefinder.com/logo.png",
        width: 200,
        height: 200
      },
      sameAs: [
        "https://facebook.com/vapefinder",
        "https://twitter.com/vapefinder",
        "https://instagram.com/vapefinder"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "English"
      }
    }
  ];

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
