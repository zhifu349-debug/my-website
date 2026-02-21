import {
  PageType,
  RecommendationPage,
  ReviewPage,
  ComparisonPage,
  TutorialPage,
  ResourcePage,
  Solution,
} from "@/types/content";

// 示例方案数据
export const mockSolutions: Solution[] = [
  {
    id: "vultr",
    name: "Vultr",
    slug: "vultr",
    price: "$5/mo",
    affiliateUrl: "https://www.vultr.com/?ref=example",
    pros: [
      "Affordable pricing",
      "Multiple data centers",
      "Easy to use",
      "Fast SSD storage",
      "Hourly billing",
    ],
    cons: [
      "Limited support on lower tiers",
      "No free tier",
      "Community support only",
    ],
    features: [
      "SSD cloud servers",
      "100% SLA",
      "Global infrastructure",
      "One-click apps",
      "Docker support",
    ],
    rating: 4.5,
    bestFor: ["Beginners", "Small projects", "Development environments"],
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    slug: "digitalocean",
    price: "$4/mo",
    affiliateUrl: "https://www.digitalocean.com/?refcode=example",
    pros: [
      "Developer-friendly",
      "Excellent documentation",
      "Community support",
      "Reliable performance",
      "Good API",
    ],
    cons: [
      "Fewer data center locations",
      "Basic customer support",
      "No Windows support",
    ],
    features: [
      "SSD cloud servers",
      "Floating IPs",
      "Load balancers",
      "Object storage",
      "Kubernetes",
    ],
    rating: 4.7,
    bestFor: ["Developers", "Startups", "API users"],
  },
  {
    id: "linode",
    name: "Linode",
    slug: "linode",
    price: "$5/mo",
    affiliateUrl: "https://www.linode.com/?r=example",
    pros: [
      "Great performance",
      "24/7 support",
      "Multiple Linux distros",
      "Good value",
      "IPv6 support",
    ],
    cons: [
      "Steep learning curve",
      "Limited Windows options",
      "Fewer one-click apps",
    ],
    features: [
      "SSD storage",
      "Cloud firewall",
      "NodeBalancers",
      "Object storage",
      "GPU instances",
    ],
    rating: 4.6,
    bestFor: ["Advanced users", "Production apps", "Tech-savvy users"],
  },
];

// 示例推荐页数据
export const mockRecommendationPage: RecommendationPage = {
  id: "rec-1",
  slug: "best-vps-2026",
  keyword: "best vps",
  intent: "commercial" as any,
  solutions: mockSolutions,
  painPoints: [
    "Slow website performance",
    "Unexpected downtime",
    "Complex setup process",
    "Hidden fees",
    "Poor customer support",
  ],
  useCases: [
    "Hosting a personal website",
    "Running development environments",
    "Deploying production applications",
    "Testing new projects",
  ],
  selectionGuide: {
    beginners:
      "Choose DigitalOcean for excellent documentation and community support",
    advanced:
      "Linode offers more control and better performance for technical users",
    specialNeeds: "Vultr provides global data centers for worldwide audiences",
  },
  faqs: [
    {
      question: "What is a VPS?",
      answer:
        "A Virtual Private Server (VPS) is a virtual machine sold as a service by an Internet hosting service.",
    },
    {
      question: "How much does a VPS cost?",
      answer:
        "VPS hosting typically costs between $4-20 per month for basic plans.",
    },
    {
      question: "Do I need technical skills?",
      answer:
        "Basic Linux knowledge is helpful, but many providers offer managed services.",
    },
  ],
  publishedAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-02-10"),
};

// 示例评测页数据
export const mockReviewPage: ReviewPage = {
  id: "review-1",
  slug: "vultr-review",
  keyword: "vultr review",
  product: mockSolutions[0],
  background:
    "Vultr is a cloud computing platform founded in 2014. It provides scalable cloud servers for developers and businesses.",
  features: [
    "Multiple OS options including Linux and Windows",
    "One-click application deployment",
    "Automated backups",
    "Load balancers",
    "Dedicated cloud firewalls",
  ],
  performance:
    "Excellent performance with NVMe SSD storage and 99.9% uptime SLA.",
  pricing: "Hourly billing starting at $5/month with no long-term contracts.",
  testResults: [
    {
      metric: "Boot Time",
      value: "45 seconds",
      details: "Fast boot times across all plans",
    },
    {
      metric: "I/O Performance",
      value: "500 MB/s",
      details: "Consistent NVMe SSD speeds",
    },
    { metric: "Uptime", value: "99.9%", details: "Based on 6-month testing" },
  ],
  screenshots: [],
  conclusion:
    "Vultr is an excellent choice for developers and small businesses looking for affordable, reliable cloud hosting.",
  suitableFor: [
    "Developers needing multiple environments",
    "Startups with limited budget",
    "Projects requiring global presence",
  ],
  notSuitableFor: [
    "Enterprise applications needing extensive support",
    "Users preferring managed services",
  ],
  faqs: [
    {
      question: "Is Vultr good for beginners?",
      answer:
        "Yes, Vultr provides good documentation and a user-friendly interface for beginners.",
    },
    {
      question: "Does Vultr offer free trial?",
      answer:
        "Vultr offers a limited credit for new users to test their services.",
    },
  ],
  publishedAt: new Date("2026-01-20"),
  updatedAt: new Date("2026-02-05"),
};

// 示例对比页数据
export const mockComparisonPage: ComparisonPage = {
  id: "comp-1",
  slug: "vultr-vs-digitalocean",
  keyword: "vultr vs digitalocean",
  products: [mockSolutions[0], mockSolutions[1]],
  comparisonTable: [
    {
      feature: "Starting Price",
      values: ["$5/mo", "$4/mo"],
    },
    {
      feature: "Data Centers",
      values: ["32 locations", "12 locations"],
    },
    {
      feature: "SSD Storage",
      values: ["NVMe", "Standard SSD"],
    },
    {
      feature: "Customer Support",
      values: ["Email", "Community & Email"],
    },
    {
      feature: "API Quality",
      values: ["Good", "Excellent"],
    },
  ],
  scenarioComparison: [
    {
      scenario: "Best for Beginners",
      recommended: ["digitalocean"],
      reason:
        "DigitalOcean has excellent documentation and a more user-friendly interface",
    },
    {
      scenario: "Global Deployment",
      recommended: ["vultr"],
      reason: "Vultr has more data center locations worldwide",
    },
  ],
  finalRecommendation: [
    {
      scenario: "Development & Testing",
      productId: "digitalocean",
      reason: "Lower cost and better documentation for quick iteration",
    },
    {
      scenario: "Production Applications",
      productId: "vultr",
      reason: "More data centers and NVMe storage for better performance",
    },
  ],
  faqs: [
    {
      question: "Which is cheaper?",
      answer:
        "DigitalOcean starts at $4/month, while Vultr starts at $5/month.",
    },
    {
      question: "Can I migrate between them?",
      answer: "Yes, both offer migration tools and easy data export options.",
    },
  ],
  publishedAt: new Date("2026-01-25"),
  updatedAt: new Date("2026-02-01"),
};

// 示例教程页数据
export const mockTutorialPage: TutorialPage = {
  id: "tut-1",
  slug: "v2ray-setup",
  keyword: "v2ray setup",
  intent: "informational" as any,
  background:
    "V2Ray is a proxy tool that helps you bypass internet restrictions. This guide will walk you through the setup process.",
  prerequisites: [
    "A VPS server (Vultr, DigitalOcean, or Linode)",
    "Basic SSH knowledge",
    "A domain name (optional)",
  ],
  steps: [
    {
      id: "step1",
      title: "Choose a VPS Provider",
      content:
        "Select a VPS provider based on your needs. We recommend starting with DigitalOcean or Vultr for beginners.",
    },
    {
      id: "step2",
      title: "Create a Server Instance",
      content:
        "Create a new droplet/server with at least 1GB RAM. Choose Ubuntu 20.04 or 22.04 as the OS.",
    },
    {
      id: "step3",
      title: "Connect via SSH",
      content: "Use your terminal to connect: ssh root@your-server-ip",
    },
    {
      id: "step4",
      title: "Install V2Ray",
      content:
        "Run the installation script: bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)",
    },
  ],
  commonErrors: [
    {
      error: "Connection timeout",
      solution: "Check your firewall settings and ensure port 443 is open.",
    },
    {
      error: "Permission denied",
      solution: "Make sure you are using sudo or logging in as root.",
    },
  ],
  recommendedProducts: mockSolutions.slice(0, 2),
  faqs: [
    {
      question: "Is V2Ray legal?",
      answer:
        "V2Ray is a legitimate tool for network proxying. Always comply with local laws and regulations.",
    },
    {
      question: "How do I update V2Ray?",
      answer:
        "Run the update script provided by the official V2Ray repository.",
    },
  ],
  publishedAt: new Date("2026-02-01"),
  updatedAt: new Date("2026-02-15"),
};

// 示例资源页数据
export const mockResourcePage: ResourcePage = {
  id: "res-1",
  slug: "vps-guide",
  keyword: "vps guide",
  title: "Complete VPS Hosting Guide",
  description: "Everything you need to know about VPS hosting",
  valueProposition:
    "Learn how to choose, set up, and manage your VPS server effectively",
  targetAudience: [
    "Beginners exploring VPS hosting",
    "Developers needing deployment knowledge",
    "Business owners looking for hosting solutions",
  ],
  contents: [
    {
      id: "section1",
      title: "Introduction to VPS",
      content:
        "A comprehensive overview of what VPS hosting is and why you might need it.",
    },
    {
      id: "section2",
      title: "Choosing a Provider",
      content:
        "Detailed comparison of top VPS providers and how to select the right one.",
    },
    {
      id: "section3",
      title: "Setup & Configuration",
      content: "Step-by-step guide to setting up your first VPS server.",
    },
  ],
  pricing: [
    {
      plan: "Basic",
      price: "Free",
      features: [
        "Essential VPS knowledge",
        "Basic setup guide",
        "Provider comparison",
      ],
    },
    {
      plan: "Pro",
      price: "$29",
      features: [
        "Advanced configurations",
        "Security best practices",
        "Optimization tips",
        "Case studies",
      ],
    },
  ],
  faqs: [
    {
      question: "What format is this guide?",
      answer: "This guide is available in PDF and online formats.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes, we offer a 30-day money-back guarantee on the Pro version.",
    },
  ],
  publishedAt: new Date("2026-02-10"),
  updatedAt: new Date("2026-02-10"),
};
