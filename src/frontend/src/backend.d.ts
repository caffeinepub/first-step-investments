import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CategoryId = bigint;
export interface InvestmentCategory {
    id: CategoryId;
    icon: string;
    name: string;
    description: string;
    trendLabel: string;
}
export interface MarketTrend {
    id: string;
    value: number;
    momentum: number;
}
export interface InvestmentTip {
    id: TipId;
    title: string;
    body: string;
    category: CategoryId;
}
export type TipId = bigint;
export interface backendInterface {
    addCategory(name: string, description: string, icon: string, trendLabel: string): Promise<CategoryId>;
    addTip(title: string, body: string, categoryId: CategoryId): Promise<TipId>;
    getAllCategories(): Promise<Array<InvestmentCategory>>;
    getAllTips(): Promise<Array<InvestmentTip>>;
    getMarketTrends(): Promise<Array<MarketTrend>>;
    getTipsByCategory(categoryId: CategoryId): Promise<Array<InvestmentTip>>;
    subscribeEmail(email: string): Promise<void>;
    updateMarketTrend(id: string, value: number, momentum: number): Promise<void>;
}
