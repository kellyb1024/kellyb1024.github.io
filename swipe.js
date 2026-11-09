// 가로로 넘기는 줄: 아래에 진행 막대를 달고, 다른 페이지에서 돌아오면 처음으로 되돌린다.
(function () {
  var SEL = '.slides3, .case-wide .zine, .goods, .sq-grid, .hz-stack, .step > .shots, .shots.deck';
  function rows() {
    return Array.prototype.filter.call(document.querySelectorAll(SEL), function (el) {
      return getComputedStyle(el).overflowX === 'auto' || getComputedStyle(el).overflowX === 'scroll';
    });
  }
  function setup() {
    rows().forEach(function (el) {
      var bar = el.nextElementSibling && el.nextElementSibling.classList.contains('swipe-bar') ? el.nextElementSibling : null;
      if (!bar) {
        bar = document.createElement('div'); bar.className = 'swipe-bar'; bar.setAttribute('aria-hidden', 'true');
        bar.appendChild(document.createElement('span'));
        el.parentNode.insertBefore(bar, el.nextSibling);
        el.addEventListener('scroll', function () { update(el, bar); }, { passive: true });
      }
      update(el, bar);
    });
  }
  function update(el, bar) {
    var max = el.scrollWidth - el.clientWidth;
    bar.hidden = max <= 2;
    var w = el.clientWidth / el.scrollWidth;
    var t = bar.firstChild;
    t.style.width = (w * 100) + '%';
    t.style.transform = 'translateX(' + (max > 0 ? (el.scrollLeft / max) * (1 / w - 1) * 100 : 0) + '%)';
  }
  function reset() { rows().forEach(function (el) { el.scrollLeft = 0; }); setup(); }
  window.addEventListener('pageshow', reset);
  window.addEventListener('resize', setup);
  window.addEventListener('load', setup);
  document.addEventListener('DOMContentLoaded', setup);
  if ('scrollRestoration' in history) { /* vertical position stays; horizontal rows reset on pageshow */ }
})();
