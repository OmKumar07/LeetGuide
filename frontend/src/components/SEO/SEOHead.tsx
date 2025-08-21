import React, { useEffect } from "react";
import {
  generatePageTitle,
  generatePageDescription,
  generateKeywords,
  generateCanonicalUrl,
  generateImageUrl,
} from "../../utils/seo";
import type { UserStats } from "../../utils/seo";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  username?: string;
  userStats?: UserStats;
  noIndex?: boolean;
  canonical?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  author = "LeetGuide Team",
  publishedTime,
  modifiedTime,
  username,
  userStats,
  noIndex = false,
  canonical,
  structuredData,
}) => {
  useEffect(() => {
    // Generate dynamic content
    const dynamicTitle = generatePageTitle(title, username, userStats);
    const dynamicDescription = generatePageDescription(
      description,
      username,
      userStats
    );
    const dynamicKeywords = generateKeywords(keywords, username, userStats);
    const finalCanonical = canonical || generateCanonicalUrl(url || "");
    const finalImage = generateImageUrl(image);

    // Update document title
    document.title = dynamicTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (
      selector: string,
      content: string,
      attribute: string = "content"
    ) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute(
            "property",
            selector.match(/property="([^"]*)"/)![1]
          );
        } else if (selector.includes("name=")) {
          element.setAttribute("name", selector.match(/name="([^"]*)"/)![1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (
      rel: string,
      href: string,
      additionalAttributes?: Record<string, string>
    ) => {
      let element = document.querySelector(
        `link[rel="${rel}"]`
      ) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
      if (additionalAttributes) {
        Object.entries(additionalAttributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }
    };

    // Basic meta tags
    updateMetaTag('meta[name="description"]', dynamicDescription);
    updateMetaTag('meta[name="keywords"]', dynamicKeywords.join(", "));
    updateMetaTag('meta[name="author"]', author);
    updateMetaTag(
      'meta[name="robots"]',
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // Canonical URL
    updateLinkTag("canonical", finalCanonical);

    // Open Graph meta tags
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:url"]', url || finalCanonical);
    updateMetaTag('meta[property="og:title"]', dynamicTitle);
    updateMetaTag('meta[property="og:description"]', dynamicDescription);
    updateMetaTag('meta[property="og:image"]', finalImage);
    updateMetaTag('meta[property="og:image:width"]', "1200");
    updateMetaTag('meta[property="og:image:height"]', "630");
    updateMetaTag(
      'meta[property="og:image:alt"]',
      `${dynamicTitle} - Dashboard Screenshot`
    );
    updateMetaTag('meta[property="og:site_name"]', "LeetGuide");
    updateMetaTag('meta[property="og:locale"]', "en_US");

    // Article specific meta tags
    if (type === "article") {
      if (publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
      }
      updateMetaTag('meta[property="article:author"]', author);
    }

    // Profile specific meta tags
    if (type === "profile" && username) {
      updateMetaTag('meta[property="profile:username"]', username);
    }

    // Twitter Card meta tags
    updateMetaTag('meta[name="twitter:card"]', "summary_large_image");
    updateMetaTag('meta[name="twitter:url"]', url || finalCanonical);
    updateMetaTag('meta[name="twitter:title"]', dynamicTitle);
    updateMetaTag('meta[name="twitter:description"]', dynamicDescription);
    updateMetaTag('meta[name="twitter:image"]', finalImage);
    updateMetaTag(
      'meta[name="twitter:image:alt"]',
      `${dynamicTitle} - Dashboard Screenshot`
    );
    updateMetaTag('meta[name="twitter:creator"]', "@leetguide");
    updateMetaTag('meta[name="twitter:site"]', "@leetguide");

    // Structured Data
    if (structuredData) {
      let scriptElement = document.querySelector(
        'script[type="application/ld+json"]'
      ) as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // We don't remove meta tags on cleanup as they should persist
      // until the next page navigation or component update
    };
  }, [
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
    username,
    userStats,
    noIndex,
    canonical,
    structuredData,
  ]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
