import {json,noStore} from "../../_lib/beta-auth.js";
const MAX_LOG_BYTES=10*1024*1024;
function headers(){return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, X-PG-Beta-Report-Key"}}
export async function onRequestOptions(){return new Response(null,{status:204,headers:headers()})}
export async function onRequestPost({request,env}){
 if(!env.BETA_REPORT_KEY||request.headers.get("X-PG-Beta-Report-Key")!==env.BETA_REPORT_KEY)return json({error:"Incident reporting is not enabled for this build."},403,{...noStore,...headers()});
 const form=await request.formData().catch(()=>null);if(!form)return json({error:"Invalid incident report."},400,{...noStore,...headers()});
 const incidentNumber=String(form.get("incidentNumber")||"").trim(),log=form.get("log");
 if(!incidentNumber)return json({error:"Incident number is required."},400,{...noStore,...headers()});
 if(!(log instanceof File)||log.size<1||log.size>MAX_LOG_BYTES)return json({error:"A log file up to 10 MB is required."},400,{...noStore,...headers()});
 const metadata=String(form.get("metadata")||new URL(request.url).searchParams.get("metadata")||"");if(metadata.length>20000)return json({error:"Incident metadata is too large."},400,{...noStore,...headers()});
 const reportId=crypto.randomUUID(),safeName=log.name.replace(/[^a-zA-Z0-9._-]/g,"_"),objectKey=`beta-incidents/${new Date().toISOString().slice(0,10)}/${reportId}/${safeName}`;
 try{await env.EVIDENCE.put(objectKey,log.stream(),{httpMetadata:{contentType:log.type||"text/plain"},customMetadata:{incidentNumber}});const result=await env.DB.prepare("INSERT INTO beta_incident_reports (incident_number,description,app_metadata,log_object_key,log_original_name,log_content_type,log_size_bytes) VALUES (?,?,?,?,?,?,?)").bind(incidentNumber,"",metadata||null,objectKey,log.name,log.type||"application/octet-stream",log.size).run();return new Response(JSON.stringify({ok:true,reportId:String(result.meta?.last_row_id||reportId)}),{status:201,headers:{"Content-Type":"application/json",...noStore,...headers()}})}catch(error){await env.EVIDENCE.delete(objectKey).catch(()=>{});return json({error:"Incident report could not be saved."},500,{...noStore,...headers()})}
}
