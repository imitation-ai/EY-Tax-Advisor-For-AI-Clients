import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const config=read('distribution.json'),{surface,version,slug,skill,origin}=config;
if(!['client','expert'].includes(surface)||!/^\d+\.\d+\.\d+$/.test(version))throw new Error('Invalid distribution metadata.');
if(process.env.RELEASE_TAG&&process.env.RELEASE_TAG!==`v${version}`)throw new Error('Release tag must match distribution version.');
const packages=['chatgpt','claude'].map(host=>({dir:`${host}-${surface}`,name:`${slug}-${host}`,manifest:host==='claude'?'.claude-plugin/plugin.json':'plugin.json',files:[host==='claude'?'.claude-plugin/plugin.json':'plugin.json',host==='claude'?'.mcp.json':'mcp.json','ey-logo.jpeg',`skills/${skill}/SKILL.md`]}));
const controlled=surface==='client'&&config.engine==='controlled';
packages.push({dir:surface,name:`${slug}-${controlled?'copilot':'cowork'}`,manifest:'manifest.json',files:controlled?['manifest.json','color.png','outline.png']:['manifest.json','declarativeAgent.json','ai-plugin.json','color.png','outline.png',`skills/${skill}/SKILL.md`]});
const allowed=new Set(packages.flatMap(p=>p.files.map(f=>`packages/${p.dir}/${f}`)));
const walk=dir=>{for(const item of readdirSync(dir,{withFileTypes:true})){const path=resolve(dir,item.name);if(lstatSync(path).isSymbolicLink())throw new Error(`Symlinks are not permitted: ${relative(root,path)}`);if(item.isDirectory())walk(path);else if(!allowed.has(relative(root,path)))throw new Error(`Unexpected plugin file: ${relative(root,path)}`);}};
walk(resolve(root,'packages'));
const forbidden=/-----BEGIN [A-Z ]*PRIVATE KEY-----|\bsk-or-v1-[a-zA-Z0-9]+|\bgh[pousr]_[A-Za-z0-9]{20,}|"(?:clientSecret|client_secret|access_token|refresh_token|password)"\s*:\s*"[^"\s]+"/;
for(const file of allowed){const bytes=readFileSync(resolve(root,file));if(!/\.(png|jpeg)$/.test(file)){if(forbidden.test(bytes.toString()))throw new Error(`Credential pattern found in ${file}`);}if(file.endsWith('SKILL.md')&&!/^---\r?\n/.test(bytes.toString()))throw new Error(`Missing skill metadata: ${file}`);}
for(const pkg of packages){const manifest=read(`packages/${pkg.dir}/${pkg.manifest}`);if(manifest.version!==version)throw new Error(`Version mismatch in ${pkg.dir}`);if(pkg.dir!==surface&&manifest.name!==slug)throw new Error('Unexpected plugin identity.');}
for(const host of ['chatgpt','claude']){const path=`packages/${host}-${surface}/${host==='claude'?'.mcp.json':'mcp.json'}`,servers=read(path).mcpServers;if(Object.keys(servers).length!==1||Object.values(servers)[0].url!==origin+'/mcp')throw new Error(`Unexpected MCP connector: ${path}`);}
for(const [file,key,path] of [['.agents/plugins/marketplace.json','path',`./packages/chatgpt-${surface}`],['.claude-plugin/marketplace.json',null,`./packages/claude-${surface}`]]){const catalog=read(file);if(catalog.name!==slug||catalog.plugins.length!==1||catalog.plugins[0].name!==slug||(key?catalog.plugins[0].source[key]:catalog.plugins[0].source)!==path)throw new Error('Marketplace must expose exactly this app.');}
const manifest=read(`packages/${surface}/manifest.json`),connection=manifest.agentConnectors?.[0]?.toolSource?.remoteMcpServer;
if(controlled) {
 if(manifest.agentConnectors||manifest.agentSkills||manifest.copilotAgents?.declarativeAgents||manifest.copilotAgents?.customEngineAgents?.length!==1||manifest.bots?.length!==1||manifest.bots[0].botId!==manifest.copilotAgents.customEngineAgents[0].id||!manifest.bots[0].scopes.includes('copilot'))throw new Error('The EY client app must use the controlled custom engine exclusively.');
} else {
if(manifest.agentConnectors.length!==1||connection?.mcpServerUrl!==origin+'/mcp'||connection.authorization?.type!=='OAuthPluginVault'||!connection.authorization.referenceId||connection.authorization.referenceId.includes('${'))throw new Error('Unresolved Cowork connector.');
const agent=read(`packages/${surface}/declarativeAgent.json`),plugin=read(`packages/${surface}/ai-plugin.json`);
if(manifest.copilotAgents.declarativeAgents.length!==1||agent.actions.length!==1||!agent.instructions||agent.instructions.length>8000||plugin.runtimes.length!==1||plugin.runtimes[0].spec.url!==connection.mcpServerUrl||plugin.runtimes[0].auth.reference_id!==connection.authorization.referenceId||plugin.runtimes[0].auth.type!=='OAuthPluginVault')throw new Error('Unresolved Copilot Chat app.');
}
const output=resolve(root,'dist');rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});const sums=[];
for(const pkg of packages){const name=`${pkg.name}-${version}.zip`,archive=resolve(output,name);execFileSync('zip',['-q','-X',archive,...pkg.files],{cwd:resolve(root,`packages/${pkg.dir}`)});const members=execFileSync('unzip',['-Z1',archive],{encoding:'utf8'}).trim().split('\n');if(members.length!==pkg.files.length||members.some(f=>!pkg.files.includes(f)))throw new Error(`Unexpected ZIP entries in ${name}`);sums.push(`${createHash('sha256').update(readFileSync(archive)).digest('hex')}  ${name}`);}
writeFileSync(resolve(output,'SHA256SUMS'),sums.join('\n')+'\n');console.log(`Validated and packaged ${config.name}: ${packages.length} host formats, version ${version}.`);
