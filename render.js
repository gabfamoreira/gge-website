function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatCatalogPrice(value) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function productCardHTML(product) {
  const thumbHTML = product.image
    ? `<img src="${product.image}" alt="${escapeHtml(product.name)}" onload="this.nextElementSibling.hidden = true" onerror="this.hidden = true"><span>Product image</span>`
    : 'Product image';

  const priceHTML = product.oldPrice
    ? `<span class="price-old">${formatCatalogPrice(product.oldPrice)}</span><span class="price-new">${formatCatalogPrice(product.price)}</span>`
    : `<span class="price-new">${formatCatalogPrice(product.price)}</span>`;

  const typeAttr = product.type ? ` data-type="${product.type}"` : '';

  return `
      <div class="product-card" data-price="${product.price}"${typeAttr}>
        <div class="product-thumb">${thumbHTML}</div>
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div>${priceHTML}</div>
        <button class="add-btn">Add to cart</button>
      </div>`;
}

function renderProductGrids() {
  document.querySelectorAll('[data-product-grid]').forEach((container) => {
    const category = container.dataset.productGrid;
    const items = PRODUCTS.filter((product) => product.category === category);
    container.innerHTML = items.map(productCardHTML).join('');

    const countLabel = container.closest('main')?.querySelector('.category-header span');
    if (countLabel) {
      countLabel.textContent = `${items.length} product${items.length === 1 ? '' : 's'}`;
    }
  });
}

renderProductGrids();
