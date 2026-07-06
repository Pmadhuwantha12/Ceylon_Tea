// ============================================
// MOBILE MENU
// ============================================
function toggleMenu() {
    document.querySelector('nav ul').classList.toggle('show');
}

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav ul').classList.remove('show');
    });
});

// ============================================
// SHOPPING CART SYSTEM
// ============================================
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const optionMap = {
    'Black Tea': '12.00',
    'Green Tea': '14.99',
    'White Tea': '4.75',
    'Oolong Tea': '16.99',
    'White Tea Premium': '19.99',
    'Chai Spice': '4.75',
    'Green Tea Curls': '8.99',
    'Big Leaf Black Tea': '24.99',
    'Ginger & Lemongrass': '12.99'
};

function addToCart(teaName, price, button) {
    const existing = cartItems.find(item => item.name === teaName);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ name: teaName, price: price, quantity: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
    showNotification(`${teaName} added to cart! 🎉`);
    if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Added!';
        button.style.background = '#2d6a4f';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
}

function updateCartQuantity(index, change) {
    cartItems[index].quantity += change;
    if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }
    const cartList = document.getElementById('cartItemsList');
    if (cartList) {
        if (cartItems.length === 0) {
            cartList.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Your cart is empty</p>';
        } else {
            cartList.innerHTML = cartItems.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateCartQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${index}, 1)">+</button>
                        <button onclick="removeFromCart(${index})" class="cart-remove">✕</button>
                    </div>
                </div>
            `).join('');
        }
    }
    const cartTotal = document.getElementById('cartTotalPrice');
    if (cartTotal) {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = '$' + total.toFixed(2);
    }
    updateShopOrderForm();
}

function updateShopOrderForm() {
    const container = document.getElementById('orderItemsContainer');
    if (!container) return;
    if (!window.location.pathname.includes('shop.html') && !window.location.pathname.includes('shop')) return;
    container.innerHTML = '';
    if (cartItems.length === 0) {
        addEmptyOrderItem();
    } else {
        cartItems.forEach(item => addOrderItemFromCart(item));
        updateRemoveButtons();
        updateOrderSummary();
    }
}

function addEmptyOrderItem() {
    const container = document.getElementById('orderItemsContainer');
    if (!container) return;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    itemDiv.innerHTML = `
        <div class="item-row">
            <div class="item-select">
                <label>Tea Type</label>
                <select class="tea-type" onchange="updateOrderSummary()">
                    <option value="" disabled selected>-- Select a Tea --</option>
                    <option value="12.00">Black Tea - $12.00/100g</option>
                    <option value="14.99">Green Tea - $14.99/100g</option>
                    <option value="4.75">White Tea - $4.75/20g</option>
                    <option value="16.99">Oolong Tea - $16.99/100g</option>
                    <option value="4.75">Chai Spice - $4.75/20g</option>
                    <option value="8.99">Green Tea Curls - $8.99/25 Tea Bags</option>
                    <option value="24.99">Big Leaf Black Tea - $24.99/400g</option>
                    <option value="12.99">Ginger & Lemongrass - $12.99/100g</option>
                </select>
            </div>
            <div class="item-quantity">
                <label>Qty</label>
                <input type="number" class="item-qty" min="1" max="20" value="1" onchange="updateOrderSummary()">
            </div>
            <div class="item-remove">
                <button type="button" class="remove-btn" onclick="removeItem(this)" disabled>✕</button>
            </div>
        </div>
        <div class="item-subtotal">$0.00</div>
    `;
    container.appendChild(itemDiv);
    updateRemoveButtons();
    updateOrderSummary();
}

function addOrderItemFromCart(item) {
    const container = document.getElementById('orderItemsContainer');
    if (!container) return;
    const optionValue = optionMap[item.name] || '12.00';
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    itemDiv.innerHTML = `
        <div class="item-row">
            <div class="item-select">
                <label>Tea Type</label>
                <select class="tea-type" onchange="updateOrderSummary()">
                    <option value="12.00" ${optionValue === '12.00' ? 'selected' : ''}>Black Tea - $12.00/100g</option>
                    <option value="14.99" ${optionValue === '14.99' ? 'selected' : ''}>Green Tea - $14.99/100g</option>
                    <option value="4.75" ${optionValue === '4.75' ? 'selected' : ''}>White Tea - $4.75/20g</option>
                    <option value="16.99" ${optionValue === '16.99' ? 'selected' : ''}>Oolong Tea - $16.99/100g</option>
                    <option value="4.75" ${optionValue === '4.75' ? 'selected' : ''}>Chai Spice - $4.75/20g</option>
                    <option value="8.99" ${optionValue === '8.99' ? 'selected' : ''}>Green Tea Curls - $8.99/25 Tea Bags</option>
                    <option value="24.99" ${optionValue === '24.99' ? 'selected' : ''}>Big Leaf Black Tea - $24.99/400g</option>
                    <option value="12.99" ${optionValue === '12.99' ? 'selected' : ''}>Ginger & Lemongrass - $12.99/100g</option>
                </select>
            </div>
            <div class="item-quantity">
                <label>Qty</label>
                <input type="number" class="item-qty" min="1" max="20" value="${item.quantity}" onchange="updateOrderSummary()">
            </div>
            <div class="item-remove">
                <button type="button" class="remove-btn" onclick="removeItem(this)">✕</button>
            </div>
        </div>
        <div class="item-subtotal">$${(parseFloat(optionValue) * item.quantity).toFixed(2)}</div>
    `;
    container.appendChild(itemDiv);
}

function goToCheckout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty! Add some teas from the Varieties page first.');
        return;
    }
    toggleCart();
    window.location.href = 'shop.html';
}

function showNotification(message) {
    let notification = document.getElementById('cartNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cartNotification';
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }
    notification.innerHTML = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// ============================================
// ORDER SYSTEM
// ============================================
function addOrderItem() {
    const container = document.getElementById('orderItemsContainer');
    if (!container) return;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    itemDiv.innerHTML = `
        <div class="item-row">
            <div class="item-select">
                <label>Tea Type</label>
                <select class="tea-type" onchange="updateOrderSummary()">
                    <option value="" disabled selected>-- Select a Tea --</option>
                    <option value="12.00">Black Tea - $12.00/100g</option>
                    <option value="14.99">Green Tea - $14.99/100g</option>
                    <option value="4.75">White Tea - $4.75/20g</option>
                    <option value="16.99">Oolong Tea - $16.99/100g</option>
                    <option value="4.75">Chai Spice - $4.75/20g</option>
                    <option value="8.99">Green Tea Curls - $8.99/25 Tea Bags</option>
                    <option value="24.99">Big Leaf Black Tea - $24.99/400g</option>
                    <option value="12.99">Ginger & Lemongrass - $12.99/100g</option>
                </select>
            </div>
            <div class="item-quantity">
                <label>Qty</label>
                <input type="number" class="item-qty" min="1" max="20" value="1" onchange="updateOrderSummary()">
            </div>
            <div class="item-remove">
                <button type="button" class="remove-btn" onclick="removeItem(this)">✕</button>
            </div>
        </div>
        <div class="item-subtotal">$0.00</div>
    `;
    container.appendChild(itemDiv);
    updateRemoveButtons();
    updateOrderSummary();
}

function removeItem(btn) {
    const container = document.getElementById('orderItemsContainer');
    if (container.children.length <= 1) {
        alert('You need at least one item in your order.');
        return;
    }
    const item = btn.closest('.order-item');
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        item.remove();
        updateRemoveButtons();
        updateOrderSummary();
    }, 300);
}

function updateRemoveButtons() {
    const items = document.querySelectorAll('.order-item');
    document.querySelectorAll('.remove-btn').forEach((btn, i) => {
        btn.disabled = items.length <= 1;
    });
}

function updateOrderSummary() {
    const items = document.querySelectorAll('.order-item');
    let subtotal = 0;
    const itemDetails = [];
    items.forEach(item => {
        const select = item.querySelector('.tea-type');
        const qty = parseInt(item.querySelector('.item-qty').value) || 1;
        const price = parseFloat(select.value) || 0;
        const teaName = select.options[select.selectedIndex]?.text?.split(' - ')[0] || 'Tea';
        const total = price * qty;
        subtotal += total;
        const subtotalDisplay = item.querySelector('.item-subtotal');
        if (subtotalDisplay) {
            subtotalDisplay.textContent = total > 0 ? '$' + total.toFixed(2) : '$0.00';
        }
        if (price > 0) {
            itemDetails.push({ name: teaName, qty, total });
        }
    });
    const summaryContainer = document.getElementById('orderItemsSummary');
    if (summaryContainer) {
        const validItems = itemDetails.filter(item => item.total > 0);
        if (validItems.length === 0) {
            summaryContainer.innerHTML = '<p style="color:#999;">No items in cart</p>';
        } else {
            summaryContainer.innerHTML = validItems.map(item => `
                <div class="summary-item">
                    <span class="item-name">${item.name} × ${item.qty}</span>
                    <span class="item-price">$${item.total.toFixed(2)}</span>
                </div>
            `).join('');
        }
    }
    const giftWrap = document.getElementById('giftWrap');
    const giftCost = giftWrap?.checked ? 1.50 : 0;
    const shipping = subtotal > 30 ? 0 : 3.00;
    const total = subtotal + giftCost + shipping;
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('giftWrapCost').textContent = '$' + giftCost.toFixed(2);
    document.getElementById('shippingCost').textContent = '$' + shipping.toFixed(2);
    document.getElementById('totalCost').textContent = '$' + total.toFixed(2);
}

document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('address').value.trim();
    if (!name || !email || !phone || !address) {
        alert('Please fill in all required fields.');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address.');
        return;
    }
    const items = document.querySelectorAll('.order-item');
    let orderSummary = [], totalItems = 0;
    items.forEach(item => {
        const select = item.querySelector('.tea-type');
        const qty = parseInt(item.querySelector('.item-qty').value) || 1;
        const teaName = select.options[select.selectedIndex]?.text?.split(' - ')[0] || 'Tea';
        if (select.value && select.value !== '') {
            orderSummary.push(`${teaName} × ${qty}`);
            totalItems += qty;
        }
    });
    if (orderSummary.length === 0) {
        alert('Please add at least one tea to your order.');
        return;
    }
    document.querySelector('.order-form form').style.display = 'none';
    document.getElementById('orderConfirmation').style.display = 'block';
    document.getElementById('confirmationMessage').innerHTML = `
        Thank you, <strong>${name}</strong>!<br>
        Your order of <strong>${totalItems} items</strong> has been placed.<br><br>
        <strong>Order Details:</strong><br>${orderSummary.join('<br>')}<br><br>
        We'll ship it to: <em>${address}</em>
    `;
    document.getElementById('orderNumber').textContent = 'TEA-' + Date.now().toString().slice(-6);
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
});

function resetForm() {
    document.querySelector('.order-form form').style.display = 'block';
    document.getElementById('orderConfirmation').style.display = 'none';
    const container = document.getElementById('orderItemsContainer');
    if (container) {
        container.innerHTML = '';
        if (cartItems.length === 0) {
            addEmptyOrderItem();
        } else {
            cartItems.forEach(item => addOrderItemFromCart(item));
            updateRemoveButtons();
            updateOrderSummary();
        }
    }
    ['customerName', 'customerEmail', 'customerPhone', 'address', 'specialInstructions'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const giftWrap = document.getElementById('giftWrap');
    if (giftWrap) giftWrap.checked = false;
    updateOrderSummary();
}

// ============================================
// TEA FINDER QUIZ
// ============================================
let quizStep = 0;
let quizAnswers = [];

const quizQuestions = [
    {
        question: "1. What flavor do you prefer?",
        options: [
            { value: 'fruity', label: '🍑 Fruity & Sweet' },
            { value: 'floral', label: '🌸 Floral & Light' },
            { value: 'earthy', label: '🌿 Earthy & Fresh' },
            { value: 'smoky', label: '🔥 Smoky & Bold' },
            { value: 'spicy', label: '🌶️ Spicy & Warm' }
        ]
    },
    {
        question: "2. How strong do you like your tea?",
        options: [
            { value: 'light', label: '☁️ Light & Delicate' },
            { value: 'medium', label: '🌤️ Medium & Balanced' },
            { value: 'strong', label: '⚡ Strong & Bold' }
        ]
    },
    {
        question: "3. When do you usually drink tea?",
        options: [
            { value: 'morning', label: '🌅 Morning' },
            { value: 'afternoon', label: '☕ Afternoon' },
            { value: 'evening', label: '🌙 Evening' }
        ]
    }
];

const recommendations = {
    'fruity_light_morning': 'Green Tea Curls - Fruity & floral. A gentle morning tea.',
    'fruity_light_afternoon': 'White Tea - Light & refreshing. Perfect for afternoon.',
    'fruity_light_evening': 'White Tea - Delicate & calming. Ideal for evening.',
    'fruity_medium_morning': 'Oolong Tea - Balanced & fruity. Great for morning.',
    'fruity_medium_afternoon': 'Oolong Tea - Complex & smooth. Perfect afternoon tea.',
    'fruity_medium_evening': 'White Tea - Light & subtly sweet. For evening relaxation.',
    'fruity_strong_morning': 'Black Tea - Bold & brisk. The perfect morning wake-up.',
    'fruity_strong_afternoon': 'Black Tea - Strong & full-bodied. Great for focus.',
    'fruity_strong_evening': 'Chai Spice - Warm & bold. A great evening treat.',
    'floral_light_morning': 'White Tea - Floral & delicate. A gentle start.',
    'floral_light_afternoon': 'Green Tea - Light & floral. Perfect for afternoon.',
    'floral_light_evening': 'White Tea - Light & calming. Ideal for evening.',
    'floral_medium_morning': 'Green Tea - Fresh & awakening. Great for morning.',
    'floral_medium_afternoon': 'Oolong Tea - Floral & balanced. Perfect afternoon.',
    'floral_medium_evening': 'Green Tea - Light & calming. For evening unwind.',
    'floral_strong_morning': 'Black Tea - Bold with floral notes. Strong morning tea.',
    'floral_strong_afternoon': 'Black Tea - Strong & invigorating. Great for productivity.',
    'floral_strong_evening': 'Chai Spice - Warm & aromatic. A comforting evening tea.',
    'earthy_light_morning': 'Green Tea - Earthy & fresh. Morning clarity.',
    'earthy_light_afternoon': 'White Tea - Light & earthy. Great for afternoon.',
    'earthy_light_evening': 'White Tea - Light & grounding. Evening wind-down.',
    'earthy_medium_morning': 'Green Tea - Fresh & earthy. Morning energy.',
    'earthy_medium_afternoon': 'Oolong Tea - Balanced & earthy. Perfect afternoon.',
    'earthy_medium_evening': 'Green Tea - Light & grounding. Evening relaxation.',
    'earthy_strong_morning': 'Black Tea - Strong & malty. Ultimate morning tea.',
    'earthy_strong_afternoon': 'Black Tea - Bold & full-bodied. Great for focus.',
    'earthy_strong_evening': 'Chai Spice - Warm & earthy. A comforting evening tea.',
    'smoky_light_morning': 'Oolong Tea - Lightly smoky. A unique morning.',
    'smoky_light_afternoon': 'Oolong Tea - Smoky & complex. Great for contemplation.',
    'smoky_light_evening': 'Black Tea - Lightly smoky. Perfect for evening.',
    'smoky_medium_morning': 'Oolong Tea - Medium roast & balanced. Great morning.',
    'smoky_medium_afternoon': 'Big Leaf Black Tea - Smoky & bold. Perfect afternoon.',
    'smoky_medium_evening': 'Chai Spice - Warm & smoky. A great evening tea.',
    'smoky_strong_morning': 'Big Leaf Black Tea - Bold & smoky. Ultimate morning tea.',
    'smoky_strong_afternoon': 'Big Leaf Black Tea - Strong & invigorating. Great for energy.',
    'smoky_strong_evening': 'Chai Spice - Bold & warming. A comforting evening tea.',
    'spicy_light_morning': 'Chai Spice - Lightly spiced. A gentle morning chai.',
    'spicy_light_afternoon': 'Chai Spice - Subtly spiced. Great for afternoon.',
    'spicy_light_evening': 'Chai Spice - Warm & soothing. Perfect evening tea.',
    'spicy_medium_morning': 'Chai Spice - Balanced & aromatic. Perfect morning chai.',
    'spicy_medium_afternoon': 'Chai Spice - Rich & spiced. Ideal for afternoon comfort.',
    'spicy_medium_evening': 'Chai Spice - Warm & comforting. A great evening tea.',
    'spicy_strong_morning': 'Chai Spice - Bold & invigorating. Ultimate morning chai.',
    'spicy_strong_afternoon': 'Chai Spice - Strong & warming. Great for afternoon.',
    'spicy_strong_evening': 'Chai Spice - Bold & comforting. A perfect evening chai.'
};

function answerQuiz(value) {
    quizAnswers.push(value);
    quizStep++;
    if (quizStep < quizQuestions.length) {
        showQuestion();
    } else {
        showRecommendation();
    }
}

function showQuestion() {
    const q = quizQuestions[quizStep];
    const questionText = document.getElementById('questionText');
    const optionsDiv = document.getElementById('quizOptions');
    if (questionText) questionText.textContent = q.question;
    if (optionsDiv) {
        optionsDiv.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt.label;
            btn.onclick = () => answerQuiz(opt.value);
            optionsDiv.appendChild(btn);
        });
    }
}

function showRecommendation() {
    const quizQuestion = document.getElementById('quizQuestion');
    const quizResult = document.getElementById('quizResult');
    if (quizQuestion) quizQuestion.style.display = 'none';
    if (quizResult) quizResult.style.display = 'block';
    const key = quizAnswers.join('_');
    const recommendation = recommendations[key] || 'Oolong Tea - A perfect balance for any time of day.';
    const recommendationDiv = document.getElementById('quizRecommendation');
    if (recommendationDiv) {
        recommendationDiv.innerHTML = `
            <p style="font-size:1.3rem;font-weight:bold;">${recommendation}</p>
            <p>Based on your preferences, we recommend this tea.</p>
            <a href="shop.html" class="btn" style="margin-top:10px;">Shop Now</a>
        `;
    }
}

function resetQuiz() {
    quizStep = 0;
    quizAnswers = [];
    const quizQuestion = document.getElementById('quizQuestion');
    const quizResult = document.getElementById('quizResult');
    if (quizQuestion) quizQuestion.style.display = 'block';
    if (quizResult) quizResult.style.display = 'none';
    showQuestion();
}

if (document.getElementById('quizQuestion')) {
    showQuestion();
}

// ============================================
// CONTACT FORM
// ============================================
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const feedback = document.getElementById('contactFeedback');
    if (!name || !email || !message) {
        feedback.innerHTML = 'Please fill in all required fields.';
        feedback.className = 'error';
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        feedback.innerHTML = 'Please enter a valid email address.';
        feedback.className = 'error';
        return;
    }
    feedback.innerHTML = `✅ Thank you, ${name}! Your message has been sent. We'll get back to you within 24 hours.`;
    feedback.className = 'success';
    this.reset();
    setTimeout(() => {
        feedback.innerHTML = '';
        feedback.className = '';
    }, 5000);
});

// ============================================
// LOAD MORE REVIEWS
// ============================================
function loadMoreReviews() {
    const reviews = [
        { stars: '⭐⭐⭐⭐⭐', text: '"The green tea is incredibly fresh. I feel energized every morning!"', name: '- David C.' },
        { stars: '⭐⭐⭐⭐⭐', text: '"I\'ve tried many teas, but Ceylon Tea is truly special."', name: '- Emma W.' },
        { stars: '⭐⭐⭐⭐', text: '"Great service and fast delivery. The oolong tea is my new favorite."', name: '- Michael T.' },
        { stars: '⭐⭐⭐⭐⭐', text: '"The white tea is pure luxury. Perfect for evening relaxation."', name: '- Lisa R.' }
    ];
    const grid = document.getElementById('reviewDisplay');
    if (!grid) return;
    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `<div class="stars">${review.stars}</div><p>${review.text}</p><h4>${review.name}</h4>`;
        grid.appendChild(card);
    });
    const btn = document.querySelector('.reviews .btn');
    if (btn) btn.style.display = 'none';
}

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    if (document.getElementById('orderItemsContainer')) {
        const container = document.getElementById('orderItemsContainer');
        if (cartItems.length > 0) {
            container.innerHTML = '';
            cartItems.forEach(item => addOrderItemFromCart(item));
            updateRemoveButtons();
            updateOrderSummary();
        } else {
            container.innerHTML = '';
            addEmptyOrderItem();
        }
    }
});
