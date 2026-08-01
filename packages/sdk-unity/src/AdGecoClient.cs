using System;using System.Collections;using UnityEngine;using UnityEngine.Networking;
namespace AdGeco { [Serializable] public class AdRequest { public string placementId=""; public string userKey=""; }
public sealed class AdGecoClient { private readonly string baseUrl;private readonly string apiKey;public AdGecoClient(string baseUrl,string apiKey){this.baseUrl=baseUrl.TrimEnd('/');this.apiKey=apiKey;}
 public IEnumerator RequestAd(AdRequest request,Action<string> onSuccess,Action<string> onError){var json=JsonUtility.ToJson(request);using var web=UnityWebRequest.Put(baseUrl+"/v1/exchange/ad-requests",json);web.method="POST";web.SetRequestHeader("content-type","application/json");web.SetRequestHeader("x-adgeco-sdk-key",apiKey);yield return web.SendWebRequest();if(web.result==UnityWebRequest.Result.Success)onSuccess(web.downloadHandler.text);else onError(web.error+": "+web.downloadHandler.text);}}
}
