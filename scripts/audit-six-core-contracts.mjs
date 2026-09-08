import fs from "node:fs";
const registry=JSON.parse(fs.readFileSync("reports/action-registry.json","utf8"));
const coverage=JSON.parse(fs.readFileSync("reports/action-coverage.json","utf8"));
const order=["eventspace","connection","long-ai","long-scene","flash-flow","media"],failures=[];
if(registry.contracts.length!==coverage.totals.controls)failures.push("registry/coverage count mismatch");
for(const contract of registry.contracts){if(!contract.actionId||!contract.name||!contract.intent)failures.push(`${contract.actionId}: missing identity/content`);if(contract.inputSchema!=="long-action-input/v1"||contract.outputSchema!=="long-action-result/v1")failures.push(`${contract.actionId}: missing input/output schema`);if(contract.receiptSchema!=="long-six-core-envelope/v1")failures.push(`${contract.actionId}: wrong receipt schema`);if(contract.sixCorePlan?.length!==6||contract.sixCorePlan.some((step,index)=>step.core!==order[index]||step.receiptRequired!==true))failures.push(`${contract.actionId}: invalid six-core plan`);if(!contract.workflowLinks?.previous||!contract.workflowLinks?.next)failures.push(`${contract.actionId}: missing workflow links`);if(/unconfigured/i.test(JSON.stringify(contract)))failures.push(`${contract.actionId}: unconfigured marker`)}
if(failures.length){console.error(failures.join("\n"));process.exit(1)}
console.log(`SIX-CORE CONTRACT AUDIT PASS: ${registry.contracts.length}/${coverage.totals.controls} actions.`);
