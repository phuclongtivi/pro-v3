import fs from "node:fs";
const file=process.argv[2];
if(!file||!fs.existsSync(file)){console.error("Usage: node scripts/audit-runtime-uniqueness.mjs <runtime-buttons.json>");process.exit(2)}
const rows=JSON.parse(fs.readFileSync(file,"utf8"));
const ids=rows.map(x=>x.actionId).filter(Boolean),missing=rows.filter(x=>!x.actionId),counts=new Map();
for(const id of ids)counts.set(id,(counts.get(id)||0)+1);
const duplicates=[...counts].filter(([,count])=>count>1).map(([actionId,count])=>({actionId,count}));
const result={controls:rows.length,unique:new Set(ids).size,missing:missing.length,duplicates,pass:!missing.length&&!duplicates.length};
console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
