/**
 * Fun Face Game - 付費系統 (Payment)
 * @version 1.0.0
 * @date 2024-12-30
 */

const Payment = (function() {
  'use strict';

  let config = null;
  let storage = null;
  let analytics = null;
  let enabled = false;
  let provider = null;
  let products = [];
  let initialized = false;
  let pendingPurchase = null;

  function init() {
    if (typeof Config !== 'undefined') {
      config = Config;
      enabled = Config.payment ? Config.payment.enabled : false;
      provider = Config.payment ? Config.payment.provider : null;
      products = Config.payment ? Config.payment.products : [];
    }

    if (typeof Storage !== 'undefined') storage = Storage;
    if (typeof Analytics !== 'undefined') analytics = Analytics;

    if (!enabled) {
      if (config && config.log) {
        config.log('info', 'Payment disabled');
      }
      initialized = true;
      return false;
    }

    initialized = true;

    if (config && config.log) {
      config.log('info', 'Payment initialized', {provider: provider});
    }

    return true;
  }

  function isEnabled() {
    return enabled;
  }

  function isInitialized() {
    return initialized;
  }

  function getProducts() {
    return products.map(function(p) {
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        currency: p.currency,
        type: p.type,
        description: p.description,
        purchased: hasPurchased(p.id)
      };
    });
  }

  function getProduct(productId) {
    const product = products.find(function(p) { return p.id === productId; });
    if (!product) return null;
    
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      type: product.type,
      description: product.description,
      purchased: hasPurchased(product.id)
    };
  }

  function hasPurchased(productId) {
    if (!storage) return false;
    return storage.hasPurchased(productId);
  }

  function getPurchases() {
    if (!storage) return [];
    return storage.getAllPurchases();
  }

  function purchase(productId, onSuccess, onError) {
    if (!enabled) {
      if (onError) onError({code: 'DISABLED', message: 'Payment system is disabled'});
      return false;
    }

    if (!initialized) {
      if (onError) onError({code: 'NOT_INITIALIZED', message: 'Payment system not initialized'});
      return false;
    }

    const product = getProduct(productId);
    if (!product) {
      if (onError) onError({code: 'PRODUCT_NOT_FOUND', message: 'Product not found'});
      return false;
    }

    if (product.purchased) {
      if (onError) onError({code: 'ALREADY_PURCHASED', message: 'Product already purchased'});
      return false;
    }

    pendingPurchase = {
      productId: productId,
      product: product,
      timestamp: Date.now(),
      onSuccess: onSuccess,
      onError: onError
    };

    if (config && config.log) {
      config.log('info', 'Starting purchase', {productId: productId});
    }

    if (provider === 'simulation' || !provider) {
      simulatePurchase(productId, product);
    } else {
      if (onError) onError({code: 'PROVIDER_NOT_IMPLEMENTED', message: 'Payment provider not implemented'});
    }

    return true;
  }

  function simulatePurchase(productId, product) {
    setTimeout(function() {
      const success = Math.random() > 0.1;
      
      if (success) {
        completePurchase(productId, product);
      } else {
        failPurchase({code: 'SIMULATION_FAILED', message: 'Simulated purchase failed'});
      }
    }, 2000);
  }

  function completePurchase(productId, product) {
    if (!storage) {
      failPurchase({code: 'STORAGE_NOT_AVAILABLE', message: 'Storage not available'});
      return;
    }

    storage.savePurchase(productId);

    if (analytics) {
      analytics.trackPurchase(productId, product.price, product.currency);
    }

    if (config && config.log) {
      config.log('info', 'Purchase completed', {productId: productId});
    }

    if (pendingPurchase && pendingPurchase.onSuccess) {
      pendingPurchase.onSuccess({
        productId: productId,
        product: product,
        transactionId: 'txn_' + Date.now()
      });
    }

    pendingPurchase = null;

    if (typeof window !== 'undefined') {
      const event = new CustomEvent('purchaseComplete', {
        detail: {productId: productId, product: product}
      });
      window.dispatchEvent(event);
    }
  }

  function failPurchase(error) {
    if (config && config.log) {
      config.log('error', 'Purchase failed', error);
    }

    if (pendingPurchase && pendingPurchase.onError) {
      pendingPurchase.onError(error);
    }

    pendingPurchase = null;
  }

  function restore(onSuccess, onError) {
    if (!enabled) {
      if (onError) onError({code: 'DISABLED', message: 'Payment system is disabled'});
      return false;
    }

    if (!storage) {
      if (onError) onError({code: 'STORAGE_NOT_AVAILABLE', message: 'Storage not available'});
      return false;
    }

    const purchases = storage.getAllPurchases();

    if (config && config.log) {
      config.log('info', 'Restoring purchases', {count: purchases.length});
    }

    if (onSuccess) {
      onSuccess({
        purchases: purchases,
        count: purchases.length
      });
    }

    return true;
  }

  function clearPurchases() {
    if (!storage) return false;
    
    const purchases = storage.getAllPurchases();
    purchases.forEach(function(productId) {
      const key = 'purchases';
      const current = storage.get(key, []);
      const filtered = current.filter(function(id) { return id !== productId; });
      storage.set(key, filtered, Infinity);
    });

    if (config && config.log) {
      config.log('info', 'Purchases cleared');
    }

    return true;
  }

  function getProductPrice(productId, language) {
    const product = getProduct(productId);
    if (!product) return null;

    const name = language && product.name[language] 
      ? product.name[language] 
      : product.name['en'];

    return {
      id: product.id,
      name: name,
      price: product.price,
      currency: product.currency,
      formattedPrice: formatPrice(product.price, product.currency)
    };
  }

  function formatPrice(price, currency) {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥',
      TWD: 'NT$'
    };

    const symbol = symbols[currency] || currency;
    
    if (currency === 'JPY' || currency === 'CNY') {
      return symbol + Math.round(price);
    }

    return symbol + price.toFixed(2);
  }

  function isPurchasePending() {
    return pendingPurchase !== null;
  }

  function cancelPendingPurchase() {
    if (!pendingPurchase) return false;

    if (config && config.log) {
      config.log('info', 'Purchase cancelled', {productId: pendingPurchase.productId});
    }

    if (pendingPurchase.onError) {
      pendingPurchase.onError({code: 'CANCELLED', message: 'Purchase cancelled by user'});
    }

    pendingPurchase = null;
    return true;
  }

  function getConfig() {
    return {
      enabled: enabled,
      provider: provider,
      initialized: initialized,
      productCount: products.length,
      purchaseCount: getPurchases().length,
      pendingPurchase: pendingPurchase !== null
    };
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    init: init,
    isEnabled: isEnabled,
    isInitialized: isInitialized,
    getProducts: getProducts,
    getProduct: getProduct,
    hasPurchased: hasPurchased,
    getPurchases: getPurchases,
    purchase: purchase,
    restore: restore,
    clearPurchases: clearPurchases,
    getProductPrice: getProductPrice,
    formatPrice: formatPrice,
    isPurchasePending: isPurchasePending,
    cancelPendingPurchase: cancelPendingPurchase,
    getConfig: getConfig
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Payment;
if (typeof window !== 'undefined') window.Payment = Payment;
