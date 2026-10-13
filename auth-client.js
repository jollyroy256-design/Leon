import { createClient } from '@supabase/supabase-js';

const config = window.LEON_AUTH || {enabled:false};
const client = config.enabled ? createClient(config.url, config.key, {
  auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
}) : null;
const form = document.querySelector('#account-form');
const fields = document.querySelector('#account-fields');
const title = document.querySelector('#account-title');
const status = document.querySelector('#account-status');
const email = document.querySelector('#account-email');
const password = document.querySelector('#account-password');
const confirmation = document.querySelector('#account-confirm');
const name = document.querySelector('#account-name');
const details = document.querySelector('#account-details');
const submit = document.querySelector('#account-submit');
const route = location.pathname;
let mode = route.includes('sign-up') ? 'signup' : route.includes('reset-password') ? 'reset' : 'signin';
let recoveryReady = false;
let busy = false;
let ready = false;
const labels = {
  signin:['Welcome back.','Sign in to your LEON account.','Sign in'],
  signup:['Start your next chapter.','Create your LEON account.','Create account'],
  reset:['Forgot your password?','Enter your email and we’ll send a reset link.','Send reset link'],
  update:['Choose a new password.','Set a new password for your LEON account.','Update password']
};
function showStatus(message, type='error') {
  if (!status) return;
  status.textContent=message; status.className=type;
}
function displayRow(id, visible) {
  const row=document.querySelector(id);row.hidden=!visible;
  row.querySelectorAll('input').forEach(input=>{input.disabled=!visible;input.required=visible;});
}
function renderForm() {
  if (!form) return;
  const [heading,intro,action]=labels[mode];
  document.title=`${mode==='signup'?'Sign up':mode==='reset'||mode==='update'?'Reset password':'Sign in'} | LEON`;
  title.textContent=heading;document.querySelector('#account-intro').textContent=intro;
  form.hidden=false;details.hidden=true;document.querySelector('.account-tabs').hidden=false;
  document.querySelectorAll('[data-auth-tab]').forEach(a=>a.dataset.authTab===mode?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  displayRow('#account-name-row',mode==='signup');
  displayRow('#account-email-row',mode!=='update');
  displayRow('#account-password-row',mode!=='reset');
  displayRow('#account-confirm-row',mode==='signup'||mode==='update');
  document.querySelector('#forgot-password').hidden=mode!=='signin';
  document.querySelector('#password-guidance').hidden=mode==='signin'||mode==='reset';
  password.autocomplete=mode==='signin'?'current-password':'new-password';
  if(mode==='signup'||mode==='update')password.minLength=12;else password.removeAttribute('minlength');
  submit.textContent=action;
  fields.disabled=!client||!ready||busy;
}
function renderUser(user) {
  document.querySelectorAll('[data-auth-link]').forEach(a=>{a.textContent=user?'My account':'Sign in';a.href=user?'/account.html':'/sign-in.html';});
  document.querySelectorAll('[data-auth-signup]').forEach(a=>a.hidden=Boolean(user));
  if (!form || !user || mode==='update' || mode==='reset') return;
  title.textContent='Your LEON account.';document.title='My account | LEON';
  document.querySelector('#account-intro').textContent='You’re signed in. Explore roles or speak with our team.';
  document.querySelector('.account-tabs').hidden=true;form.hidden=true;details.hidden=false;
  document.querySelector('#account-user-email').textContent=user.email||'';
  password.value='';confirmation.value='';
}
function friendlyError(error) {
  const code=error?.code;
  if(code==='invalid_credentials')return 'The email or password is incorrect. Please try again.';
  if(code==='email_not_confirmed')return 'Please confirm your email using the link in your inbox before signing in.';
  if(code==='weak_password')return 'Choose a stronger password with at least 12 characters.';
  if(code==='over_email_send_rate_limit'||code==='over_request_rate_limit'||error?.status===429)return 'Too many attempts. Please wait a few minutes and try again.';
  if(code==='same_password')return 'Choose a password different from your current password.';
  if(code==='user_already_exists')return 'Unable to create this account. Try signing in or resetting your password.';
  return 'Account access could not be completed. Please check your connection and try again.';
}
async function refreshUser() {
  if (!client) return;
  try {
    const {data:{session},error:sessionError}=await client.auth.getSession();
    if(sessionError)throw sessionError;
    if(!session) { if(form){renderForm();} renderUser(null);return; }
    const {data:{user},error}=await client.auth.getUser();
    if(error)throw error;
    renderUser(user);
  } catch(error) {
    if(form)showStatus(friendlyError(error));
  }
}
if(form) {
  renderForm();
  document.querySelector('#account-availability').hidden=Boolean(client);
  document.querySelectorAll('[data-password-toggle]').forEach(button=>button.addEventListener('click',()=>{
    const input=document.getElementById(button.dataset.passwordToggle);
    const reveal=input.type==='password';input.type=reveal?'text':'password';
    button.textContent=reveal?'Hide':'Show';button.setAttribute('aria-pressed',String(reveal));
    button.setAttribute('aria-label',`${reveal?'Hide':'Show'} ${input===confirmation?'confirmation password':'password'}`);
  }));
  [password,confirmation].forEach(input=>input.addEventListener('input',()=>confirmation.setCustomValidity('')));
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!client||!ready||busy)return;
    if((mode==='signup'||mode==='update')&&password.value!==confirmation.value){confirmation.setCustomValidity('Passwords do not match.');confirmation.reportValidity();return;}
    if(!form.reportValidity())return;
    const action=mode;
    busy=true;fields.disabled=true;submit.textContent='Please wait…';showStatus('');
    try {
      if(action==='signup') {
        const {data,error}=await client.auth.signUp({email:email.value.trim(),password:password.value,options:{data:{full_name:name.value.trim()},emailRedirectTo:`${location.origin}/account.html`}});
        if(error)throw error;
        password.value='';confirmation.value='';
        if(data.session){await refreshUser();}else showStatus('Check your email for the next step. If you already have an account, sign in instead.','success');
      } else if(action==='signin') {
        const {error}=await client.auth.signInWithPassword({email:email.value.trim(),password:password.value});
        if(error)throw error;
        await refreshUser();
      } else if(action==='reset') {
        const {error}=await client.auth.resetPasswordForEmail(email.value.trim(),{redirectTo:`${location.origin}/reset-password.html`});
        if(error)throw error;
        showStatus('If an account exists for this email, you’ll receive a reset link. Check your inbox and spam folder.','success');
      } else if(action==='update') {
        if(!recoveryReady)throw new Error('Recovery session required');
        const {error}=await client.auth.updateUser({password:password.value});
        if(error)throw error;
        recoveryReady=false;mode='signin';password.value='';confirmation.value='';
        await refreshUser();showStatus('Your password has been updated.','success');
      }
    } catch(error) { showStatus(friendlyError(error)); }
    finally {busy=false;fields.disabled=!client||!ready;submit.textContent=labels[mode][2];}
  });
  document.querySelector('#account-signout').addEventListener('click',async event=>{
    const button=event.currentTarget;
    button.disabled=true;
    let error;
    try { ({error}=await client.auth.signOut({scope:'local'})); }
    catch(failure) { error=failure; }
    finally { button.disabled=false; }
    if(error){showStatus(friendlyError(error));return;}
    mode='signin';renderForm();renderUser(null);showStatus('You’ve signed out.','success');
  });
}
if(client) {
  client.auth.onAuthStateChange(event=>{
    if(event==='PASSWORD_RECOVERY'&&form){recoveryReady=true;mode='update';renderForm();}
    if(event==='SIGNED_OUT'&&form){recoveryReady=false;mode='signin';renderForm();}
    // Defer provider calls until the auth callback releases its lock.
    setTimeout(()=>refreshUser(),0);
  });
  client.auth.getSession().then(({error})=>{
    ready=true;
    if(form){renderForm();if(error)showStatus('This link may have expired. Request a new reset link or try signing in.');}
    return refreshUser();
  }).catch(()=>{ready=true;if(form){renderForm();showStatus('Account access is unavailable. Please try again.');}});
}
