const encoder = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
async function digest(value){return crypto.subtle.digest("SHA-256", encoder.encode(value));}
export async function hashPassword(password, salt){const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:encoder.encode(salt),iterations:120000,hash:"SHA-256"},key,256);return b64(bits)}
export async function sessionHash(token){return b64(await digest(token))}
export async function getSession(request,env){const cookie=request.headers.get("Cookie")||"";const match=cookie.match(/(?:^|; )pg_beta_session=([^;]+)/);if(!match)return null;return (await env.DB.prepare("SELECT s.*,u.username,u.display_name,u.role,u.active FROM beta_sessions s JOIN beta_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>datetime('now') AND u.active=1").bind(await sessionHash(match[1])).first())||null}
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json",...headers}})}
export const noStore={"Cache-Control":"no-store"};
