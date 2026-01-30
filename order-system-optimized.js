// ==================== SISTEMA DE PEDIDOS OPTIMIZADO ====================
// Carrito Libre + Lógica Condicional

class OptimizedOrderSystem {
    constructor() {
        this.cart = {}; // { productId: quantity }
        this.init();
    }
    
    init() {
        this.renderProductList();
        this.setupEventListeners();
        this.updateUI();
    }
    
    // ==================== RENDER PRODUCTS ====================
    renderProductList() {
        this.renderEmpanadas();
        this.renderBebidas();
        this.renderCombos();
    }
    
    renderEmpanadas() {
        const container = document.getElementById('empanadasList');
        if (!container) return;
        
        let html = '';
        PRODUCTS_OPTIMIZED.empanadas.forEach(product => {
            html += this.createProductRow(product);
        });
        container.innerHTML = html;
    }
    
    renderBebidas() {
        const container = document.getElementById('bebidasList');
        if (!container) return;
        
        let html = '';
        PRODUCTS_OPTIMIZED.bebidas.forEach(product => {
            html += this.createProductRow(product);
        });
        container.innerHTML = html;
    }
    
    renderCombos() {
        const container = document.getElementById('combosList');
        if (!container) return;
        
        let html = '';
        PRODUCTS_OPTIMIZED.combos.forEach(product => {
            html += this.createProductRow(product, true);
        });
        container.innerHTML = html;
    }
    
    createProductRow(product, showDescription = false) {
        const quantity = this.cart[product.id] || 0;
        
        return `
            <div class="product-row" data-product-id="${product.id}">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    ${showDescription ? `<div class="product-desc">${product.description}</div>` : ''}
                    <div class="product-price">Gs. ${this.formatPrice(product.price)}</div>
                </div>
                <div class="product-controls">
                    <button type="button" class="qty-btn" onclick="orderSystem.decreaseQuantity('${product.id}')">−</button>
                    <input type="number" 
                           class="qty-input" 
                           value="${quantity}" 
                           min="0"
                           data-product-id="${product.id}"
                           onchange="orderSystem.setQuantity('${product.id}', this.value)">
                    <button type="button" class="qty-btn" onclick="orderSystem.increaseQuantity('${product.id}')">+</button>
                </div>
            </div>
        `;
    }
    
    // ==================== CART MANAGEMENT ====================
    increaseQuantity(productId) {
        this.cart[productId] = (this.cart[productId] || 0) + 1;
        this.updateUI();
    }
    
    decreaseQuantity(productId) {
        if (this.cart[productId] && this.cart[productId] > 0) {
            this.cart[productId]--;
            if (this.cart[productId] === 0) {
                delete this.cart[productId];
            }
        }
        this.updateUI();
    }
    
    setQuantity(productId, value) {
        const qty = parseInt(value) || 0;
        if (qty > 0) {
            this.cart[productId] = qty;
        } else {
            delete this.cart[productId];
        }
        this.updateUI();
    }
    
    // ==================== UI UPDATE ====================
    updateUI() {
        this.updateQuantityDisplays();
        this.updatePricing();
        this.applyConditionalLogic();
        this.validateOrder();
    }
    
    updateQuantityDisplays() {
        document.querySelectorAll('.qty-input').forEach(input => {
            const productId = input.dataset.productId;
            input.value = this.cart[productId] || 0;
        });
    }
    
    updatePricing() {
        const subtotal = this.calculateSubtotal();
        const delivery = this.getDeliveryCost();
        const total = subtotal + delivery;
        
        document.getElementById('subtotalAmount').textContent = `Gs. ${this.formatPrice(subtotal)}`;
        document.getElementById('deliveryAmount').textContent = delivery > 0 ? `Gs. ${this.formatPrice(delivery)}` : 'Gratis';
        document.getElementById('totalAmount').textContent = `Gs. ${this.formatPrice(total)}`;
    }
    
    calculateSubtotal() {
        let total = 0;
        
        // Empanadas
        PRODUCTS_OPTIMIZED.empanadas.forEach(product => {
            if (this.cart[product.id]) {
                total += product.price * this.cart[product.id];
            }
        });
        
        // Bebidas
        PRODUCTS_OPTIMIZED.bebidas.forEach(product => {
            if (this.cart[product.id]) {
                total += product.price * this.cart[product.id];
            }
        });
        
        // Combos
        PRODUCTS_OPTIMIZED.combos.forEach(product => {
            if (this.cart[product.id]) {
                total += product.price * this.cart[product.id];
            }
        });
        
        return total;
    }
    
    getDeliveryCost() {
        const zoneSelect = document.getElementById('deliveryZone');
        if (!zoneSelect || !zoneSelect.value) return 0;
        
        const deliveryType = document.querySelector('input[name="tipoEntrega"]:checked')?.value;
        if (deliveryType !== 'Envío') return 0;
        
        const zone = DELIVERY_ZONES[zoneSelect.value];
        return zone ? zone.price : 0;
    }
    
    // ==================== CONDITIONAL LOGIC ====================
    applyConditionalLogic() {
        const hasCombo = this.hasComboInCart();
        const comboPersonas = this.getComboPersonas();
        const isLargeOrder = this.calculateSubtotal() >= ORDER_CONFIG.largeOrderThreshold;
        
        // Personalización: SOLO si hay combo de tortas
        const personalizacionSection = document.getElementById('personalizacionSection');
        if (personalizacionSection) {
            personalizacionSection.style.display = hasCombo ? 'block' : 'none';
        }
        
        // Cantidad de invitados: SOLO si combo > 5 personas
        const invitadosSection = document.getElementById('invitadosSection');
        if (invitadosSection) {
            invitadosSection.style.display = (hasCombo && comboPersonas > ORDER_CONFIG.comboPersonasThreshold) ? 'block' : 'none';
        }
        
        // Restricciones: SOLO si hay combo O pedido grande
        const restriccionesSection = document.getElementById('restriccionesSection');
        if (restriccionesSection) {
            restriccionesSection.style.display = (hasCombo || isLargeOrder) ? 'block' : 'none';
        }
    }
    
    hasComboInCart() {
        return PRODUCTS_OPTIMIZED.combos.some(combo => this.cart[combo.id] > 0);
    }
    
    getComboPersonas() {
        let maxPersonas = 0;
        PRODUCTS_OPTIMIZED.combos.forEach(combo => {
            if (this.cart[combo.id] > 0 && combo.personas > maxPersonas) {
                maxPersonas = combo.personas;
            }
        });
        return maxPersonas;
    }
    
    // ==================== VALIDATION ====================
    validateOrder() {
        const errors = [];
        const total = this.calculateSubtotal();
        
        // Validar mínimo general
        if (total > 0 && total < ORDER_CONFIG.minimumOrder) {
            errors.push(`Pedido mínimo: Gs. ${this.formatPrice(ORDER_CONFIG.minimumOrder)}`);
        }
        
        // Validar mínimo de empanadas
        const totalEmpanadas = this.getTotalEmpanadas();
        if (totalEmpanadas > 0 && totalEmpanadas < ORDER_CONFIG.minimumEmpanadas) {
            errors.push(`Empanadas: mínimo ${ORDER_CONFIG.minimumEmpanadas} unidades`);
        }
        
        // Mostrar errores
        const errorContainer = document.getElementById('orderErrors');
        const submitBtn = document.getElementById('submitOrderBtn');
        
        if (errors.length > 0) {
            errorContainer.innerHTML = errors.map(err => `<div class="error-msg">⚠️ ${err}</div>`).join('');
            errorContainer.style.display = 'block';
            submitBtn.disabled = true;
        } else {
            errorContainer.style.display = 'none';
            submitBtn.disabled = total === 0;
        }
    }
    
    getTotalEmpanadas() {
        let total = 0;
        PRODUCTS_OPTIMIZED.empanadas.forEach(product => {
            if (this.cart[product.id]) {
                total += this.cart[product.id];
            }
        });
        return total;
    }
    
    // ==================== ORDER SUBMISSION ====================
    submitOrder(e) {
        e.preventDefault();
        
        if (!this.validateOrderForSubmit()) {
            return;
        }
        
        const orderData = this.prepareOrderData();
        const whatsappMessage = this.buildWhatsAppMessage(orderData);
        
        // Enviar a WhatsApp
        const whatsappURL = `https://wa.me/595985373995?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappURL, '_blank');
        
        // Mostrar mensaje de confirmación al cliente
        this.showSuccessMessage();
        
        // Reset form
        this.resetOrder();
    }
    
    validateOrderForSubmit() {
        const total = this.calculateSubtotal();
        if (total === 0) {
            alert('Por favor seleccioná al menos un producto');
            return false;
        }
        
        if (total < ORDER_CONFIG.minimumOrder) {
            alert(`El pedido mínimo es de Gs. ${this.formatPrice(ORDER_CONFIG.minimumOrder)}`);
            return false;
        }
        
        const totalEmpanadas = this.getTotalEmpanadas();
        if (totalEmpanadas > 0 && totalEmpanadas < ORDER_CONFIG.minimumEmpanadas) {
            alert(`Pedido mínimo de empanadas: ${ORDER_CONFIG.minimumEmpanadas} unidades`);
            return false;
        }
        
        return true;
    }
    
    prepareOrderData() {
        const data = {
            productos: this.getOrderedProducts(),
            personalizacion: this.getPersonalizacion(),
            invitados: this.getInvitados(),
            restricciones: this.getRestricciones(),
            delivery: this.getDeliveryInfo(),
            pago: this.getPaymentMethod(),
            fecha: document.getElementById('fechaEntrega')?.value,
            comentarios: document.getElementById('comentariosExtra')?.value,
            subtotal: this.calculateSubtotal(),
            deliveryCost: this.getDeliveryCost(),
            total: this.calculateSubtotal() + this.getDeliveryCost()
        };
        
        return data;
    }
    
    getOrderedProducts() {
        const products = [];
        
        // Get all products with quantities
        const allProducts = [
            ...PRODUCTS_OPTIMIZED.empanadas,
            ...PRODUCTS_OPTIMIZED.bebidas,
            ...PRODUCTS_OPTIMIZED.combos
        ];
        
        allProducts.forEach(product => {
            if (this.cart[product.id]) {
                products.push({
                    name: product.name,
                    quantity: this.cart[product.id],
                    price: product.price,
                    subtotal: product.price * this.cart[product.id]
                });
            }
        });
        
        return products;
    }
    
    getPersonalizacion() {
        if (!this.hasComboInCart()) return null;
        
        const wantsPersonalization = document.querySelector('input[name="personalizacion"]:checked')?.value === 'Si';
        if (!wantsPersonalization) return null;
        
        return {
            nombre: document.getElementById('personalizacionNombre')?.value,
            edad: document.getElementById('personalizacionEdad')?.value,
            colores: Array.from(document.querySelectorAll('input[name="colores"]:checked')).map(cb => cb.value),
            evento: document.getElementById('tipoEvento')?.value,
            tematica: document.getElementById('tematica')?.value,
            mensaje: document.getElementById('mensajePersonalizado')?.value
        };
    }
    
    getInvitados() {
        const section = document.getElementById('invitadosSection');
        if (!section || section.style.display === 'none') return null;
        
        return document.getElementById('cantidadPersonas')?.value;
    }
    
    getRestricciones() {
        const section = document.getElementById('restriccionesSection');
        if (!section || section.style.display === 'none') return [];
        
        return Array.from(document.querySelectorAll('input[name="restrictions"]:checked')).map(cb => cb.value);
    }
    
    getDeliveryInfo() {
        const tipo = document.querySelector('input[name="tipoEntrega"]:checked')?.value;
        const zona = document.getElementById('deliveryZone')?.value;
        
        return {
            tipo: tipo,
            zona: zona ? DELIVERY_ZONES[zona]?.name : null
        };
    }
    
    getPaymentMethod() {
        return document.querySelector('input[name="metodoPago"]:checked')?.value;
    }
    
    // ==================== WHATSAPP MESSAGE ====================
    buildWhatsAppMessage(data) {
        let msg = `🎂 *NUEVO PEDIDO - DULCE RO*\n\n`;
        
        // Productos
        msg += `📦 *PRODUCTOS*\n`;
        data.productos.forEach(p => {
            msg += `• ${p.name} x${p.quantity} - Gs. ${this.formatPrice(p.subtotal)}\n`;
        });
        msg += `\n`;
        
        // Personalización
        if (data.personalizacion) {
            msg += `🎨 *PERSONALIZACIÓN*\n`;
            if (data.personalizacion.nombre) msg += `Nombre: ${data.personalizacion.nombre}\n`;
            if (data.personalizacion.edad) msg += `Edad: ${data.personalizacion.edad}\n`;
            if (data.personalizacion.colores.length) msg += `Colores: ${data.personalizacion.colores.join(', ')}\n`;
            if (data.personalizacion.evento) msg += `Evento: ${data.personalizacion.evento}\n`;
            if (data.personalizacion.tematica) msg += `Temática: ${data.personalizacion.tematica}\n`;
            if (data.personalizacion.mensaje) msg += `Mensaje: ${data.personalizacion.mensaje}\n`;
            msg += `\n`;
        }
        
        // Invitados
        if (data.invitados) {
            msg += `👥 *INVITADOS*: ${data.invitados} personas\n\n`;
        }
        
        // Restricciones
        if (data.restricciones.length > 0) {
            msg += `🌿 *RESTRICCIONES*: ${data.restricciones.join(', ')}\n\n`;
        }
        
        // Entrega
        msg += `🚚 *ENTREGA*\n`;
        msg += `Tipo: ${data.delivery.tipo}\n`;
        if (data.delivery.zona) msg += `Zona: ${data.delivery.zona}\n`;
        if (data.fecha) msg += `Fecha: ${data.fecha}\n`;
        msg += `\n`;
        
        // Pago
        if (data.pago) {
            msg += `💳 *PAGO*: ${data.pago}\n\n`;
        }
        
        // Total
        msg += `💰 *RESUMEN*\n`;
        msg += `Subtotal: Gs. ${this.formatPrice(data.subtotal)}\n`;
        msg += `Delivery: Gs. ${this.formatPrice(data.deliveryCost)}\n`;
        msg += `*TOTAL: Gs. ${this.formatPrice(data.total)}*\n`;
        
        // Comentarios
        if (data.comentarios) {
            msg += `\n📝 *COMENTARIOS*\n${data.comentarios}`;
        }
        
        return msg;
    }
    
    // ==================== SUCCESS MESSAGE ====================
    showSuccessMessage() {
        const modal = document.getElementById('modalSuccess');
        const message = document.getElementById('successMessage');
        
        if (message) {
            message.textContent = 'Su pedido ha sido procesado y ya fue recibido por nuestro local. Muchas gracias.';
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    resetOrder() {
        this.cart = {};
        document.getElementById('orderForm')?.reset();
        this.updateUI();
    }
    
    // ==================== HELPERS ====================
    formatPrice(price) {
        return price.toLocaleString('es-PY');
    }
    
    setupEventListeners() {
        // Form submit
        document.getElementById('orderForm')?.addEventListener('submit', (e) => {
            this.submitOrder(e);
        });
        
        // Delivery type change
        document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const zones = document.getElementById('deliveryZones');
                if (radio.value === 'Envío') {
                    zones?.classList.add('active');
                } else {
                    zones?.classList.remove('active');
                }
                this.updatePricing();
            });
        });
        
        // Delivery zone change
        document.getElementById('deliveryZone')?.addEventListener('change', () => {
            this.updatePricing();
        });
        
        // Personalization toggle
        document.querySelectorAll('input[name="personalizacion"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const options = document.getElementById('personalizationOptions');
                if (e.target.value === 'Si') {
                    options?.classList.add('active');
                } else {
                    options?.classList.remove('active');
                }
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.orderSystem = new OptimizedOrderSystem();
});
