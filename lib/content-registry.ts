/** FIXFLOW3-R4 content registry.
 * Runtime resolution order: NODE ID -> REGISTRY -> SEMANTIC MATCH -> GUARD -> STATE -> COVERAGE.
 */
export type RuntimeState="loading"|"ready"|"empty"|"permission-required"|"error"|"unavailable";
export type ContentSpec={
 id:string; intent:string; component:string; specialized:boolean;
 keywords:string[]; dependencies?:string[]; allowedStates:RuntimeState[]; end:string;
};
export const CONTENT_REGISTRY:ContentSpec[]=[
 {id:"studio.broadcast.create-video.template",intent:"media-composer",component:"TemplateVideoBuilder",specialized:true,keywords:["tạo video","từ mẫu","template","dựng video"],allowedStates:["ready","error"],end:"send-to-broadcast"},
 {id:"store.sales.create-product.new",intent:"product-editor",component:"ProductCreateForm",specialized:true,keywords:["tạo sản phẩm","mới","product"],allowedStates:["ready","error"],end:"save-or-publish"},
 {id:"store.sales.create-product.template",intent:"product-editor",component:"ProductCreateForm",specialized:true,keywords:["tạo sản phẩm","từ mẫu","template product"],allowedStates:["ready","error"],end:"save-or-publish"},
 {id:"home.myai.ai-flash",intent:"ai-chat",component:"AIFlashWorkspace",specialized:true,keywords:["ai flash","chat ai"],dependencies:["ai-provider"],allowedStates:["loading","ready","error","unavailable"],end:"repeat-send"},
 {id:"home.connect.devices.laptop.hdmi",intent:"media-connection",component:"MediaConnectionPanel",specialized:true,keywords:["hdmi","capture","laptop"],dependencies:["media-device","permission"],allowedStates:["loading","ready","empty","permission-required","error","unavailable"],end:"connect"},
 {id:"store.shopping.checkout",intent:"payment",component:"PaymentCenter",specialized:true,keywords:["thanh toán","checkout","payment"],dependencies:["payment-provider"],allowedStates:["loading","ready","error","unavailable"],end:"payment-confirmed"},
 {id:"store.shopping.stickers",intent:"sticker-store",component:"StickerStore",specialized:true,keywords:["sticker","sticker store"],allowedStates:["loading","ready","empty","error"],end:"purchase-or-send"},
 {id:"me.settings.appearance",intent:"appearance",component:"AppearanceCenter",specialized:true,keywords:["giao diện","theme","appearance"],allowedStates:["ready","error"],end:"apply"},
];
export const SPECIALIZED_KEYWORDS=["tạo video","tạo sản phẩm","thanh toán","sticker","ai flash","camera","hdmi","capture","mixer","theme","boss","upload media","tạo qr","quét qr","check-in","ứng dụng ngoài","1080p","4k","8k","ai bán hàng","ai soát bill","ai soát vé","quét bill","quét vé","render","record","xuất video","nhập kho","xuất kho","kiểm kê","đơn hàng"];
export function semanticRequiresSpecialized(label:string){const x=label.toLowerCase();return SPECIALIZED_KEYWORDS.some(k=>x.includes(k));}
