// ==================== SISTEMA DE PEDIDOS INTELIGENTE ====================
// Dulce Ro - Smart Order System

class OrderSystem {
    constructor() {
        this.currentOrder = {
            product: null,
            quantity: 1,
            cookingOption: null, // Para empanadas
            personalization: {
                enabled: false,
                name: '',
                age: '',
                colors: [],
                theme: '',
                eventType: '',
                message: ''
            },
            restrictions: [],
            delivery: {
                type: 'retiro',
                zone: null,
                zoneCost: 0
            },
            payment: null,
            totalPersonas: 1
        };
        
        this.ticketCounter = this.loadTicketCounter();
        this.init();
    }
    
    init() {
        this.renderProductSelector();
        this.setupEventListeners();
        this.updateTotalPrice();
    }
    
    // ==================== RENDER PRODUCT SELECTOR ====================
    renderProductSelector() {
        const selector = document.getElementById('productSelector');
        if (!selector) return;
        
        let options = '<option value="">Seleccioná tu producto...</option>';
        
        // Combos
        options += '<optgroup label="🎂 Combos Especiales">';
        PRODUCTS_DB.combos.forEach(product => {
            options += `<option value="${product.id}" data-category="combo" data-price="${product.price}">
                ${product.name} - Gs. ${this.formatPrice(product.price)}
            </option>`;
        });
        options += '</optgroup>';
        
        // Empanadas
        options += '<optgroup label="🥐 Empanadas (Mínimo 5 unidades)">';
        PRODUCTS_DB.empanadas.forEach(product => {
            options += `<option value="${product.id}" data-category="empanada" data-price="${product.price}">
                ${product.name} - Gs. ${this.formatPrice(product.price)} c/u
            </option>`;
        });
        options += '</optgroup>';
        
        // Bebidas
        options += '<optgroup label="🥤 Bebidas 500ml">';
        PRODUCTS_DB.bebidas.forEach(product => {
            options += `<option value="${product.id}" data-category="bebida" data-price="${product.price}">
                ${product.name} - Gs. ${this.formatPrice(product.price)} c/u
            </option>`;
        });
        options += '</optgroup>';
        
        selector.innerHTML = options;
    }
    
    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        // Product Selection
        document.getElementById('productSelector')?.addEventListener('change', (e) => {
            this.onProductChange(e.target.value);
        });
        
        // Quantity Controls
        document.getElementById('decreaseQty')?.addEventListener('click', () => {
            this.changeQuantity(-1);
        });
        
        document.getElementById('increaseQty')?.addEventListener('click', () => {
            this.changeQuantity(1);
        });
        
        document.getElementById('quantityInput')?.addEventListener('change', (e) => {
            this.setQuantity(parseInt(e.target.value) || 1);
        });
        
        // Personalization Toggle
        document.querySelectorAll('input[name="personalizacion"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePersonalization(e.target.value === 'Si');
            });
        });
        
        // Delivery Type
        document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.onDeliveryTypeChange(e.target.value);
            });
        });
        
        // Delivery Zone
        document.getElementById('deliveryZone')?.addEventListener('change', (e) => {
            this.onDeliveryZoneChange(e.target.value);
        });
        
        // Form Submit
        document.getElementById('orderForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
    }
    
    // ==================== PRODUCT CHANGE ====================
    onProductChange(productId) {
        if (!productId) {
            this.currentOrder.product = null;
            this.updateTotalPrice();
            return;
        }
        
        // Find product in database
        let product = null;
        
        product = PRODUCTS_DB.combos.find(p => p.id === productId);
        if (!product) product = PRODUCTS_DB.empanadas.find(p => p.id === productId);
        if (!product) product = PRODUCTS_DB.bebidas.find(p => p.id === productId);
        
        this.currentOrder.product = product;
        
        // Show cooking options for empanadas
        if (product && product.category === 'empanada') {
            document.getElementById('cookingOptions')?.classList.add('active');
            // Set minimum quantity for empanadas
            if (this.currentOrder.quantity < product.minOrder) {
                this.setQuantity(product.minOrder);
            }
        } else {
            document.getElementById('cookingOptions')?.classList.remove('active');
            this.currentOrder.cookingOption = null;
        }
        
        this.updateTotalPrice();
        this.checkMinimumOrder();
    }
    
    // ==================== QUANTITY MANAGEMENT ====================
    changeQuantity(delta) {
        const newQty = this.currentOrder.quantity + delta;
        this.setQuantity(newQty);
    }
    
    setQuantity(qty) {
        // Validate minimum
        let minQty = 1;
        if (this.currentOrder.product?.category === 'empanada') {
            minQty = this.currentOrder.product.minOrder || 5;
        }
        
        this.currentOrder.quantity = Math.max(minQty, qty);
        document.getElementById('quantityInput').value = this.currentOrder.quantity;
        
        this.updateTotalPrice();
        this.checkMinimumOrder();
        this.checkLargeEvent();
    }
    
    // ==================== PERSONALIZATION ====================
    togglePersonalization(enabled) {
        this.currentOrder.personalization.enabled = enabled;
        const options = document.getElementById('personalizationOptions');
        
        if (enabled) {
            options?.classList.add('active');
        } else {
            options?.classList.remove('active');
            // Reset personalization data
            this.currentOrder.personalization = {
                enabled: false,
                name: '',
                age: '',
                colors: [],
                theme: '',
                eventType: '',
                message: ''
            };
        }
    }
    
    // ==================== DELIVERY ====================
    onDeliveryTypeChange(type) {
        this.currentOrder.delivery.type = type;
        const zoneSelector = document.getElementById('deliveryZones');
        
        if (type === 'Envío') {
            zoneSelector?.classList.add('active');
        } else {
            zoneSelector?.classList.remove('active');
            this.currentOrder.delivery.zone = null;
            this.currentOrder.delivery.zoneCost = 0;
        }
        
        this.updateTotalPrice();
    }
    
    onDeliveryZoneChange(zoneId) {
        const zone = DELIVERY_ZONES[zoneId];
        this.currentOrder.delivery.zone = zone;
        this.currentOrder.delivery.zoneCost = zone?.price || 0;
        
        // Show zone info
        const zoneInfo = document.getElementById('zoneInfo');
        if (zone && !zone.requiresContact) {
            zoneInfo.textContent = `Costo de envío: Gs. ${this.formatPrice(zone.price)}`;
            zoneInfo.classList.add('active');
        } else if (zone?.requiresContact) {
            zoneInfo.textContent = 'Consultá el costo de envío por WhatsApp';
            zoneInfo.classList.add('active');
        } else {
            zoneInfo.classList.remove('active');
        }
        
        // Check if torta + far zone
        if (this.currentOrder.product?.category === 'combo' && zone?.priority >= 3) {
            this.showAlert('warning', '⚠️ Para tortas a zonas lejanas, contactanos por WhatsApp para coordinar transporte especial');
        }
        
        this.updateTotalPrice();
    }
    
    // ==================== PRICE CALCULATION ====================
    calculateSubtotal() {
        if (!this.currentOrder.product) return 0;
        return this.currentOrder.product.price * this.currentOrder.quantity;
    }
    
    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const delivery = this.currentOrder.delivery.zoneCost || 0;
        return subtotal + delivery;
    }
    
    updateTotalPrice() {
        const subtotal = this.calculateSubtotal();
        const delivery = this.currentOrder.delivery.zoneCost || 0;
        const total = this.calculateTotal();
        
        document.getElementById('subtotalAmount').textContent = `Gs. ${this.formatPrice(subtotal)}`;
        document.getElementById('deliveryAmount').textContent = delivery > 0 ? `Gs. ${this.formatPrice(delivery)}` : 'Gratis';
        document.getElementById('totalAmount').textContent = `Gs. ${this.formatPrice(total)}`;
    }
    
    // ==================== VALIDATIONS ====================
    checkMinimumOrder() {
        const total = this.calculateTotal();
        const minimumAlert = document.getElementById('minimumAlert');
        
        if (total > 0 && total < ORDER_CONFIG.minimumOrder) {
            minimumAlert?.classList.add('active');
            document.getElementById('submitOrderBtn').disabled = true;
        } else {
            minimumAlert?.classList.remove('active');
            document.getElementById('submitOrderBtn').disabled = false;
        }
    }
    
    checkLargeEvent() {
        // Check if event is for 10+ people
        const personasInput = document.getElementById('cantidadPersonas');
        const personas = parseInt(personasInput?.value) || 1;
        
        this.currentOrder.totalPersonas = personas;
        
        if (personas >= ORDER_CONFIG.largeEventThreshold) {
            this.showAlert('info', `🎉 PEDIDO GRANDE detectado (${personas} personas). 
                Este pedido será revisado manualmente para darte el mejor precio.`);
        }
    }
    
    // ==================== ORDER SUBMISSION ====================
    submitOrder() {
        // Validate form
        if (!this.validateOrder()) {
            return;
        }
        
        // Generate ticket
        const ticket = this.generateTicket();
        
        // Prepare WhatsApp message
        const message = this.prepareWhatsAppMessage(ticket);
        
        // Save to localStorage (simulating database)
        this.saveOrder(ticket);
        
        // Open WhatsApp
        const whatsappURL = `https://wa.me/595985373995?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
        
        // Show success modal
        this.showSuccessModal(ticket);
        
        // Reset form
        this.resetForm();
    }
    
    validateOrder() {
        if (!this.currentOrder.product) {
            alert('Por favor seleccioná un producto');
            return false;
        }
        
        const nombre = document.getElementById('nombreCliente')?.value;
        if (!nombre) {
            alert('Por favor ingresá tu nombre');
            return false;
        }
        
        const total = this.calculateTotal();
        if (total < ORDER_CONFIG.minimumOrder) {
            alert(`El pedido mínimo es de Gs. ${this.formatPrice(ORDER_CONFIG.minimumOrder)}`);
            return false;
        }
        
        return true;
    }
    
    generateTicket() {
        const ticketNumber = this.getNextTicketNumber();
        const isLargeEvent = this.currentOrder.totalPersonas >= ORDER_CONFIG.largeEventThreshold;
        
        return {
            ticketId: ticketNumber,
            isLargeEvent: isLargeEvent,
            timestamp: new Date().toISOString(),
            cliente: document.getElementById('nombreCliente')?.value,
            telefono: document.getElementById('telefonoCliente')?.value,
            producto: this.currentOrder.product,
            cantidad: this.currentOrder.quantity,
            cookingOption: this.currentOrder.cookingOption,
            personalization: this.currentOrder.personalization,
            personas: this.currentOrder.totalPersonas,
            restrictions: this.getSelectedRestrictions(),
            delivery: this.currentOrder.delivery,
            payment: this.getSelectedPayment(),
            subtotal: this.calculateSubtotal(),
            deliveryCost: this.currentOrder.delivery.zoneCost,
            total: this.calculateTotal(),
            comentarios: document.getElementById('comentariosExtra')?.value || ''
        };
    }
    
    prepareWhatsAppMessage(ticket) {
        let msg = `🎫 ${ticket.isLargeEvent ? '🎉 PEDIDO GRANDE' : 'PEDIDO'} #${ticket.ticketId}\n\n`;
        
        msg += `👤 *CLIENTE*\n`;
        msg += `Nombre: ${ticket.cliente}\n`;
        msg += `Teléfono: ${ticket.telefono}\n\n`;
        
        msg += `📦 *PRODUCTO*\n`;
        msg += `${ticket.producto.name}\n`;
        msg += `Cantidad: ${ticket.cantidad}\n`;
        if (ticket.cookingOption) {
            msg += `Cocción: ${ticket.cookingOption}\n`;
        }
        msg += `\n`;
        
        if (ticket.personalization.enabled) {
            msg += `🎨 *PERSONALIZACIÓN*\n`;
            if (ticket.personalization.name) msg += `Nombre: ${ticket.personalization.name}\n`;
            if (ticket.personalization.age) msg += `Edad: ${ticket.personalization.age}\n`;
            if (ticket.personalization.eventType) msg += `Tipo de evento: ${ticket.personalization.eventType}\n`;
            if (ticket.personalization.colors.length) msg += `Colores: ${ticket.personalization.colors.join(', ')}\n`;
            if (ticket.personalization.theme) msg += `Temática: ${ticket.personalization.theme}\n`;
            if (ticket.personalization.message) msg += `Mensaje: ${ticket.personalization.message}\n`;
            msg += `\n`;
        }
        
        if (ticket.personas > 1) {
            msg += `👥 *PERSONAS*: ${ticket.personas}\n\n`;
        }
        
        if (ticket.restrictions.length) {
            msg += `🌿 *RESTRICCIONES*\n${ticket.restrictions.join(', ')}\n\n`;
        }
        
        msg += `🚚 *ENTREGA*\n`;
        msg += `Tipo: ${ticket.delivery.type}\n`;
        if (ticket.delivery.zone) {
            msg += `Zona: ${ticket.delivery.zone.name}\n`;
        }
        msg += `\n`;
        
        msg += `💳 *PAGO*\n${ticket.payment}\n\n`;
        
        msg += `💰 *TOTAL*\n`;
        msg += `Subtotal: Gs. ${this.formatPrice(ticket.subtotal)}\n`;
        msg += `Delivery: Gs. ${this.formatPrice(ticket.deliveryCost)}\n`;
        msg += `*TOTAL: Gs. ${this.formatPrice(ticket.total)}*\n`;
        
        if (ticket.isLargeEvent) {
            msg += `\n⚠️ *NOTA: Pedido grande - Revisar precio manualmente*`;
        }
        
        if (ticket.comentarios) {
            msg += `\n\n📝 *COMENTARIOS*\n${ticket.comentarios}`;
        }
        
        return msg;
    }
    
    // ==================== HELPERS ====================
    getSelectedRestrictions() {
        const checkboxes = document.querySelectorAll('input[name="restrictions"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    getSelectedPayment() {
        const radio = document.querySelector('input[name="metodoPago"]:checked');
        return radio?.value || 'No especificado';
    }
    
    formatPrice(price) {
        return price.toLocaleString('es-PY');
    }
    
    showAlert(type, message) {
        // Implementation for showing alerts
        console.log(`[${type}] ${message}`);
    }
    
    showSuccessModal(ticket) {
        document.getElementById('ticketNumber').textContent = `#${ticket.ticketId}`;
        document.getElementById('modalSuccess').classList.add('active');
    }
    
    // ==================== TICKET MANAGEMENT ====================
    loadTicketCounter() {
        const saved = localStorage.getItem('dulcero_ticket_counter');
        return saved ? parseInt(saved) : 0;
    }
    
    getNextTicketNumber() {
        this.ticketCounter++;
        localStorage.setItem('dulcero_ticket_counter', this.ticketCounter.toString());
        return this.ticketCounter.toString().padStart(4, '0');
    }
    
    saveOrder(ticket) {
        // Save to localStorage for now (will be replaced with backend)
        const orders = JSON.parse(localStorage.getItem('dulcero_orders') || '[]');
        orders.push(ticket);
        localStorage.setItem('dulcero_orders', JSON.stringify(orders));
    }
    
    resetForm() {
        document.getElementById('orderForm')?.reset();
        this.currentOrder = {
            product: null,
            quantity: 1,
            cookingOption: null,
            personalization: {enabled: false},
            restrictions: [],
            delivery: {type: 'retiro', zone: null, zoneCost: 0},
            payment: null,
            totalPersonas: 1
        };
        this.updateTotalPrice();
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    window.orderSystem = new OrderSystem();
});
