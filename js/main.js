// js/main.js
(function () {
  'use strict';

  // ---------- Config / optional override ----------
  // If you want to provide server data from HTML, set window.RESULTS_OVERRIDE = [...] before loading this script.
  const sampleResults = Array.isArray(window.RESULTS_OVERRIDE) ? window.RESULTS_OVERRIDE : [
    { exam: 'সাপ্তাহিক পরীক্ষা', session: '2023', className: 'এনিসিপি', total: 240, passed: 205, absent: 35 },
    { exam: 'সাপ্তাহিক পরীক্ষা', session: '2023', className: 'এক্স-ক্লাস', total: 200, passed: 170, absent: 30 },
    { exam: 'সাপ্তাহিক পরীক্ষা', session: '2023', className: 'বি-শাখা', total: 150, passed: 120, absent: 30 },
    { exam: 'টার্ম ফাইনাল', session: '2023', className: 'সি-গ্রুপ', total: 180, passed: 160, absent: 20 },
    { exam: 'টার্ম ফাইনাল', session: '2022', className: 'ডি-শাখা', total: 160, passed: 140, absent: 20 },
    { exam: 'সাপ্তাহিক পরীক্ষা', session: '2023', className: 'ই-শাখা', total: 220, passed: 180, absent: 40 },
    { exam: 'সাপ্তাহিক পরীক্ষা', session: '2023', className: 'এফ-শাখা', total: 210, passed: 178, absent: 32 },
    { exam: 'টার্ম ফাইনাল', session: '2023', className: 'জি-শাখা', total: 190, passed: 162, absent: 28 }
  ];

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str).replace(/[&<>"'\/]/g, function (s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' })[s];
    });
  }

  function debounce(fn, delay = 200) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ---------- Mobile menu & header ----------
  function initMobileMenu() {
    const mobileBtn = $('mobileMenuButton');
    const mobileMenu = $('mobileMenu');
    const iconOpen = $('icon-open');
    const iconClose = $('icon-close');
    const mobileLoginBtn = $('mobileLoginBtn');

    if (!mobileBtn || !mobileMenu) return;

    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      // aria-expanded should reflect whether the menu is open (true when NOT hidden)
      mobileBtn.setAttribute('aria-expanded', String(!isHidden));
      if (iconOpen) iconOpen.classList.toggle('hidden');
      if (iconClose) iconClose.classList.toggle('hidden');
    });

    // Close menu when clicking links or login inside it
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('#mobileLoginBtn')) {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
        }
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileBtn.setAttribute('aria-expanded', 'false');
        if (iconOpen) iconOpen.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
      }
    });
  }

  // ---------- Year filler ----------
  function initYear() {
    const yearEl = $('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Students carousel (optional) ----------
  function initStudentsCarousel() {
    const prev = $('students-prev');
    const next = $('students-next');
    const track = $('students-track');

    if (!track) return;

    function scrollByPage(direction = 1) {
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      const card = track.querySelector('article');
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width + gap;
      const visibleCards = Math.max(1, Math.floor(track.getBoundingClientRect().width / cardWidth));
      const amount = cardWidth * visibleCards;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }

    prev?.addEventListener('click', () => scrollByPage(-1));
    next?.addEventListener('click', () => scrollByPage(1));

    function updateArrows() {
      const atStart = track.scrollLeft <= 5;
      const atEnd = track.scrollWidth - Math.ceil(track.clientWidth + track.scrollLeft) <= 5;
      if (prev) prev.style.visibility = atStart ? 'hidden' : 'visible';
      if (next) next.style.visibility = atEnd ? 'hidden' : 'visible';
    }

    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  // ---------- Results table module ----------
  function initResultsModule() {
    const tbody = $('resultsTbody');
    const sessionSelect = $('sessionSelect');
    const examSelect = $('examSelect');
    const searchInput = $('searchInput');
    const totalCandidatesEl = $('totalCandidates');
    const totalPassedEl = $('totalPassed');
    const passRateEl = $('passRate');

    // if core elements are missing, skip this feature
    if (!tbody || !sessionSelect || !examSelect || !searchInput || !totalCandidatesEl || !totalPassedEl || !passRateEl) {
      return;
    }

    // use sampleResults from config (above)
    const dataSource = sampleResults.slice();

    function renderTable(data) {
      tbody.innerHTML = '';
      data.forEach(row => {
        const passPct = row.total ? ((row.passed / row.total) * 100) : 0;
        const tr = document.createElement('tr');
        tr.className = 'bg-white';
        tr.innerHTML = `
          <td class="px-4 py-4 text-sm text-gray-700">${escapeHtml(row.exam)} — <span class="text-gray-500 text-xs">${escapeHtml(row.className)}</span></td>
          <td class="px-4 py-4 text-sm text-gray-600">${escapeHtml(row.session)}</td>
          <td class="px-4 py-4 text-sm text-gray-600">${(row.total || 0).toLocaleString()}</td>
          <td class="px-4 py-4 text-sm text-gray-600">${(row.passed || 0).toLocaleString()}</td>
          <td class="px-4 py-4 text-sm text-red-500">${(row.absent || 0).toLocaleString()}</td>
          <td class="px-4 py-4 text-right">
            <span class="pill bg-[#E6F6F2] text-[#006747]">${passPct.toFixed(2)}%</span>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function computeAndRenderMetrics(data) {
      const totalCandidates = data.reduce((s, r) => s + (r.total || 0), 0);
      const totalPassed = data.reduce((s, r) => s + (r.passed || 0), 0);
      const passRate = totalCandidates ? (totalPassed / totalCandidates) * 100 : 0;
      totalCandidatesEl.textContent = totalCandidates.toLocaleString();
      totalPassedEl.textContent = totalPassed.toLocaleString();
      passRateEl.textContent = passRate ? passRate.toFixed(2) + '%' : '0%';
    }

    function applyFilters() {
      const sessionVal = sessionSelect.value;
      const examVal = examSelect.value;
      const q = (searchInput.value || '').trim().toLowerCase();

      let filtered = dataSource.slice();

      if (sessionVal && sessionVal !== 'all') filtered = filtered.filter(r => r.session === sessionVal);
      if (examVal && examVal !== 'all') filtered = filtered.filter(r => r.exam === examVal);
      if (q) {
        filtered = filtered.filter(r =>
          (r.className && r.className.toLowerCase().includes(q)) ||
          (r.exam && r.exam.toLowerCase().includes(q))
        );
      }

      renderTable(filtered);
      computeAndRenderMetrics(filtered);
    }

    // initial render
    applyFilters();

    // listeners
    sessionSelect.addEventListener('change', applyFilters);
    examSelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', debounce(applyFilters, 250));
  }

  // ---------- Initialize everything when DOM ready ----------
  function init() {
    initMobileMenu();
    initYear();
    initStudentsCarousel();
    initResultsModule();
  }

  // ensure only one DOMContentLoaded handler (defensive)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // already loaded
    init();
  }

  // expose for debugging (optional)
  window.VirleafSite = window.VirleafSite || { init };
})();
