import { useSearchParams, Link } from "react-router";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const searchResults = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

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
            <span className="text-gray-900">Tìm kiếm</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <SearchIcon className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold">
              Kết quả tìm kiếm cho "{query}"
            </h1>
          </div>
          <p className="text-gray-600">
            Tìm thấy {searchResults.length} sản phẩm
          </p>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <SearchIcon className="w-24 h-24 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 mb-6">
              Không tìm thấy sản phẩm nào với từ khóa "{query}"
            </p>
            <Link to="/">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Về trang chủ
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
