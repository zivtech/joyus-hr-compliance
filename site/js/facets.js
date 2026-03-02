(function () {
  'use strict';

  var FACETS = ['jurisdiction', 'type', 'status'];
  var LABELS = { jurisdiction: 'Jurisdiction', type: 'Law Type', status: 'Status' };
  var active = { jurisdiction: new Set(), type: new Set(), status: new Set() };

  var bar, list, cards, countText, clearBtn, emptyMsg, panels = {};

  function init() {
    bar = document.getElementById('facet-bar');
    list = document.querySelector('.reg-list');
    if (!bar || !list) return;

    cards = Array.from(list.querySelectorAll('.reg-card'));
    countText = document.getElementById('facet-count-text');
    clearBtn = document.getElementById('facet-clear');
    emptyMsg = document.getElementById('facet-empty');

    readURL();
    buildUI();
    applyFilters();

    clearBtn.addEventListener('click', function () {
      FACETS.forEach(function (f) { active[f].clear(); });
      syncCheckboxes();
      applyFilters();
      writeURL();
    });

    document.addEventListener('click', function (e) {
      FACETS.forEach(function (f) {
        var group = panels[f].closest('.facet-group');
        if (!group.contains(e.target)) closePanel(f);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') FACETS.forEach(closePanel);
    });

    window.addEventListener('popstate', function () {
      readURL();
      syncCheckboxes();
      applyFilters();
    });
  }

  function buildUI() {
    FACETS.forEach(function (facet) {
      var values = extractValues(facet);
      var group = bar.querySelector('[data-facet="' + facet + '"]');
      var toggle = group.querySelector('.facet-group-toggle');
      var panel = group.querySelector('.facet-group-panel');
      panels[facet] = panel;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = panel.classList.contains('is-open');
        FACETS.forEach(closePanel);
        if (!isOpen) openPanel(facet);
      });

      if (facet === 'jurisdiction' && values.length > 10) {
        var search = document.createElement('input');
        search.type = 'text';
        search.className = 'facet-search';
        search.placeholder = 'Filter jurisdictions\u2026';
        search.addEventListener('input', function () {
          var q = search.value.toLowerCase();
          var opts = panel.querySelectorAll('.facet-option');
          opts.forEach(function (opt) {
            var label = opt.querySelector('.facet-option-label').textContent.toLowerCase();
            opt.style.display = label.indexOf(q) !== -1 ? '' : 'none';
          });
        });
        panel.appendChild(search);
      }

      values.forEach(function (v) {
        var opt = document.createElement('label');
        opt.className = 'facet-option';

        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = v.value;
        cb.dataset.facet = facet;
        if (active[facet].has(v.value)) cb.checked = true;
        cb.addEventListener('change', function () {
          if (cb.checked) active[facet].add(v.value);
          else active[facet].delete(v.value);
          applyFilters();
          writeURL();
        });

        var span = document.createElement('span');
        span.className = 'facet-option-label';
        span.textContent = v.value;

        var count = document.createElement('span');
        count.className = 'facet-option-count';
        count.dataset.facetValue = v.value;
        count.dataset.facetKey = facet;
        count.textContent = v.count;

        opt.appendChild(cb);
        opt.appendChild(span);
        opt.appendChild(count);
        panel.appendChild(opt);
      });
    });
  }

  function extractValues(facet) {
    var map = {};
    cards.forEach(function (c) {
      var val = c.dataset[facet];
      if (val) map[val] = (map[val] || 0) + 1;
    });
    var arr = Object.keys(map).map(function (k) { return { value: k, count: map[k] }; });
    if (facet === 'status') {
      var order = ['active', 'pending', 'expired', 'repealed', 'superseded'];
      arr.sort(function (a, b) { return order.indexOf(a.value) - order.indexOf(b.value); });
    } else {
      arr.sort(function (a, b) { return a.value.localeCompare(b.value); });
    }
    return arr;
  }

  function applyFilters() {
    var visible = 0;
    cards.forEach(function (card) {
      var match = FACETS.every(function (f) {
        if (active[f].size === 0) return true;
        return active[f].has(card.dataset[f]);
      });
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    countText.textContent = 'Showing ' + visible + ' of ' + cards.length + ' regulations';
    clearBtn.hidden = FACETS.every(function (f) { return active[f].size === 0; });
    emptyMsg.style.display = visible === 0 ? 'block' : 'none';

    updateCounts();
    updateToggleLabels();
  }

  function updateCounts() {
    FACETS.forEach(function (facet) {
      var counts = {};
      cards.forEach(function (card) {
        var otherMatch = FACETS.every(function (f) {
          if (f === facet) return true;
          if (active[f].size === 0) return true;
          return active[f].has(card.dataset[f]);
        });
        if (otherMatch) {
          var val = card.dataset[facet];
          if (val) counts[val] = (counts[val] || 0) + 1;
        }
      });

      var badges = panels[facet].querySelectorAll('.facet-option-count');
      badges.forEach(function (badge) {
        var n = counts[badge.dataset.facetValue] || 0;
        badge.textContent = n;
        badge.closest('.facet-option').classList.toggle('facet-option--zero', n === 0);
      });
    });
  }

  function updateToggleLabels() {
    FACETS.forEach(function (facet) {
      var group = panels[facet].closest('.facet-group');
      var pill = group.querySelector('.facet-group-count');
      var n = active[facet].size;
      pill.textContent = n > 0 ? n : '';
    });
  }

  function openPanel(facet) {
    var group = panels[facet].closest('.facet-group');
    panels[facet].classList.add('is-open');
    group.querySelector('.facet-group-toggle').setAttribute('aria-expanded', 'true');
  }

  function closePanel(facet) {
    var group = panels[facet].closest('.facet-group');
    panels[facet].classList.remove('is-open');
    group.querySelector('.facet-group-toggle').setAttribute('aria-expanded', 'false');
  }

  function syncCheckboxes() {
    FACETS.forEach(function (facet) {
      var cbs = panels[facet].querySelectorAll('input[type="checkbox"]');
      cbs.forEach(function (cb) {
        cb.checked = active[facet].has(cb.value);
      });
    });
  }

  function readURL() {
    var params = new URLSearchParams(window.location.search);
    FACETS.forEach(function (f) {
      var val = params.get(f);
      active[f] = val ? new Set(val.split(',').map(decodeURIComponent)) : new Set();
    });
  }

  function writeURL() {
    var params = new URLSearchParams();
    FACETS.forEach(function (f) {
      if (active[f].size > 0) {
        params.set(f, Array.from(active[f]).sort().map(encodeURIComponent).join(','));
      }
    });
    var qs = params.toString();
    var url = qs ? window.location.pathname + '?' + qs : window.location.pathname;
    history.replaceState(null, '', url);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
