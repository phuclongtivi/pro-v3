/** Local output evidence only; does not claim remote six-core execution. */
export async function renderLocalVideo(files:File[],title:string,progress:(value:number)=>void,signal:AbortSignal,template="event-announce"){
 if(!files.length||files.length>20)throw new Error("Chọn từ 1 đến 20 ảnh/video.");
 if(files.reduce((sum,file)=>sum+file.size,0)>250*1024*1024)throw new Error("Tổng dung lượng tối đa 250 MB.");
 if(typeof MediaRecorder==='undefined')throw new Error("Trình duyệt chưa hỗ trợ xuất video. Hãy thử trình duyệt khác.");
 const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;
 if(!canvas.captureStream)throw new Error("Trình duyệt chưa hỗ trợ dựng video trên thiết bị.");
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error("Không mở được bộ dựng hình.");
 const mime=['video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(value=>MediaRecorder.isTypeSupported(value));
 if(!mime)throw new Error("Không có định dạng xuất video được hỗ trợ.");
 const audio=new AudioContext();await audio.resume();const audioOut=audio.createMediaStreamDestination();
 const stream=canvas.captureStream(30);audioOut.stream.getAudioTracks().forEach(track=>stream.addTrack(track));
 const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:4000000});const chunks:Blob[]=[];
 let failure=false;recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)};recorder.onerror=()=>{failure=true};
 const stopped=new Promise<void>(resolve=>{recorder.onstop=()=>resolve()});
 const urls:string[]=[];const videos:HTMLVideoElement[]=[];
 function check(){if(signal.aborted)throw new Error("Đã hủy dựng video.");if(failure)throw new Error("Không thể ghi video.");if(document.hidden)throw new Error("Giữ màn hình này mở khi dựng video, rồi thử lại.")}
 function load(element:HTMLImageElement|HTMLVideoElement,event:string){return new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>done(new Error("Không đọc được tệp trong thời gian cho phép.")),15000);function done(error?:Error){clearTimeout(timer);element.removeEventListener(event,ok);element.removeEventListener('error',bad);signal.removeEventListener('abort',abort);error?reject(error):resolve()}const ok=()=>done();const bad=()=>done(new Error("Tệp không được hỗ trợ hoặc bị hỏng."));const abort=()=>done(new Error("Đã hủy dựng video."));element.addEventListener(event,ok,{once:true});element.addEventListener('error',bad,{once:true});signal.addEventListener('abort',abort,{once:true})})}
 function draw(source:CanvasImageSource,width:number,height:number){ctx!.fillStyle=template==='product-card'?'#f5efff':template==='short-recap'?'#102a36':'#151127';ctx!.fillRect(0,0,1280,720);const scale=Math.min(1280/width,720/height);ctx!.drawImage(source,(1280-width*scale)/2,(720-height*scale)/2,width*scale,height*scale);if(title){ctx!.fillStyle='rgba(18,12,35,.72)';ctx!.fillRect(0,template==='live-intro'?280:600,1280,120);ctx!.fillStyle='#fff';ctx!.font='600 36px sans-serif';ctx!.fillText(title.slice(0,100),40,template==='live-intro'?350:670,1200)}}
 try{
  for(let index=0;index<files.length;index++){
   check();const file=files[index];const url=URL.createObjectURL(file);urls.push(url);let source:HTMLImageElement|HTMLVideoElement;let width:number,height:number,duration=3000;let node:MediaElementAudioSourceNode|undefined;
   if(file.type.startsWith('image/')){const img=new Image();const loaded=load(img,'load');img.src=url;await loaded;source=img;width=img.naturalWidth;height=img.naturalHeight}
   else if(file.type.startsWith('video/')){const video=document.createElement('video');videos.push(video);video.playsInline=true;video.preload='auto';const loaded=load(video,'loadeddata');video.src=url;video.load();await loaded;if(!Number.isFinite(video.duration)||video.duration<=0||video.duration>30)throw new Error("Mỗi video đầu vào cần dài tối đa 30 giây.");source=video;width=video.videoWidth;height=video.videoHeight;duration=video.duration*1000;node=audio.createMediaElementSource(video);node.connect(audioOut);await video.play()}
   else throw new Error("Chỉ nhận tệp ảnh hoặc video.");
   check();draw(source,width,height);if(recorder.state==='inactive')recorder.start(250);else if(recorder.state==='paused')recorder.resume();
   const start=performance.now();await new Promise<void>((resolve,reject)=>{const tick=()=>{try{check();draw(source,width,height);const elapsed=performance.now()-start;progress(Math.round((index+Math.min(elapsed/duration,1))/files.length*100));if(elapsed>=duration){resolve();return}setTimeout(tick,33)}catch(error){reject(error)}};tick()});
   if(source instanceof HTMLVideoElement)source.pause();node?.disconnect();recorder.pause();
  }
  recorder.stop();await stopped;if(failure)throw new Error("Không thể hoàn thành video.");const blob=new Blob(chunks,{type:recorder.mimeType});if(!blob.size)throw new Error("Video đầu ra trống.");
  const hash=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());return{blob,extension:mime.startsWith('video/mp4')?'mp4':'webm',evidence:{kind:'local-media-output',bytes:blob.size,sha256:Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join(''),createdAt:new Date().toISOString()}};
 }finally{if(recorder.state!=='inactive')recorder.stop();videos.forEach(video=>{video.pause();video.removeAttribute('src');video.load()});stream.getTracks().forEach(track=>track.stop());await audio.close();urls.forEach(url=>URL.revokeObjectURL(url))}
}
