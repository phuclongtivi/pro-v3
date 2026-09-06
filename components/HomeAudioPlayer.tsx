"use client";
import {useEffect,useRef,useState} from "react";
import {chooseTrack,loadAudioPrefs,LONG_TRACKS} from "@/core/audio-engine";
import type {Lang} from "@/lib/navigation";

export default function HomeAudioPlayer({lang}:{lang:Lang}){
 const audioRef=useRef<HTMLAudioElement|null>(null);const[track,setTrack]=useState(()=>LONG_TRACKS[0]);const[playing,setPlaying]=useState(false);const[blocked,setBlocked]=useState(false);
 useEffect(()=>{const prefs=loadAudioPrefs();const t=chooseTrack(prefs);setTrack(t);if(prefs.policy==="off")return;let a:HTMLAudioElement|null=null;const timer=window.setTimeout(()=>{a=new Audio(t.src);a.loop=true;a.volume=.22;audioRef.current=a;a.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>setBlocked(true))},5600);return()=>{window.clearTimeout(timer);a?.pause();audioRef.current=null}},[]);
 function toggle(){const a=audioRef.current;if(!a){const n=new Audio(track.src);n.loop=true;n.volume=.22;audioRef.current=n;n.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>setBlocked(true));return}if(a.paused)a.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>setBlocked(true));else{a.pause();setPlaying(false)}}
 function next(){const i=(LONG_TRACKS.findIndex(x=>x.id===track.id)+1)%LONG_TRACKS.length;const t=LONG_TRACKS[i];setTrack(t);audioRef.current?.pause();const a=new Audio(t.src);a.loop=true;a.volume=.22;audioRef.current=a;a.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>setBlocked(true))}
 return <div className="homeAudioBar"><div><b>{lang==="vi"?"Nhạc nền Home":lang==="zh"?"Home 背景音乐":"Home background music"}</b><span>{track.title}{blocked?(lang==="vi"?" · Chạm để bật":" · Tap to play"):""}</span></div><button type="button" onClick={toggle}>{playing?"Ⅱ":"▶"}</button><button type="button" onClick={next}>››</button></div>
}
