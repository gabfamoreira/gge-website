const filterCards = document.querySelectorAll('.category-grid .product-card');
const filterInputs = document.querySelectorAll('.filters input[type="checkbox"]');
const clearFiltersButton = document.querySelector('.clear-filters');
const productCount = document.querySelector('.category-header span');

function priceMatches(price, selectedRanges) {
  if (selectedRanges.length === 0) return true;
  return selectedRanges.some((range) => {
    if (range === 'under-50') return price < 50;
    if (range === '50-150') return price >= 50 && price <= 150;
    return price > 150;
  });
}

function applyFilters() {
  const selectedPrices = [...document.querySelectorAll('input[data-filter-group="price"]:checked')]
    .map((input) => input.value);
  const selectedTypes = [...document.querySelectorAll('input[data-filter-group="type"]:checked')]
    .map((input) => input.value);
  let visibleCount = 0;

  filterCards.forEach((card) => {
    const matchesPrice = priceMatches(Number(card.dataset.price), selectedPrices);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(card.dataset.type);
    const isVisible = matchesPrice && matchesType;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  productCount.textContent = `${visibleCount} product${visibleCount === 1 ? '' : 's'}`;
  clearFiltersButton.disabled = selectedPrices.length === 0 && selectedTypes.length === 0;
}

filterInputs.forEach((input) => input.addEventListener('change', applyFilters));
clearFiltersButton.addEventListener('click', () => {
  filterInputs.forEach((input) => { input.checked = false; });
  applyFilters();
});

applyFilters();
