(function() {
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var progressBar = document.getElementById('progressBar');
  var sideRail = document.getElementById('sideRail');
  var backTop = document.getElementById('backTop');
  var searchInput = document.getElementById('reportSearch');
  var searchCount = document.getElementById('searchCount');
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));

  function sectionTitle(section) {
    var num = section.querySelector('.section-num');
    var h2 = section.querySelector('h2');
    var prefix = num ? num.textContent.split('/')[0].trim() + ' ' : '';
    return prefix + (h2 ? h2.textContent.trim() : section.id);
  }

  function scrollToTarget(selector) {
    var target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight <= 0 ? 0 : Math.min(100, Math.max(0, scrollTop / docHeight * 100));
    if (progressBar) progressBar.style.width = progress + '%';
    if (backTop) backTop.classList.toggle('show', scrollTop > 700);
  }

  function setActiveSection(id) {
    sections.forEach(function(section) {
      section.classList.toggle('active-section', section.id === id);
    });
    tocLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
    Array.prototype.slice.call(document.querySelectorAll('.rail-dot')).forEach(function(dot) {
      dot.classList.toggle('active', dot.getAttribute('data-target') === id);
    });
  }

  function buildRail() {
    if (!sideRail) return;
    sections.forEach(function(section) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'rail-dot';
      button.setAttribute('data-target', section.id);
      button.setAttribute('data-title', sectionTitle(section));
      button.addEventListener('click', function() {
        scrollToTarget('#' + section.id);
      });
      sideRail.appendChild(button);
    });
  }

  function wireProductTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.product-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.product-panel'));
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var key = tab.getAttribute('data-product');
        tabs.forEach(function(t) { t.classList.toggle('active', t === tab); });
        panels.forEach(function(panel) {
          panel.classList.toggle('active', panel.getAttribute('data-panel') === key);
        });
      });
    });
  }

  function wireCommandDock() {
    Array.prototype.slice.call(document.querySelectorAll('[data-jump]')).forEach(function(button) {
      button.addEventListener('click', function() {
        scrollToTarget(button.getAttribute('data-jump'));
      });
    });
    if (backTop) {
      backTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function wireSearch() {
    if (!searchInput || !searchCount) return;
    searchInput.addEventListener('input', function() {
      var query = searchInput.value.trim().toLowerCase();
      var matched = 0;
      sections.forEach(function(section) {
        var text = section.textContent.toLowerCase();
        var isMatch = !query || text.indexOf(query) !== -1;
        section.classList.toggle('search-hidden', !isMatch);
        if (isMatch) matched += 1;
      });
      searchCount.textContent = query ? matched + ' MATCHED' : sections.length + ' CHAPTERS';
      if (query && matched > 0) {
        var first = sections.find(function(section) {
          return !section.classList.contains('search-hidden');
        });
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function observeSections() {
    if (!('IntersectionObserver' in window)) {
      sections.forEach(function(section) { section.classList.add('in-view'); });
      return;
    }
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12 });

    var activeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

    sections.forEach(function(section) {
      revealObserver.observe(section);
      activeObserver.observe(section);
    });
  }

  function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchInput) searchInput.focus();
      }
      if (event.key === 'Escape' && searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
      }
    });
  }

  buildRail();
  wireProductTabs();
  wireCommandDock();
  wireSearch();
  observeSections();
  addKeyboardShortcuts();
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
})();
