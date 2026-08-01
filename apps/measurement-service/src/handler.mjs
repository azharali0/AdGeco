import {MeasurementLedger,qualifyViewability} from './engine.mjs';
const ledger=new MeasurementLedger();
export async function handle(path,body){if(path==='/events')return ledger.append(body);if(path==='/viewability')return qualifyViewability(body);throw new Error('NOT_FOUND');}
