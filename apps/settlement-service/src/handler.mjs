import {prepareSettlement,nextPayoutAttempt} from './settlement.mjs';
export async function handle(path,body){if(path==='/prepare')return prepareSettlement(body);if(path==='/retry')return nextPayoutAttempt(body.attempt,body.errorCode);throw new Error('NOT_FOUND');}
