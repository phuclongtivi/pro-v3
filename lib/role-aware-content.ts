export type AccessMode = "viewer"|"participant"|"owner"|"editor"|"operator"|"moderator"|"seller"|"buyer"|"self"|"boss"|"unknown";
export type AccessContext={
  mode:AccessMode;
  objectType:string;
  canRead:boolean;
  canEdit:boolean;
  canShare:boolean;
  canJoin:boolean;
  canManage:boolean;
  requiresRuntimeOwnership:boolean;
  reason:string;
};

type Input={section:string;activeId:string;endType?:string;actionId?:string;selectedId?:string;runtimeRole?:AccessMode;runtimeOwner?:boolean|null};

const base=(mode:AccessMode,objectType:string,reason:string):AccessContext=>({
  mode,objectType,canRead:true,canEdit:["owner","editor","operator","seller","self","boss"].includes(mode),
  canShare:["viewer","participant","owner","editor","buyer","self"].includes(mode),
  canJoin:["viewer","participant","buyer"].includes(mode),
  canManage:["owner","editor","operator","moderator","seller","self"].includes(mode),
  requiresRuntimeOwnership:false,reason
});

export function resolveAccessContext(p:Input):AccessContext{
  const runtime=p.runtimeRole;
  if(runtime){const x=base(runtime,"runtime","Runtime role supplied");if(p.runtimeOwner===true){x.mode="owner";x.canEdit=x.canManage=true;}return x;}
  if(p.section==="home.events"){
    if(p.activeId==="create-gift") return base("owner","gift-draft","User is creating a new gift object");
    if(["gift","no-gift","ticket","no-ticket"].includes(p.activeId)) return base("viewer","event","Public/discovered event content is read-only by default");
    if(p.activeId==="my-events"){
      const mutation=["create-notice","manage-gift","init-gift"].includes(p.selectedId||"");
      const x=base(mutation?"unknown":"participant","event","My Events can contain both owned and joined events");
      if(mutation){x.canEdit=false;x.canManage=false;x.requiresRuntimeOwnership=true;x.reason="Ownership/editor permission must be proven by runtime before authoring or management";}
      return x;
    }
  }
  if(p.section==="home.quickcreate") return base("owner","draft","User is creating a new object");
  if(p.section==="home.myai") return base("self","ai-job","Personal AI workspace");
  if(p.section==="home.connect") return base("self","connection","User controls their connection session");
  if(p.section.startsWith("studio.broadcast")||p.section.startsWith("studio.mixer")) return base("operator","studio","Studio controls are operator actions");
  if(p.section.startsWith("studio.chat")){
    if(["roles","members"].includes(p.activeId)){const x=base("unknown","chat-room","Moderation requires room role at runtime");x.canEdit=false;x.canManage=false;x.requiresRuntimeOwnership=true;return x;}
    return base("participant","chat-room","Room member view by default");
  }
  if(p.section.startsWith("store.sales")||p.section.startsWith("store.inventory")||p.section.startsWith("store.orders")) return base("seller","commerce","Seller/operator workspace");
  if(p.section.startsWith("store.shopping")) return base("buyer","commerce","Shopping is buyer-facing");
  if(p.section.startsWith("me.")) return base("self","user","User-owned profile/settings/notifications");
  return base("unknown","generic","No role rule; runtime must decide before mutations");
}

export function accessAllowsMutation(a:AccessContext){return a.canEdit||a.canManage;}
