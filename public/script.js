// Загрузка категорий и товаров
async function loadData() {
    try {
        console.log('🔄 Загрузка данных...');
        
        // Загрузка категорий
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Ошибка загрузки категорий');
        const categories = await categoriesResponse.json();
        console.log('✅ Загружено категорий:', categories.length);
        displayCategories(categories);

        // Загрузка цветов (товаров)
        const flowersResponse = await fetch('/api/flowers');
        if (!flowersResponse.ok) throw new Error('Ошибка загрузки цветов');
        const flowers = await flowersResponse.json();
        console.log('✅ Загружено цветов:', flowers.length);
        displayFlowers(flowers);

    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        // Показываем сообщение об ошибке пользователю
        document.getElementById('categories').innerHTML = 
            '<p class="error">Ошибка загрузки категорий</p>';
        document.getElementById('products').innerHTML = 
            '<p class="error">Ошибка загрузки товаров</p>';
    }
}

// Отображение категорий
function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categories');
    
    if (categories.length === 0) {
        categoriesContainer.innerHTML = '<p>Категории не найдены</p>';
        return;
    }

    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card">
            <h3>${category.name}</h3>
            ${category.description ? `<p>${category.description}</p>` : ''}
        </div>
    `).join('');
}

// Отображение цветов (товаров)
function displayFlowers(flowers) {
    const productsContainer = document.getElementById('products');
    
    if (flowers.length === 0) {
        productsContainer.innerHTML = '<p>Цветы не найдены</p>';
        return;
    }

    productsContainer.innerHTML = flowers.map(flower => `
        <div class="product-card">
            <img src="${flower.imageUrl || '/images/placeholder.jpg'}" 
                 alt="${flower.name}" 
                 class="product-image"
                 onerror="this.src='/images/placeholder.jpg'">
            <h3 class="product-name">${flower.name}</h3>
            <div class="product-price">${flower.price} руб.</div>
            <p class="product-description">${flower.description || 'Описание отсутствует'}</p>
            <div class="product-category">
                ${flower.category ? `Категория: ${flower.category.name}` : 'Без категории'}
            </div>
            ${flower.inStock ? 
                '<div class="in-stock">✓ В наличии</div>' : 
                '<div class="out-of-stock">Нет в наличии</div>'
            }
        </div>
    `).join('');
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);

// Обновление данных каждые 30 секунд (опционально)
setInterval(loadData, 30000);