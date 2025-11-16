// Загрузка категорий и товаров
async function loadData() {
    try {
        // Загрузка категорий
        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();
        displayCategories(categories);

        // Загрузка товаров
        const productsResponse = await fetch('/api/products');
        const products = await productsResponse.json();
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Отображение категорий
function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card">
            <h3>${category.name}</h3>
        </div>
    `).join('');
}

// Отображение товаров
function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="/images/${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='/images/placeholder.jpg'">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${product.price} руб.</div>
            <p class="product-description">${product.description}</p>
            <div class="product-category">Категория: ${product.Category.name}</div>
        </div>
    `).join('');
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);