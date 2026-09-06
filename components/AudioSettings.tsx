"use client";
import {useEffect,useState} from "react";
import {LONG_TRACKS,loadAudioPrefs,saveAudioPrefs,lockTheme,type AudioPrefs} from "@/core/audio-engine";
export default function AudioSettings(){
 const[p,setP]=useState<AudioPrefs>({policy:"daily",mode:"random",recent:[]});const[preview,setPreview]=useState<HTMLAudioElement|null>(null);
 useEffect(()=>setP(loadAudioPrefs()),[]);
 function update(n:AudioPrefs){setP(n);saveAudioPrefs(n)}
 function hear(src:string){preview?.pause();const a=new Audio(src);a.volume=.38;a.play().catch(()=>{});setPreview(a)}
 return <div className="audioSettings"><h3>Long Audio Engine</h3><p>10 bài ngắn 15–30 giây • AI Flash review hàng tuần • bài user khóa không bị thay.</p>
  <label>Nhạc khởi động<select value={p.policy} onChange={e=>update({...p,policy:e.target.value as AudioPrefs["policy"]})}><option value="off">Tắt</option><option value="daily">Đầu ngày</option><option value="cold">Mỗi lần khởi động lạnh</option></select></label>
  <label>Cách chọn<select value={p.mode} onChange={e=>update({...p,mode:e.target.value as AudioPrefs["mode"]})}><option value="random">Ngẫu nhiên</option><option value="ai">AI chọn cho tôi</option><option value="locked">Nhạc chủ đề của tôi</option></select></label>
  <div className="audioRail">{LONG_TRACKS.map(t=><div className={"audioTrack "+(p.lockedTrackId===t.id?"locked":"")} key={t.id}><b>{t.title}</b><span>{t.duration}s • {t.mood.join(" / ")}</span><div><button onClick={()=>hear(t.src)}>▶ Nghe</button><button onClick={()=>{lockTheme(t.id);setP(loadAudioPrefs())}}>☆ Chọn chủ đề</button></div></div>)}</div>
  <p className="muted">Nguồn xu hướng tham khảo: SoundCloud, Zing MP3, TikTok Trending. Long không tự tải/cắt/re-host bản nhạc có bản quyền nếu chưa có quyền sử dụng.</p>
 </div>
}
