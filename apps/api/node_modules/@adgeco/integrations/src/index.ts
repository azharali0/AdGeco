import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export type Money={amountMinor:number;currency:string};
export type ProviderResult<T>={provider:string;reference:string;status:'PENDING'|'SUCCEEDED'|'FAILED';data:T};
export interface PaymentProvider{
 createFunding(input:{idempotencyKey:string;customerReference:string;money:Money;returnUrl:string}):Promise<ProviderResult<{checkoutUrl?:string}>>;
 refund(input:{idempotencyKey:string;paymentReference:string;money?:Money}):Promise<ProviderResult<Record<string,unknown>>>;
 verifyWebhook(input:{rawBody:string;signature:string}):Record<string,unknown>;
}
export interface PayoutProvider{
 createBeneficiary(input:{idempotencyKey:string;legalName:string;country:string;currency:string;bankToken:string}):Promise<ProviderResult<Record<string,unknown>>>;
 sendPayout(input:{idempotencyKey:string;beneficiaryReference:string;money:Money;statementReference:string}):Promise<ProviderResult<Record<string,unknown>>>;
 getPayout(reference:string):Promise<ProviderResult<Record<string,unknown>>>;
}
export interface VerificationProvider{
 createBusinessCheck(input:{idempotencyKey:string;organisationId:string;legalName:string;country:string;registrationNumber?:string;callbackUrl:string}):Promise<ProviderResult<{hostedUrl?:string}>>;
 getCheck(reference:string):Promise<ProviderResult<{decision?:'APPROVED'|'REJECTED'|'REVIEW'}>>;
}
export interface ObjectStorageProvider{
 createUpload(input:{key:string;contentType:string;size:number;checksum:string;expiresInSeconds:number}):Promise<{uploadUrl:string;headers:Record<string,string>;assetUrl:string}>;
 delete(key:string):Promise<void>;
}
export interface ConsentProvider{evaluate(input:{country?:string;tcString?:string;gppString?:string;purposes:string[]}):Promise<{allowed:boolean;reasons:string[];policyVersion:string}>;}
export interface TaxProvider{quote(input:{sellerCountry:string;buyerCountry:string;money:Money;taxId?:string;productCode:string}):Promise<{net:Money;tax:Money;gross:Money;rules:string[]}>;}

const httpConfig=z.object({baseUrl:z.string().url(),apiKey:z.string().min(8),webhookSecret:z.string().min(16),provider:z.string().min(2)});
export class HttpPaymentProvider implements PaymentProvider{
 private readonly cfg:z.infer<typeof httpConfig>;
 constructor(config:z.input<typeof httpConfig>){this.cfg=httpConfig.parse(config);}
 private async call(path:string,body:unknown,idempotencyKey:string){const response=await fetch(`${this.cfg.baseUrl}${path}`,{method:'POST',headers:{authorization:`Bearer ${this.cfg.apiKey}`,'content-type':'application/json','idempotency-key':idempotencyKey},body:JSON.stringify(body)});if(!response.ok)throw new Error(`PAYMENT_PROVIDER_${response.status}`);return response.json() as Promise<Record<string,unknown>>;}
 async createFunding(input:{idempotencyKey:string;customerReference:string;money:Money;returnUrl:string}){const data=await this.call('/funding',input,input.idempotencyKey);return {provider:this.cfg.provider,reference:String(data.reference),status:String(data.status??'PENDING') as 'PENDING',data:{checkoutUrl:data.checkoutUrl?String(data.checkoutUrl):undefined}};}
 async refund(input:{idempotencyKey:string;paymentReference:string;money?:Money}){const data=await this.call('/refunds',input,input.idempotencyKey);return {provider:this.cfg.provider,reference:String(data.reference),status:String(data.status??'PENDING') as 'PENDING',data};}
 verifyWebhook(input:{rawBody:string;signature:string}){const expected=createHmac('sha256',this.cfg.webhookSecret).update(input.rawBody).digest();const actual=Buffer.from(input.signature,'hex');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new Error('INVALID_PROVIDER_SIGNATURE');return JSON.parse(input.rawBody) as Record<string,unknown>;}
}

export class HttpJsonProvider{
 constructor(private readonly baseUrl:string,private readonly apiKey:string,private readonly provider:string){}
 async post(path:string,body:unknown,idempotencyKey:string){const response=await fetch(`${this.baseUrl}${path}`,{method:'POST',headers:{authorization:`Bearer ${this.apiKey}`,'content-type':'application/json','idempotency-key':idempotencyKey},body:JSON.stringify(body)});if(!response.ok)throw new Error(`${this.provider.toUpperCase()}_${response.status}`);return response.json() as Promise<Record<string,unknown>>;}
 async get(path:string){const response=await fetch(`${this.baseUrl}${path}`,{headers:{authorization:`Bearer ${this.apiKey}`}});if(!response.ok)throw new Error(`${this.provider.toUpperCase()}_${response.status}`);return response.json() as Promise<Record<string,unknown>>;}
}

export function requireProductionIntegration(name:string,value:string|undefined,nodeEnv=process.env.NODE_ENV){if(nodeEnv==='production'&&!value)throw new Error(`MISSING_PRODUCTION_INTEGRATION_${name}`);return value;}

export * from './providers.js';
