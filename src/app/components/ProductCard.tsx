import { Link } from "react-router";
import { Product } from "../data/products";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.discount || 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 group"
    >
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercent > 0 && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-500">
            -{discountPercent}%
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm line-clamp-2 h-10 mb-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-600 font-semibold">
            ₫{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₫{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
          </div>
          <span>Đã bán {product.sold}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">{product.location}</div>
      </div>
    </Link>
  );
}
