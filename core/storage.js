/**
 * Fun Face Game - 本地儲存系統 (Storage)
 * @version 1.0.0
 * @date 2024-12-30
 */

const Storage = (function() {
  'use strict';

  let config = null;
  let prefix = 'funfacegame_';
  let version = '1.0';

  function init() {
    if (typeof Config !== 'undefined') {
      config = Config;
      prefix = Config.storage ? Config.storage.prefix : prefix;
      version = Config.storage ? Config.storage.version : version;
    }
    if (config && config.log) {
      config.log('info', 'Storage initialized', {prefix: prefix, available: isAvailable()});
    }
    return isAvailable();
  }

  function isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getFullKey(key) {
    return prefix + version + '_' + key;
  }

  function set(key, value, expiration) {
    if (!isAvailable()) return false;
    try {
      const data = {value: value, timestamp: Date.now(), expiration: expiration || null};
      const fullKey = getFullKey(key);
      localStorage.setItem(fullKey, JSON.stringify(data));
      if (config && config.log && config.isDevelopment && config.isDevelopment()) {
        config.log('debug', 'Storage.set', {key: key});
      }
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        clearExpired();
        try {
          const data = {value: value, timestamp: Date.now(), expiration: expiration || null};
          localStorage.setItem(getFullKey(key), JSON.stringify(data));
          return true;
        } catch (e2) {
          return false;
        }
      }
      return false;
    }
  }

  function get(key, defaultValue) {
    if (!isAvailable()) return defaultValue !== undefined ? defaultValue : null;
    try {
      const item = localStorage.getItem(getFullKey(key));
      if (!item) return defaultValue !== undefined ? defaultValue : null;
      const data = JSON.parse(item);
      if (data.expiration && Date.now() - data.timestamp > data.expiration) {
        remove(key);
        return defaultValue !== undefined ? defaultValue : null;
      }
      return data.value;
    } catch (e) {
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  function remove(key) {
    if (!isAvailable()) return false;
    try {
      localStorage.removeItem(getFullKey(key));
      return true;
    } catch (e) {
      return false;
    }
  }

  function has(key) {
    if (!isAvailable()) return false;
    try {
      const item = localStorage.getItem(getFullKey(key));
      if (!item) return false;
      const data = JSON.parse(item);
      if (data.expiration && Date.now() - data.timestamp > data.expiration) {
        remove(key);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function clear() {
    if (!isAvailable()) return false;
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      keys.forEach(key => localStorage.removeItem(key));
      if (config && config.log) config.log('info', 'Storage cleared', {count: keys.length});
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearExpired() {
    if (!isAvailable()) return 0;
    let count = 0;
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      keys.forEach(fullKey => {
        try {
          const item = localStorage.getItem(fullKey);
          if (!item) return;
          const data = JSON.parse(item);
          if (data.expiration && Date.now() - data.timestamp > data.expiration) {
            localStorage.removeItem(fullKey);
            count++;
          }
        } catch (e) {
          localStorage.removeItem(fullKey);
          count++;
        }
      });
      if (count > 0 && config && config.log) config.log('info', 'Expired items cleared', {count: count});
      return count;
    } catch (e) {
      return count;
    }
  }

  function keys() {
    if (!isAvailable()) return [];
    try {
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      const prefixLen = (prefix + version + '_').length;
      return allKeys.map(k => k.substring(prefixLen));
    } catch (e) {
      return [];
    }
  }

  function size() {
    return keys().length;
  }

  function getSize() {
    if (!isAvailable()) return 0;
    try {
      let total = 0;
      const projectKeys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      projectKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) total += (key.length + item.length) * 2;
      });
      return total;
    } catch (e) {
      return 0;
    }
  }

  function getUsageRatio() {
    if (!isAvailable()) return 0;
    try {
      const maxSize = 5 * 1024 * 1024;
      return Math.min(getSize() / maxSize, 1);
    } catch (e) {
      return 0;
    }
  }

  function getInfo() {
    return {
      available: isAvailable(),
      prefix: prefix,
      version: version,
      itemCount: size(),
      sizeBytes: getSize(),
      usageRatio: getUsageRatio(),
      keys: keys()
    };
  }

  function exportData() {
    if (!isAvailable()) return {};
    try {
      const data = {};
      keys().forEach(key => { data[key] = get(key); });
      return data;
    } catch (e) {
      return {};
    }
  }

  function importData(data, overwrite) {
    if (!isAvailable() || typeof data !== 'object') return 0;
    let count = 0;
    try {
      Object.keys(data).forEach(key => {
        if (!overwrite && has(key)) return;
        if (set(key, data[key])) count++;
      });
      if (config && config.log) config.log('info', 'Data imported', {count: count});
      return count;
    } catch (e) {
      return count;
    }
  }

  function savePhotos(photos) {
    const exp = config && config.storage && config.storage.cacheExpiration 
      ? config.storage.cacheExpiration.photos : 7 * 24 * 60 * 60 * 1000;
    return set('photos', photos, exp);
  }

  function getPhotos() {
    return get('photos', []);
  }

  function saveScore(gameId, score) {
    const scores = get('scores', {});
    if (!scores[gameId] || score > scores[gameId].highScore) {
      scores[gameId] = {highScore: score, lastScore: score, lastPlayed: Date.now()};
    } else {
      scores[gameId].lastScore = score;
      scores[gameId].lastPlayed = Date.now();
    }
    const exp = config && config.storage && config.storage.cacheExpiration 
      ? config.storage.cacheExpiration.scores : 30 * 24 * 60 * 60 * 1000;
    return set('scores', scores, exp);
  }

  function getHighScore(gameId) {
    const scores = get('scores', {});
    return scores[gameId] ? scores[gameId].highScore : 0;
  }

  function getAllScores() {
    return get('scores', {});
  }

  function saveSettings(settings) {
    return set('settings', settings, Infinity);
  }

  function getSettings() {
    return get('settings', {});
  }

  function saveTheme(themeId) {
    return set('theme', themeId, Infinity);
  }

  function getTheme() {
    return get('theme', null);
  }

  function savePurchase(productId) {
    const purchases = get('purchases', []);
    if (!purchases.includes(productId)) purchases.push(productId);
    return set('purchases', purchases, Infinity);
  }

  function hasPurchased(productId) {
    return get('purchases', []).includes(productId);
  }

  function getAllPurchases() {
    return get('purchases', []);
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    init: init, set: set, get: get, remove: remove, has: has, clear: clear,
    clearExpired: clearExpired, keys: keys, size: size, getSize: getSize,
    getUsageRatio: getUsageRatio, getInfo: getInfo, exportData: exportData,
    importData: importData, savePhotos: savePhotos, getPhotos: getPhotos,
    saveScore: saveScore, getHighScore: getHighScore, getAllScores: getAllScores,
    saveSettings: saveSettings, getSettings: getSettings, saveTheme: saveTheme,
    getTheme: getTheme, savePurchase: savePurchase, hasPurchased: hasPurchased,
    getAllPurchases: getAllPurchases, isAvailable: isAvailable
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Storage;
if (typeof window !== 'undefined') window.Storage = Storage;
