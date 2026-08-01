package com.adgeco.sdk
import java.net.HttpURLConnection
import java.net.URI
import java.nio.charset.StandardCharsets

data class AdRequest(val placementId:String,val userKey:String?=null,val country:String?=null,val deviceType:String?=null)
data class AdResponse(val rawJson:String)
class AdGecoClient(private val apiBaseUrl:String,private val apiKey:String,private val connectTimeoutMs:Int=3000,private val readTimeoutMs:Int=3000){
 fun requestAd(request:AdRequest):AdResponse{val connection=URI.create("$apiBaseUrl/v1/exchange/ad-requests").toURL().openConnection() as HttpURLConnection;connection.requestMethod="POST";connection.connectTimeout=connectTimeoutMs;connection.readTimeout=readTimeoutMs;connection.doOutput=true;connection.setRequestProperty("content-type","application/json");connection.setRequestProperty("x-adgeco-sdk-key",apiKey);val body="{\"placementId\":\"${request.placementId}\"${request.userKey?.let{",\"userKey\":\"$it\""}?:""}}";connection.outputStream.use{it.write(body.toByteArray(StandardCharsets.UTF_8))};val code=connection.responseCode;val stream=if(code in 200..299)connection.inputStream else connection.errorStream;val text=stream.bufferedReader().use{it.readText()};if(code !in 200..299)throw IllegalStateException("AdGeco HTTP $code: $text");return AdResponse(text)}
}
