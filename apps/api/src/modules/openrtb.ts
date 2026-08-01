import type {FastifyInstance} from 'fastify';
import {bidRequestSchema,noBid} from '@adgeco/openrtb';
import {prisma} from '@adgeco/database';
import {hashToken} from '@adgeco/auth';

export async function registerOpenRtbRoutes(app:FastifyInstance,tokenPepper:string){
 app.post('/openrtb/2.6/bid',async(req,reply)=>{
  const apiKey=String(req.headers['x-openrtb-key']??'');
  if(!apiKey)return reply.code(401).send({code:'OPENRTB_AUTH_REQUIRED'});
  const prefix=apiKey.slice(0,16);
  const registration=await prisma.sdkRegistration.findFirst({where:{publicKeyPrefix:prefix,status:{in:['CERTIFIED','ACTIVE']}}});
  if(!registration||registration.secretHash!==hashToken(`${tokenPepper}:${apiKey}`))return reply.code(401).send({code:'INVALID_OPENRTB_CREDENTIAL'});
  const request=bidRequestSchema.parse(req.body);
  await prisma.outboxEvent.create({data:{organisationId:registration.organisationId,type:'OpenRtbBidRequestAccepted',correlationId:req.id,payload:{requestId:request.id,impressions:request.imp.length,sdkRegistrationId:registration.id}}});
  // Demand fan-out is intentionally explicit: until a certified DSP adapter is configured, return standards-compliant no-bid.
  return reply.code(204).send(noBid(request.id,0));
 });
}
