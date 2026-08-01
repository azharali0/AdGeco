import { randomUUID } from 'node:crypto';
type Fields=Record<string,unknown>;
const counters=new Map<string,number>(); const gauges=new Map<string,number>();
function write(level:string,message:string,fields:Fields={}){process.stdout.write(`${JSON.stringify({timestamp:new Date().toISOString(),level,message,...fields})}\n`)}
export const logger={info:(message:string,fields?:Fields)=>write('info',message,fields),warn:(message:string,fields?:Fields)=>write('warn',message,fields),error:(message:string,fields?:Fields)=>write('error',message,fields)};
export function requestId(value?:string){return value?.trim()||randomUUID()}
export function incrementMetric(name:string,value=1){counters.set(name,(counters.get(name)??0)+value)}
export function setGauge(name:string,value:number){gauges.set(name,value)}
export function prometheusMetrics(){const sanitize=(v:string)=>v.replace(/[^a-zA-Z0-9_:]/g,'_');return [...[...counters].map(([k,v])=>`${sanitize(k)}_total ${v}`),...[...gauges].map(([k,v])=>`${sanitize(k)} ${v}`)].join('\n')+'\n'}
