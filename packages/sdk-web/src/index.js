export class AdGecoWebClient {
    baseUrl;
    sdkKey;
    timeoutMs;
    constructor(baseUrl, sdkKey, timeoutMs = 3000) {
        this.baseUrl = baseUrl;
        this.sdkKey = sdkKey;
        this.timeoutMs = timeoutMs;
    }
    async call(path, body) { const response = await fetch(`${this.baseUrl}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-adgeco-sdk-key': this.sdkKey }, body: JSON.stringify(body), signal: AbortSignal.timeout(this.timeoutMs) }); if (!response.ok)
        throw new Error(`ADGECO_HTTP_${response.status}`); return response.json(); }
    requestAd(request) { return this.call('/v1/exchange/ad-requests', request); }
    trackRender(deliveryToken, visiblePercentage, durationMs) { return this.call('/v1/delivery/render', { deliveryToken, visiblePercentage, durationMs }); }
    trackVideo(deliveryToken, quartile) { return this.call('/v1/delivery/video', { deliveryToken, quartile }); }
    trackConversion(deliveryToken, type, valueMicros) { return this.call('/v1/measurement/conversions', { deliveryToken, type, valueMicros }); }
    async renderImage(container, response) { if (!response.assetUrl)
        return; const img = document.createElement('img'); img.src = response.assetUrl; img.alt = 'Advertisement'; img.loading = 'eager'; img.referrerPolicy = 'no-referrer'; img.addEventListener('load', () => this.trackRender(response.deliveryToken, 100, 1000).catch(() => undefined)); if (response.clickUrl)
        img.addEventListener('click', () => { window.location.assign(response.clickUrl); }); container.replaceChildren(img); }
}
