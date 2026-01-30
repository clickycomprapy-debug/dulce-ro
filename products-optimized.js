// ==================== BASE DE PRODUCTOS OPTIMIZADA ====================
// Sistema de Carrito Libre - Dulce Ro

const PRODUCTS_OPTIMIZED = {
    empanadas: [
        // Jamón y Queso
        { id: 'emp-jq-frita', name: 'Empanada de jamón y queso frita', price: 5000, category: 'empanada', sabor: 'jamón y queso', coccion: 'frita' },
        { id: 'emp-jq-horno', name: 'Empanada de jamón y queso al horno', price: 5000, category: 'empanada', sabor: 'jamón y queso', coccion: 'al horno' },
        
        // Carne
        { id: 'emp-carne-frita', name: 'Empanada de carne frita', price: 5000, category: 'empanada', sabor: 'carne', coccion: 'frita' },
        { id: 'emp-carne-horno', name: 'Empanada de carne al horno', price: 5000, category: 'empanada', sabor: 'carne', coccion: 'al horno' },
        
        // Mandioca
        { id: 'emp-mandioca-frita', name: 'Empanada de mandioca frita', price: 5000, category: 'empanada', sabor: 'mandioca', coccion: 'frita' },
        { id: 'emp-mandioca-horno', name: 'Empanada de mandioca al horno', price: 5000, category: 'empanada', sabor: 'mandioca', coccion: 'al horno' },
        
        // Pollo
        { id: 'emp-pollo-frita', name: 'Empanada de pollo frita', price: 5000, category: 'empanada', sabor: 'pollo', coccion: 'frita' },
        { id: 'emp-pollo-horno', name: 'Empanada de pollo al horno', price: 5000, category: 'empanada', sabor: 'pollo', coccion: 'al horno' }
    ],
    
    bebidas: [
        { id: 'beb-coca', name: 'Coca Cola 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-guarana', name: 'Guaraná 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-sprite', name: 'Sprite 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-zanahoria', name: 'Jugo de Zanahoria 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-remolacha', name: 'Jugo de Remolacha 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-verde', name: 'Jugo Verde 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-pina', name: 'Jugo de Piña 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-banana', name: 'Jugo de Banana 500ml', price: 5000, category: 'bebida' },
        { id: 'beb-frutilla', name: 'Jugo de Frutilla 500ml', price: 5000, category: 'bebida' }
    ],
    
    combos: [
        { 
            id: 'combo1', 
            name: 'Combo 1 (1kg)', 
            price: 135000, 
            category: 'combo',
            personas: 5,
            description: 'Torta 1kg + 6 cupcakes'
        },
        { 
            id: 'combo2', 
            name: 'Combo 2 (2kg)', 
            price: 300000, 
            category: 'combo',
            personas: 10,
            description: 'Torta 2kg + 10 cupcakes + 10 cookies'
        },
        { 
            id: 'combo3', 
            name: 'Combo 3 (3kg)', 
            price: 475000, 
            category: 'combo',
            personas: 15,
            description: 'Torta 3kg + 50 bocaditos + 10 galletitas + 15 shots'
        }
    ]
};

// Zonas de delivery (mantener igual)
const DELIVERY_ZONES = {
    'fernando-sur': { name: 'Fernando de la Mora (Sur)', price: 10000 },
    'fernando-norte': { name: 'Fernando de la Mora (Norte)', price: 10000 },
    'san-lorenzo': { name: 'San Lorenzo', price: 10000 },
    'capiata': { name: 'Capiatá', price: 15000 },
    'luque': { name: 'Luque', price: 12000 },
    'villa-elisa': { name: 'Villa Elisa', price: 10000 },
    'nemby': { name: 'Ñemby', price: 12000 },
    'asuncion': { name: 'Asunción', price: 15000 },
    'ypane': { name: 'Ypané', price: 20000 },
    'mariano': { name: 'Mariano Roque Alonso', price: 18000 },
    'otra': { name: 'Otra zona', price: 0, requiresContact: true }
};

// Configuración
const ORDER_CONFIG = {
    minimumOrder: 25000,
    minimumEmpanadas: 5,
    largeOrderThreshold: 100000, // Gs
    comboPersonasThreshold: 5
};

// Testimonios por categoría
const TESTIMONIALS = {
    dulces: [
        { text: 'La mejor torta, riquísimo. Recomendado.', author: 'Noelia González' },
        { text: 'Muy rico y fresco, ideal para cumpleaños.', author: 'María López' },
        { text: 'Hermosa presentación y excelente sabor.', author: 'Carlos Benítez' }
    ],
    salados: [
        { text: 'Barato y rico, vuelvo a comprar.', author: 'Pedro Cardozo' },
        { text: 'Las empanadas espectaculares.', author: 'Ana Rojas' },
        { text: 'Perfecto para reuniones.', author: 'Luis Fernández' }
    ],
    saludables: [
        { text: 'Saludable pero con mucho sabor.', author: 'Lucía Martínez' },
        { text: 'Ideal para cuidar la alimentación.', author: 'Jorge Ramírez' },
        { text: 'Muy buena opción fit.', author: 'Paola Giménez' }
    ]
};
