import fs from 'node:fs';
const nav=fs.readFileSync(new URL('../lib/navigation.ts',import.meta.url),'utf8');
const regPath=new URL('../lib/content-registry.ts',import.meta.url);
const reg=fs.existsSync(regPath)?fs.readFileSync(regPath,'utf8'):'';
const forbidden=['Quản lý AI và Thu-Chi','ai-finance'];
const stale=forbidden.filter(x=>nav.includes(x)||reg.includes(x));
if(stale.length){console.error('FAIL removed branch still exists:',stale.join(', '));process.exit(1)}
const required=['TemplateVideoBuilder','ProductCreateForm','AIFlashWorkspace','MediaConnectionPanel','PaymentCenter','StickerStore','AppearanceCenter'];
const missing=required.filter(x=>!reg.includes(x));
if(missing.length){console.error('FAIL specialized registry missing:',missing.join(', '));process.exit(1)}
console.log('PASS R4 content registry baseline');
console.log('PASS removed AI/Finance branch');
console.log('PASS specialized intents registered:',required.length);
