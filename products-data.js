// ==================== BASE DE PRODUCTOS CON PRECIOS ====================
// Dulce Ro - Sistema de Pedidos Inteligente

const PRODUCTS_DB = {
    combos: [
        {
            id: 'combo1',
            name: 'Combo 1 (1kg)',
            description: 'Torta 1kg + 6 cupcakes',
            category: 'combo',
            price: 135000,
            minPersonas: 1,
            includes: ['Torta de 1kg con cobertura chantilly + toppers', '6 cupcakes con topper']
        },
        {
            id: 'combo2',
            name: 'Combo 2 (2kg)',
            description: 'Torta 2kg + 10 cupcakes + 10 cookies',
            category: 'combo',
            price: 300000,
            minPersonas: 1,
            includes: ['Torta de 2kg con cobertura chantilly + toppers', '10 cupcakes con topper', '10 cookies']
        },
        {
            id: 'combo3',
            name: 'Combo 3 (3kg)',
            description: 'Torta 3kg + 50 bocaditos + 10 galletitas + 15 shots',
            category: 'combo',
            price: 475000,
            minPersonas: 1,
            includes: ['Torta de 3kg con chantilly + toppers', '50 bocaditos dulces', '10 galletitas personalizadas', '15 shots dulces']
        }
    ],
    
    empanadas: [
        {
            id: 'emp-carne',
            name: 'Empanadas de Carne',
            category: 'empanada',
            price: 5000,
            priceUnit: 'unidad',
            minOrder: 5,
            sabor: 'carne'
        },
        {
            id: 'emp-mandioca',
            name: 'Empanadas de Mandioca',
            category: 'empanada',
            price: 5000,
            priceUnit: 'unidad',
            minOrder: 5,
            sabor: 'mandioca'
        },
        {
            id: 'emp-jamon',
            name: 'Empanadas de Jamón y Queso',
            category: 'empanada',
            price: 5000,
            priceUnit: 'unidad',
            minOrder: 5,
            sabor: 'jamon-queso'
        },
        {
            id: 'emp-pollo',
            name: 'Empanadas de Pollo',
            category: 'empanada',
            price: 5000,
            priceUnit: 'unidad',
            minOrder: 5,
            sabor: 'pollo'
        }
    ],
    
    bebidas: [
        {
            id: 'beb-coca',
            name: 'Coca Cola 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'gaseosa'
        },
        {
            id: 'beb-guarana',
            name: 'Guaraná 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        },
        {
            id: 'beb-sprite',
            name: 'Sprite 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'gaseosa'
        },
        {
            id: 'beb-zanahoria',
            name: 'Jugo de Zanahoria 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        },
        {
            id: 'beb-remolacha',
            name: 'Jugo de Remolacha 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        },
        {
            id: 'beb-verde',
            name: 'Jugo Verde 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        },
        {
            id: 'beb-pina',
            name: 'Jugo de Piña 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        },
        {
            id: 'beb-banana',
            name: 'Jugo de Banana 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        },
        {
            id: 'beb-frutilla',
            name: 'Jugo de Frutilla 500ml',
            category: 'bebida',
            price: 5000,
            priceUnit: 'unidad',
            tipo: 'pulp'
        }
    ]
};

// ==================== ZONAS DE DELIVERY ====================
const DELIVERY_ZONES = {
    'fernando-sur': {
        name: 'Fernando de la Mora (Sur)',
        price: 10000,
        priority: 1
    },
    'fernando-norte': {
        name: 'Fernando de la Mora (Norte)',
        price: 10000,
        priority: 1
    },
    'san-lorenzo': {
        name: 'San Lorenzo',
        price: 10000,
        priority: 1
    },
    'capiata': {
        name: 'Capiatá',
        price: 15000,
        priority: 2
    },
    'luque': {
        name: 'Luque',
        price: 12000,
        priority: 2
    },
    'villa-elisa': {
        name: 'Villa Elisa',
        price: 10000,
        priority: 1
    },
    'nemby': {
        name: 'Ñemby',
        price: 12000,
        priority: 2
    },
    'asuncion': {
        name: 'Asunción',
        price: 15000,
        priority: 2
    },
    'ypane': {
        name: 'Ypané',
        price: 20000,
        priority: 3
    },
    'mariano': {
        name: 'Mariano Roque Alonso',
        price: 18000,
        priority: 3
    },
    'otra': {
        name: 'Otra zona',
        price: 0,
        priority: 4,
        requiresContact: true
    }
};

// ==================== CONFIGURACIÓN DEL SISTEMA ====================
const ORDER_CONFIG = {
    minimumOrder: 25000,
    largeEventThreshold: 10, // personas
    largeEventExtraPerPerson: 15000, // Gs por persona adicional
    deliveryIncluded: false,
    paymentAlias: 'DULCERO.PY'
};

// ==================== OPCIONES DE PERSONALIZACIÓN ====================
const PERSONALIZATION_OPTIONS = {
    colors: ['Rosado', 'Celeste', 'Amarillo', 'Verde', 'Violeta', 'Rojo', 'Multicolor'],
    eventTypes: ['Cumpleaños', 'Boda', 'Graduación', 'Baby Shower', 'Aniversario', 'Corporativo', 'Otro'],
    themes: ['Princesas', 'Superhéroes', 'Unicornios', 'Dinosaurios', 'Frozen', 'Paw Patrol', 'Elegante', 'Minimalista', 'Otro']
};

// ==================== RESTRICCIONES ALIMENTARIAS ====================
const DIETARY_RESTRICTIONS = [
    { id: 'sin-azucar', label: 'Sin azúcar', extraCost: 0 },
    { id: 'integral', label: 'Integral', extraCost: 0 },
    { id: 'sin-gluten', label: 'Sin gluten', extraCost: 0 },
    { id: 'sin-lactosa', label: 'Sin lactosa', extraCost: 0 },
    { id: 'vegano', label: 'Vegano', extraCost: 0 },
    { id: 'ninguna', label: 'Ninguna', extraCost: 0 }
];

// ==================== MÉTODOS DE PAGO ====================
const PAYMENT_METHODS = [
    { id: 'qr', label: 'Código QR', icon: '📱' },
    { id: 'efectivo', label: 'Efectivo', icon: '💵' },
    { id: 'transferencia', label: 'Transferencia', icon: '🏦', showAlias: true }
];

// ==================== EMPANADA COOKING OPTIONS ====================
const COOKING_OPTIONS = [
    { id: 'fritas', label: 'Fritas' },
    { id: 'horno', label: 'Al Horno' }
];
