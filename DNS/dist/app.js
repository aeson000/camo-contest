const DATA={NA:[{key:'NA_C0',id:0,location:'Chicago',url:'login0.wotblitz.com:20016'},{key:'NA_C2',id:2,location:'California',url:'login2.wotblitz.com:20016'},{key:'NA_C3',id:3,location:'São Paulo, Brazil',url:'login3.wotblitz.com:20016'}],EU:[{key:'EU_C0',id:0,location:'Netherlands',url:'login0.wotblitz.eu:20016'},{key:'EU_C3',id:3,location:'Poland',url:'login3.wotblitz.eu:20016'},{key:'EU_C4',id:4,location:'Kazakhstan',url:'login4.wotblitz.eu:20016'}],ASIA:[{key:'SG_C0',id:0,location:'Singapore',url:'login0.wotblitz.asia:20016'},{key:'SG_C1',id:1,location:'Singapore',url:'login1.wotblitz.asia:20016'},{key:'SG_C2',id:2,location:'Japan',url:'login2.wotblitz.asia:20016'},{key:'SG_C3',id:3,location:'Indonesia',url:'login3.wotblitz.asia:20016'}]};
const PLATFORMS=['Windows','macOS','Android','iOS'];
const state={server:'NA',platform:'Windows',clusters:new Set()};
const $=id=>document.getElementById(id);
const hostname=url=>url.split(':')[0];

function renderSingleOptions(){
  $('server-options').innerHTML=Object.keys(DATA).map(name=>`<button type="button" class="choice" role="radio" aria-checked="${state.server===name}" data-server="${name}">${name}</button>`).join('');
  $('platform-options').innerHTML=PLATFORMS.map(name=>`<button type="button" class="choice" role="radio" aria-checked="${state.platform===name}" data-platform="${name}">${name}</button>`).join('');
}
function renderClusters(){
  $('cluster-options').innerHTML=DATA[state.server].map(c=>`<label class="cluster-option"><input type="checkbox" value="${c.key}" ${state.clusters.has(c.key)?'checked':''}><span><strong>${c.key}</strong><small>${c.location}</small></span></label>`).join('');
}
function selected(){return DATA[state.server].filter(c=>state.clusters.has(c.key))}
function renderResults(){
  const items=selected(), list=$('endpoint-list'), copy=$('copy-domains');
  copy.disabled=!items.length;
  list.innerHTML=items.length?items.map(c=>`<div class="endpoint"><div><strong>${c.key}</strong><span class="location">${c.location}</span></div><div class="endpoint-meta"><code>${c.url}</code><small>Cluster ID ${c.id}</small></div></div>`).join(''):'<p class="empty-state">Select at least one cluster to generate your block list.</p>';
}
function platformContent(){
  const domains=selected().map(c=>hostname(c.url));
  const hosts=domains.length?domains.map(d=>`0.0.0.0 ${d}`).join('\n'):'# Select clusters above to generate entries';
  const domainList=domains.length?domains.map(d=>`<code>${d}</code>`).join(''):'<span>Select clusters above to generate domains.</span>';
  if(state.platform==='Windows') return `<details class="guide" open><summary><span class="summary-copy"><strong>Windows hosts file</strong><small>Built in · recommended</small></span><span class="chevron" aria-hidden="true">+</span></summary><div class="guide-content"><ol class="instructions"><li><span>1</span><div><h3>Open Notepad as administrator</h3><p>Find Notepad in Start, right-click it, and choose <strong>Run as administrator</strong>.</p></div></li><li><span>2</span><div><h3>Open the hosts file</h3><p>Open <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code>. Choose “All files” if needed.</p></div></li><li><span>3</span><div><h3>Add these lines and save</h3><div class="code-block">${hosts}</div></div></li><li><span>4</span><div><h3>Apply the change</h3><p>Run <code>ipconfig /flushdns</code> from an administrator Command Prompt, then restart Blitz.</p></div></li></ol></div></details>`;
  if(state.platform==='macOS') return `<details class="guide" open><summary><span class="summary-copy"><strong>macOS hosts file</strong><small>Built in · recommended</small></span><span class="chevron" aria-hidden="true">+</span></summary><div class="guide-content"><ol class="instructions"><li><span>1</span><div><h3>Open the hosts file</h3><p>Open Terminal and edit <code>/etc/hosts</code> with administrator privileges.</p></div></li><li><span>2</span><div><h3>Add these lines</h3><div class="code-block">${hosts}</div></div></li><li><span>3</span><div><h3>Save and apply</h3><p>Save the file, flush the DNS cache or restart your Mac, then restart Blitz.</p></div></li></ol></div></details>`;
  if(state.platform==='Android') return `<details class="guide" open><summary><span class="summary-copy"><strong>RethinkDNS</strong><small>Free Android firewall</small></span><span class="chevron" aria-hidden="true">+</span></summary><div class="guide-content"><ol class="instructions"><li><span>1</span><div><h3>Install RethinkDNS</h3><p>Get the free <a href="https://rethinkdns.com/app" target="_blank" rel="noopener">Rethink DNS + Firewall app</a>.</p></div></li><li><span>2</span><div><h3>Start the firewall</h3><p>Enable the firewall and approve Android’s local VPN connection. It may conflict with another VPN because Android allows only one active VPN service.</p></div></li><li><span>3</span><div><h3>Block the selected domains</h3><p>Add each hostname below to the app’s domain rules, set them to Block, then restart Blitz.</p><div class="inline-domains">${domainList}</div></div></li></ol></div></details>`;
  return `<details class="guide" open><summary><span class="summary-copy"><strong>Lockdown Privacy</strong><small>Free iOS firewall</small></span><span class="chevron" aria-hidden="true">+</span></summary><div class="guide-content"><ol class="instructions"><li><span>1</span><div><h3>Install Lockdown Privacy</h3><p>Install the free <a href="https://lockdownprivacy.com/" target="_blank" rel="noopener">Lockdown Privacy</a> app and enable its on-device Firewall.</p></div></li><li><span>2</span><div><h3>Open the custom block list</h3><p>Under Firewall, open <strong>Block List</strong>, then choose <strong>Custom</strong>.</p></div></li><li><span>3</span><div><h3>Add the selected domains</h3><p>Enter each hostname below, tap <strong>Done</strong>, then tap <strong>Save</strong> and restart Blitz.</p><div class="inline-domains">${domainList}</div></div></li></ol></div></details>`;
}
function renderPlatformGuide(){$('platform-guide').innerHTML=platformContent()}
function renderAll(){renderSingleOptions();renderClusters();renderResults();renderPlatformGuide()}

document.addEventListener('click',e=>{
  const server=e.target.closest('[data-server]'); if(server){state.server=server.dataset.server;state.clusters.clear();renderAll();return}
  const platform=e.target.closest('[data-platform]'); if(platform){state.platform=platform.dataset.platform;renderAll();return}
});
$('cluster-options').addEventListener('change',e=>{if(e.target.matches('input[type=checkbox]')){e.target.checked?state.clusters.add(e.target.value):state.clusters.delete(e.target.value);renderResults();renderPlatformGuide()}});
$('copy-domains').addEventListener('click',async()=>{const domains=selected().map(c=>hostname(c.url)).join('\n');try{await navigator.clipboard.writeText(domains);$('copy-domains').textContent='Copied';setTimeout(()=>$('copy-domains').textContent='Copy domains',1400)}catch{$('copy-domains').textContent='Copy failed'}});
function setConfiguration(input){
  if(!input||!DATA[input.server]||!PLATFORMS.includes(input.platform)||!Array.isArray(input.clusters)) throw new Error('Use a valid server, platform, and cluster array.');
  const valid=new Set(DATA[input.server].map(c=>c.key)); if(input.clusters.some(c=>!valid.has(c))) throw new Error('One or more clusters do not belong to the selected server.');
  state.server=input.server;state.platform=input.platform;state.clusters=new Set(input.clusters);renderAll();
  return {server:state.server,platform:state.platform,clusters:[...state.clusters],domains:selected().map(c=>hostname(c.url))};
}
if(document.modelContext?.registerTool){document.modelContext.registerTool({name:'configure_cluster_blocking',title:'Configure cluster blocking',description:'Select a Blitz server region, device platform, and the clusters to block, then update the visible instructions.',inputSchema:{type:'object',properties:{server:{type:'string',enum:Object.keys(DATA)},platform:{type:'string',enum:PLATFORMS},clusters:{type:'array',items:{type:'string'},uniqueItems:true}},required:['server','platform','clusters'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:setConfiguration}).catch?.(()=>{})}
renderAll();
