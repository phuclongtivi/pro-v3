export type StartupPolicy="off"|"daily"|"cold";
export type SelectionMode="random"|"ai"|"locked";
export type AudioPrefs={policy:StartupPolicy;mode:SelectionMode;lockedTrackId?:string;lastPlayedDay?:string;recent:string[];likes?:string[]};
export type TrackSource="local"|"soundcloud"|"zing";
export type LongTrack={id:string;title:string;src:string;duration:number;mood:string[];aiManaged:boolean;source:TrackSource;pageUrl?:string;userLocked?:boolean};

export const LONG_TRACKS:LongTrack[]=[
 {id:"long-ambient-01",title:"Lavender Motion",src:"/audio/long-ambient-01.ogg",duration:24,mood:["calm","modern","soft"],aiManaged:true,source:"local"},
 {id:"long-ambient-02",title:"Event Space",src:"/audio/long-ambient-02.ogg",duration:24,mood:["future","event","clean"],aiManaged:true,source:"local"},
 {id:"long-ambient-03",title:"Flash Flow",src:"/audio/long-ambient-03.ogg",duration:24,mood:["focus","motion","light"],aiManaged:true,source:"local"},
 {id:"long-ambient-04",title:"Night Studio",src:"/audio/long-ambient-04.ogg",duration:24,mood:["night","studio","chill"],aiManaged:true,source:"local"},
 {id:"long-ambient-05",title:"Morning Glass",src:"/audio/long-ambient-05.ogg",duration:24,mood:["bright","gentle","clean"],aiManaged:true,source:"local"},
];

export const TREND_REFERENCE_SOURCES=[
 {id:"soundcloud",role:"playback",policy:"Use official/authorized playback URLs or SoundCloud Widget/API; never scrape or re-host copyrighted audio."},
 {id:"zingmp3",role:"playback-when-authorized",policy:"Use only licensed/authorized playback or embed access. Otherwise keep Zing as trend reference only."},
] as const;

const KEY="long-audio-prefs"; const day=()=>new Date().toISOString().slice(0,10);
export function loadAudioPrefs():AudioPrefs{if(typeof window==="undefined")return{policy:"daily",mode:"ai",recent:[],likes:[]};try{return{...{policy:"daily",mode:"ai",recent:[],likes:[]},...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return{policy:"daily",mode:"ai",recent:[],likes:[]}}}
export function saveAudioPrefs(v:AudioPrefs){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(v))}
export function lockTheme(trackId:string){const p=loadAudioPrefs();p.mode="locked";p.lockedTrackId=trackId;saveAudioPrefs(p)}
export function chooseTrack(p=loadAudioPrefs(),pool=LONG_TRACKS):LongTrack{if(p.mode==="locked"&&p.lockedTrackId)return pool.find(x=>x.id===p.lockedTrackId)||pool[0];const usable=pool.filter(x=>!p.recent.slice(-3).includes(x.id));if(p.mode==="ai"){const h=new Date().getHours();const likes=p.likes||[];const liked=usable.filter(t=>likes.some(x=>t.mood.includes(x)));if(liked.length)return liked[h%liked.length];return usable[(h<10?0:h<17?2:3)%Math.max(usable.length,1)]||pool[0]}return usable[Math.floor(Math.random()*Math.max(usable.length,1))]||pool[0]}
export function startupEligible(p=loadAudioPrefs(),isCold=true){if(p.policy==="off")return false;if(p.policy==="cold")return isCold;return p.lastPlayedDay!==day()}
export async function playStartup(){const p=loadAudioPrefs();if(!startupEligible(p,true))return null;const tr=chooseTrack(p);const a=new Audio(tr.src);a.volume=.24;await a.play();p.lastPlayedDay=day();p.recent=[...p.recent,tr.id].slice(-6);saveAudioPrefs(p);return tr}
export async function playWelcome(){const a=new Audio("/audio/welcome-sting.ogg");a.volume=.30;await a.play();return a}
export function weeklyRefreshPlan(){const p=loadAudioPrefs();return LONG_TRACKS.map(t=>({...t,protected:t.id===p.lockedTrackId,action:t.id===p.lockedTrackId?"KEEP_LOCKED":"AI_REVIEW"}))}
