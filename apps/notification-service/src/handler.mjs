import {renderTemplate} from './notifications.mjs';
export async function handle(path,body){if(path==='/render')return renderTemplate(body.type,body.data);throw new Error('NOT_FOUND');}
