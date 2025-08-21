import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  generatePageTitle,
  generatePageDescription,
  generateKeywords,
  generateCanonicalUrl,
} from "../utils/seo";
import type { UserStats } from "../utils/seo";

interface UseSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile";
  username?: string;
  userStats?: UserStats;
  noIndex?: boolean;
}

export const useSEO = ({
  title,
  description,
  keywords = [],
  image,
  type = "website",
  username,
  userStats,
  noIndex = false,
}: UseSEOProps = {}) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Generate SEO data
  const seoData = {
    title: generatePageTitle(title, username, userStats),
    description: generatePageDescription(description, username, userStats),
    keywords: generateKeywords(keywords, username, userStats),
    canonical: generateCanonicalUrl(currentPath),
    url: `https://leetguide.com${currentPath}`,
    image: image || "https://leetguide.com/og-image.png",
    type,
    noIndex,
  };

  return seoData;
};

// Hook for dynamic meta tag updates
export const useMetaTags = (metaTags: Record<string, string>) => {
  useEffect(() => {
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      updateMetaTag(name, content);
    });

    // Cleanup function
    return () => {
      // We don't remove meta tags on cleanup as they should persist
    };
  }, [metaTags]);
};

// Hook for social sharing
export const useSocialShare = (
  url?: string,
  title?: string,
  description?: string
) => {
  const shareData = {
    url: url || window.location.href,
    title: title || document.title,
    text: description || "Check out this awesome LeetCode analytics dashboard!",
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareData.url
    )}&text=${encodeURIComponent(shareData.text)}&via=leetguide`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareData.url
    )}&title=${encodeURIComponent(
      shareData.title
    )}&summary=${encodeURIComponent(shareData.text)}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const shareToReddit = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(
      shareData.url
    )}&title=${encodeURIComponent(shareData.title)}`;
    window.open(redditUrl, "_blank", "width=600,height=400");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return true;
    } catch (err) {
      console.log("Error copying to clipboard:", err);
      return false;
    }
  };

  return {
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToReddit,
    shareNative,
    copyToClipboard,
    canShare: !!navigator.share,
    canCopy: !!navigator.clipboard,
    shareData,
  };
};

// Hook for tracking page views (for analytics)
export const usePageView = (pageName?: string) => {
  const location = useLocation();

  useEffect(() => {
    // Here you would typically send page view data to your analytics service
    // For example, Google Analytics, Mixpanel, etc.
    const pageTitle = pageName || document.title;
    const pagePath = location.pathname + location.search;

    // Example: Google Analytics 4
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_title: pageTitle,
    //   page_location: window.location.href
    // });

    console.log("Page view tracked:", {
      page: pageTitle,
      path: pagePath,
      timestamp: new Date().toISOString(),
    });
  }, [location, pageName]);
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          console.log("Performance measure:", entry.name, entry.duration);
        }
      }
    });

    observer.observe({ entryTypes: ["measure", "navigation"] });

    // Monitor LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log("LCP:", entry.startTime);
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      // Browser doesn't support LCP
    }

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
    };
  }, []);
};
