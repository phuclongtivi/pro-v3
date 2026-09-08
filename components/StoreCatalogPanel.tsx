"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/lib/navigation";

type Product = {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  currency: string;
  store_name?: string;
  category?: string;
  quantity?: number;
  featured?: boolean;
  sku?: string;
};

const tr = (lang: Lang, vi: string, en: string, zh: string) => lang === "en" ? en : lang === "zh" ? zh : vi;

export default function StoreCatalogPanel({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("priority");
  const [selectedProductId, setSelectedProductId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: query, category, sort });
      const response = await fetch(`/api/store/products?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
      setProducts(data.products || []);
    } catch (cause) {
      setProducts([]);
      setError(cause instanceof Error ? cause.message : "CATALOG_UNAVAILABLE");
    } finally {
      setLoading(false);
    }
  }, [query, category, sort]);

  useEffect(() => {
    const timer = window.setTimeout(load, 180);
    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <section className="navWorkspace contentSurface storeCatalog" data-runtime-area="store.shopping.catalog">
      <div className="workspaceCrumbs">
        <button data-action-id="pro.store.catalog.back" type="button" className="backKey" onClick={onBack}>← Back</button>
        <span className="crumbKey selected">{tr(lang, "Tổng kho mua sắm", "Shopping warehouse", "购物总仓")}</span>
      </div>
      <div className="catalogToolbar">
        <input aria-label={tr(lang, "Tìm mặt hàng", "Search products", "搜索商品")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr(lang, "Tìm tên, SKU, cửa hàng…", "Search name, SKU or store…", "搜索名称、SKU或商店…")} />
        <select aria-label={tr(lang, "Nhóm hàng", "Category", "分类")} value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">{tr(lang, "Tất cả nhóm hàng", "All categories", "全部分类")}</option>
          <option value="food">{tr(lang, "Đồ ăn", "Food", "食品")}</option>
          <option value="drink">{tr(lang, "Đồ uống", "Drink", "饮品")}</option>
          <option value="gift">{tr(lang, "Quà tặng", "Gift", "礼物")}</option>
          <option value="service">{tr(lang, "Dịch vụ", "Service", "服务")}</option>
        </select>
        <select aria-label={tr(lang, "Sắp xếp", "Sort", "排序")} value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="priority">{tr(lang, "Ưu tiên hệ thống", "System priority", "系统优先")}</option>
          <option value="newest">{tr(lang, "Mới nhất", "Newest", "最新")}</option>
          <option value="price-asc">{tr(lang, "Giá tăng dần", "Price low to high", "价格升序")}</option>
          <option value="price-desc">{tr(lang, "Giá giảm dần", "Price high to low", "价格降序")}</option>
        </select>
        <button data-action-id="pro.store.catalog.refresh" type="button" onClick={load}>{tr(lang, "Làm mới", "Refresh", "刷新")}</button>
      </div>
      {loading ? <div className="semanticEmpty">{tr(lang, "Đang tải tổng kho…", "Loading catalog…", "正在加载商品…")}</div> : error ? (
        <div className="semanticEmpty"><b>{tr(lang, "Chưa tải được tổng kho", "Catalog unavailable", "商品目录不可用")}</b><span>{error}</span><button data-action-id="pro.store.catalog.retry" type="button" onClick={load}>{tr(lang, "Thử lại", "Retry", "重试")}</button></div>
      ) : products.length ? (
        <div className="catalogGrid">{products.map((product) => <article key={product.id} className="catalogCard">
          <div><small>{product.featured ? "◆ " : ""}{product.category || tr(lang, "Chưa phân nhóm", "Uncategorized", "未分类")}</small><h3>{product.title}</h3><p>{product.description || tr(lang, "Không có mô tả", "No description", "无描述")}</p></div>
          <div className="catalogMeta"><span>{product.store_name || "Long Store"}</span><span>{product.sku || "—"}</span><span>{tr(lang, "Còn", "Stock", "库存")}: {product.quantity ?? 0}</span></div>
          <b>{Number(product.price || 0).toLocaleString("vi-VN")} {product.currency || "VND"}</b>
          <button data-action-id={`pro.store.product.${product.id}.select`} type="button" aria-pressed={selectedProductId === product.id} disabled={(product.quantity ?? 0) <= 0} onClick={() => setSelectedProductId(product.id)}>{selectedProductId === product.id ? tr(lang, "Đã chọn", "Selected", "已选择") : (product.quantity ?? 0) > 0 ? tr(lang, "Chọn mua", "Select", "选择购买") : tr(lang, "Hết hàng", "Out of stock", "缺货")}</button>
        </article>)}</div>
      ) : <div className="semanticEmpty"><b>{tr(lang, "Tổng kho chưa có mặt hàng phù hợp", "No matching products", "没有匹配商品")}</b><span>{tr(lang, "Không dùng sản phẩm mẫu. Hãy đổi bộ lọc hoặc thêm sản phẩm thật.", "No demo products are used. Change filters or add real products.", "不使用演示商品；请更改筛选或添加真实商品。")}</span></div>}
    </section>
  );
}
