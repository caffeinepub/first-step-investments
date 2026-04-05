import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Instagram,
  Lightbulb,
  Linkedin,
  Menu,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Twitter,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LoginPage } from "./components/LoginPage";
import { MiniLineChart } from "./components/MiniLineChart";
import {
  useCategories,
  useMarketTrends,
  useSubscribeEmail,
  useTips,
} from "./hooks/useQueries";

// ─── Constants ──────────────────────────────────────────────────────────────

const NAVY = "oklch(0.45 0.12 232)";
const NAVY_MID = "oklch(0.52 0.11 232)";
const MINT = "oklch(0.82 0.10 210)";
const MINT_LIGHT = "oklch(0.92 0.06 210)";

const TREND_HISTORY: Record<string, number[]> = {
  sp500: [5100, 5180, 5150, 5200, 5220, 5231],
  nasdaq: [16000, 16200, 16100, 16300, 16420, 16480],
  bitcoin: [60000, 63000, 61500, 65000, 66800, 67200],
  gold: [2300, 2310, 2320, 2330, 2340, 2345],
  oil: [85, 84, 83, 82, 83, 82],
  bonds: [98.2, 98.4, 98.5, 98.6, 98.7, 98.7],
};

const TREND_LABELS: Record<string, string> = {
  sp500: "S&P 500",
  nasdaq: "NASDAQ",
  bitcoin: "Bitcoin",
  gold: "Gold",
  oil: "Oil",
  bonds: "Bonds",
};

const HUB_SECTIONS = [
  { id: "guide", label: "Your Guide", icon: BookOpen },
  { id: "markets", label: "Markets", icon: BarChart2 },
  { id: "tracker", label: "Tracker", icon: Target },
  { id: "tips", label: "Tips", icon: Lightbulb },
];

const TIP_ICONS = ["💡", "📊", "🎯", "⚡", "🔑", "📈", "♻️", "🔄"];
const TIP_TAGS = [
  { label: "SIP Strategy", color: "oklch(0.92 0.06 232)" },
  { label: "Asset Allocation", color: "oklch(0.92 0.08 160)" },
  { label: "Tax Saving", color: "oklch(0.94 0.07 80)" },
  { label: "Risk Management", color: "oklch(0.92 0.06 30)" },
  { label: "Market Basics", color: "oklch(0.92 0.06 232)" },
  { label: "Tax Saving", color: "oklch(0.94 0.07 80)" },
  { label: "Compounding", color: "oklch(0.92 0.08 160)" },
  { label: "Portfolio Health", color: "oklch(0.92 0.06 30)" },
];

const ROADMAP_STEPS = [
  {
    num: 1,
    icon: "🎯",
    title: "Set Your Financial Goal",
    desc: "Define whether you're investing for short-term (1-3 years), medium-term (3-7 years), or long-term (7+ years). Clear goals shape your entire strategy.",
  },
  {
    num: 2,
    icon: "🛡️",
    title: "Build an Emergency Fund",
    desc: "Before investing, keep 3-6 months of living expenses in a liquid savings account. This safety net prevents panic-selling during market dips.",
  },
  {
    num: 3,
    icon: "⚖️",
    title: "Choose Your Investment Style",
    desc: "Are you conservative (low risk, steady returns), moderate (balanced mix), or aggressive (high risk, high reward)? Knowing this avoids costly mistakes.",
  },
  {
    num: 4,
    icon: "🔄",
    title: "Start with SIP in Mutual Funds",
    desc: "Automate ₹500–₹5,000/month via SIP. You buy more units when prices fall and fewer when they rise — this is rupee cost averaging at work.",
  },
  {
    num: 5,
    icon: "🌱",
    title: "Diversify Over Time",
    desc: "As confidence grows, add stocks, ETFs, gold, and bonds. A diversified portfolio reduces risk while giving exposure to multiple growth engines.",
  },
];

const INDIA_VEHICLES = [
  {
    icon: "🏛️",
    name: "PPF",
    full: "Public Provident Fund",
    returns: "7.1% p.a.",
    tag: "Tax-Free",
    lockin: "15-year lock-in",
    risk: "Very Low",
    riskColor: "#22c55e",
    desc: "Government-backed savings with guaranteed returns. Interest earned is fully tax-free under EEE status.",
  },
  {
    icon: "📊",
    name: "ELSS",
    full: "Equity Linked Savings Scheme",
    returns: "12–15% expected",
    tag: "80C Benefit",
    lockin: "3-year lock-in",
    risk: "Moderate",
    riskColor: "#f59e0b",
    desc: "Equity mutual funds that save tax under Section 80C. Shortest lock-in among tax-saving options.",
  },
  {
    icon: "🏦",
    name: "NPS",
    full: "National Pension System",
    returns: "Market-linked",
    tag: "Retirement",
    lockin: "Till retirement",
    risk: "Low–Moderate",
    riskColor: "#3b82f6",
    desc: "Market-linked pension scheme with additional ₹50,000 tax deduction under 80CCD(1B). Great for long-term retirement.",
  },
  {
    icon: "📈",
    name: "Nifty 50",
    full: "Index Fund",
    returns: "10–12% historical",
    tag: "Low Cost",
    lockin: "No lock-in",
    risk: "Moderate",
    riskColor: "#f59e0b",
    desc: "Passively tracks India's top 50 companies. Ultra-low expense ratio, perfect for beginners wanting broad market exposure.",
  },
  {
    icon: "🏧",
    name: "Fixed Deposit",
    full: "Bank FD",
    returns: "6.5–7.5% p.a.",
    tag: "Guaranteed",
    lockin: "Flexible tenure",
    risk: "Nil",
    riskColor: "#22c55e",
    desc: "Guaranteed returns from banks. DICGC insures up to ₹5 lakhs per bank. Ideal for capital preservation.",
  },
  {
    icon: "✨",
    name: "Digital Gold",
    full: "24K Certified Gold",
    returns: "Gold price-linked",
    tag: "From ₹1",
    lockin: "No lock-in",
    risk: "Low",
    riskColor: "#22c55e",
    desc: "Buy 24K gold digitally starting from just ₹1. No storage costs, easy to liquidate, and acts as inflation hedge.",
  },
];

const BEGINNER_MISTAKES = [
  {
    icon: "⏰",
    title: "Timing the Market",
    desc: "Waiting for the 'perfect' entry leads to missed gains. Studies show time in the market consistently beats timing the market. Start today, not tomorrow.",
  },
  {
    icon: "📉",
    title: "Ignoring Inflation",
    desc: "Keeping all savings in FDs at 7% while inflation runs at 6% gives you only 1% real return. Equity investments historically outpace inflation over time.",
  },
  {
    icon: "🎰",
    title: "No Diversification",
    desc: "Concentrating in one stock or sector is gambling, not investing. A single company collapse can wipe years of gains. Spread across asset classes.",
  },
];

const FLOATING_PARTICLES = [
  { x: "10%", y: "20%", size: 6, delay: 0, duration: 4 },
  { x: "85%", y: "15%", size: 10, delay: 0.5, duration: 5 },
  { x: "70%", y: "70%", size: 5, delay: 1, duration: 3.5 },
  { x: "20%", y: "75%", size: 8, delay: 1.5, duration: 4.5 },
  { x: "50%", y: "40%", size: 4, delay: 0.8, duration: 6 },
  { x: "90%", y: "55%", size: 7, delay: 2, duration: 4 },
  { x: "35%", y: "10%", size: 5, delay: 0.3, duration: 5.5 },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
}: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  return (
    <div className="bg-white rounded-3xl border border-border shadow-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${MINT}22` }}
        >
          🧮
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">SIP Calculator</h3>
          <p className="text-sm text-muted-foreground">
            Estimate your wealth growth
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 content-start">
          <div>
            <label
              htmlFor="sip-monthly"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Monthly Investment (₹)
            </label>
            <input
              id="sip-monthly"
              type="number"
              min={500}
              step={500}
              value={monthly}
              onChange={(e) =>
                setMonthly(Math.max(500, Number(e.target.value) || 500))
              }
              data-ocid="sip.monthly.input"
              className="w-full border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-lg focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="sip-years"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Time Period (Years)
            </label>
            <input
              id="sip-years"
              type="number"
              min={1}
              max={40}
              value={years}
              onChange={(e) =>
                setYears(Math.min(40, Math.max(1, Number(e.target.value) || 1)))
              }
              data-ocid="sip.years.input"
              className="w-full border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-lg focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="sip-rate"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Expected Return (%)
            </label>
            <input
              id="sip-rate"
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={rate}
              onChange={(e) =>
                setRate(Math.min(30, Math.max(1, Number(e.target.value) || 1)))
              }
              data-ocid="sip.rate.input"
              className="w-full border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-lg focus:outline-none focus:ring-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Content ─────────────────────────────────────────────────────────

const TIP_EXTENDED = [
  "Action step: Open a demat account today (Zerodha/Groww), search for 'Nifty 50 index fund', and set a SIP date matching your salary credit date. Set it and forget it — consistency beats perfect timing every time.",
  "Action step: Write down your age, then calculate 100 minus your age for equity %. Open a flexi-cap or large-cap fund for the equity portion and PPF/FD for the rest. Review the split every year on your birthday.",
  "Action step: Log in to your PPF account (or open one at SBI/Post Office) and transfer ₹12,500/month (₹1.5L/year) for the full 80C benefit. Set a monthly auto-transfer so you never miss it.",
  "Action step: Calculate your monthly expenses. Multiply by 6. Transfer that amount to a liquid mutual fund like HDFC Liquid Fund or Parag Parikh Liquid Fund — it earns better than savings accounts and stays accessible.",
  "Action step: Open a SIP in DSP Nifty 50 Equal Weight Index Fund or UTI Nifty 50 Index Fund. Start with ₹1,000/month. Increase it by 10% every year (called a step-up SIP) as your salary grows.",
  "Action step: Compare ELSS options — Mirae Asset Tax Saver, Axis Long Term Equity, or Quant Tax Plan. Start a ₹500/month SIP to lock in your 80C deduction and let it compound beyond the 3-year lock-in.",
  "Action step: When choosing mutual funds, always pick 'Growth' plan over 'IDCW' (dividend). Check your existing funds in CAMS or MFCentral — switch to Growth if you are currently in dividend option.",
  "Action step: Set a calendar reminder for April 1 and October 1 every year. Log in, check if any asset class is ±10% off target, and rebalance by buying the underweight category using fresh SIP contributions.",
];

const MODAL_TITLES: Record<string, string> = {
  "about-us": "About First Step",
  careers: "Careers at First Step",
  press: "Press & Media",
  contact: "Contact Us",
  "beginner-guide": "Beginner's Investment Guide",
  "market-data": "Indian Market Data",
  "investment-tools": "Investment Tools",
  blog: "Investment Blog",
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
  "cookie-policy": "Cookie Policy",
  disclaimer: "Disclaimer",
  "cat-1": "Mutual Funds",
  "cat-2": "Stocks",
  "cat-3": "Fixed Deposits",
  "cat-4": "Cryptocurrency",
};

function ModalContent({ id }: { id: string }) {
  switch (id) {
    case "about-us":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            First Step was founded 2 years ago with a single mission: make
            investing accessible and understandable for every Indian, regardless
            of their financial background. We believe that financial literacy is
            the first step to financial freedom.
          </p>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Our Mission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To demystify investing for beginners in India — providing tools,
              education, and community to help you grow your wealth confidently
              and consistently.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Our Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Nivith Kumar",
                  role: "Chief Executive Officer (CEO)",
                  emoji: "👔",
                  desc: "Visionary leader driving First Step's growth and strategy with a passion for financial inclusion.",
                },
                {
                  name: "Ravi Prasad",
                  role: "Managing Director (MD)",
                  emoji: "📊",
                  desc: "Operations and business development expert ensuring First Step delivers real value to investors.",
                },
                {
                  name: "Kamlash",
                  role: "Digital Marketer",
                  emoji: "📱",
                  desc: "Growth strategist building First Step's brand and reaching new investors across digital channels.",
                },
                {
                  name: "Mugunthan",
                  role: "Website Designer",
                  emoji: "🎨",
                  desc: "Creative designer crafting the intuitive and beautiful interfaces you see on First Step.",
                },
                {
                  name: "Prasanna",
                  role: "Website Designer",
                  emoji: "💻",
                  desc: "Frontend architect ensuring the platform is fast, responsive, and delightful to use.",
                },
                {
                  name: "Arun Muthu Bagavathi",
                  role: "Assistant CEO & PA",
                  emoji: "🤝",
                  desc: "Supporting executive leadership and managing strategic coordination across First Step's key initiatives.",
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="rounded-xl border border-border p-4 flex gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.45 0.12 232)" + "22" }}
                  >
                    {member.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {member.name}
                    </p>
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: "oklch(0.45 0.12 232)" }}
                    >
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {member.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "careers":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            We're a fast-growing fintech startup and we're always looking for
            passionate people to join us. If you love investing, education, and
            building products that make a difference — you belong here.
          </p>
          <div className="space-y-4">
            {[
              {
                title: "Investment Content Writer",
                type: "Full-time · Remote",
                desc: "Write engaging articles, guides, and explainers about personal finance and investing for Indian audiences. Requires strong writing skills and basic knowledge of markets.",
              },
              {
                title: "Frontend Developer",
                type: "Full-time · Hybrid",
                desc: "Build and improve our web platform using React and TypeScript. You'll work directly with our design team to ship features used by thousands of beginners.",
              },
              {
                title: "Social Media Manager",
                type: "Part-time · Remote",
                desc: "Grow our Instagram, Twitter, and LinkedIn presence. Create short-form content about investing tips, market updates, and financial education.",
              },
              {
                title: "Financial Analyst",
                type: "Full-time · Chennai",
                desc: "Research investment opportunities, create market reports, and support the content team with data-driven insights on Indian equities and mutual funds.",
              },
            ].map((role) => (
              <div
                key={role.title}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {role.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{role.type}</p>
                  </div>
                  <a
                    href={`mailto:kumarnivith33@gmail.com?subject=Application: ${role.title}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.82 0.10 210)" }}
                    data-ocid="careers.apply.button"
                  >
                    Apply
                  </a>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "press":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            First Step has been recognized by India's leading financial media
            for democratizing investment education. We welcome press inquiries
            and media partnerships.
          </p>
          <div className="space-y-4">
            {[
              {
                date: "March 2026",
                outlet: "Economic Times Digital",
                title:
                  "First Step: The Startup Making Investing Simple for Young Indians",
                desc: "Feature story on how First Step's beginner-focused approach has helped thousands of first-time investors start their journey with confidence.",
              },
              {
                date: "January 2026",
                outlet: "YourStory",
                title:
                  "How First Step Raised Financial Literacy in Tier-2 Cities",
                desc: "In-depth profile on the company's mission to reach investors beyond metros with vernacular content and simple tools.",
              },
              {
                date: "November 2025",
                outlet: "Moneycontrol",
                title:
                  "Top Investment Education Platforms for Indian Beginners in 2025",
                desc: "First Step named among the top five platforms for beginner investors in India, praised for its SIP calculator and risk-profiling tools.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.82 0.10 210)" + "22",
                      color: "oklch(0.45 0.12 232)",
                    }}
                  >
                    {item.outlet}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                  </span>
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border p-4 bg-muted/30">
            <p className="text-sm font-medium text-foreground mb-1">
              Media Enquiries
            </p>
            <p className="text-sm text-muted-foreground">
              For press kits, interviews, or media partnerships, contact us at{" "}
              <a
                href="mailto:kumarnivith33@gmail.com"
                className="underline"
                style={{ color: "oklch(0.45 0.12 232)" }}
              >
                kumarnivith33@gmail.com
              </a>
            </p>
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            We'd love to hear from you. Reach out to the right person on our
            team for faster responses.
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Nivith Kumar",
                role: "CEO",
                email: "kumarnivith33@gmail.com",
              },
              {
                name: "Ravi Prasad",
                role: "Managing Director",
                email: "raviprasadcsk@gmail.com",
              },
              {
                name: "Arun Muthu Bagavathi",
                role: "Assistant CEO & PA",
                email: "arunmb4996@gmail.com",
              },
              {
                name: "Team Member",
                role: "Team",
                email: "m32684251@gmail.com",
              },
              {
                name: "Kamlesh",
                role: "Digital & Design",
                email: "skamaleshayyappan@gmail.com",
              },
            ].map(({ name, role, email }) => (
              <div
                key={email}
                className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-medium underline underline-offset-2"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                  data-ocid="contact.email.link"
                >
                  {email}
                </a>
              </div>
            ))}
          </div>
        </div>
      );

    case "beginner-guide":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            New to investing? Follow these 5 steps to build a solid foundation
            and start growing your wealth the right way.
          </p>
          {[
            {
              step: 1,
              title: "Understand Your Finances",
              icon: "💰",
              tips: [
                "Calculate your monthly income and expenses",
                "Identify at least 10–20% you can save",
                "Build a 3–6 month emergency fund in a savings account before investing",
              ],
            },
            {
              step: 2,
              title: "Start with SIP in Mutual Funds",
              icon: "🔄",
              tips: [
                "SIP (Systematic Investment Plan) lets you invest as little as ₹500/month",
                "Choose large-cap or index funds to start — they're diversified and stable",
                "Set up auto-debit so you never miss a payment",
              ],
            },
            {
              step: 3,
              title: "Diversify Your Portfolio",
              icon: "⚖️",
              tips: [
                "Don't put all your money in one place",
                "Spread across equity (stocks/MF), debt (FD/bonds), and gold",
                "A simple beginner split: 60% equity, 30% debt, 10% gold",
              ],
            },
            {
              step: 4,
              title: "Track Regularly",
              icon: "📊",
              tips: [
                "Review your portfolio every quarter, not daily",
                "Rebalance once a year if one asset class has drifted",
                "Use apps like Zerodha, Groww, or Kuvera for tracking",
              ],
            },
            {
              step: 5,
              title: "Stay Patient",
              icon: "⏳",
              tips: [
                "Investing is a long-term game — minimum 5+ years for equity",
                "Don't panic sell during market dips — they're temporary",
                "Time in the market beats timing the market",
              ],
            },
          ].map(({ step, title, icon, tips }) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.45 0.12 232)" }}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className="w-0.5 flex-1 my-1"
                    style={{ backgroundColor: "oklch(0.82 0.10 210)" + "44" }}
                  />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{icon}</span>
                  <h4 className="font-semibold text-foreground">{title}</h4>
                </div>
                <ul className="space-y-1">
                  {tips.map((tip) => (
                    <li
                      key={tip}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span style={{ color: "oklch(0.82 0.10 210)" }}>•</span>{" "}
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      );

    case "market-data":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Stay informed about Indian markets. Here's an overview of key
            indices and where to find real-time data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                name: "Nifty 50",
                desc: "The benchmark index of NSE, tracking the top 50 companies listed on the National Stock Exchange of India.",
                site: "nseindia.com",
              },
              {
                name: "BSE Sensex",
                desc: "The Bombay Stock Exchange's flagship index, tracking 30 of India's largest and most financially sound companies.",
                site: "bseindia.com",
              },
              {
                name: "Nifty Bank",
                desc: "Tracks the performance of the most liquid and large Indian banking stocks — a good indicator of financial sector health.",
                site: "nseindia.com",
              },
              {
                name: "India VIX",
                desc: "The volatility index — a higher VIX means more fear in the market. Great for understanding market sentiment.",
                site: "nseindia.com",
              },
            ].map((idx) => (
              <div
                key={idx.name}
                className="rounded-xl border border-border p-4"
              >
                <p className="font-semibold text-foreground mb-1">{idx.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {idx.desc}
                </p>
                <a
                  href={`https://${idx.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                >
                  {idx.site}
                </a>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border p-4 bg-muted/30">
            <p className="font-medium text-foreground text-sm mb-2">
              📰 Recommended Sources
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                •{" "}
                <a
                  href="https://nseindia.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                >
                  NSE India
                </a>{" "}
                — Official National Stock Exchange data
              </li>
              <li>
                •{" "}
                <a
                  href="https://bseindia.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                >
                  BSE India
                </a>{" "}
                — Official Bombay Stock Exchange data
              </li>
              <li>
                •{" "}
                <a
                  href="https://moneycontrol.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                >
                  Moneycontrol
                </a>{" "}
                — News, quotes, and portfolio tracking
              </li>
              <li>
                •{" "}
                <a
                  href="https://tickertape.in"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                >
                  Tickertape
                </a>{" "}
                — Screener and fundamental analysis
              </li>
            </ul>
          </div>
        </div>
      );

    case "investment-tools":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            First Step provides practical tools to help you plan and grow your
            investments. Here's what's available on the platform.
          </p>
          {[
            {
              name: "SIP Calculator",
              icon: "🔢",
              desc: "Plan your Systematic Investment Plan by entering your monthly investment, expected return, and time horizon. Instantly see how your wealth grows over time thanks to compound interest.",
              tip: "Available in the Investment Roadmap section below on this page.",
            },
            {
              name: "Risk Profiler",
              icon: "⚖️",
              desc: "Answer a few questions about your financial goals, income stability, and risk tolerance. Get a personalized recommendation: conservative, moderate, or aggressive portfolio.",
              tip: "Coming soon — will suggest specific fund categories.",
            },
            {
              name: "Portfolio Tracker",
              icon: "📈",
              desc: "Track your overall portfolio allocation across stocks, ETFs, crypto, bonds, and cash. Visualize your exposure and rebalance as needed.",
              tip: "Available in the Beginner's Hub under the Tracker tab.",
            },
          ].map(({ name, icon, desc, tip }) => (
            <div key={name} className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{icon}</span>
                <h4 className="font-semibold text-foreground">{name}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {desc}
              </p>
              <p
                className="text-xs font-medium"
                style={{ color: "oklch(0.45 0.12 232)" }}
              >
                💡 {tip}
              </p>
            </div>
          ))}
        </div>
      );

    case "blog":
      return (
        <div className="space-y-5">
          <p className="text-muted-foreground leading-relaxed">
            Stay updated with the latest insights and education from the First
            Step investment blog.
          </p>
          {[
            {
              title: "How to Start SIP with ₹500/month",
              date: "March 2026",
              summary:
                "Think investing requires a lot of money? Think again. We break down how anyone can begin a Systematic Investment Plan with just ₹500 per month and build real wealth over time.",
              tag: "Beginner",
            },
            {
              title: "Understanding Mutual Fund Types",
              date: "February 2026",
              summary:
                "Equity, debt, hybrid, ELSS — the variety of mutual funds can feel overwhelming. This guide explains each type clearly so you can choose the right one for your goals.",
              tag: "Education",
            },
            {
              title: "Gold vs Stocks: Which is Better?",
              date: "January 2026",
              summary:
                "Gold is safe, stocks grow faster — but which belongs in your portfolio? We compare historical returns, volatility, and tax implications to help you decide.",
              tag: "Analysis",
            },
            {
              title: "Tax-Saving Investments Under 80C",
              date: "December 2025",
              summary:
                "Don't pay more tax than you need to. This article explains the best Section 80C investments — ELSS, PPF, NPS, and more — and how to maximize your ₹1.5 lakh deduction.",
              tag: "Tax",
            },
          ].map(({ title, date, summary, tag }) => (
            <div key={title} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "oklch(0.82 0.10 210)" + "22",
                    color: "oklch(0.45 0.12 232)",
                  }}
                >
                  {tag}
                </span>
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary}
              </p>
            </div>
          ))}
        </div>
      );

    case "privacy-policy":
      return (
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <p>
            Last updated: March 2026. First Step ("we", "our", "us") is
            committed to protecting your personal information.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              1. Information We Collect
            </h4>
            <p>
              We collect information you provide directly (email address for
              newsletter), usage data (pages visited, features used), and device
              data (browser type, IP address). We do not collect financial
              account credentials.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              2. How We Use Your Information
            </h4>
            <p>
              Your email is used only to send investment updates and educational
              newsletters. Usage data helps us improve the platform. We do not
              sell your data to third parties.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              3. DPDP Act Compliance
            </h4>
            <p>
              Under India's Digital Personal Data Protection Act 2023, you have
              the right to access, correct, and erase your personal data. To
              exercise these rights, contact us at kumarnivith33@gmail.com.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              4. Data Security
            </h4>
            <p>
              We use industry-standard encryption and security practices to
              protect your data. However, no internet transmission is 100%
              secure.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              5. Third Parties
            </h4>
            <p>
              We use analytics tools to understand platform usage. These tools
              may collect anonymized data subject to their own privacy policies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">6. Contact</h4>
            <p>
              For privacy concerns, email{" "}
              <a
                href="mailto:kumarnivith33@gmail.com"
                className="underline"
                style={{ color: "oklch(0.45 0.12 232)" }}
              >
                kumarnivith33@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      );

    case "terms-of-service":
      return (
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <p>
            Last updated: March 2026. By using First Step, you agree to the
            following terms.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              1. Educational Purpose Only
            </h4>
            <p>
              First Step provides investment education and tools for
              informational purposes only. We are NOT a SEBI-registered
              investment advisor. Nothing on this platform constitutes financial
              advice. Always consult a certified financial planner before making
              investment decisions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              2. No Guarantee of Returns
            </h4>
            <p>
              All investment examples and projections on this platform are
              illustrative only. Past performance does not guarantee future
              results. Investments in equities, mutual funds, and crypto carry
              risk of capital loss.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              3. User Responsibilities
            </h4>
            <p>
              You are responsible for your own investment decisions. First Step
              shall not be liable for any losses arising from decisions made
              using information on this platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              4. Intellectual Property
            </h4>
            <p>
              All content on First Step — articles, tools, designs — is the
              property of First Step and may not be reproduced without
              permission.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              5. Changes to Terms
            </h4>
            <p>
              We may update these terms periodically. Continued use of the
              platform after changes constitutes acceptance.
            </p>
          </div>
        </div>
      );

    case "cookie-policy":
      return (
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <p>
            First Step uses cookies and similar technologies to provide a better
            experience. Here's what you need to know.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              What Are Cookies?
            </h4>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help the website remember your preferences and
              understand how you use it.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Essential Cookies
            </h4>
            <p>
              These are required for the platform to function. They enable
              features like the SIP calculator state, portfolio tracker
              settings, and newsletter subscription flow. You cannot opt out of
              essential cookies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Analytics Cookies
            </h4>
            <p>
              We use anonymized analytics cookies to understand which sections
              of the platform are most helpful, how long users spend on guides,
              and which features are used most. This helps us improve the
              experience.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Managing Cookies
            </h4>
            <p>
              You can clear cookies from your browser settings at any time. Note
              that clearing essential cookies may affect your experience on
              First Step. Most browsers allow you to block third-party cookies
              without affecting site functionality.
            </p>
          </div>
        </div>
      );

    case "disclaimer":
      return (
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">
            Important Disclaimer — Please Read
          </p>
          <p>
            First Step is an educational platform. We are NOT registered with
            SEBI as an investment advisor, portfolio manager, or research
            analyst.
          </p>
          <p>
            All information provided on this website is for educational and
            informational purposes only. It should not be construed as
            investment advice, trading advice, or any other type of advice.
          </p>
          <p>
            Investments in mutual funds, stocks, and other financial instruments
            are subject to market risks. Please read all scheme-related
            documents carefully before investing.
          </p>
          <p>
            Past performance is not indicative of future returns. First Step
            does not guarantee any returns on investments made based on
            information available on this platform.
          </p>
          <p className="font-medium text-foreground">
            Mutual fund investments are subject to market risks. Read all scheme
            related documents carefully.
          </p>
        </div>
      );

    default:
      if (id.startsWith("cat-")) {
        const catContent: Record<
          string,
          {
            icon: string;
            intro: string;
            points: { title: string; desc: string }[];
          }
        > = {
          "cat-1": {
            icon: "📊",
            intro:
              "Mutual funds pool money from thousands of investors to invest in a diversified portfolio of stocks, bonds, or other securities — managed by a professional fund manager.",
            points: [
              {
                title: "Types of Mutual Funds",
                desc: "Equity funds (invest in stocks, high return potential), Debt funds (bonds and fixed income, lower risk), Hybrid funds (mix of equity and debt), and ELSS (tax-saving equity funds under Section 80C).",
              },
              {
                title: "How to Invest via SIP",
                desc: "Set up a monthly SIP starting from ₹500. Choose a fund on apps like Groww, Zerodha Coin, or Kuvera. Your money auto-invests every month — no need to time the market.",
              },
              {
                title: "Risks & Returns",
                desc: "Equity mutual funds can deliver 10–15% annual returns over the long term but can fall 20–30% in a bad year. Debt funds are more stable at 6–8% but won't beat inflation by much.",
              },
              {
                title: "Why It's Great for Beginners",
                desc: "Professional management, instant diversification, as little as ₹500/month, and easy liquidity make mutual funds the ideal starting point for any beginner investor.",
              },
            ],
          },
          "cat-2": {
            icon: "📈",
            intro:
              "Stocks represent ownership in a company. When you buy a share of Tata, Infosys, or Reliance, you become a part-owner and participate in the company's growth and profits.",
            points: [
              {
                title: "BSE & NSE",
                desc: "India has two major stock exchanges: BSE (Bombay Stock Exchange, the oldest in Asia) and NSE (National Stock Exchange, the most active). Most major companies are listed on both.",
              },
              {
                title: "How to Open a Demat Account",
                desc: "You need a Demat + Trading account to buy stocks. Popular brokers: Zerodha (lowest fees), Groww (beginner-friendly), Angel One, or HDFC Securities. Account opening takes 1–2 days online.",
              },
              {
                title: "What to Look For",
                desc: "Study the company's business model, revenue growth, profit margins, debt levels, and promoter holding. Start with large-cap, established companies before moving to small-caps.",
              },
              {
                title: "Risks",
                desc: "Stocks can be volatile. Individual stocks can fall 50–80% if the company faces problems. Always diversify across at least 10–15 stocks or use mutual funds for safer exposure.",
              },
            ],
          },
          "cat-3": {
            icon: "🏦",
            intro:
              "Fixed Deposits are the safest investment in India. You deposit a lump sum with a bank for a fixed term and earn guaranteed interest — your capital is never at risk.",
            points: [
              {
                title: "Interest Rates",
                desc: "Bank FDs currently offer 6.5–7.5% per annum for regular citizens and 7–8% for senior citizens. Small Finance Banks (like AU, ESAF) offer up to 8.5% but carry slightly higher risk.",
              },
              {
                title: "FD vs Savings Account",
                desc: "A regular savings account earns 3–4%. An FD earns 6.5–7.5% — significantly more. The tradeoff is that FD money is locked in for the chosen term (7 days to 10 years).",
              },
              {
                title: "Tax Treatment",
                desc: "FD interest is fully taxable at your income slab rate. TDS (10%) is deducted if interest exceeds ₹40,000/year (₹50,000 for seniors). This makes FDs less tax-efficient than ELSS.",
              },
              {
                title: "Best For",
                desc: "FDs are best for emergency funds, short-term goals (1–3 years), and capital preservation. If you have a risk appetite, equity mutual funds are better for long-term wealth creation.",
              },
            ],
          },
          "cat-4": {
            icon: "₿",
            intro:
              "Cryptocurrency is a digital asset secured by cryptography and built on blockchain technology. Bitcoin and Ethereum are the most well-known — but the market includes thousands of tokens.",
            points: [
              {
                title: "How to Buy Crypto in India",
                desc: "Use SEBI-regulated exchanges: CoinDCX, WazirX, or CoinSwitch. Complete KYC with your PAN and Aadhaar. Start small — many platforms allow investments of ₹100 or less.",
              },
              {
                title: "Risks",
                desc: "Crypto is highly volatile — Bitcoin has dropped 70–80% from its peaks multiple times. It has no underlying business or earnings. Only invest what you can afford to lose entirely.",
              },
              {
                title: "Tax Regulations in India",
                desc: "As per the Finance Act 2022, crypto gains are taxed at a flat 30% regardless of holding period. There's no option to set off losses against other income. TDS of 1% applies on transactions above ₹50,000.",
              },
              {
                title: "The Sensible Approach",
                desc: "If you want crypto exposure, limit it to 5–10% of your portfolio maximum. Never invest your emergency fund or critical savings. Consider Bitcoin and Ethereum over speculative altcoins.",
              },
            ],
          },
        };
        const data = catContent[id];
        if (!data)
          return <p className="text-muted-foreground">Content coming soon.</p>;
        return (
          <div className="space-y-5">
            <p className="text-muted-foreground leading-relaxed">
              {data.intro}
            </p>
            {data.points.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border p-4">
                <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        );
      }
      return <p className="text-muted-foreground">Content coming soon.</p>;
  }
}

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHub, setActiveHub] = useState("markets");
  const [email, setEmail] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatMessages, setAiChatMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "👋 Hi! I'm One Call AI, powered by Claude.ai. I'm here to help you with investment questions 24/7. Ask me anything about stocks, mutual funds, SIPs, or getting started in investing!",
    },
  ]);
  const [aiChatTyping, setAiChatTyping] = useState(false);
  const [expandedTrackerCard, setExpandedTrackerCard] = useState<string | null>(
    null,
  );
  const [expandedHubTip, setExpandedHubTip] = useState<string | null>(null);
  const [expandedHelpCenter, setExpandedHelpCenter] = useState(false);
  const [expandedMarketItem, setExpandedMarketItem] = useState<string | null>(
    null,
  );
  const openModal = (id: string) => setActiveModal(id);
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const { data: trends = [], isLoading: trendsLoading } = useMarketTrends();
  const { data: tips = [], isLoading: tipsLoading } = useTips();
  const subscribeMutation = useSubscribeEmail();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribeMutation.mutateAsync(email);
    } catch {
      /* ignore */
    }
    toast.success("You're in! Welcome to First Step 🎉");
    setEmail("");
  };

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster position="top-right" />

      {/* ── Navigation ── */}
      <header
        className="sticky top-0 z-50"
        style={{ backgroundColor: NAVY_MID }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${MINT}, ${MINT_LIGHT})`,
                }}
              >
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                First Step
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Home", href: "/" },
                { label: "Learn", href: "#learn" },
                { label: "Explore", href: "#explore" },
                { label: "Roadmap", href: "#roadmap" },
                { label: "Portfolio", href: "#portfolio" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  data-ocid={`nav.${item.label.toLowerCase()}.link`}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a
                href="/signin"
                data-ocid="nav.signin.link"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Sign In
              </a>
              <button
                type="button"
                data-ocid="nav.get_started.button"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: MINT_LIGHT, color: NAVY }}
              >
                Get Started
              </button>
            </div>

            <button
              type="button"
              data-ocid="nav.mobile_menu.toggle"
              className="md:hidden text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-4 flex flex-col gap-1">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Learn", href: "#learn" },
                    { label: "Explore", href: "#explore" },
                    { label: "Roadmap", href: "#roadmap" },
                    { label: "Portfolio", href: "#portfolio" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white text-sm font-medium py-3 px-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] flex items-center"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-1">
                    <a
                      href="/signin"
                      className="text-white/80 text-sm font-medium py-3 px-2 min-h-[44px] flex items-center"
                    >
                      Sign In
                    </a>
                    <button
                      type="button"
                      className="px-5 py-3 rounded-full text-sm font-semibold w-fit"
                      style={{ backgroundColor: MINT_LIGHT, color: NAVY }}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        className="py-16 lg:py-28 relative overflow-hidden"
        style={{ backgroundColor: NAVY }}
      >
        {/* Floating particles */}
        {FLOATING_PARTICLES.map((p, i) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative particles
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: MINT,
              opacity: 0.25,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.35, 0.15] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <Badge
                className="w-fit px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${MINT}26`,
                  color: MINT_LIGHT,
                  border: `1px solid ${MINT}4D`,
                }}
              >
                🌱 Built for Beginners
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Your First Step Into
                <br />
                <span style={{ color: MINT_LIGHT }}>Smart Investing</span>
              </h1>
              <p className="text-base lg:text-lg text-white/70 max-w-md leading-relaxed">
                Navigate markets with confidence. Discover trending investments,
                track your portfolio, and learn from expert tips — all in one
                beginner-friendly platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  data-ocid="hero.open_account.button"
                  className="px-7 py-3 rounded-full font-semibold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[48px]"
                  style={{ backgroundColor: MINT_LIGHT, color: NAVY }}
                >
                  Open Free Account <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  data-ocid="hero.learn_more.button"
                  className="px-7 py-3 rounded-full font-semibold text-base border border-white/20 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Explore Resources
                </button>
              </div>

              {/* Animated stats */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { target: 10000, suffix: "+", sub: "Active learners" },
                  { target: 50, suffix: "+", sub: "Asset categories" },
                  {
                    target: 49,
                    suffix: "★",
                    sub: "User rating",
                    display: "4.9",
                  },
                ].map((stat, i) => (
                  <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static stats
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <span className="text-white font-bold text-lg sm:text-xl">
                      {stat.display ? (
                        stat.display + stat.suffix
                      ) : (
                        <AnimatedCounter
                          target={stat.target}
                          suffix={stat.suffix}
                        />
                      )}
                    </span>
                    <span className="text-white/50 text-xs">{stat.sub}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                className="rounded-3xl overflow-hidden relative"
                style={{ backgroundColor: MINT_LIGHT }}
              >
                <img
                  src="/assets/generated/hero-couple-investing.dim_600x500.jpg"
                  alt="Couple reviewing their investment portfolio on a tablet"
                  className="w-full h-72 lg:h-80 object-cover mix-blend-multiply"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="bg-white">
        {/* ── Trending Categories ── */}
        <section className="py-16" id="explore">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Trending Investment Categories
                </h2>
                <p className="text-muted-foreground mt-1">
                  Discover what's moving the markets right now
                </p>
              </div>
              <a
                href="#explore"
                data-ocid="categories.view_all.link"
                className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors shrink-0"
                style={{ color: NAVY }}
              >
                View all <ChevronRight size={14} />
              </a>
            </motion.div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-ocid="categories.list"
            >
              {catsLoading
                ? ["s1", "s2", "s3", "s4"].map((id) => (
                    <div
                      key={id}
                      className="rounded-2xl border border-border p-5 space-y-3"
                    >
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))
                : categories.slice(0, 4).map((cat, i) => (
                    <motion.div
                      key={cat.id.toString()}
                      data-ocid={`categories.item.${i + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{
                        y: -6,
                        boxShadow: "0 12px 40px 0 rgba(11,42,60,0.16)",
                      }}
                      className="group rounded-2xl border border-border bg-card p-5 cursor-pointer transition-colors duration-200"
                      onClick={() => openModal(`cat-${cat.id.toString()}`)}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                        style={{ backgroundColor: `${MINT}22` }}
                      >
                        {cat.icon}
                      </div>
                      <h3 className="font-semibold text-foreground text-base mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {cat.description}
                      </p>
                      <Badge
                        className="text-xs font-medium rounded-full"
                        style={{ backgroundColor: `${MINT}22`, color: NAVY }}
                      >
                        <TrendingUp size={11} className="mr-1" />
                        {cat.trendLabel}
                      </Badge>
                    </motion.div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Beginner's Hub ── */}
        <section
          className="py-16"
          style={{ backgroundColor: "oklch(1 0 0)" }}
          id="learn"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Your Beginner's Investment Hub
                </h2>
                <p className="text-muted-foreground mt-1">
                  Everything you need to grow your financial confidence
                </p>
              </div>
              <a
                href="#learn"
                data-ocid="hub.view_all.link"
                className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full border border-border hover:bg-white transition-colors shrink-0"
                style={{ color: NAVY }}
              >
                View all <ChevronRight size={14} />
              </a>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sub-nav */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-border p-3 flex flex-row overflow-x-auto lg:overflow-visible lg:flex-col gap-2 scrollbar-hide">
                  {HUB_SECTIONS.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeHub === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        data-ocid={`hub.${sec.id}.tab`}
                        onClick={() => setActiveHub(sec.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left shrink-0 lg:w-full min-h-[44px] ${
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                        style={isActive ? { backgroundColor: `${MINT}33` } : {}}
                      >
                        <Icon
                          size={16}
                          style={isActive ? { color: NAVY } : {}}
                        />
                        <span className="whitespace-nowrap">{sec.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hub content */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  {/* ─── Guide Tab ─── */}
                  {activeHub === "guide" && (
                    <motion.div
                      key="guide"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Customer Support */}
                      <div className="bg-white rounded-2xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-foreground text-lg">
                            24/7 Customer Support
                          </h3>
                          <Badge
                            className="text-xs rounded-full"
                            style={{
                              backgroundColor: `${MINT}22`,
                              color: NAVY,
                            }}
                          >
                            AI + Real Support
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          Get instant answers anytime with our AI-powered
                          assistant, or speak to a real investment advisor
                          during business hours (9AM–6PM IST). We're here to
                          help you every step of the way.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* AI Chat Support Card */}
                          <motion.button
                            type="button"
                            data-ocid="guide.ai_chat.button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setAiChatOpen(true)}
                            className="rounded-xl border border-border p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all hover:shadow-md"
                            style={{ backgroundColor: `${MINT}22` }}
                          >
                            <span className="text-2xl">⚡</span>
                            <p className="font-semibold text-foreground text-sm">
                              AI Chat Support
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Instant 24/7
                            </p>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: NAVY, color: "white" }}
                            >
                              Chat Now →
                            </span>
                          </motion.button>
                          {/* Real Advisor Card */}
                          <motion.a
                            href="mailto:kumarnivith33@gmail.com?subject=Investment Advice Request"
                            data-ocid="guide.real_advisor.button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="rounded-xl border border-border p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all hover:shadow-md no-underline"
                            style={{ backgroundColor: `${MINT}22` }}
                          >
                            <span className="text-2xl">🧑‍💼</span>
                            <p className="font-semibold text-foreground text-sm">
                              Real Advisor
                            </p>
                            <p className="text-xs text-muted-foreground">
                              9AM–6PM IST
                            </p>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: NAVY, color: "white" }}
                            >
                              Email Advisor →
                            </span>
                          </motion.a>
                          {/* Help Center Card */}
                          <motion.button
                            type="button"
                            data-ocid="guide.help_center.button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              setExpandedHelpCenter(!expandedHelpCenter)
                            }
                            className="rounded-xl border border-border p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all hover:shadow-md"
                            style={{ backgroundColor: `${MINT}22` }}
                          >
                            <span className="text-2xl">📚</span>
                            <p className="font-semibold text-foreground text-sm">
                              Help Center
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Self-serve guides
                            </p>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ backgroundColor: NAVY, color: "white" }}
                            >
                              {expandedHelpCenter ? (
                                <>
                                  <ChevronUp size={10} /> Close
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={10} /> Explore
                                </>
                              )}
                            </span>
                          </motion.button>
                        </div>
                        {/* Help Center Expanded Panel */}
                        <AnimatePresence>
                          {expandedHelpCenter && (
                            <motion.div
                              data-ocid="guide.help_center.panel"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-4"
                            >
                              <div
                                className="rounded-xl border border-border p-5 space-y-4"
                                style={{ backgroundColor: `${MINT}10` }}
                              >
                                <h4 className="font-semibold text-foreground text-sm">
                                  📚 Beginner Investment Guides
                                </h4>
                                {[
                                  {
                                    title: "What is a Mutual Fund?",
                                    desc: "A mutual fund pools money from many investors to buy stocks, bonds, or other assets. Professional fund managers manage your money. Ideal for beginners!",
                                  },
                                  {
                                    title: "How does SIP work?",
                                    desc: "SIP (Systematic Investment Plan) lets you invest a fixed amount monthly. You buy more units when prices are low and fewer when high — called rupee cost averaging.",
                                  },
                                  {
                                    title: "What is the Nifty 50?",
                                    desc: "Nifty 50 is India's benchmark stock index — it tracks the top 50 companies by market cap on NSE. It represents ~65% of India's total market capitalisation.",
                                  },
                                  {
                                    title: "Difference: FD vs Mutual Fund",
                                    desc: "Fixed Deposits offer guaranteed returns (5–7%) with zero risk. Mutual Funds offer potentially higher returns (10–15%) but with market risk. Choose based on your risk tolerance.",
                                  },
                                  {
                                    title: "How to open a Demat Account?",
                                    desc: "Visit Zerodha, Groww, or Upstox. Provide Aadhaar, PAN, and bank account details. Complete video KYC in 15 minutes. Fund your account and start investing!",
                                  },
                                ].map((guide) => (
                                  <div
                                    key={guide.title}
                                    className="rounded-lg bg-white border border-border p-3"
                                  >
                                    <p className="font-semibold text-sm text-foreground mb-1">
                                      {guide.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {guide.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* How to Start */}
                      <div className="bg-white rounded-2xl border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg mb-5">
                          How to Start Investing
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              num: 1,
                              title: "Open a Demat Account",
                              desc: "Open an account with a broker like Zerodha, Groww, or Upstox. It takes 15–30 minutes online.",
                            },
                            {
                              num: 2,
                              title: "Complete KYC",
                              desc: "Aadhaar + PAN verification is required. It takes just 10–15 minutes and is fully digital.",
                            },
                            {
                              num: 3,
                              title: "Add Funds",
                              desc: "Transfer ₹500–₹5,000 to your account to begin. Start small — you can always add more later.",
                            },
                            {
                              num: 4,
                              title: "Choose Your First Investment",
                              desc: "We recommend starting with a Nifty 50 index fund or a SIP in a large-cap mutual fund.",
                            },
                            {
                              num: 5,
                              title: "Track & Grow",
                              desc: "Review monthly, reinvest returns, and stay consistent. Patience builds real wealth.",
                            },
                          ].map((step, i) => (
                            <motion.div
                              key={step.num}
                              initial={{ opacity: 0, x: -12 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.07 }}
                              className="flex gap-4 items-start"
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: NAVY }}
                              >
                                {step.num}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground text-sm">
                                  {step.title}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── Markets Tab ─── */}
                  {activeHub === "markets" && (
                    <motion.div
                      key="markets"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Live Market Trends */}
                      <div className="bg-white rounded-2xl border border-border p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="font-semibold text-foreground">
                            Live Market Trends
                          </h3>
                          <Badge
                            className="text-xs rounded-full flex items-center gap-1"
                            style={{
                              backgroundColor: `${MINT}22`,
                              color: NAVY,
                            }}
                          >
                            <Sparkles size={10} /> AI Powered
                          </Badge>
                        </div>
                        {trendsLoading ? (
                          <div className="space-y-3">
                            {["sk1", "sk2", "sk3", "sk4"].map((id) => (
                              <Skeleton
                                key={id}
                                className="h-10 w-full rounded-lg"
                              />
                            ))}
                          </div>
                        ) : (
                          <div
                            className="space-y-3"
                            data-ocid="hub.markets.list"
                          >
                            {trends.map((t, i) => (
                              <div key={t.id} className="space-y-1">
                                <motion.button
                                  type="button"
                                  data-ocid={`hub.markets.item.${i + 1}`}
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: i * 0.06 }}
                                  onClick={() =>
                                    setExpandedMarketItem(
                                      expandedMarketItem === t.id ? null : t.id,
                                    )
                                  }
                                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                      style={{
                                        backgroundColor: `${MINT}22`,
                                        color: NAVY,
                                      }}
                                    >
                                      {(TREND_LABELS[t.id] || t.id)
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                      {TREND_LABELS[t.id] || t.id}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <MiniLineChart
                                      data={
                                        TREND_HISTORY[t.id] || [
                                          t.value * 0.95,
                                          t.value,
                                        ]
                                      }
                                      width={64}
                                      height={28}
                                      color={
                                        t.momentum >= 0 ? "#3CC6A6" : "#F87171"
                                      }
                                      label={`${TREND_LABELS[t.id] || t.id} trend`}
                                    />
                                    <span
                                      className="text-xs font-semibold w-14 text-right"
                                      style={{
                                        color:
                                          t.momentum >= 0
                                            ? "oklch(0.55 0.14 165)"
                                            : "#EF4444",
                                      }}
                                    >
                                      {t.momentum >= 0 ? "+" : ""}
                                      {t.momentum.toFixed(1)}%
                                    </span>
                                    {expandedMarketItem === t.id ? (
                                      <ChevronUp
                                        size={14}
                                        className="text-muted-foreground"
                                      />
                                    ) : (
                                      <ChevronDown
                                        size={14}
                                        className="text-muted-foreground"
                                      />
                                    )}
                                  </div>
                                </motion.button>
                                <AnimatePresence>
                                  {expandedMarketItem === t.id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden px-2 pb-2"
                                    >
                                      <div
                                        className="rounded-lg p-3 text-xs space-y-1.5"
                                        style={{ backgroundColor: `${MINT}15` }}
                                      >
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Current Value
                                          </span>
                                          <span className="font-semibold text-foreground">
                                            {t.value.toLocaleString("en-IN")}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Day Change
                                          </span>
                                          <span
                                            className="font-semibold"
                                            style={{
                                              color:
                                                t.momentum >= 0
                                                  ? "oklch(0.55 0.14 165)"
                                                  : "#EF4444",
                                            }}
                                          >
                                            {t.momentum >= 0 ? "▲" : "▼"}{" "}
                                            {Math.abs(t.momentum).toFixed(2)}%
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Signal
                                          </span>
                                          <span
                                            className="font-semibold"
                                            style={{ color: NAVY }}
                                          >
                                            {t.momentum >= 1
                                              ? "🚀 Strong Buy"
                                              : t.momentum >= 0
                                                ? "📈 Moderate Gain"
                                                : t.momentum > -1
                                                  ? "⚠️ Watch"
                                                  : "📉 Declining"}
                                          </span>
                                        </div>
                                        <p className="text-muted-foreground pt-1 border-t border-border">
                                          {t.momentum >= 0
                                            ? "This asset is showing positive momentum. Long-term investors should stay calm and hold."
                                            : "Short-term dip. Long-term investors: this may be a good opportunity to buy more units at a lower price (SIP advantage)."}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 10-Year Market Performance */}
                      <div className="bg-white rounded-2xl border border-border p-6">
                        <h3 className="font-semibold text-foreground mb-1">
                          10-Year Market Performance (India)
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5">
                          Historical data showing long-term growth of key Indian
                          indices
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm min-w-[480px]">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left font-semibold text-foreground py-2 pr-4">
                                  Index
                                </th>
                                {[
                                  "2015",
                                  "2017",
                                  "2019",
                                  "2021",
                                  "2023",
                                  "2024",
                                ].map((yr) => (
                                  <th
                                    key={yr}
                                    className="text-right font-semibold text-muted-foreground py-2 px-2"
                                  >
                                    {yr}
                                  </th>
                                ))}
                                <th
                                  className="text-right font-semibold py-2 pl-2"
                                  style={{ color: "oklch(0.55 0.14 165)" }}
                                >
                                  10Y Return
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                {
                                  index: "Nifty 50",
                                  values: [
                                    "7,900",
                                    "10,400",
                                    "12,100",
                                    "17,500",
                                    "21,800",
                                    "24,500",
                                  ],
                                  ret: "+210%",
                                },
                                {
                                  index: "Sensex",
                                  values: [
                                    "26,000",
                                    "34,000",
                                    "40,000",
                                    "58,000",
                                    "72,000",
                                    "80,000",
                                  ],
                                  ret: "+208%",
                                },
                                {
                                  index: "Gold (₹/10g)",
                                  values: [
                                    "26,000",
                                    "29,000",
                                    "35,000",
                                    "48,000",
                                    "60,000",
                                    "72,000",
                                  ],
                                  ret: "+177%",
                                },
                              ].map((row, i) => (
                                <motion.tr
                                  key={row.index}
                                  initial={{ opacity: 0, y: 8 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: i * 0.08 }}
                                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                >
                                  <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">
                                    {row.index}
                                  </td>
                                  {row.values.map((val) => (
                                    <td
                                      key={val}
                                      className="py-3 px-2 text-right text-muted-foreground text-xs"
                                    >
                                      {val}
                                    </td>
                                  ))}
                                  <td
                                    className="py-3 pl-2 text-right font-bold text-sm"
                                    style={{ color: "oklch(0.55 0.14 165)" }}
                                  >
                                    {row.ret}
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          * Approximate values for illustration. Past
                          performance is not indicative of future returns.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── Tracker Tab ─── */}
                  {activeHub === "tracker" && (
                    <motion.div
                      key="tracker"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-2xl border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg mb-2">
                          What is a Market Tracker?
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                          A market tracker monitors the live price of stocks,
                          indices, and assets. It shows you whether a price has
                          gone{" "}
                          <strong className="text-foreground">
                            UP (gain 🚀)
                          </strong>{" "}
                          or{" "}
                          <strong className="text-foreground">
                            DOWN (loss 📉)
                          </strong>{" "}
                          compared to its previous value.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          {/* Rocket / Gain Card */}
                          <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
                            <button
                              type="button"
                              data-ocid="tracker.gain.button"
                              onClick={() =>
                                setExpandedTrackerCard(
                                  expandedTrackerCard === "gain"
                                    ? null
                                    : "gain",
                                )
                              }
                              className="w-full p-5 text-left cursor-pointer hover:bg-green-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">🚀</span>
                                  <div>
                                    <p className="font-bold text-green-800">
                                      Rocket / Gain
                                    </p>
                                    <p className="text-xs text-green-600 font-medium">
                                      Price went UP — tap for details
                                    </p>
                                  </div>
                                </div>
                                {expandedTrackerCard === "gain" ? (
                                  <ChevronUp
                                    size={16}
                                    className="text-green-600"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={16}
                                    className="text-green-600"
                                  />
                                )}
                              </div>
                              <p className="text-sm text-green-700 leading-relaxed mt-2">
                                The stock or index rose in value. Investors who
                                hold it made a profit.
                              </p>
                            </button>
                            <AnimatePresence>
                              {expandedTrackerCard === "gain" && (
                                <motion.div
                                  data-ocid="tracker.gain.panel"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden border-t border-green-200"
                                >
                                  <div className="p-4 space-y-3 bg-green-50">
                                    <p className="text-sm text-green-800 font-semibold">
                                      What does a 🚀 gain mean for you?
                                    </p>
                                    <ul className="space-y-2 text-sm text-green-700">
                                      <li>
                                        ✅ If you own the stock/fund — your
                                        investment grew. Paper profit!
                                      </li>
                                      <li>
                                        ✅ Mutual Fund NAV increases — each unit
                                        is now worth more.
                                      </li>
                                      <li>
                                        ✅ Index funds like Nifty 50 rising =
                                        your SIP units are more valuable.
                                      </li>
                                      <li>
                                        ⚠️ Don't sell in panic if prices dip
                                        later — gains are realized only when you
                                        sell.
                                      </li>
                                    </ul>
                                    <div className="rounded-lg bg-green-100 border border-green-200 p-3 text-xs text-green-800">
                                      💡 <strong>Beginner Tip:</strong> When the
                                      market goes up, stay calm. Don't rush to
                                      sell — long-term investors benefit from
                                      letting gains compound over years.
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {/* Loss Card */}
                          <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
                            <button
                              type="button"
                              data-ocid="tracker.loss.button"
                              onClick={() =>
                                setExpandedTrackerCard(
                                  expandedTrackerCard === "loss"
                                    ? null
                                    : "loss",
                                )
                              }
                              className="w-full p-5 text-left cursor-pointer hover:bg-red-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">📉</span>
                                  <div>
                                    <p className="font-bold text-red-800">
                                      Loss
                                    </p>
                                    <p className="text-xs text-red-600 font-medium">
                                      Price went DOWN — tap for details
                                    </p>
                                  </div>
                                </div>
                                {expandedTrackerCard === "loss" ? (
                                  <ChevronUp
                                    size={16}
                                    className="text-red-600"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={16}
                                    className="text-red-600"
                                  />
                                )}
                              </div>
                              <p className="text-sm text-red-700 leading-relaxed mt-2">
                                The stock or index fell in value. This is normal
                                — markets fluctuate daily. Long-term investors
                                stay calm.
                              </p>
                            </button>
                            <AnimatePresence>
                              {expandedTrackerCard === "loss" && (
                                <motion.div
                                  data-ocid="tracker.loss.panel"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden border-t border-red-200"
                                >
                                  <div className="p-4 space-y-3 bg-red-50">
                                    <p className="text-sm text-red-800 font-semibold">
                                      What does a 📉 loss mean for you?
                                    </p>
                                    <ul className="space-y-2 text-sm text-red-700">
                                      <li>
                                        ⚠️ If you own it — your investment lost
                                        value temporarily (unrealized loss).
                                      </li>
                                      <li>
                                        ⚠️ Only a real loss if you sell now —
                                        stay invested if your goal is long-term.
                                      </li>
                                      <li>
                                        ✅ SIP investors benefit: you buy MORE
                                        units at a lower price during dips!
                                      </li>
                                      <li>
                                        ✅ Nifty 50 has always recovered
                                        historically after every major crash.
                                      </li>
                                    </ul>
                                    <div className="rounded-lg bg-red-100 border border-red-200 p-3 text-xs text-red-800">
                                      💡 <strong>Beginner Tip:</strong> Market
                                      dips are normal. The Nifty 50 fell 38% in
                                      March 2020 — but recovered and hit
                                      all-time highs by late 2020. Patience
                                      wins.
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div
                          className="rounded-xl p-4 text-sm text-muted-foreground leading-relaxed"
                          style={{ backgroundColor: `${MINT}15` }}
                        >
                          💡{" "}
                          <strong className="text-foreground">
                            Day traders
                          </strong>{" "}
                          buy and sell daily.{" "}
                          <strong className="text-foreground">
                            Long-term investors
                          </strong>{" "}
                          hold for years. Most beginners should focus on
                          long-term SIP investing and ignore daily market
                          movements.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── Tips Tab ─── */}
                  {activeHub === "tips" && (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-2xl border border-border p-6">
                        <h3 className="font-bold text-foreground text-lg mb-1">
                          Today's Investment Tips
                        </h3>
                        <p className="text-sm text-muted-foreground mb-5">
                          How to use tips for future profit
                        </p>
                        <div
                          className="rounded-xl p-4 text-sm text-muted-foreground leading-relaxed mb-6"
                          style={{ backgroundColor: `${MINT}15` }}
                        >
                          Investment tips highlight stocks, mutual funds, or
                          sectors showing strong signals — based on recent
                          earnings, sector growth, or technical indicators.
                          These are not guarantees, but informed starting
                          points.
                        </div>
                        <div className="space-y-4">
                          {[
                            {
                              icon: "📈",
                              title: "Growth Picks",
                              desc: "Sectors showing strong momentum this week — Technology, Pharma, Green Energy",
                              color: "bg-blue-50 border-blue-200",
                              textColor: "text-blue-800",
                              subColor: "text-blue-600",
                            },
                            {
                              icon: "💰",
                              title: "Value Picks",
                              desc: "Stocks trading below intrinsic value — potential long-term gain if held 3–5 years",
                              color: "bg-amber-50 border-amber-200",
                              textColor: "text-amber-800",
                              subColor: "text-amber-600",
                            },
                            {
                              icon: "🛡️",
                              title: "Safe Bets",
                              desc: "Low-risk options: Nifty 50 index funds, AAA-rated bonds, PPF top-ups",
                              color: "bg-green-50 border-green-200",
                              textColor: "text-green-800",
                              subColor: "text-green-600",
                            },
                          ].map((tip, i) => (
                            <motion.div
                              key={tip.title}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.09 }}
                              className={`rounded-xl border overflow-hidden ${tip.color}`}
                            >
                              <button
                                type="button"
                                data-ocid={`hub.tips.${tip.title.toLowerCase().replace(" ", "_")}.button`}
                                onClick={() =>
                                  setExpandedHubTip(
                                    expandedHubTip === tip.title
                                      ? null
                                      : tip.title,
                                  )
                                }
                                className="w-full p-4 text-left cursor-pointer hover:opacity-90 transition-opacity"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{tip.icon}</span>
                                    <p
                                      className={`font-bold text-sm ${tip.textColor}`}
                                    >
                                      {tip.title}
                                    </p>
                                  </div>
                                  {expandedHubTip === tip.title ? (
                                    <ChevronUp
                                      size={16}
                                      className={tip.subColor}
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={16}
                                      className={tip.subColor}
                                    />
                                  )}
                                </div>
                                <p
                                  className={`text-sm leading-relaxed mt-1 ${tip.subColor}`}
                                >
                                  {tip.desc}
                                </p>
                              </button>
                              <AnimatePresence>
                                {expandedHubTip === tip.title && (
                                  <motion.div
                                    data-ocid={`hub.tips.${tip.title.toLowerCase().replace(" ", "_")}.panel`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <div
                                      className={`px-4 pb-4 border-t ${tip.color.includes("blue") ? "border-blue-200" : tip.color.includes("amber") ? "border-amber-200" : "border-green-200"}`}
                                    >
                                      <div className="pt-3 space-y-2 text-sm">
                                        {tip.title === "Growth Picks" && (
                                          <>
                                            <p
                                              className={`font-semibold ${tip.textColor}`}
                                            >
                                              📈 Top Growth Sectors This Week:
                                            </p>
                                            <ul
                                              className={`space-y-1.5 ${tip.subColor}`}
                                            >
                                              <li>
                                                💻 <strong>Technology:</strong>{" "}
                                                IT exports growing, strong Q4
                                                results from TCS, Infosys.
                                                Consider: Nifty IT ETF
                                              </li>
                                              <li>
                                                💊 <strong>Pharma:</strong>{" "}
                                                Generic drug exports to US
                                                rising. Consider: Sun Pharma,
                                                Dr. Reddy's
                                              </li>
                                              <li>
                                                🌿{" "}
                                                <strong>Green Energy:</strong>{" "}
                                                Govt backing solar and wind.
                                                Consider: Adani Green, Tata
                                                Power
                                              </li>
                                            </ul>
                                            <div
                                              className={`rounded-lg p-2.5 text-xs ${tip.color.includes("blue") ? "bg-blue-100 text-blue-800" : ""}`}
                                            >
                                              ⏱️ Momentum investing = buy when a
                                              sector is trending up. Best for
                                              6–18 month horizon.
                                            </div>
                                          </>
                                        )}
                                        {tip.title === "Value Picks" && (
                                          <>
                                            <p
                                              className={`font-semibold ${tip.textColor}`}
                                            >
                                              💰 Value Investing Explained:
                                            </p>
                                            <ul
                                              className={`space-y-1.5 ${tip.subColor}`}
                                            >
                                              <li>
                                                📊 Find stocks where{" "}
                                                <strong>
                                                  Price/Earnings (P/E)
                                                </strong>{" "}
                                                is below sector average
                                              </li>
                                              <li>
                                                🏦 Look for strong fundamentals:
                                                low debt, high promoter holding
                                                (&gt;50%)
                                              </li>
                                              <li>
                                                ⏳ Hold 3–5 years minimum.
                                                Famous value investor: Warren
                                                Buffett's Indian counterpart
                                                approach
                                              </li>
                                              <li>
                                                🔍 Example sectors: PSU Banks,
                                                Capital Goods, select FMCG
                                                stocks
                                              </li>
                                            </ul>
                                            <div className="rounded-lg p-2.5 text-xs bg-amber-100 text-amber-800">
                                              ⚠️ Value traps exist — a cheap
                                              stock can stay cheap. Always check
                                              earnings growth trend.
                                            </div>
                                          </>
                                        )}
                                        {tip.title === "Safe Bets" && (
                                          <>
                                            <p
                                              className={`font-semibold ${tip.textColor}`}
                                            >
                                              🛡️ Low-Risk Options for Beginners:
                                            </p>
                                            <ul
                                              className={`space-y-1.5 ${tip.subColor}`}
                                            >
                                              <li>
                                                📊{" "}
                                                <strong>
                                                  Nifty 50 Index Fund:
                                                </strong>{" "}
                                                Auto-diversified, avg 12% pa
                                                over 10 years
                                              </li>
                                              <li>
                                                🏛️{" "}
                                                <strong>
                                                  AAA-rated Bonds:
                                                </strong>{" "}
                                                Corporate bonds rated AAA by
                                                CRISIL — 7–8% returns
                                              </li>
                                              <li>
                                                🏛️{" "}
                                                <strong>
                                                  PPF (Public Provident Fund):
                                                </strong>{" "}
                                                Govt guaranteed 7.1% tax-free,
                                                15-year lock-in
                                              </li>
                                              <li>
                                                🏦{" "}
                                                <strong>
                                                  FD (Fixed Deposit):
                                                </strong>{" "}
                                                5.5–7.5% guaranteed, DICGC
                                                insured up to ₹5 lakh
                                              </li>
                                            </ul>
                                            <div className="rounded-lg p-2.5 text-xs bg-green-100 text-green-800">
                                              ✅ For absolute beginners: Start
                                              with PPF + Nifty 50 SIP. Safe +
                                              growth combo!
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                          ⚠️{" "}
                          <strong>
                            Tips are for educational purposes only.
                          </strong>{" "}
                          Always do your own research before investing.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ── Actionable Tips ── */}
        <section className="py-16" id="tips">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Actionable Investment Tips
                  </h2>
                  <Badge
                    className="text-xs rounded-full flex items-center gap-1"
                    style={{ backgroundColor: `${MINT}22`, color: NAVY }}
                  >
                    <Sparkles size={10} /> AI Powered
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Expert advice to accelerate your investment journey
                </p>
              </div>
              <a
                href="#tips"
                data-ocid="tips.view_all.link"
                className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors shrink-0"
                style={{ color: NAVY }}
              >
                View all <ChevronRight size={14} />
              </a>
            </motion.div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="tips.list"
            >
              {tipsLoading
                ? ["t1", "t2", "t3", "t4", "t5", "t6"].map((id) => (
                    <div
                      key={id}
                      className="rounded-2xl border border-border p-6 space-y-3"
                    >
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))
                : tips.slice(0, 6).map((tip, i) => (
                    <motion.div
                      key={tip.id.toString()}
                      data-ocid={`tips.item.${i + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{
                        y: -6,
                        boxShadow: "0 12px 40px 0 rgba(11,42,60,0.16)",
                      }}
                      className="group rounded-2xl border border-border bg-card p-6 cursor-pointer transition-colors duration-200"
                      onClick={() =>
                        setExpandedTip(
                          expandedTip === tip.id.toString()
                            ? null
                            : tip.id.toString(),
                        )
                      }
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ backgroundColor: `${MINT}22` }}
                        >
                          {TIP_ICONS[i % TIP_ICONS.length]}
                        </div>
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              TIP_TAGS[i % TIP_TAGS.length].color,
                            color: NAVY,
                          }}
                        >
                          {TIP_TAGS[i % TIP_TAGS.length].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star size={12} style={{ color: MINT }} fill={MINT} />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "oklch(0.45 0.12 232)" }}
                        >
                          Pro Tip
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-base mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.body}
                      </p>
                      <div
                        className="mt-3 flex items-center gap-1 text-xs font-medium"
                        style={{ color: "oklch(0.45 0.12 232)" }}
                      >
                        <span>
                          {expandedTip === tip.id.toString()
                            ? "Hide action step ▲"
                            : "See action step ▼"}
                        </span>
                      </div>
                      <AnimatePresence>
                        {expandedTip === tip.id.toString() && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden mt-2 pt-3 border-t border-border"
                          >
                            <div
                              className="rounded-xl p-3 text-sm leading-relaxed"
                              style={{
                                backgroundColor: `${MINT}15`,
                                color: NAVY,
                              }}
                            >
                              <p
                                className="font-semibold text-xs uppercase tracking-wide mb-1.5"
                                style={{ color: MINT }}
                              >
                                ✅ Action Step
                              </p>
                              <p>{TIP_EXTENDED[i % TIP_EXTENDED.length]}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Investment Roadmap ── */}
        <section
          id="roadmap"
          className="py-20"
          style={{ backgroundColor: NAVY }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <Badge
                className="mb-4 text-xs rounded-full"
                style={{
                  backgroundColor: `${MINT}26`,
                  color: MINT_LIGHT,
                  border: `1px solid ${MINT}4D`,
                }}
              >
                🗺️ Step-by-Step Plan
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Your Investment Roadmap
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                A clear, actionable path from zero to confident investor —
                designed for the Indian market
              </p>
            </motion.div>

            {/* A. Beginner Roadmap Steps */}
            <div className="relative mb-20">
              {/* Vertical connecting line */}
              <div
                className="absolute left-6 top-0 bottom-0 w-0.5 hidden sm:block"
                style={{ backgroundColor: `${MINT}40` }}
              />
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute left-6 top-0 w-0.5 origin-top hidden sm:block"
                style={{ backgroundColor: MINT, height: "100%" }}
              />

              <div className="space-y-6">
                {ROADMAP_STEPS.map((step, i) => (
                  <motion.div
                    key={step.num}
                    data-ocid={`roadmap.step.${step.num}`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="flex gap-5 sm:gap-8 items-start"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold z-10 shrink-0 border-2"
                      style={{
                        backgroundColor: NAVY,
                        borderColor: MINT,
                        color: MINT,
                      }}
                    >
                      {step.num}
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 flex-1 border border-white/10 hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="font-bold text-white text-lg">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* B. India Investment Vehicles */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                India's Best Investment Options
              </h3>
              <p className="text-white/50 mb-8">
                Curated for Indian investors — from safe to growth-oriented
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {INDIA_VEHICLES.map((v, i) => (
                  <motion.div
                    key={v.name}
                    data-ocid={`roadmap.vehicle.item.${i + 1}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 16px 48px 0 rgba(0,0,0,0.3)",
                    }}
                    className="bg-white/5 rounded-2xl p-5 border border-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{v.icon}</span>
                        <div>
                          <h4 className="font-bold text-white">{v.name}</h4>
                          <p className="text-white/40 text-xs">{v.full}</p>
                        </div>
                      </div>
                      <Badge
                        className="text-xs rounded-full shrink-0"
                        style={{
                          backgroundColor: `${MINT}26`,
                          color: MINT_LIGHT,
                        }}
                      >
                        {v.tag}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {v.desc}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">{v.lockin}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: v.riskColor }}
                        />
                        <span style={{ color: v.riskColor }}>
                          {v.risk} risk
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="font-bold" style={{ color: MINT_LIGHT }}>
                        {v.returns}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* C. SIP Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SIPCalculator />
            </motion.div>

            {/* D. Common Mistakes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                Common Beginner Mistakes
              </h3>
              <p className="text-white/50 mb-8">
                Avoid these pitfalls that trip up most new investors
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {BEGINNER_MISTAKES.map((m, i) => (
                  <motion.div
                    key={m.title}
                    data-ocid={`roadmap.mistake.item.${i + 1}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{m.icon}</span>
                      <AlertTriangle size={16} className="text-red-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2">{m.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {m.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${MINT}, ${MINT_LIGHT})`,
                  }}
                >
                  <span className="text-white font-bold text-sm">FS</span>
                </div>
                <span className="text-white font-bold text-lg">First Step</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                Empowering beginners to make smart, confident investment
                decisions with education, tools, and community.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2"
                data-ocid="footer.newsletter.form"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  data-ocid="footer.newsletter.input"
                  className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 min-w-0"
                />
                <button
                  type="submit"
                  data-ocid="footer.newsletter.submit_button"
                  disabled={subscribeMutation.isPending}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-60 flex-shrink-0"
                  style={{ backgroundColor: MINT_LIGHT, color: NAVY }}
                >
                  {subscribeMutation.isPending ? "..." : "Join"}
                </button>
              </form>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: "About Us", id: "about-us" },
                  { label: "Careers", id: "careers" },
                  { label: "Press", id: "press" },
                  { label: "Contact", id: "contact" },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openModal(id)}
                      data-ocid={`footer.${id}.button`}
                      className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Beginner Guide", id: "beginner-guide" },
                  { label: "Market Data", id: "market-data" },
                  { label: "Investment Tools", id: "investment-tools" },
                  { label: "Blog", id: "blog" },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openModal(id)}
                      data-ocid={`footer.${id}.button`}
                      className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: "Privacy Policy", id: "privacy-policy" },
                  { label: "Terms of Service", id: "terms-of-service" },
                  { label: "Cookie Policy", id: "cookie-policy" },
                  { label: "Disclaimer", id: "disclaimer" },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openModal(id)}
                      data-ocid={`footer.${id}.button`}
                      className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} First Step. AI insights powered by{" "}
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white/70 underline transition-colors"
              >
                Claude
              </a>
              {" · "}
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                className="hover:text-white/70 underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4">
              {[
                {
                  icon: Twitter,
                  label: "Twitter",
                  href: "https://twitter.com",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://instagram.com",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  data-ocid={`footer.${label.toLowerCase()}.link`}
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      {/* ── AI Chat Dialog (One Call AI) ── */}
      <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <DialogContent
          className="max-w-md max-h-[90vh] p-0 overflow-hidden flex flex-col"
          data-ocid="guide.ai_chat.dialog"
        >
          <div
            className="p-5 border-b border-border"
            style={{
              background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: MINT }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">One Call AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-white/70">
                    Powered by Claude.ai · Online 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 max-h-[50vh]">
            <div className="space-y-3">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={`msg-${idx}-${msg.role}`}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "ai" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${MINT}33` }}
                    >
                      <Bot size={14} style={{ color: NAVY }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "text-foreground rounded-tl-sm border border-border"
                    }`}
                    style={
                      msg.role === "user"
                        ? { backgroundColor: NAVY }
                        : { backgroundColor: `${MINT}15` }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiChatTyping && (
                <div className="flex gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${MINT}33` }}
                  >
                    <Bot size={14} style={{ color: NAVY }} />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 border border-border"
                    style={{ backgroundColor: `${MINT}15` }}
                  >
                    <div className="flex gap-1 items-center">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: NAVY, animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          backgroundColor: NAVY,
                          animationDelay: "150ms",
                        }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          backgroundColor: NAVY,
                          animationDelay: "300ms",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                "How do I start investing?",
                "What is SIP?",
                "Is Nifty 50 safe?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    const AI_RESPONSES: Record<string, string> = {
                      "How do I start investing?":
                        "Great question! 🎯 Start with these 3 steps:\n1. Open a Demat account on Zerodha or Groww (free, 15 min)\n2. Complete KYC with your Aadhaar + PAN\n3. Start a SIP of ₹500/month in a Nifty 50 index fund\n\nSmall start, big results over time! 💪",
                      "What is SIP?":
                        "SIP = Systematic Investment Plan 📊\n\nYou invest a fixed amount (e.g. ₹1,000) every month automatically. When markets are low, you buy MORE units. When high, fewer units.\n\nThis is called Rupee Cost Averaging — it reduces your average cost over time. Best strategy for beginners!",
                      "Is Nifty 50 safe?":
                        "Nifty 50 is India's safest equity option for beginners! 🛡️\n\n• Tracks top 50 Indian companies\n• Auto-diversified across sectors\n• Historical avg return: ~12% per year over 10 years\n• Recovered from EVERY crash so far\n\nFor long-term (5+ years), it's considered a safe bet. Not guaranteed, but historically reliable.",
                    };
                    const userMsg = { role: "user" as const, text: q };
                    setAiChatMessages((prev) => [...prev, userMsg]);
                    setAiChatTyping(true);
                    setTimeout(() => {
                      setAiChatTyping(false);
                      setAiChatMessages((prev) => [
                        ...prev,
                        {
                          role: "ai",
                          text:
                            AI_RESPONSES[q] ||
                            "I'm here to help! Could you tell me more about what you'd like to know?",
                        },
                      ]);
                    }, 1200);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
                  style={{ color: NAVY }}
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!aiChatInput.trim()) return;
                const userText = aiChatInput.trim();
                setAiChatMessages((prev) => [
                  ...prev,
                  { role: "user", text: userText },
                ]);
                setAiChatInput("");
                setAiChatTyping(true);
                setTimeout(() => {
                  setAiChatTyping(false);
                  const lower = userText.toLowerCase();
                  let reply =
                    "Thanks for your question! 🤖 As One Call AI, I can help with investment basics. For personalized advice, please connect with our Real Advisor (9AM–6PM IST) at kumarnivith33@gmail.com.";
                  if (lower.includes("mutual fund") || lower.includes("mf")) {
                    reply =
                      "Mutual Funds pool money from investors to buy stocks/bonds 📊. Types include:\n• Equity (high growth, higher risk)\n• Debt (stable, low risk)\n• Hybrid (balanced)\n• ELSS (tax saving under 80C)\n\nStart with a large-cap or Nifty 50 index fund!";
                  } else if (lower.includes("sip")) {
                    reply =
                      "SIP = Systematic Investment Plan 📅\nInvest a fixed amount monthly (min ₹100). It averages out market volatility over time — called Rupee Cost Averaging. Great for beginners!";
                  } else if (
                    lower.includes("nifty") ||
                    lower.includes("sensex")
                  ) {
                    reply =
                      "Nifty 50 tracks India's top 50 NSE stocks 📈\nSensex tracks top 30 BSE stocks\nBoth are benchmarks for India's stock market health. When they rise, Indian economy is generally doing well.";
                  } else if (
                    lower.includes("fd") ||
                    lower.includes("fixed deposit")
                  ) {
                    reply =
                      "Fixed Deposits (FD) 🏦 offer:\n• Guaranteed returns: 5.5–7.5%\n• DICGC insured up to ₹5 lakh\n• No market risk\n• Best for short-term (1–3 years)\n\nFor long-term wealth, combine FD with mutual fund SIPs!";
                  } else if (lower.includes("tax") || lower.includes("elss")) {
                    reply =
                      "ELSS (Equity Linked Savings Scheme) 💰 saves tax under Section 80C:\n• Invest up to ₹1.5 lakh/year to save tax\n• 3-year lock-in (shortest among tax savers)\n• Market-linked returns (avg 12–15% historically)\n• Best tax-saving + wealth-building combo!";
                  }
                  setAiChatMessages((prev) => [
                    ...prev,
                    { role: "ai", text: reply },
                  ]);
                }, 1400);
              }}
              className="flex gap-2"
              data-ocid="guide.ai_chat.form"
            >
              <Input
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                placeholder="Ask about investing..."
                data-ocid="guide.ai_chat.input"
                className="flex-1 text-sm"
              />
              <button
                type="submit"
                data-ocid="guide.ai_chat.submit_button"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: NAVY }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeModal !== null}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null);
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-hidden p-0"
          data-ocid="content.modal"
        >
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle
                  className="text-xl font-bold"
                  style={{ color: NAVY }}
                >
                  {MODAL_TITLES[activeModal ?? ""] ?? "Information"}
                </DialogTitle>
              </DialogHeader>
              {activeModal && <ModalContent id={activeModal} />}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
