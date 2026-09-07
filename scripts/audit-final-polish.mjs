import fs from "node:fs";
const css=fs.readFileSync("app/globals.css","utf8");
const nav=fs.readFileSync("components/Nav3Navigator.tsx","utf8");
const sem=fs.readFileSync("components/SemanticSpecializedPanel.tsx","utf8");
const checks=[
 ["polish marker",css.includes("FIXFLOW3-R4B2 FINAL POLISH")],
 ["Tree5 crumb divider disabled",css.includes(".workspaceCrumbs{border-bottom:0!important")],
 ["nested semantic crumbs hidden",css.includes(".semanticPanel>.workspaceCrumbs")],
 ["mobile safe-area actions",css.includes("env(safe-area-inset-bottom)")],
 ["technical Input END label removed",!nav.includes("Input → END")],
 ["generic Apply END wording removed",!sem.includes('"Áp dụng · END"')],
];
let ok=true;for(const [name,pass] of checks){console.log(`${pass?"PASS":"FAIL"} ${name}`);if(!pass)ok=false;}if(!ok)process.exit(1);console.log("FINAL POLISH AUDIT PASS");
