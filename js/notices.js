document.addEventListener('DOMContentLoaded', function () {
      const container = document.getElementById('noticesContainer');
      if (!container) return; // Bail if this page doesn't have notices UI

      // Tabs
      const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
      const noticeItems = () => Array.from(container.querySelectorAll('.notice-item'));

      function setActiveTab(cat = 'all') {
        tabButtons.forEach(b => {
          b.classList.toggle('bg-[#E5F4F0]', b.dataset.tab === cat);
          b.classList.toggle('text-emerald-700', b.dataset.tab === cat);
          b.classList.toggle('shadow-sm', b.dataset.tab === cat);
        });
        // Show/hide notices
        noticeItems().forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.category === cat) ? 'flex' : 'none';
        });
      }

      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.dataset.tab || 'all';
          setActiveTab(cat);
        });
      });

      // Set default active tab
      const defaultTab = document.querySelector('.tab-btn[data-tab="all"]');
      if (defaultTab) setActiveTab('all');

      // Debounced Search
      const searchInput = document.getElementById('noticeSearch');
      if (searchInput) {
        let timer = null;
        const debounce = (fn, delay = 250) => {
          return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
          };
        };

        const doSearch = () => {
          const q = searchInput.value.trim().toLowerCase();
          noticeItems().forEach(item => {
            const text = (item.innerText || '').toLowerCase();
            item.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
          });
        };

        searchInput.addEventListener('input', debounce(doSearch, 250));
      }

      // Load more (demo): clones the last visible item
      const loadMoreBtn = document.getElementById('loadMore');
      if (loadMoreBtn) {
        const spinner = document.getElementById('loadSpinner');
        const loadMoreText = document.getElementById('loadMoreText');

        loadMoreBtn.addEventListener('click', async () => {
          if (spinner) spinner.classList.remove('hidden');
          if (loadMoreText) loadMoreText.textContent = 'লোড হচ্ছে...';

          // Simulate network latency
          await new Promise(r => setTimeout(r, 700));

          if (spinner) spinner.classList.add('hidden');
          if (loadMoreText) loadMoreText.textContent = 'আরো বিস্তারিত';

          // Append a clone of last item for demo purposes
          const visibleItems = Array.from(container.querySelectorAll('.notice-item'));
          const sample = visibleItems[visibleItems.length - 1] || visibleItems[0];
          if (sample) {
            const clone = sample.cloneNode(true);
            container.appendChild(clone);
          }
        });
      }
    });