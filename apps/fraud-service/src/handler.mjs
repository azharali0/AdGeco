import {assessTraffic,supplyChainValid} from './engine.mjs';
export async function handle(path,body){if(path==='/assess')return assessTraffic(body);if(path==='/supply-chain')return {valid:supplyChainValid(body.nodes)};throw new Error('NOT_FOUND');}
