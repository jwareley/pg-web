import {getSession,json,noStore} from "../../_lib/beta-auth.js";
export async function onRequestGet({request,env}){
 const s=await getSession(request,env);if(!s||s.role!=="admin")return json({error:"Admin access required."},403,noStore);
 const users=await env.DB.prepare("SELECT id,username,display_name FROM beta_users WHERE role='tester' AND active=1 ORDER BY display_name").all();
 const result=[];
 for(const u of users.results){
  const rows=await env.DB.prepare("SELECT t.pack_key,t.task_key,t.title,t.instructions,t.required,COALESCE(r.status,'not_started') status,r.ui_element_code,r.severity,r.reproduction_steps,r.expected_result,r.actual_result,r.notes,r.saved_at,r.submitted_at FROM beta_tasks t LEFT JOIN beta_responses r ON r.task_id=t.id AND r.user_id=? WHERE t.pack_key IN ('common','explore') OR EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=? AND a.pack_key=t.pack_key) ORDER BY t.sort_order,t.id").bind(u.id,u.id).all();
  const time=await env.DB.prepare("SELECT COALESCE(SUM(active_seconds),0) active_seconds,COALESCE(SUM(inactive_seconds),0) inactive_seconds,MAX(last_activity_at) last_activity_at FROM beta_sessions_time WHERE user_id=?").bind(u.id).first();
  const agreement=await env.DB.prepare("SELECT id,stage_key,agreement_version,privacy_version,full_name,email,public_name,adult_confirmed,risk_confirmed,credit_opt_out,application_data,stage_requirements,decision,decline_reason,submitted_at agreed_at,withdrawal_status,completion_status,promo_available_at FROM beta_agreement_records WHERE user_id=? AND stage_key=? ORDER BY id DESC LIMIT 1").bind(u.id,"stage-1").first();
  const tasks=rows.results;result.push({...u,tasks,agreement:agreement||null,active_seconds:time?.active_seconds||0,inactive_seconds:time?.inactive_seconds||0,last_activity_at:time?.last_activity_at||null});
 }
 return json({testers:result},200,noStore);
}
