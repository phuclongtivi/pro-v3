"use client";
import {useEffect,useRef,useState} from "react";
import {LONG_TRACKS,loadAudioPrefs} from "@/core/audio-engine";
import type {Lang} from "@/lib/navigation";
type Track={id:string;title:string;streamUrl:string;source:"local"|"soundcloud"|"zing";pageUrl?:string};
export default function HomeAudioPlayer({lang}:{lang:Lang}){
 const audioRef=useRef<HTMLAudioElement|null>(null);const[tracks,setTracks]=useState<Track[]>(LONG_TRACKS.map(t=>({id:t.id,title:t.title,streamUrl:t.src,source:"local"})));const[index,setIndex]=useState(0);const[playing,setPlaying]=useState(false);const[blocked,setBlocked]=useState(false);const[loadedWeek,setLoadedWeek]=useState<number|null>(null);
 const track=tracks[index]||tracks[0]; const vi=lang==="vi",zh=lang==="zh";
 useEffect(()=>{const prefs=loadAudioPrefs();fetch("/api/music/playlist",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({likes:prefs.likes||[]}),cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{if(j?.playlist?.length){setTracks(j.playlist);setLoadedWeek(j.week)}}).catch(()=>{});},[]);
 useEffect(()=>()=>{audioRef.current?.pause();audioRef.current=null},[]);
 function create(t=track){if(!t)return null;const a=new Audio(t.streamUrl);a.preload="none";a.volume=.24;a.addEventListener("ended",()=>next());audioRef.current=a;return a}
 function play(){const a=audioRef.current&&audioRef.current.src.includes(track?.streamUrl||"")?audioRef.current:create();if(!a)return;a.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>{setPlaying(false);setBlocked(true)})}
 function stop(){const a=audioRef.current;if(a){a.pause();a.currentTime=0}setPlaying(false)}
 function next(){stop();setIndex(i=>(i+1)%Math.max(tracks.length,1));setTimeout(()=>{const n=tracks[(index+1)%Math.max(tracks.length,1)];if(n){const a=create(n);a?.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>setBlocked(true))}},0)}
 function like(){try{const p=loadAudioPrefs();const moods=p.likes||[];p.likes=[...new Set([...moods,track?.id||""])].filter(Boolean);localStorage.setItem("long-audio-prefs",JSON.stringify(p))}catch{}}
 return <div className="homeAudioBar"><div className="homeAudioMeta"><b>{vi?"Nhạc nền Home":zh?"Home 背景音乐":"Home background music"}</b><span>{track?.title||"Long Ambient"} · {track?.source?.toUpperCase()}{blocked?(vi?" · Chạm Play để cấp quyền phát":zh?" · 点击播放以授权":" · Tap Play to allow audio"):""}</span><small>{vi?`Playlist AI • cập nhật tuần${loadedWeek!==null?` #${loadedWeek}`:""}`:zh?"AI 播放列表 • 每周更新":"AI playlist • weekly refresh"}</small></div><div className="homeAudioControls"><button type="button" onClick={play} aria-label="Play">▶</button><button type="button" onClick={stop} aria-label="Stop">■</button><button type="button" onClick={next} aria-label="Next">››</button><button type="button" onClick={like} aria-label="Like">♡</button></div></div>
}
