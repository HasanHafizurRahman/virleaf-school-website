  document.getElementById('year').textContent = new Date().getFullYear();

        const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
        const grid = document.getElementById('galleryGrid');
        let galleryItems = Array.from(grid.children);

        // Function to set the active tab style
        function setActiveTab(clickedBtn) {
            filterBtns.forEach(btn => {
                // Remove active styles and the main 'tab-active' class from all buttons
                btn.classList.remove('bg-[#E5F4F0]', 'text-emerald-700', 'tab-active');
                // Add the default style for inactive tabs
                btn.classList.add('text-gray-600', 'hover:bg-gray-50');
            });
            // Add active styles and the main 'tab-active' class to the clicked button
            clickedBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
            clickedBtn.classList.add('bg-[#E5F4F0]', 'text-emerald-700', 'tab-active');
        }

        // Main function to filter and search items
        function filterAndSearch() {
            const activeFilterBtn = document.querySelector('.filter-btn.tab-active');
            // If no button is active, default to 'all' to be safe
            const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
            const query = document.getElementById('gallerySearch').value.trim().toLowerCase();

            galleryItems.forEach(item => {
                const type = item.dataset.type;
                const title = (item.dataset.title || '').toLowerCase();

                // Check if the item type matches the active filter
                const typeMatch = activeFilter === 'all' ||
                    (activeFilter === 'images' && type === 'image') ||
                    (activeFilter === 'videos' && type === 'video');

                // Check if the item title matches the search query
                const searchMatch = !query || title.includes(query);

                // Show the item only if both conditions are met
                if (typeMatch && searchMatch) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }

        // Add click event listeners to all filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveTab(btn);
                filterAndSearch();
            });
        });

        // Add input event listener for the search bar
        document.getElementById('gallerySearch').addEventListener('input', filterAndSearch);

        // --- Load More Button ---
        document.getElementById('loadMoreGallery').addEventListener('click', async function () {
            const spinner = document.getElementById('gallerySpinner');
            const txt = document.getElementById('loadMoreGalleryText');
            spinner.classList.remove('hidden');
            txt.textContent = 'লোড হচ্ছে...';
            await new Promise(r => setTimeout(r, 800));
            spinner.classList.add('hidden');
            txt.textContent = 'আরো বিস্তারিত';

            // Clone first 3 items to simulate loading new ones
            const sampleNodes = galleryItems.slice(0, 3).map(n => n.cloneNode(true));
            sampleNodes.forEach(n => {
                grid.appendChild(n);
                if (n.matches('.video-item')) {
                    addVideoClickListener(n); // Add click listener to new video items
                }
            });
            // Update the list of all gallery items
            galleryItems = Array.from(grid.children);
            // Re-apply the current filter and search to the entire grid
            filterAndSearch();
        });
        
        // --- Video Item Click Listener ---
        function addVideoClickListener(node) {
            node.addEventListener('click', () => {
                // Placeholder action: Replace with your video player or modal logic
                alert(node.dataset.title + " — ভিডিও প্লে (এখানে মোডাল বা ভিডিও প্লেয়ার লাগান)");
            });
        }
        // Attach listener to initial video items
        document.querySelectorAll('.video-item').forEach(addVideoClickListener);

        // --- Mobile Menu ---
        // You can add the mobile menu and dropdown JS here if needed
        
        // --- END: SCRIPT FOR GALLERY ---