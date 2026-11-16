(function(){
  "use strict";

  var sections=window.PG_BETA_QUESTIONNAIRE||[];
  var select=document.querySelector("#reviewTesterSelect");
  var target=document.querySelector("#questionnaireReview");
  var sync=document.querySelector("#questionnaireReviewSync");
  var rows=[];

  function esc(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  function parse(task){
    try{return JSON.parse(task&&task.notes||"{}")}catch(e){return{}}
  }

  function has(value){return value!=null&&String(value).trim()!==""}
  var latestReviewRows=[];
  function decorateReviewEvidence(){var tester=latestReviewRows[Number(select.value)],explore=tester&&(tester.tasks||[]).find(function(task){return task.pack_key==="explore"});if(!explore)return;target.querySelectorAll(".review-question").forEach(function(article){if(article.querySelector(".admin-evidence"))return;var label=article.querySelector(".review-question-head>span"),match=(label&&label.textContent||"").match(/^Q(\d+)\.(\d+|C)$/);if(!match)return;var key="q"+match[1]+"-"+(match[2]==="C"?"comments":match[2]),items=(explore.evidence||[]).filter(function(item){return item.question_key===key});if(!items.length)return;article.insertAdjacentHTML("beforeend",'<div class="admin-evidence">'+items.map(function(item){return'<a href="/api/beta/admin-evidence/'+encodeURIComponent(item.id)+'" target="_blank" rel="noopener">View evidence · '+esc(item.original_name)+'</a>'}).join("")+'</div>')})}

  function renderTester(tester){
    var explore=(tester.tasks||[]).find(function(task){return task.pack_key==="explore"});
    var answers=parse(explore),html="";
    if(!explore){target.innerHTML='<p class="muted">No questionnaire record exists for this tester.</p>';return}
    sections.forEach(function(section,si){
      var answered=0,total=section[1].length+1,rating=answers["rating-"+(si+1)],items=section[1].map(function(prompt,qi){
        var key="q"+(si+1)+"-"+(qi+1),answer=answers[key],complete=has(answer);
        if(complete)answered++;
        return '<article class="review-question"><div class="review-question-head"><span>Q'+(si+1)+"."+(qi+1)+'</span><strong>'+esc(prompt)+'</strong><b class="'+(complete?"review-complete":"review-pending")+'">'+(complete?"Answered":"Not answered")+'</b></div>'+(complete?'<p class="review-answer">'+esc(answer)+'</p>':'<p class="review-empty">No answer saved.</p>')+'</article>';
      }).join("");
      var commentKey="q"+(si+1)+"-comments",comment=answers[commentKey];
      if(has(comment))answered++;
      items+='<article class="review-question"><div class="review-question-head"><span>Q'+(si+1)+'.C</span><strong>Comments / suggestions / notes</strong><b class="review-complete">'+(has(comment)?"Answered":"Not answered")+'</b></div>'+(has(comment)?'<p class="review-answer">'+esc(comment)+'</p>':'<p class="review-empty">No comments saved.</p>')+'</article>';
      if(has(rating)){answered++;items+='<div class="review-rating">Section rating: <strong>'+esc(rating)+' / 5 stars</strong></div>'}
      html+='<details class="review-section" '+(si===0?"open":"")+'><summary><span>'+esc(section[0])+'</span><small>'+answered+' / '+total+' answered</small></summary><div class="review-question-list">'+items+'</div></details>';
    });
    target.innerHTML='<div class="review-tester-meta"><strong>'+esc(tester.display_name)+'</strong><span>'+esc(tester.username)+'</span><span>Saved '+(explore.saved_at?esc(new Date(explore.saved_at).toLocaleString()):"not yet")+'</span></div>'+html;
  }

  function applyData(data){
    rows=data.testers||[];
    latestReviewRows=rows;
    select.innerHTML=rows.map(function(t,i){return'<option value="'+i+'">'+esc(t.display_name)+" ("+esc(t.username)+")</option>"}).join("");
    if(rows.length)renderTester(rows[0]);
    else target.innerHTML='<p class="muted">No active testers found.</p>';
    sync.textContent="Live data · "+new Date().toLocaleTimeString();
  }

  function showFailure(error){
    var auth=error&&((error.status===401)||(error.status===403));
    sync.textContent=auth?"Admin sign-in required":"Live data unavailable";
    target.innerHTML=auth
      ?'<p class="muted">Please sign in through the tester portal, then open the admin dashboard again.</p>'
      :'<p class="muted">Questionnaire review is temporarily unavailable. <button type="button" class="admin-button secondary" id="questionnaireRetry">Retry</button></p>';
    var retry=document.querySelector("#questionnaireRetry");
    if(retry)retry.onclick=load;
  }

  function load(){
    sync.textContent="Loading live answers…";
    var request=window.PG_BETA_ADMIN_OVERVIEW_LOAD
      ? window.PG_BETA_ADMIN_OVERVIEW_LOAD()
      : fetch("/api/beta/admin-overview",{credentials:"same-origin",cache:"no-store"}).then(function(r){if(!r.ok){var e=new Error();e.status=r.status;throw e}return r.json()});
    request.then(applyData).catch(showFailure);
  }

  select.addEventListener("change",function(){renderTester(rows[Number(select.value)])});
  window.addEventListener("pg-beta-admin-overview",function(event){applyData(event.detail)});
  new MutationObserver(decorateReviewEvidence).observe(target,{childList:true,subtree:true});
  load();
})();
