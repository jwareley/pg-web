import {getSession,json,noStore} from "../../_lib/beta-auth.js";

export async function onRequestGet({request,env}){
  const s=await getSession(request,env);
  if(!s)return json({error:"Sign in required."},401,noStore);
  const rows=await env.DB.prepare("SELECT t.pack_key,t.task_key,t.title,t.instructions,t.required,COALESCE(r.status,'not_started') status,r.ui_element_code,r.severity,r.reproduction_steps,r.expected_result,r.actual_result,r.notes,r.saved_at,r.submitted_at FROM beta_tasks t LEFT JOIN beta_responses r ON r.task_id=t.id AND r.user_id=? WHERE t.pack_key IN ('common','explore') OR EXISTS (SELECT 1 FROM beta_assignments a WHERE a.user_id=? AND a.pack_key=t.pack_key) ORDER BY t.sort_order,t.id").bind(s.user_id,s.user_id).all();
  return json({tasks:rows.results},200,noStore);
}
