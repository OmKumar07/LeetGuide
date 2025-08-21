export interface UserStats {
  username: string;
  totalSolved: number;
  ranking: number;
  acceptanceRate: string; // Note: This is a string in the API
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalAttempts?: number;
  contributionPoints?: number;
}

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultImage: string;
  twitterHandle: string;
  facebookAppId?: string;
  author: string;
}

export const seoConfig: SEOConfig = {
  siteName: "LeetGuide",
  siteUrl: "https://leetguide.com",
  defaultImage: "https://leetguide.com/og-image.png",
  twitterHandle: "@leetguide",
  author: "LeetGuide Team",
};

export const generatePageTitle = (
  pageTitle?: string,
  username?: string,
  userStats?: UserStats
): string => {
  if (username && userStats) {
    return `${username} - ${userStats.totalSolved} Problems Solved | LeetGuide Analytics`;
  }

  if (pageTitle) {
    return `${pageTitle} | LeetGuide - Advanced LeetCode Analytics`;
  }

  return "LeetGuide - Advanced LeetCode Analytics Dashboard | Track Your Coding Progress";
};

export const generatePageDescription = (
  pageDescription?: string,
  username?: string,
  userStats?: UserStats
): string => {
  if (username && userStats) {
    const acceptanceRate = parseFloat(userStats.acceptanceRate);
    return `${username} has solved ${userStats.totalSolved} LeetCode problems (Easy: ${userStats.easySolved}, Medium: ${userStats.mediumSolved}, Hard: ${userStats.hardSolved}) with ${acceptanceRate}% acceptance rate. Current ranking: ${userStats.ranking}. Track your coding progress with LeetGuide analytics.`;
  }

  if (pageDescription) {
    return pageDescription;
  }

  return "Track your LeetCode progress with advanced analytics, performance insights, difficulty analysis, and AI-powered problem recommendations. Get detailed statistics on your coding journey and improve your problem-solving skills with personalized learning paths.";
};

export const generateKeywords = (
  baseKeywords: string[] = [],
  username?: string,
  userStats?: UserStats,
  additionalKeywords: string[] = []
): string[] => {
  const defaultKeywords = [
    "LeetCode analytics",
    "coding progress tracker",
    "algorithm practice",
    "data structures",
    "programming dashboard",
    "leetcode stats",
    "coding interview prep",
    "problem solving tracker",
    "competitive programming",
    "software engineering practice",
    "coding analytics",
    "leetcode insights",
    "programming metrics",
    "algorithm analysis",
    "coding performance",
  ];

  const keywords = [...defaultKeywords, ...baseKeywords, ...additionalKeywords];

  if (username && userStats) {
    const acceptanceRate = parseFloat(userStats.acceptanceRate);
    keywords.push(
      `${username} leetcode`,
      `${userStats.totalSolved} problems solved`,
      `rank ${userStats.ranking}`,
      `${acceptanceRate}% acceptance rate`
    );
  }

  return [...new Set(keywords)]; // Remove duplicates
};

export const generateCanonicalUrl = (path: string): string => {
  return `${seoConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export const generateImageUrl = (imagePath?: string): string => {
  if (!imagePath) return seoConfig.defaultImage;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${seoConfig.siteUrl}${
    imagePath.startsWith("/") ? imagePath : `/${imagePath}`
  }`;
};

export const generateStructuredData = {
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LeetGuide",
    description:
      "Advanced LeetCode analytics dashboard with real-time progress tracking, performance insights, and AI-powered problem recommendations",
    url: seoConfig.siteUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: seoConfig.author,
    },
    sameAs: ["https://github.com/leetguide"],
  }),

  profile: (username: string, userStats: UserStats) => ({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${username} - LeetCode Analytics Profile`,
    description: `${username}'s LeetCode progress and statistics`,
    url: `${seoConfig.siteUrl}/profile/${username}`,
    mainEntity: {
      "@type": "Person",
      name: username,
      description: `LeetCode user with ${userStats.totalSolved} problems solved`,
      achievementStatistics: {
        "@type": "AchievementStatistics",
        solvedProblems: userStats.totalSolved,
        acceptanceRate: parseFloat(userStats.acceptanceRate),
        ranking: userStats.ranking,
        difficulty: {
          easy: userStats.easySolved,
          medium: userStats.mediumSolved,
          hard: userStats.hardSolved,
        },
      },
    },
  }),

  breadcrumb: (breadcrumbs: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  }),

  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),
};

export const socialShareUrls = {
  twitter: (url: string, text: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}&via=leetguide`,

  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,

  linkedin: (url: string, title: string, summary: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
      summary
    )}`,

  reddit: (url: string, title: string) =>
    `https://reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,

  whatsapp: (url: string, text: string) =>
    `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${text} ${url}`
    )}`,
};
