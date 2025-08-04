import { ElementType } from "react";

export interface IApp {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  icon: ElementType;
  color: string;
  category: string;
  url: string;
  isInternal?: boolean;
  rating: number;
  badge: "New" | "Popular" | "Trending" | "Editor's Choice";
  features: string[];
}