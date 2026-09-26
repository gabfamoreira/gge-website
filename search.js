function escapeSearchHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatSearchPrice(value) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function initSearch() {
  document.querySelectorAll('.search-wrap').forEach((wrap) => {
    const input = wrap.querySelector('.search-bar input[type="text"]');
    const resultsBox = wrap.querySelector('.search-results');
    if (!input || !resultsBox) return;

    function renderResults() {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        resultsBox.hidden = true;
        resultsBox.innerHTML = '';
        return;
      }

      const matches = PRODUCTS.filter((product) => product.name.toLowerCase().includes(query)).slice(0, 8);

      resultsBox.innerHTML = matches.length
        ? matches.map((product) => `
          <a class="search-result" href="${product.categoryUrl}">
            <span class="search-result-name">${escapeSearchHtml(product.name)}</span>
            <span class="search-result-price">${formatSearchPrice(product.price)}</span>
          </a>`).join('')
        : '<div class="search-results-empty">No products found</div>';

      resultsBox.hidden = false;
    }

    input.addEventListener('input', renderResults);
    input.addEventListener('focus', () => { if (input.value.trim()) renderResults(); });

    document.addEventListener('click', (event) => {
      if (!wrap.contains(event.target)) resultsBox.hidden = true;
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        resultsBox.hidden = true;
        input.blur();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initSearch);
