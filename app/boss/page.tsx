"use client";
import Link from "next/link";
const blocks=[
 ["EVENT LIVE","Video Preview • Event Space • Timeline","/event/demo-live"],
 ["AI / APPROVAL","Jobs • Requests • Human AI roadmap","/ai-jobs"],
 ["STUDIO","Camera • Audio • Flash Flow • Output","/studio"],
 ["DEVICES","iPhone • Studio TV • Mac • Device Mesh","/studio"],
 ["STORE","Orders • Sales • Inventory","/store"],
 ["SYSTEM","Runtime • CPU/GPU/Net • Health","/"]
];
export default function Boss(){return <main className="bossPage"><header className="bossHeader"><div><span>LONG BOSS</span><b>CONTROL CENTER</b></div><div className="bossStatus">SYSTEM ●</div></header><div className="bossGrid">{blocks.map(([a,b,h])=><Link href={h} className="bossBlock" key={a}><h2>{a}</h2><p>{b}</p><div className="bossMeter">● ● ●</div></Link>)}</div><footer className="bossTicker">ALERTS ● AI REQUESTS ● TIMELINE ● DEVICE STATUS</footer></main>}