import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
public struct AdGecoRequest:Codable{public let placementId:String;public let userKey:String?;public init(placementId:String,userKey:String?=nil){self.placementId=placementId;self.userKey=userKey}}
public final class AdGecoClient{private let baseURL:URL;private let apiKey:String;private let session:URLSession;public init(baseURL:URL,apiKey:String,session:URLSession = .shared){self.baseURL=baseURL;self.apiKey=apiKey;self.session=session}
 public func requestAd(_ request:AdGecoRequest) async throws -> Data{var urlRequest=URLRequest(url:baseURL.appendingPathComponent("v1/exchange/ad-requests"));urlRequest.httpMethod="POST";urlRequest.setValue("application/json",forHTTPHeaderField:"content-type");urlRequest.setValue(apiKey,forHTTPHeaderField:"x-adgeco-sdk-key");urlRequest.httpBody=try JSONEncoder().encode(request);let(data,response)=try await session.data(for:urlRequest);guard let http=response as? HTTPURLResponse,(200..<300).contains(http.statusCode) else{throw URLError(.badServerResponse)};return data}}
