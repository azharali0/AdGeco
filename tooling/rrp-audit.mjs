import {readFile,readdir} from 'node:fs/promises';
const required=['packages/integrations/src/index.ts','packages/openrtb/src/index.ts','apps/api/src/modules/openrtb.ts','apps/web/app/login/page.tsx','apps/web/app/agency/page.tsx','apps/web/app/admin/page.tsx','infrastructure/terraform/main.tf'];
for(const file of required)await readFile(new URL(`../${file}`,import.meta.url));
const server=await readFile(new URL('../apps/api/src/server.ts',import.meta.url),'utf8');if(!server.includes('registerOpenRtbRoutes'))throw new Error('OpenRTB routes are not registered');
const tf=await readFile(new URL('../infrastructure/terraform/main.tf',import.meta.url),'utf8');for(const token of ['aws_db_instance','aws_elasticache_replication_group','aws_s3_bucket','aws_cloudfront_distribution'])if(!tf.includes(token))throw new Error(`Terraform missing ${token}`);
console.log('ADG-RRP-1 repository audit passed');
