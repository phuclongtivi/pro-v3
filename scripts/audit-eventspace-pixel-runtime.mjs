import fs from "node:fs";

const runtime=fs.readFileSync("lib/eventspace-runtime.ts","utf8");
const provider=fs.readFileSync("components/EventSpaceProvider.tsx","utf8");
const event=fs.readFileSync("components/SemanticSpecializedPanel.tsx","utf8");
const navigation=fs.readFileSync("lib/navigation.ts","utf8");
const uiFiles=["components","app"].flatMap(root=>walk(root));
const visible=uiFiles.filter(file=>/\.(tsx|ts)$/.test(file)).map(file=>fs.readFileSync(file,"utf8")).join("\n");
const checks=[
  ["six technical cores",["long-scene","flash-flow","eventspace","media","long-ai","connection"].every(core=>runtime.includes(`\"${core}\"`))],
  ["pixel-domain governor",runtime.includes('domain: "pixel"')&&runtime.includes('transportUnit: "frame"')],
  ["720p/1200p execution plan",runtime.includes('target: "720p" | "1200p"')],
  ["device-aware local execution",runtime.includes("detectDeviceCapability")&&runtime.includes('execution: "local-gpu" | "local-cpu"')],
  ["global button dispatcher",provider.includes('document.addEventListener("click", click)')&&provider.includes('closest("button")')],
  ["event Flash artifact",runtime.includes('kind: "event-flash"')&&event.includes("openEventFlash")&&event.includes("eventFlashPreview")],
  ["runtime result feedback",provider.includes("RuntimeResultToast")],
  ["removed finance branch",!navigation.includes('C("finance"')],
  ["no visible END label",!visible.includes(" · END")&&!visible.includes(">END<")],
];
let ok=true;
for(const [name,pass] of checks){console.log(`${pass?"PASS":"FAIL"} ${name}`);if(!pass)ok=false;}
if(!ok)process.exit(1);
console.log("EVENTSPACE PIXEL RUNTIME AUDIT PASS");

function walk(root){
  return fs.readdirSync(root,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(`${root}/${entry.name}`):[`${root}/${entry.name}`]);
}
