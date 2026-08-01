import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../src/AdGecoClient.cs',import.meta.url),'utf8');
for(const token of ['namespace AdGeco','class AdGecoClient','UnityWebRequest','RequestAd','x-adgeco-sdk-key'])if(!source.includes(token))throw new Error(`Unity SDK missing ${token}`);
console.log('unity-sdk-source-ok');
