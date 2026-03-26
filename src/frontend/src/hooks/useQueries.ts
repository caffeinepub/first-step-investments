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
    title: "Start Small, Think Long",
    body: "You don't need thousands to begin. Even $50/month invested consistently can grow significantly over time thanks to compound interest.",
    category: 1n,
  },
  {
    id: 2n,
    title: "Diversify Your Portfolio",
    body: "Don't put all your eggs in one basket. Spread investments across stocks, ETFs, and bonds to reduce risk and smooth out volatility.",
    category: 2n,
  },
  {
    id: 3n,
    title: "Understand Your Risk Tolerance",
    body: "Before investing, ask yourself how much you can afford to lose. Your time horizon and goals should guide your asset allocation strategy.",
    category: 1n,
  },
  {
    id: 4n,
    title: "Automate Your Investments",
    body: "Set up recurring contributions to take advantage of dollar-cost averaging — buying more shares when prices dip automatically.",
    category: 2n,
  },
  {
    id: 5n,
    title: "Learn Before You Leap",
    body: "Study the basics of P/E ratios, dividends, and market cycles before picking individual stocks. Education is your best first investment.",
    category: 1n,
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
