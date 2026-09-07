"use client";
import {useState} from "react";
import type {Lang} from "@/lib/navigation";

type Props={lang:Lang;onBack:()=>void;onDone:()=>void;mode?:"new"|"template"};
export default function ProductCreateForm({lang,onBack,onDone,mode="new"}:Props){
 const vi=lang==="vi"; const[name,setName]=useState(""); const[price,setPrice]=useState(""); const[sku,setSku]=useState(""); const[qty,setQty]=useState("0"); const[category,setCategory]=useState(""); const[desc,setDesc]=useState(""); const[media,setMedia]=useState<File[]>([]); const[draft,setDraft]=useState(false);
 const valid=name.trim()&&Number(price)>0;
 return <section className="navWorkspace specializedPanel">
  <div className="workspaceCrumbs"><button type="button" className="backKey" onClick={onBack}>← Back</button><button type="button" className="crumbKey selected">{vi?"Tạo sản phẩm":"Create Product"}</button><button type="button" className="crumbKey selected tree5Crumb">{mode==="template"?(vi?"Từ mẫu":"From Template"):(vi?"Mới":"New")}</button></div>
  <div className="specialHead"><div><span>SPECIALIZED CONTENT</span><h2>{vi?"Mẫu tạo sản phẩm":"Product Creation Template"}</h2></div><b className="statePill ready">{vi?"FORM SẴN SÀNG":"FORM READY"}</b></div>
  <div className="specialGrid productForm">
   <label className="wide"><span>{vi?"Ảnh / video sản phẩm":"Product photo / video"}</span><input type="file" accept="image/*,video/*" multiple onChange={e=>setMedia(Array.from(e.target.files||[]))}/><small>{media.length?`${media.length} ${vi?"tệp đã chọn":"files selected"}`:(vi?"Có thể thêm sau":"Optional")}</small></label>
   <label><span>{vi?"Tên sản phẩm *":"Product name *"}</span><input value={name} onChange={e=>setName(e.target.value)} /></label>
   <label><span>{vi?"Giá bán *":"Price *"}</span><input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} /></label>
   <label><span>SKU</span><input value={sku} onChange={e=>setSku(e.target.value)} /></label>
   <label><span>{vi?"Số lượng kho":"Stock quantity"}</span><input type="number" min="0" value={qty} onChange={e=>setQty(e.target.value)} /></label>
   <label><span>{vi?"Danh mục":"Category"}</span><input value={category} onChange={e=>setCategory(e.target.value)} /></label>
   <label className="wide"><span>{vi?"Mô tả ngắn":"Short description"}</span><textarea value={desc} onChange={e=>setDesc(e.target.value)} /></label>
   <div className="productPreview wide"><b>{vi?"Preview card":"Product preview"}</b><div><strong>{name|| (vi?"Tên sản phẩm":"Product name")}</strong><span>{price?`${Number(price).toLocaleString()} ₫`:(vi?"Chưa nhập giá":"No price")}</span><small>SKU: {sku||"—"} · {vi?"Tồn":"Stock"}: {qty||0}</small></div></div>
  </div>
  <div className="endCommitRow"><button type="button" className="secondaryEnd" onClick={()=>setDraft(true)}>{draft?"✓ ":""}{vi?"Lưu nháp":"Save draft"}</button><button type="button" className="endCommit" disabled={!valid} onClick={onDone}>{vi?"Lưu & Đăng sản phẩm · END":"Save & Publish Product · END"}</button></div>
 </section>
}
