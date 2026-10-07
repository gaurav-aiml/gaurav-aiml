(function () {
  'use strict';

  /* Theme toggle. Saved choice wins; otherwise the system setting applies via CSS. */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  function currentTheme() {
    return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: keep in-memory choice */ }
  });

  /* Project filter. */
  var chips = document.querySelectorAll('.chip');
  var rows = document.querySelectorAll('#projects > li');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.f;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      rows.forEach(function (li) { li.hidden = !(f === 'all' || li.dataset.cat === f); });
    });
  });

  /* Agent loop: search > read > write > critic, then one revision round. */
  var buttons = document.querySelectorAll('#steps button');
  var loop = document.getElementById('loop');
  var status = document.getElementById('status');
  var script = [
    { i: 0, text: 'Finds sources for the topic.' },
    { i: 1, text: 'Opens and scrapes the pages it found.' },
    { i: 2, text: 'Writes a structured first draft.' },
    { i: 3, text: 'Reviews the draft and flags claims the sources do not support.' },
    { i: 2, text: 'Rewrites the flagged sections.', revise: true },
    { i: 3, text: 'Checks the revision and accepts the report.', revise: true }
  ];
  var pos = 0, timer = null;
  function show(step) {
    buttons.forEach(function (b, n) { b.classList.toggle('on', n === step.i); });
    loop.classList.toggle('on', !!step.revise);
    status.textContent = step.text;
  }
  function tick() { pos = (pos + 1) % script.length; show(script[pos]); }
  function start() {
    if (timer || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(tick, 2200);
  }
  function stop() { clearInterval(timer); timer = null; }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      stop();
      var n = Number(b.dataset.i);
      var step = script.filter(function (s) { return s.i === n && !s.revise; })[0];
      pos = script.indexOf(step);
      show(step);
    });
  });
  var fig = document.querySelector('.agent');
  fig.addEventListener('mouseenter', stop);
  fig.addEventListener('mouseleave', start);
  show(script[0]);
  start();

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
