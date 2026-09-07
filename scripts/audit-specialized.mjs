import fs from 'node:fs';
const nav=fs.readFileSync('components/Nav3Navigator.tsx','utf8');
const sem=fs.readFileSync('components/SemanticSpecializedPanel.tsx','utf8');
const failures=[];
if(!nav.includes('SemanticSpecializedPanel')) failures.push('Nav3Navigator does not render SemanticSpecializedPanel');
for(const x of ['qr-create','external-app','display-output','ai-bill','ai-ticket','ai-sales','device','audio-control','media-render','inventory','orders','event-notice','gift-manage','gift-create','room-create','room-name','graphics-overlay','custom-api','customer-orders','profile']) if(!sem.includes(`"${x}"`)) failures.push(`missing semantic intent ${x}`);
if(/<RuntimeActionPanel[\s\S]{0,300}selected/.test(nav)) failures.push('blind RuntimeActionPanel selected fallback still active');
if(failures.length){console.error('SPECIALIZED AUDIT FAIL');for(const f of failures)console.error('-',f);process.exit(1)}
console.log('SPECIALIZED AUDIT PASS: semantic runtime panel covers recognized functional intents; blind slider fallback disabled.');
