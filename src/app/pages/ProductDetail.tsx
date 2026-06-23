import { useParams, Link } from "react-router";
import { products } from "../data/products";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, ShoppingCart, MapPin, Shield, Truck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";

export function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 flex items-center gap-1">
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
              <div className="aspect-square rounded-lg overflow-hidden mb-4 border">
                <ImageWithFallback
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
                  <span className="text-gray-600">
                    {product.sold} Đã bán
                  </span>
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
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-600 ml-4">
                    {product.stock} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
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
    </div>
  );
}
