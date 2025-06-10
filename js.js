// Mobile menu toggle (Hiển thị/ẩn menu trên thiết bị di động)
document.getElementById('mobileMenuButton').addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// 2. Back to top button (Nút trở về đầu trang)
// Chức năng: Khi người dùng cuộn xuống trang > 300px, nút trở về đầu (#backToTop) sẽ hiện ra.
//  Nếu cuộn về gần đầu trang thì sẽ ẩn đi.
window.addEventListener('scroll', function() {
    var backToTopButton = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});
// Chức năng: Khi bấm vào nút trở về đầu trang, trình duyệt sẽ cuộn mượt lên đầu trang.
document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Product filtering(Lọc sản phẩm theo loại)
// 1.Chức năng: Lấy tất cả các nút lọc và các thẻ sản phẩm.
const filterButtons = document.querySelectorAll('.filter-button');
const productCards = document.querySelectorAll('.product-card');
// 2.Chức năng:
// Khi người dùng chọn một filter button, script:
// Cập nhật giao diện của nút (highlight button đang được chọn).
// Lọc sản phẩm: chỉ hiển thị những sản phẩm có data-category trùng với filter (all thì hiện hết
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('bg-pink-100', 'text-pink-600', 'border-pink-200');
            btn.classList.add('bg-gray-100', 'text-gray-600', 'border-gray-200');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        this.classList.add('bg-pink-100', 'text-pink-600', 'border-pink-200');
        this.classList.remove('bg-gray-100', 'text-gray-600', 'border-gray-200');
        
        const filter = this.dataset.filter;
        
        productCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const categories = card.dataset.category.split(',');
                if (categories.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Shopping cart functionality(Chức năng giỏ hàng)
let cartItems = [];
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const id = this.dataset.id;
        const name = this.dataset.name;
        const price = parseInt(this.dataset.price);
        const image = this.dataset.image;
        
        // Check if item already exists in cart
        const existingItem = cartItems.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Show notification
        showNotification('Đã thêm sản phẩm vào giỏ hàng');
    });
});

function updateCart() {
    // Update cart count Cập nhật giao diện giỏ hàng
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Giỏ hàng trống</p>';
    } else {
        let total = 0;
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center py-2 border-b';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                <div class="ml-3 flex-1">
                    <h4 class="text-sm font-medium text-gray-700 truncate">${item.name}</h4>
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>${item.price.toLocaleString()}đ x ${item.quantity}</span>
                        <span class="font-semibold">${itemTotal.toLocaleString()}đ</span>
                    </div>
                </div>
                <button class="remove-item ml-2 text-gray-400 hover:text-pink-500" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Update total
        cartTotal.textContent = total.toLocaleString() + 'đ';
    }
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            cartItems = cartItems.filter(item => item.id !== id);
            updateCart();
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng');
        });
    });
}
// 6. showNotification(message) – Thông báo nhỏ 
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center animate-slideIn';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        ${message}
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 7. updateCart(); 
// // Khởi tạo
updateCart();