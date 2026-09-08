import fs from "node:fs";
const studio=fs.readFileSync("components/StudioWorkflowPanel.tsx","utf8");
const sem=fs.readFileSync("components/SemanticSpecializedPanel.tsx","utf8");
const nav=fs.readFileSync("components/Nav3Navigator.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const checks=[
 ["studio export specialized",sem.includes('activeId==="export-video"')&&studio.includes("EVENT VIDEO DOWNLOAD")],
 ["export does not request upload",studio.includes("Export Video never asks you to upload a file here")&&!/mode===\"studio-export\"[\s\S]{0,3000}type=\"file\"/.test(studio)],
 ["Flash Flow source required",sem.includes('activeId==="flash-flow"')&&nav.includes('A("source", "Chọn nguồn"')&&studio.includes("FLASH FLOW SOURCE")],
 ["Flash Flow device file picker",studio.includes('accept="image/*,video/*"')],
 ["room creation sign-in gate",studio.includes("SIGN-IN REQUIRED")&&studio.includes("disabled={!auth||!name.trim()}")],
 ["mixer persistence sign-in gate",studio.includes("MIXER RUNTIME")&&studio.includes("disabled={persistentBlocked}")],
 ["temporary mixer apply allowed",studio.includes("Áp dụng tạm thời")],
 ["Tree5 divider removed",css.includes("FIXFLOW3-R4B3 STUDIO LOGIC + FINAL POLISH")&&css.includes("border-top:0!important")],
];
let ok=true;for(const [n,p] of checks){console.log(`${p?"PASS":"FAIL"} ${n}`);if(!p)ok=false;}if(!ok)process.exit(1);console.log("STUDIO LOGIC AUDIT PASS");
