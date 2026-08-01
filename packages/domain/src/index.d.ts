export type AuctionCandidate={id:string,bidMicros:number,floorMicros:number,priority?:number,eligible:boolean};
export function selectAuctionWinner(candidates:AuctionCandidate[]):AuctionCandidate|null;
export function splitRevenue(grossMicros:number,publisherBps:number):{grossMicros:number,publisherMicros:number,platformMicros:number};
export type LedgerLine={accountId:string,direction:'DEBIT'|'CREDIT',amountMicros:number};
export function assertBalancedLedger(lines:LedgerLine[]):true;
export function calculateSettlement(grossMicros:number,withholdingBps:number):{grossMicros:number,withholdingMicros:number,netMicros:number};
export function nextRetryAt(attempt:number,now?:Date):Date;
export function stableIdempotencyKey(parts:(string|number)[]):string;
