export type Category = {
  id: string;
  slug: string;
  name: string;
};

export type ProductSummary = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};
