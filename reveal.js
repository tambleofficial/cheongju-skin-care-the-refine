// Shared reveal + fill effects for THE REFINE (v3).
// IntersectionObserver-driven (this runtime emits no inner scroll signal), with a
// safety timeout that hard-sets the final state so content can never stay hidden.
// Variety comes from the [data-reveal] value (up | scale | line) and [data-clip];
// initial states live in each page's CSS, this only toggles .reveal-in.
(function(){
  window.RefineFX = function(){
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal],[data-clip]'));
    var flowWraps = Array.prototype.slice.call(document.querySelectorAll('[data-flow-wrap]'));
    function fill(w){
      var l = w.querySelector('[data-flow]');
      if(l){ l.style.transition = 'transform 1.9s cubic-bezier(.22,.61,.36,1)'; l.style.transform = 'scaleY(1)'; }
    }
    function showAll(){
      els.forEach(function(e){ e.style.transition = 'none'; e.classList.add('reveal-in'); });
      flowWraps.forEach(fill);
    }
    if(reduce){ showAll(); return function(){}; }
    var io = null;
    if('IntersectionObserver' in window){
      io = new IntersectionObserver(function(ents){
        ents.forEach(function(en){
          if(!en.isIntersecting) return;
          if(en.target.hasAttribute('data-flow-wrap')) fill(en.target);
          else en.target.classList.add('reveal-in');
          io.unobserve(en.target);
        });
      }, { rootMargin:'0px 0px -8% 0px', threshold:0.04 });
      els.forEach(function(e){ io.observe(e); });
      flowWraps.forEach(function(w){ io.observe(w); });
    } else {
      showAll();
    }
    var safety = setTimeout(showAll, 1400);
    return function(){ if(io) io.disconnect(); clearTimeout(safety); };
  };

  // Count-up for [data-count] (fires once when in view).
  window.RefineCount = function(){
    if(!('IntersectionObserver' in window)) return function(){};
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(en){
        if(!en.isIntersecting) return;
        var el = en.target, to = parseFloat(el.getAttribute('data-count'))||0, t0 = null, dur = 1400;
        var suffix = el.getAttribute('data-suffix') || '';
        function step(ts){ if(!t0) t0 = ts; var p = Math.min((ts-t0)/dur,1); var e = 1-Math.pow(1-p,3);
          el.textContent = Math.round(to*e) + suffix; if(p<1) requestAnimationFrame(step); }
        requestAnimationFrame(step); io.unobserve(el);
      });
    }, { threshold:0.4 });
    nodes.forEach(function(n){ io.observe(n); });
    return function(){ io.disconnect(); };
  };
})();