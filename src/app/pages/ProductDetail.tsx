import { useParams, Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { products } from "../data/products";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Star,
  ShoppingCart,
  MapPin,
  Shield,
  Truck,
  ArrowLeft,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { SectionState } from "../components/SectionState";
import { addToCart } from "../../store/slices/cartSlice";
import type { AppDispatch } from "../../store/store";
import { toast } from "sonner";

export function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<
    Record<string, string>
  >({});
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <Link to="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    );
  }

  useEffect(() => {
    if (!product?.id) return;
    const raw = window.localStorage.getItem("shopviet_recently_viewed");
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [
      product.id,
      ...parsed.filter((item) => item !== product.id),
    ].slice(0, 6);
    window.localStorage.setItem(
      "shopviet_recently_viewed",
      JSON.stringify(next),
    );
    setRecentlyViewed(next);
  }, [product?.id]);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);
  const availableStock = useMemo(() => {
    if (!product.variants?.length) return product.stock;
    let stock = product.stock;
    product.variants.forEach((variant) => {
      const selected = selectedVariant[variant.id];
      if (!selected) return;
      const option = variant.options.find((item) => item.id === selected);
      if (option) stock += option.stockDelta;
    });
    return Math.max(1, stock);
  }, [product, selectedVariant]);
  const averageRating = useMemo(() => {
    const reviews = product.reviews ?? [];
    if (!reviews.length) return product.rating;
    return reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  }, [product]);
  const viewedProducts = products.filter(
    (item) => recentlyViewed.includes(item.id) && item.id !== product.id,
  );

  const handleAddToCart = () => {
    if (
      product.variants?.length &&
      product.variants.some((variant) => !selectedVariant[variant.id])
    ) {
      toast.error("Vui lòng chọn đầy đủ biến thể trước khi thêm vào giỏ");
      return;
    }
    dispatch(addToCart({ product, quantity }));
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    if (
      product.variants?.length &&
      product.variants.some((variant) => !selectedVariant[variant.id])
    ) {
      toast.error("Vui lòng chọn đầy đủ biến thể trước khi mua");
      return;
    }
    dispatch(addToCart({ product, quantity }));
    navigate("/checkout");
  };

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              to="/"
              className="hover:text-orange-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Product Info */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <button
                type="button"
                className="aspect-square rounded-lg overflow-hidden mb-4 border w-full text-left"
                onClick={() => setIsZoomOpen(true)}
              >
                <ImageWithFallback
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx
                        ? "border-orange-600"
                        : "border-gray-200"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-orange-600 font-semibold">
                    {product.rating}
                  </span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="border-l pl-4">
                  <span className="text-gray-600">{product.sold} Đã bán</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-orange-600">
                    ₫{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-400 line-through">
                        ₫{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-orange-500 hover:bg-orange-500">
                        -{product.discount}% GIẢM
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Vận chuyển</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Giao đến {product.location}</span>
                </div>
              </div>

              {product.variants?.map((variant) => (
                <div key={variant.id} className="mb-4">
                  <h3 className="font-semibold mb-2">{variant.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const isSelected =
                        selectedVariant[variant.id] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setSelectedVariant((prev) => ({
                              ...prev,
                              [variant.id]: option.id,
                            }))
                          }
                          className={`rounded-full border px-3 py-2 text-sm ${isSelected ? "border-orange-600 bg-orange-50 text-orange-700" : "border-gray-300"}`}
                        >
                          {option.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Số lượng</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(availableStock, quantity + 1))
                    }
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-600 ml-4">
                    {availableStock} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600">Đảm bảo chính hãng</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600">Miễn phí vận chuyển</p>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600">Đổi trả 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Đánh giá & nhận xét</h2>
            <div className="text-sm text-gray-600">
              {averageRating.toFixed(1)} / 5
            </div>
          </div>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-3">
              {product.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{review.user}</span>
                    <span className="text-sm text-gray-500">
                      {review.createdAt}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-1 text-sm text-yellow-500">
                    {Array.from({ length: 5 }, (_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${idx < review.rating ? "fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <SectionState
              kind="empty"
              title="Chưa có đánh giá"
              message="Sản phẩm này chưa có nhận xét nào."
            />
          )}
        </div>

        {viewedProducts.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Đã xem gần đây</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {viewedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-white/90 p-2"
              onClick={() => setIsZoomOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
