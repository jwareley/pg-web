import {getSession,json,noStore} from "../../_lib/beta-auth.js";
export async function onRequestGet({request,env}){const s=await getSession(request,env);return s?json({user:{username:s.username,displayName:s.display_name,role:s.role}},200,noStore):json({user:null},401,noStore)}
