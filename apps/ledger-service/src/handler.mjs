import {Ledger} from './ledger.mjs';
const ledger=new Ledger();
export async function handle(path,body){if(path==='/accounts'){return ledger.addAccount(body)}if(path==='/entries'){return ledger.post(body)}if(path==='/reversals'){return ledger.reverse(body.entryId,body.reason)}throw new Error('NOT_FOUND');}
