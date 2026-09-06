export type StartupPolicy="off"|"daily"|"cold";
export type SelectionMode="random"|"ai"|"locked";
export type AudioPrefs={policy:StartupPolicy;mode:SelectionMode;lockedTrackId?:string;lastPlayedDay?:string;recent:string[]};
export type LongTrack={id:string;title:string;src:string;duration:number;mood:string[];aiManaged:boolean;userLocked?:boolean};

export const LONG_TRACKS:LongTrack[]=[
 {id:"long-theme-01",title:"Lavender Dawn",src:"/audio/long-theme-01.ogg",duration:15,mood:["warm","soft"],aiManaged:true},
 {id:"long-theme-02",title:"Quiet Motion",src:"/audio/long-theme-02.ogg",duration:15,mood:["calm","modern"],aiManaged:true},
 {id:"long-theme-03",title:"Long Pulse",src:"/audio/long-theme-03.ogg",duration:15,mood:["future","light"],aiManaged:true},
 {id:"long-theme-04",title:"Lavender Motion",src:"/audio/long-theme-04.ogg",duration:15,mood:["cinematic","warm"],aiManaged:true},
 {id:"long-theme-05",title:"Morning Flow",src:"/audio/long-theme-05.ogg",duration:15,mood:["bright","gentle"],aiManaged:true},
 {id:"long-theme-06",title:"Soft Stage",src:"/audio/long-theme-06.ogg",duration:15,mood:["event","soft"],aiManaged:true},
 {id:"long-theme-07",title:"Future Tea",src:"/audio/long-theme-07.ogg",duration:15,mood:["organic","future"],aiManaged:true},
 {id:"long-theme-08",title:"City Lavender",src:"/audio/long-theme-08.ogg",duration:15,mood:["urban","calm"],aiManaged:true},
 {id:"long-theme-09",title:"Dragon Light",src:"/audio/long-theme-09.ogg",duration:15,mood:["identity","light"],aiManaged:true},
 {id:"long-theme-10",title:"Event Glow",src:"/audio/long-theme-10.ogg",duration:15,mood:["event","cinematic"],aiManaged:true},
];

export const TREND_REFERENCE_SOURCES=[
 {id:"soundcloud",role:"reference",policy:"Use official API/player/licensed metadata only; do not scrape or re-host copyrighted audio."},
 {id:"zingmp3",role:"reference",policy:"Trend reference only unless licensed/provider access is explicitly available."},
 {id:"tiktok-trending",role:"reference",policy:"Trend reference only via approved/authorized data access; do not copy copyrighted tracks."},
] as const;

const KEY="long-audio-prefs";
const day=()=>new Date().toISOString().slice(0,10);
export function loadAudioPrefs():AudioPrefs{
 if(typeof window==="undefined")return{policy:"daily",mode:"random",recent:[]};
 try{return {...{policy:"daily",mode:"random",recent:[]},...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return{policy:"daily",mode:"random",recent:[]}}
}
export function saveAudioPrefs(v:AudioPrefs){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(v))}
export function lockTheme(trackId:string){const p=loadAudioPrefs();p.mode="locked";p.lockedTrackId=trackId;saveAudioPrefs(p)}
export function chooseTrack(p=loadAudioPrefs()):LongTrack{
 if(p.mode==="locked"&&p.lockedTrackId){return LONG_TRACKS.find(x=>x.id===p.lockedTrackId)||LONG_TRACKS[0]}
 const pool=LONG_TRACKS.filter(x=>!p.recent.slice(-3).includes(x.id));
 // AI mode is deterministic placeholder until provider is connected: time-of-day weighted selection.
 if(p.mode==="ai"){const h=new Date().getHours();return pool[(h<10?0:h<17?4:8)%Math.max(pool.length,1)]||LONG_TRACKS[0]}
 return pool[Math.floor(Math.random()*Math.max(pool.length,1))]||LONG_TRACKS[0]
}
export function startupEligible(p=loadAudioPrefs(),isCold=true){
 if(p.policy==="off")return false;
 if(p.policy==="cold")return isCold;
 return p.lastPlayedDay!==day();
}
export async function playStartup(){
 const p=loadAudioPrefs(); if(!startupEligible(p,true))return null;
 const tr=chooseTrack(p); const a=new Audio(tr.src); a.volume=.32; await a.play();
 p.lastPlayedDay=day();p.recent=[...p.recent,tr.id].slice(-6);saveAudioPrefs(p);return tr;
}
export async function playWelcome(){
 const a=new Audio("/audio/welcome-sting.ogg");a.volume=.34;await a.play();return a;
}
export function weeklyRefreshPlan(){
 const p=loadAudioPrefs();
 return LONG_TRACKS.map(t=>({...t,protected:t.id===p.lockedTrackId,action:t.id===p.lockedTrackId?"KEEP_LOCKED":"AI_REVIEW"}));
}
