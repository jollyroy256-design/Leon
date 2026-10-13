// Public browser configuration only. Never expose a Supabase secret or service-role key.
module.exports = function publicAuthConfig(env = process.env) {
  const url = (env.SUPABASE_URL || '').trim();
  const key = (env.SUPABASE_PUBLISHABLE_KEY || '').trim();
  if (!url && !key) return {url:'',key:'',enabled:false};
  if (!url || !key) throw new Error('Set both SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('SUPABASE_URL must be the HTTPS project origin.');
  let publicKey = key.startsWith('sb_publishable_');
  if (!publicKey && key.split('.').length === 3) {
    try { publicKey = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'anon'; } catch {}
  }
  if (!publicKey) throw new Error('Only a public Supabase publishable or anon key may be used.');
  return {url:parsed.origin,key,enabled:true};
};
