import Principal "mo:core/Principal";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type CategoryId = Nat;
  type TipId = Nat;

  type InvestmentCategory = {
    id : CategoryId;
    name : Text;
    description : Text;
    icon : Text;
    trendLabel : Text;
  };

  type InvestmentTip = {
    id : TipId;
    title : Text;
    body : Text;
    category : CategoryId;
  };

  type MarketTrend = {
    id : Text;
    value : Float;
    momentum : Float;
  };

  let categories = Map.empty<CategoryId, InvestmentCategory>();
  let tips = Map.empty<TipId, InvestmentTip>();
  let newsletterEmails = List.empty<Text>();
  let marketTrends = Map.empty<Text, MarketTrend>();

  var nextCategoryId = 0;
  var nextTipId = 0;

  module InvestmentCategory {
    public func compare(a : InvestmentCategory, b : InvestmentCategory) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module InvestmentTip {
    public func compare(a : InvestmentTip, b : InvestmentTip) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public shared ({ caller }) func addCategory(name : Text, description : Text, icon : Text, trendLabel : Text) : async CategoryId {
    let id = nextCategoryId;
    nextCategoryId += 1;
    let category : InvestmentCategory = {
      id;
      name;
      description;
      icon;
      trendLabel;
    };
    categories.add(id, category);
    id;
  };

  public shared ({ caller }) func addTip(title : Text, body : Text, categoryId : CategoryId) : async TipId {
    if (not categories.containsKey(categoryId)) {
      Runtime.trap("Category does not exist");
    };
    let id = nextTipId;
    nextTipId += 1;
    let tip : InvestmentTip = {
      id;
      title;
      body;
      category = categoryId;
    };
    tips.add(id, tip);
    id;
  };

  public shared ({ caller }) func subscribeEmail(email : Text) : async () {
    if (newsletterEmails.any(func(existingEmail) { existingEmail == email })) {
      Runtime.trap("Email already subscribed");
    };
    newsletterEmails.add(email);
  };

  public shared ({ caller }) func updateMarketTrend(id : Text, value : Float, momentum : Float) : async () {
    let trend : MarketTrend = {
      id;
      value;
      momentum;
    };
    marketTrends.add(id, trend);
  };

  public query ({ caller }) func getAllCategories() : async [InvestmentCategory] {
    categories.values().toArray().sort();
  };

  public query ({ caller }) func getAllTips() : async [InvestmentTip] {
    tips.values().toArray().sort();
  };

  public query ({ caller }) func getTipsByCategory(categoryId : CategoryId) : async [InvestmentTip] {
    tips.values().toArray().filter(func(tip) { tip.category == categoryId }).sort();
  };

  public query ({ caller }) func getMarketTrends() : async [MarketTrend] {
    marketTrends.values().toArray();
  };
};
