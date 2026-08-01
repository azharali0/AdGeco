export type AdRequest={placementId:string,deviceId?:string,country?:string,language?:string,consent?:Record<string,unknown>};
export type AdResponse={requestId:string;decisionId?:string;deliveryToken?:string;assetUrl?:string;clickUrl?:string;noFillReason?:string};
export class AdGecoWebClient{
 constructor(private readonly baseUrl:string,private readonly sdkKey:string,private readonly timeoutMs=3000){}
 private async call<T>(path:string,body:unknown):Promise<T>{const response=await fetch(`${this.baseUrl}${path}`,{method:'POST',headers:{'content-type':'application/json','x-adgeco-sdk-key':this.sdkKey},body:JSON.stringify(body),signal:AbortSignal.timeout(this.timeoutMs)});if(!response.ok)throw new Error(`ADGECO_HTTP_${response.status}`);return response.json() as Promise<T>}
 requestAd(request:AdRequest){return this.call<AdResponse>('/v1/exchange/ad-requests',request)}
 trackRender(deliveryToken:string,visiblePercentage:number,durationMs:number){return this.call('/v1/delivery/render',{deliveryToken,visiblePercentage,durationMs})}
 trackVideo(deliveryToken:string,quartile:'START'|'FIRST_QUARTILE'|'MIDPOINT'|'THIRD_QUARTILE'|'COMPLETE'){return this.call('/v1/delivery/video',{deliveryToken,quartile})}
 trackConversion(deliveryToken:string,type:string,valueMicros?:number){return this.call('/v1/measurement/conversions',{deliveryToken,type,valueMicros})}
 async renderImage(container:HTMLElement,response:AdResponse){if(!response.assetUrl)return;const img=document.createElement('img');img.src=response.assetUrl;img.alt='Advertisement';img.loading='eager';img.referrerPolicy='no-referrer';img.addEventListener('load',()=>this.trackRender(response.deliveryToken!,100,1000).catch(()=>undefined));if(response.clickUrl)img.addEventListener('click',()=>{window.location.assign(response.clickUrl!)});container.replaceChildren(img)}
}
