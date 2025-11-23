// Основной URL API
const API_URL = 'http://localhost:8080/api';

// Загрузка всех данных для магазина
async function loadData() {
    try {
        console.log('🔄 Загрузка данных магазина...');
        
        // Загрузка категорий
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Ошибка загрузки категорий');
        const categories = await categoriesResponse.json();
        console.log('✅ Загружено категорий:', categories.length);
        displayCategories(categories);

        // Загрузка товаров
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) throw new Error('Ошибка загрузки товаров');
        const products = await productsResponse.json();
        console.log('✅ Загружено товаров:', products.length);
        displayProducts(products);

        // Загрузка актуальных цен
        const pricesResponse = await fetch('/api/pricelist');
        if (!pricesResponse.ok) throw new Error('Ошибка загрузки цен');
        const prices = await pricesResponse.json();
        console.log('✅ Загружено цен:', prices.length);

        // Обновляем товары с актуальными ценами
        const productsWithPrices = updateProductsWithPrices(products, prices);
        displayProducts(productsWithPrices);

    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        showErrorMessage(error.message);
    }
}

// Обновление товаров с актуальными ценами
function updateProductsWithPrices(products, prices) {
    // Сортируем цены по дате (самые новые первыми)
    const sortedPrices = prices.sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date));
    
    return products.map(product => {
        // Находим самую актуальную цену для товара
        const latestPrice = sortedPrices.find(price => price.article === product.article);
        
        if (latestPrice) {
            // Применяем скидку если есть
            let finalPrice = latestPrice.price;
            if (latestPrice.discount_percent > 0) {
                finalPrice = latestPrice.price * (1 - latestPrice.discount_percent / 100);
            }
            
            return {
                ...product,
                currentPrice: finalPrice,
                originalPrice: latestPrice.price,
                discountPercent: latestPrice.discount_percent,
                discountType: latestPrice.discount_type,
                hasDiscount: latestPrice.discount_percent > 0
            };
        }
        
        return {
            ...product,
            currentPrice: null,
            hasDiscount: false
        };
    });
}

// Отображение категорий
function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categories');
    
    if (!categories || categories.length === 0) {
        categoriesContainer.innerHTML = '<p class="text-muted">Категории не найдены</p>';
        return;
    }

    // Фильтруем только категории верхнего уровня (без родителя)
    const topLevelCategories = categories.filter(cat => !cat.parent_category_id);
    
    categoriesContainer.innerHTML = topLevelCategories.map(category => `
        <div class="category-card" onclick="showCategoryProducts(${category.category_code})">
            <div class="category-icon">📁</div>
            <h3>${category.category_name}</h3>
            ${category.hierarchy_level ? `<span class="category-level">Уровень ${category.hierarchy_level}</span>` : ''}
        </div>
    `).join('');
}

// Отображение товаров
function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    
    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p class="text-muted">Товары не найдены</p>';
        return;
    }

    // Фильтруем товары с ценами
    const availableProducts = products.filter(product => product.currentPrice !== null);
    
    if (availableProducts.length === 0) {
        productsContainer.innerHTML = '<p class="text-muted">Нет товаров с ценами</p>';
        return;
    }

    productsContainer.innerHTML = availableProducts.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${getProductImage(product.article)}" 
                     alt="${product.product_name}" 
                     class="product-image"
                     onerror="this.src='/images/placeholder.jpg'">
                ${product.hasDiscount ? '<div class="discount-badge">🔥 Скидка!</div>' : ''}
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${product.product_name}</h3>
                
                <div class="product-meta">
                    ${product.country_of_origin ? `<span class="product-country">🇺🇳 ${product.country_of_origin}</span>` : ''}
                    ${product.grade ? `<span class="product-grade">⭐ ${product.grade}</span>` : ''}
                </div>
                
                <p class="product-description">${product.description || 'Описание отсутствует'}</p>
                
                <div class="product-category">
                    📂 ${product.category ? product.category.category_name : 'Без категории'}
                </div>
                
                <div class="product-supplier">
                    🚚 ${product.supplier ? product.supplier.company_name : 'Поставщик не указан'}
                </div>
                
                <div class="product-price-section">
                    ${product.hasDiscount ? `
                        <div class="original-price">${product.originalPrice} руб.</div>
                        <div class="discount-percent">-${product.discountPercent}%</div>
                    ` : ''}
                    <div class="current-price ${product.hasDiscount ? 'discounted' : ''}">
                        ${product.currentPrice ? Math.round(product.currentPrice) : 'Цена не установлена'} руб.
                    </div>
                </div>
                
                ${product.expiration_date ? `
                    <div class="expiration-info">
                        📅 Срок годности: ${product.expiration_date} дней
                    </div>
                ` : ''}
                
                <div class="product-actions">
                    <button class="btn-buy" onclick="addToCart('${product.article}')">
                        🛒 В корзину
                    </button>
                    <button class="btn-info" onclick="showProductInfo('${product.article}')">
                        ℹ️ Подробнее
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Получение изображения для товара
function getProductImage(article) {
    // Маппинг артикулов к изображениям
    const imageMap = {
        'rose_pink': '/images/2025-11-11 22.23.35.jpg',
        'exotic_bouquet': '/images/2025-11-11 22.23.43.jpg',
        'wedding_composition': '/images/2025-11-11 22.23.47.jpg'
    };
    
    return imageMap[article] || '/images/placeholder.jpg';
}

// Показать товары определенной категории
async function showCategoryProducts(categoryId) {
    try {
        const response = await fetch(`/api/categories/${categoryId}/products`);
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
            
            // Прокрутка к товарам
            document.getElementById('products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров категории:', error);
    }
}

// Добавление в корзину
function addToCart(article) {
    let cart = JSON.parse(localStorage.getItem('flowerCart') || '[]');
    const existingItem = cart.find(item => item.article === article);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            article: article,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('flowerCart', JSON.stringify(cart));
    
    // Показываем уведомление
    showNotification('Товар добавлен в корзину!');
    
    // Обновляем счетчик корзины
    updateCartCounter();
}

// Обновление счетчика корзины
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('flowerCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Показать информацию о товаре
async function showProductInfo(article) {
    try {
        const response = await fetch(`/api/products/${article}`);
        if (response.ok) {
            const product = await response.json();
            
            // Здесь можно показать модальное окно с детальной информацией
            alert(`Детальная информация о товаре:\n\nНазвание: ${product.product_name}\nОписание: ${product.description || 'Нет описания'}\nАртикул: ${product.article}`);
        }
    } catch (error) {
        console.error('Ошибка загрузки информации о товаре:', error);
    }
}

// Показать уведомление
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Показать сообщение об ошибке
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <strong>Ошибка!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').prepend(errorDiv);
}

// Поиск товаров
async function searchProducts(query) {
    try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        }
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateCartCounter();
    
    // Добавляем обработчик поиска если есть поле поиска
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            if (e.target.value.length >= 2) {
                searchProducts(e.target.value);
            } else if (e.target.value.length === 0) {
                loadData(); // Возвращаем все товары
            }
        });
    }
});

// Обновление данных каждые 60 секунд (опционально)
setInterval(loadData, 60000);