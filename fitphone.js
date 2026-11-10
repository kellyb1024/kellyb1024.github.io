(function(){
  function fit(){
    document.querySelectorAll('.phone iframe').forEach(function(f){
      var p=f.parentElement, cs=getComputedStyle(p);
      var padL=parseFloat(cs.paddingLeft)||0, padT=parseFloat(cs.paddingTop)||0;
      var w=p.clientWidth-padL*2;
      var desk=p.classList.contains('screen');
      var bw=desk?1280:390, bh=desk?800:844;
      // 11/10: 베젤이 사방 같은 두께가 되게, 폭 기준 배율로 틀 높이를 화면에 정확히 맞춘다
      var k=w/bw;
      p.style.height=(bh*k+padT*2)+'px';
      f.style.position='absolute'; f.style.left=padL+'px'; f.style.top=padT+'px';
      f.style.width=bw+'px'; f.style.height=bh+'px';
      f.style.transformOrigin='0 0'; f.style.transform='scale('+k+')';
      var rad=(desk?8:34)/k; f.style.borderRadius=rad+'px';
      // 11/10: transform이 걸린 iframe은 border-radius 클리핑이 풀릴 수 있어 clip-path로 한 번 더 자름
      f.style.clipPath='inset(0 round '+rad+'px)'; f.style.webkitClipPath='inset(0 round '+rad+'px)';
    });
  }
  window.addEventListener('resize',fit);
  new MutationObserver(fit).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',fit); fit();
})();
