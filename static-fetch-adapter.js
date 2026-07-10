(function(){
'use strict';
var fixtures=window.__YESSKIN_STATIC_API__||{},meta=window.__YESSKIN_STATIC_META__||{};
var gate={automaticSendAllowed:false,remoteWriteAllowed:false,customerFacingPublishAllowed:false};
var originalFetch=window.fetch.bind(window);
if(!location.hash&&/(?:^|\/)index\.html$/.test(location.pathname))location.hash='customers';
function res(body,status){return Promise.resolve(new Response(JSON.stringify(body),{status:status||200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}}))}
function keyFor(url){
 var exact=url.pathname+url.search;if(Object.prototype.hasOwnProperty.call(fixtures,exact))return exact;
 if(url.pathname==='/api/customer-archive-fixtures/live')return url.searchParams.get('customerId')?'/api/customer-archive-fixtures/live?limit=1&customerId='+encodeURIComponent(url.searchParams.get('customerId')):'/api/customer-archive-fixtures/live?limit=20&summaryOnly=1';
 if(url.pathname==='/api/p7/live/tasks/directory')return '/api/p7/live/tasks/directory?page=1&pageSize=50';
 if(url.pathname==='/api/p7/live/tasks/detail')return '/api/p7/live/tasks/detail?customerId='+encodeURIComponent(url.searchParams.get('customerId')||meta.customerId);
 if(url.pathname==='/api/lifecycle/archive-challenges')return '/api/lifecycle/archive-challenges?customerId='+encodeURIComponent(meta.customerId);
 if(url.pathname==='/api/h5-summary/visual-detection/initial-data')return '/api/h5-summary/visual-detection/initial-data';
 if(url.pathname==='/api/ops-dashboard/pack')return '/api/ops-dashboard/pack?scope=live';
 return Object.prototype.hasOwnProperty.call(fixtures,url.pathname)?url.pathname:'';
}
function local(path,init){var raw={};try{raw=JSON.parse(init&&init.body||'{}')}catch(e){}
 if(path==='/api/backend/advisor-script/field-summaries')return {ok:true,summary:'敏感屏障型',summarySource:'static_replay',modelCall:{status:'static_replay',outputAccepted:true},safetyBoundary:gate};
 if(path==='/api/backend/advisor-script/runs'||path==='/api/backend/advisor-script/revisions')return {ok:true,runId:'STATIC_C5_REPLAY',run:{runId:'STATIC_C5_REPLAY',output:{advisorScript:{finalScriptText:'林女士您好，我是顾问。想温和关心一下您最近的肤况和护理节奏；如果方便，您可以告诉我近期感受，我先帮您整理，再由顾问和医生一起判断是否需要安排复盘。'}}},safetyBoundary:gate};
 if(path==='/api/h5-summary/images'){var image=raw.imageBase64||'';return {ok:true,data:{id:'STATIC_H5_IMAGE',downloadUrl:image,imageBase64:image},safetyBoundary:gate}}
 if(path==='/api/backend/advisor-script/prompt-source')return {ok:true,promptText:'静态演示沿用当前 C5 顾问话术提示词框架；所有生成均为本地回放。',source:'static_replay',safetyBoundary:gate};
 return {ok:true,status:'static_replay',message:'静态演示已在本地记录；未连接真实服务。',data:raw,safetyBoundary:gate,gates:gate}
}
window.fetch=function(input,init){var raw=typeof input==='string'?input:(input&&input.url)||'',url;try{url=new URL(raw,location.href)}catch(e){return res({ok:false,error:'invalid_static_url'},400)}
 var method=String((init&&init.method)||(input&&input.method)||'GET').toUpperCase();
 if(url.pathname.startsWith('/api/')){if(method!=='GET')return res(local(url.pathname,init));var key=keyFor(url);if(key&&Object.prototype.hasOwnProperty.call(fixtures,key))return res(fixtures[key]);if(url.pathname==='/api/backend/advisor-script/prompt-source')return res(local(url.pathname,init));return res({ok:true,items:[],events:[],message:'静态演示未连接真实接口。',safetyBoundary:gate,gates:gate})}
 if(url.protocol==='file:'||url.origin===location.origin||url.protocol==='data:'||url.protocol==='blob:')return originalFetch(input,init);
 return res({ok:false,error:'static_network_blocked',message:'静态演示禁止访问网络。'},404)
};
})();
