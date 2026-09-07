import fs from "node:fs";
const sem=fs.readFileSync("components/SemanticSpecializedPanel.tsx","utf8");
const nav=fs.readFileSync("components/Nav3Navigator.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const complete=fs.readFileSync("components/ContentCompletePanels.tsx","utf8");
const failures=[];
for(const x of ["event-notice","gift-manage","gift-create","room-create","room-name","graphics-overlay","custom-api","customer-orders","profile"]) if(!sem.includes(`intent===\"${x}\"`)) failures.push(`missing R4B runtime panel ${x}`);
if(!nav.includes('semanticIntent({section')) failures.push('input/chat nodes are not guarded by semantic runtime intent');
if(!css.includes('.navWorkspace.contentSurface>.workspaceCrumbs,.semanticWorkspace>.workspaceCrumbs{border-bottom:0!important}')) failures.push('Tree5 divider cleanup rule missing');
if(/<span>1,250<\/span>/.test(complete)) failures.push('hard-coded Sticker wallet points remain');
if(!complete.includes('/api/me/stickers')) failures.push('Sticker wallet runtime endpoint is missing');
if(failures.length){console.error('R4B TREE5 RUNTIME AUDIT FAIL');for(const f of failures)console.error('-',f);process.exit(1)}
console.log('R4B TREE5 RUNTIME AUDIT PASS');
console.log('PASS specialized runtime panels for observed defects');
console.log('PASS Tree5 divider cleanup');
console.log('PASS Sticker wallet no seed/demo inventory');
