import { createHash } from 'node:crypto';
export function selectAuctionWinner(candidates){
  const eligible=candidates.filter(c=>c.eligible&&Number.isSafeInteger(c.bidMicros)&&c.bidMicros>=c.floorMicros);
  eligible.sort((a,b)=>(b.priority??0)-(a.priority??0)||b.bidMicros-a.bidMicros||a.id.localeCompare(b.id));
  return eligible[0]??null;
}
export function splitRevenue(grossMicros,publisherBps){
  if(!Number.isSafeInteger(grossMicros)||grossMicros<0)throw new Error('INVALID_GROSS');
  if(!Number.isInteger(publisherBps)||publisherBps<0||publisherBps>10000)throw new Error('INVALID_REVENUE_SHARE');
  const publisherMicros=Math.floor(grossMicros*publisherBps/10000);
  return {grossMicros,publisherMicros,platformMicros:grossMicros-publisherMicros};
}
export function assertBalancedLedger(lines){
  if(!Array.isArray(lines)||lines.length<2)throw new Error('LEDGER_REQUIRES_TWO_LINES');
  const debit=lines.filter(l=>l.direction==='DEBIT').reduce((s,l)=>s+l.amountMicros,0);
  const credit=lines.filter(l=>l.direction==='CREDIT').reduce((s,l)=>s+l.amountMicros,0);
  if(!Number.isSafeInteger(debit)||!Number.isSafeInteger(credit)||debit!==credit)throw new Error('UNBALANCED_LEDGER');
  if(lines.some(l=>!Number.isSafeInteger(l.amountMicros)||l.amountMicros<=0))throw new Error('INVALID_LEDGER_AMOUNT');
  return true;
}
export function calculateSettlement(grossMicros,withholdingBps){
  if(!Number.isSafeInteger(grossMicros)||grossMicros<0)throw new Error('INVALID_GROSS');
  if(!Number.isInteger(withholdingBps)||withholdingBps<0||withholdingBps>10000)throw new Error('INVALID_WITHHOLDING');
  const withholdingMicros=Math.floor(grossMicros*withholdingBps/10000);
  return {grossMicros,withholdingMicros,netMicros:grossMicros-withholdingMicros};
}
export function nextRetryAt(attempt,now=new Date()){
  if(!Number.isInteger(attempt)||attempt<1)throw new Error('INVALID_ATTEMPT');
  const minutes=Math.min(24*60,2**(attempt-1)*5);
  return new Date(now.getTime()+minutes*60_000);
}
export function stableIdempotencyKey(parts){return createHash('sha256').update(parts.map(String).join('\u001f')).digest('hex');}
