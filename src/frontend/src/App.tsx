import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  ChevronRight,
  Instagram,
  Lightbulb,
  Linkedin,
  Menu,
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
import { DonutChart } from "./components/DonutChart";
import { MiniLineChart } from "./components/MiniLineChart";
import {
  useCategories,
  useMarketTrends,
  useSubscribeEmail,
  useTips,
} from "./hooks/useQueries";

// ─── Constants ──────────────────────────────────────────────────────────────

const NAVY = "oklch(0.17 0.06 232)";
const NAVY_MID = "oklch(0.20 0.065 232)";
const MINT = "oklch(0.75 0.13 172)";
const MINT_LIGHT = "oklch(0.87 0.10 168)";

const PORTFOLIO_SEGMENTS = [
  { label: "Stocks", value: 40, color: "#3CC6A6" },
  { label: "ETFs", value: 25, color: "#A8E6C8" },
  { label: "Crypto", value: 15, color: "#5BB8F5" },
  { label: "Bonds", value: 12, color: "#F5A623" },
  { label: "Cash", value: 8, color: "#E0E7EE" },
];

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

const TIP_ICONS = ["💡", "📊", "🎯", "⚡", "🔑"];

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

  const r = rate / 100;
  const n = years;
  const P = monthly;
  const monthlyRate = r / 12;
  const months = n * 12;
  const fv =
    P * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
  const totalInvested = P * months;
  const estimatedReturns = fv - totalInvested;

  const fmt = (v: number) =>
    `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)}`;

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
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Monthly Investment
              </span>
              <span className="text-sm font-bold" style={{ color: MINT }}>
                ₹{monthly.toLocaleString("en-IN")}
              </span>
            </div>
            <Slider
              min={500}
              max={50000}
              step={500}
              value={[monthly]}
              onValueChange={(v) => setMonthly(v[0])}
              data-ocid="sip.monthly.input"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹500</span>
              <span>₹50,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Time Period
              </span>
              <span className="text-sm font-bold" style={{ color: MINT }}>
                {years} years
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20].map((y) => (
                <button
                  key={y}
                  type="button"
                  data-ocid={`sip.years.${y}.button`}
                  onClick={() => setYears(y)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all min-w-[48px]"
                  style={
                    years === y
                      ? { backgroundColor: MINT, color: NAVY }
                      : {
                          backgroundColor: "oklch(0.96 0.01 175)",
                          color: "oklch(0.4 0.04 250)",
                        }
                  }
                >
                  {y}Y
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Expected Return
              </span>
              <span className="text-sm font-bold" style={{ color: MINT }}>
                {rate}% p.a.
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[8, 10, 12, 15].map((rv) => (
                <button
                  key={rv}
                  type="button"
                  data-ocid={`sip.rate.${rv}.button`}
                  onClick={() => setRate(rv)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all min-w-[48px]"
                  style={
                    rate === rv
                      ? { backgroundColor: MINT, color: NAVY }
                      : {
                          backgroundColor: "oklch(0.96 0.01 175)",
                          color: "oklch(0.4 0.04 250)",
                        }
                  }
                >
                  {rv}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <motion.div
          key={`${monthly}-${years}-${rate}`}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-6 flex flex-col justify-center gap-4"
          style={{ backgroundColor: NAVY }}
          data-ocid="sip.results.panel"
        >
          {[
            { label: "Total Invested", value: totalInvested, accent: false },
            {
              label: "Estimated Returns",
              value: estimatedReturns,
              accent: false,
            },
            { label: "Final Value", value: fv, accent: true },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.accent ? "border-t border-white/10 pt-4" : ""}`}
            >
              <p className="text-white/50 text-xs mb-1">{item.label}</p>
              <p
                className="font-bold text-2xl"
                style={{ color: item.accent ? MINT_LIGHT : "white" }}
              >
                {fmt(item.value)}
              </p>
            </div>
          ))}
          <p className="text-white/30 text-xs mt-2">
            * Estimates are indicative. Actual returns may vary with market
            conditions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHub, setActiveHub] = useState("markets");
  const [email, setEmail] = useState("");
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

  const heroChartData = [42, 48, 45, 52, 58, 55, 62, 68, 65, 74];

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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Portfolio Value
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        ₹20,31,800
                      </p>
                    </div>
                    <Badge
                      className="text-xs font-semibold rounded-full"
                      style={{ backgroundColor: `${MINT}33`, color: NAVY }}
                    >
                      +8.4%
                    </Badge>
                  </div>
                  <MiniLineChart
                    data={heroChartData}
                    width={260}
                    height={48}
                    color="#3CC6A6"
                    filled
                    label="Portfolio growth chart"
                  />
                  <div className="flex justify-between mt-2">
                    {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                      <span key={m} className="text-xs text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>
                </motion.div>
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
          style={{ backgroundColor: "oklch(0.97 0.01 175)" }}
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
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Markets card */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-foreground">
                      Live Market Trends
                    </h3>
                    <Badge
                      className="text-xs rounded-full flex items-center gap-1"
                      style={{ backgroundColor: `${MINT}22`, color: NAVY }}
                    >
                      <Sparkles size={10} /> AI Powered
                    </Badge>
                  </div>
                  {trendsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3" data-ocid="hub.markets.list">
                      {trends.map((t, i) => (
                        <motion.div
                          key={t.id}
                          data-ocid={`hub.markets.item.${i + 1}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors"
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
                                TREND_HISTORY[t.id] || [t.value * 0.95, t.value]
                              }
                              width={64}
                              height={28}
                              color={t.momentum >= 0 ? "#3CC6A6" : "#F87171"}
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
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Portfolio donut */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Example Portfolio
                  </h3>
                  <div className="flex items-center gap-6">
                    <DonutChart
                      segments={PORTFOLIO_SEGMENTS}
                      size={130}
                      thickness={26}
                    />
                    <div className="flex-1 space-y-2">
                      {PORTFOLIO_SEGMENTS.map((seg) => (
                        <div
                          key={seg.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: seg.color }}
                            />
                            <span className="text-muted-foreground">
                              {seg.label}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {seg.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="mt-4 p-3 rounded-xl text-xs text-muted-foreground"
                    style={{ backgroundColor: `${MINT}1A` }}
                  >
                    💡 This is an example balanced beginner portfolio. Adjust
                    based on your risk tolerance.
                  </div>
                </div>

                {/* Quick stats */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Avg. Annual Return",
                      value: "10–12%",
                      sub: "S&P 500 historical",
                      icon: "📈",
                    },
                    {
                      label: "Recommended Start",
                      value: "₹4,200/mo",
                      sub: "SIP (Systematic Investment Plan)",
                      icon: "💰",
                    },
                    {
                      label: "Risk Level",
                      value: "Low–Med",
                      sub: "Diversified portfolio",
                      icon: "🛡️",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl border border-border p-4 text-center"
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="font-bold text-foreground text-lg">
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium text-foreground mb-0.5">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.sub}
                      </div>
                    </motion.div>
                  ))}
                </div>
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-ocid="tips.list"
            >
              {tipsLoading
                ? ["t1", "t2", "t3"].map((id) => (
                    <div
                      key={id}
                      className="rounded-2xl border border-border p-6 space-y-3"
                    >
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))
                : tips.slice(0, 3).map((tip, i) => (
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
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                        style={{ backgroundColor: `${MINT}22` }}
                      >
                        {TIP_ICONS[i % TIP_ICONS.length]}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star size={12} style={{ color: MINT }} fill={MINT} />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "oklch(0.45 0.10 172)" }}
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
                {["About Us", "Careers", "Press", "Contact"].map((l) => (
                  <li key={l}>
                    <a
                      href="/company"
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {l}
                    </a>
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
                  "Beginner Guide",
                  "Market Data",
                  "Investment Tools",
                  "Blog",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="/resources"
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Disclaimer",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="/legal"
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {l}
                    </a>
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
    </div>
  );
}
