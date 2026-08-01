import {aggregateCampaign,csv} from './reporting.mjs';
export async function handle(path,body){if(path==='/aggregate')return aggregateCampaign(body.rows||[]);if(path==='/csv')return {contentType:'text/csv',body:csv(body.headers,body.rows)};throw new Error('NOT_FOUND');}
