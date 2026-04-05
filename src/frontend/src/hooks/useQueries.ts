import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  InvestmentCategory,
  InvestmentTip,
  MarketTrend,
} from "../backend.d";
import { useActor } from "./useActor";

const SEED_CATEGORIES: InvestmentCategory[] = [
  {
    id: 1n,
    icon: "📈",
    name: "Stocks",
    description:
      "Own a share of publicly traded companies and grow with the market.",
    trendLabel: "+5.2% this month",
  },
  {
    id: 2n,
    icon: "💼",
    name: "ETFs",
    description:
      "Diversified funds that track indices — perfect for beginners.",
    trendLabel: "+3.8% this month",
  },
  {
    id: 3n,
    icon: "₿",
    name: "Crypto",
    description: "Digital assets with high potential — manage risk carefully.",
    trendLabel: "+12.4% this week",
  },
  {
    id: 4n,
    icon: "🏠",
    name: "Real Estate",
    description: "Invest in property or REITs for steady long-term returns.",
    trendLabel: "+1.9% this month",
  },
  {
    id: 5n,
    icon: "🔒",
    name: "Bonds",
    description: "Low-risk fixed income — ideal for capital preservation.",
    trendLabel: "+0.8% this month",
  },
];

const SEED_TRENDS: MarketTrend[] = [
  { id: "sp500", value: 5231.4, momentum: 2.3 },
  { id: "nasdaq", value: 16480.2, momentum: 3.1 },
  { id: "bitcoin", value: 67200.0, momentum: 5.8 },
  { id: "gold", value: 2345.6, momentum: 0.9 },
  { id: "oil", value: 82.4, momentum: -1.2 },
  { id: "bonds", value: 98.7, momentum: 0.3 },
];

const SEED_TIPS: InvestmentTip[] = [
  {
    id: 1n,
    title: "Start a SIP with ₹500/month",
    body: "You don't need lakhs to begin. Start a SIP in a Nifty 50 index fund with as little as ₹500/month. After 10 years at 12% returns, that becomes ₹1.16 lakhs — without any extra effort.",
    category: 1n,
  },
  {
    id: 2n,
    title: "Use the 100 Minus Age Rule",
    body: "A simple starting point: subtract your age from 100. If you're 25, put 75% in equity (mutual funds/stocks) and 25% in debt (FDs/PPF). Adjust as you get older and closer to your goal.",
    category: 2n,
  },
  {
    id: 3n,
    title: "Max Out Your PPF Every Year",
    body: "PPF gives 7.1% tax-free returns, guaranteed by the government. Invest the maximum ₹1.5 lakh per year — it also gives you ₹1.5L deduction under Section 80C, saving up to ₹46,800 in taxes.",
    category: 3n,
  },
  {
    id: 4n,
    title: "Buy an Emergency Fund First",
    body: "Before investing, keep 3–6 months of expenses in a liquid fund or high-yield savings account. This prevents you from selling your investments at a loss when unexpected costs hit.",
    category: 1n,
  },
  {
    id: 5n,
    title: "Never Time the Market — SIP Instead",
    body: "Trying to buy at the bottom and sell at the top is nearly impossible. SIPs buy automatically — more units when prices fall, fewer when they rise. This lowers your average cost over time.",
    category: 2n,
  },
  {
    id: 6n,
    title: "Pick ELSS Over FD for Tax Saving",
    body: "ELSS mutual funds have a 3-year lock-in (shortest among 80C options) and historically deliver 12–15% returns vs FD's 6–7%. For long-term tax saving, ELSS is the smarter choice.",
    category: 2n,
  },
  {
    id: 7n,
    title: "Reinvest Your Dividends",
    body: "Choose the 'Growth' option over 'Dividend' in mutual funds. Dividends are taxed when paid out, but growth compounds silently. Over 20 years, the difference can be 30–40% more wealth.",
    category: 1n,
  },
  {
    id: 8n,
    title: "Review Your Portfolio Every 6 Months",
    body: "Rebalance if any asset class drifts more than 10% from your target. If equity grew to 85% when you wanted 70%, sell some and shift to debt — this is called disciplined rebalancing.",
    category: 2n,
  },
];

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<InvestmentCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return SEED_CATEGORIES;
      const data = await actor.getAllCategories();
      return data.length > 0 ? data : SEED_CATEGORIES;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SEED_CATEGORIES,
  });
}

export function useMarketTrends() {
  const { actor, isFetching } = useActor();
  return useQuery<MarketTrend[]>({
    queryKey: ["marketTrends"],
    queryFn: async () => {
      if (!actor) return SEED_TRENDS;
      const data = await actor.getMarketTrends();
      return data.length > 0 ? data : SEED_TRENDS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SEED_TRENDS,
  });
}

export function useTips() {
  const { actor, isFetching } = useActor();
  return useQuery<InvestmentTip[]>({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return SEED_TIPS;
      const data = await actor.getAllTips();
      return data.length > 0 ? data : SEED_TIPS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SEED_TIPS,
  });
}

export function useSubscribeEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeEmail(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });
}
