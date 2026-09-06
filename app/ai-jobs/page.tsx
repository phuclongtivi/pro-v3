"use client";
import {useEffect,useState} from "react";
import BrandFooter from "@/components/BrandFooter";
const types=["CHECK_EVENT_HEALTH","GENERATE_EVENT_REPORT","REMIND_GUEST","SUGGEST_ACTION"];
export default function AIJobs(){
 const[jobs,setJobs]=useState<any[]>([]);const[type,setType]=useState(types[0]);
 function user(){let u=localStorage.getItem("long-user-id");if(!u){u=crypto.randomUUID();localStorage.setItem("long-user-id",u)}return u}
 async function load(){const d=await fetch("/api/ai/jobs",{headers:{"x-long-user-id":user()},cache:"no-store"}).then(r=>r.json());if(d.ok)setJobs(d.jobs||[])}
 async function create(){await fetch("/api/ai/jobs",{method:"POST",headers:{"Content-Type":"application/json","x-long-user-id":user()},body:JSON.stringify({jobType:type,requiresApproval:true,payload:{source:"Long App"}})});load()}
 async function act(id:string,op:"approve"|"execute"){await fetch(`/api/ai/jobs/${id}/${op}`,{method:"POST",headers:{"x-long-user-id":user()}});load()}
 useEffect(()=>{load()},[])
 return <main className="page"><section className="hero"><h1>AI Jobs</h1><p>AI làm việc có trạng thái • approval • result</p></section><section className="panel" style={{marginTop:12}}><div className="field"><label>Job</label><select value={type} onChange={e=>setType(e.target.value)}>{types.map(x=><option key={x}>{x}</option>)}</select></div><button className="action" onClick={create}>Tạo AI Job</button></section><section className="grid" style={{marginTop:12}}>{jobs.map(j=><div className="card" key={j.id}><h3>{j.job_type}</h3><p>{j.status}</p><div className="layerbar">{j.status==="pending_approval"&&<button onClick={()=>act(j.id,"approve")}>Approve</button>}{j.status==="queued"&&<button onClick={()=>act(j.id,"execute")}>Execute</button>}</div></div>)}</section><BrandFooter/></main>
}