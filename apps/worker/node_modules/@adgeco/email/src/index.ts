export interface EmailMessage { to:string; subject:string; html:string; text:string; idempotencyKey:string }
export interface EmailProvider { send(message:EmailMessage):Promise<{providerMessageId:string}> }
export class HttpEmailProvider implements EmailProvider {
  constructor(private readonly endpoint:string,private readonly apiKey:string,private readonly from:string){}
  async send(message:EmailMessage){const response=await fetch(this.endpoint,{method:'POST',headers:{authorization:`Bearer ${this.apiKey}`,'content-type':'application/json','idempotency-key':message.idempotencyKey},body:JSON.stringify({from:this.from,to:[message.to],subject:message.subject,html:message.html,text:message.text})});if(!response.ok)throw new Error(`EMAIL_PROVIDER_${response.status}`);const body=await response.json() as {id?:string};return {providerMessageId:body.id??message.idempotencyKey};}
}
export class ConsoleEmailProvider implements EmailProvider { async send(message:EmailMessage){console.info(JSON.stringify({event:'email.development',to:message.to,subject:message.subject,idempotencyKey:message.idempotencyKey}));return {providerMessageId:`dev:${message.idempotencyKey}`};} }
