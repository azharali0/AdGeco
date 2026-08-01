import { spawnSync } from 'node:child_process';
if(!process.env.DATABASE_URL){console.error('DATABASE_URL_REQUIRED');process.exit(2)}
const check=spawnSync('psql',['--version'],{encoding:'utf8'});
if(check.status!==0){console.error('PSQL_REQUIRED_FOR_EXTERNAL_DATABASE_CERTIFICATION');process.exit(2)}
const probes=[
 ['connectivity','select 1;'],
 ['serializable','begin isolation level serializable; select 1; rollback;'],
 ['migration-table',`select count(*) from "_prisma_migrations";`]
];
for(const [name,sql] of probes){const result=spawnSync('psql',[process.env.DATABASE_URL,'-v','ON_ERROR_STOP=1','-Atc',sql],{encoding:'utf8'});if(result.status!==0){console.error(`${name.toUpperCase()}_FAILED\n${result.stderr}`);process.exit(1)}console.log(`${name}:pass`)}
