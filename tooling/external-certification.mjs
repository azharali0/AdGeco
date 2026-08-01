const profiles={
 providers:['PAYMENT_PROVIDER_URL','PAYMENT_PROVIDER_KEY','PAYMENT_WEBHOOK_SECRET','PAYOUT_PROVIDER_URL','PAYOUT_PROVIDER_KEY','VERIFICATION_PROVIDER_URL','VERIFICATION_PROVIDER_KEY','CONSENT_PROVIDER_URL','CONSENT_PROVIDER_KEY','TAX_PROVIDER_URL','TAX_PROVIDER_KEY','OBJECT_STORAGE_UPLOAD_URL','OBJECT_STORAGE_PUBLIC_URL'],
 production:['DATABASE_URL','REDIS_URL','JWT_SECRET','TOKEN_PEPPER','ENCRYPTION_KEY','SERVICE_SECRET','PUBLIC_APP_URL'],
 kubernetes:['KUBECONFIG'],
};
const requested=process.argv.slice(2); const selected=requested.length?requested:Object.keys(profiles);
const missing=[];
for(const profile of selected){if(!profiles[profile]){console.error(`UNKNOWN_PROFILE:${profile}`);process.exit(2)}for(const key of profiles[profile])if(!process.env[key]||/replace|example\.com|local-development|ci-only/i.test(process.env[key]))missing.push(`${profile}:${key}`)}
if(missing.length){console.error(JSON.stringify({status:'blocked',missing},null,2));process.exit(2)}
console.log(JSON.stringify({status:'credential-contract-satisfied',profiles:selected}));
