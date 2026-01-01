/**
 * Fun Face Game - 廣告管理系統 (Ads)
 * @version 1.0.0
 * @date 2024-12-30
 */

const Ads = (function() {
  'use strict';

  let config = null;
  let storage = null;
  let analytics = null;
  let enabled = false;
  let adsenseId = null;
  let frequency = {};
  let placements = {};
  let initialized = false;
  let counters = {
    preroll: 0,
    interstitial: 0,
    levelCount: 0
  };

  function init() {
    if (typeof Config !== 'undefined') {
      config = Config;
      enabled = Config.ads ? Config.ads.enabled : false;
      adsenseId = Config.ads ? Config.ads.adsenseId : null;
      frequency = Config.ads ? Config.ads.frequency : {};
      placements = Config.ads ? Config.ads.placements : {};
    }

    if (typeof Storage !== 'undefined') storage = Storage;
    if (typeof Analytics !== 'undefined') analytics = Analytics;

    if (!enabled) {
      if (config && config.log) {
        config.log('info', 'Ads disabled');
      }
      initialized = true;
      return false;
    }

    if (hasRemoveAdsPurchase()) {
      enabled = false;
      if (config && config.log) {
        config.log('info', 'Ads disabled - user purchased remove_ads');
      }
      initialized = true;
      return false;
    }

    if (config && config.isDevelopment && config.isDevelopment() && config.debug && config.debug.skipAds) {
      enabled = false;
      if (config && config.log) {
        config.log('info', 'Ads disabled - debug.skipAds is true');
      }
      initialized = true;
      return false;
    }

    loadCounters();
    initialized = true;

    if (config && config.log) {
      config.log('info', 'Ads initialized', {adsenseId: adsenseId});
    }

    return true;
  }

  function loadCounters() {
    if (!storage) return;
    const saved = storage.get('ad_counters', {});
    counters.preroll = saved.preroll || 0;
    counters.interstitial = saved.interstitial || 0;
    counters.levelCount = saved.levelCount || 0;
  }

  function saveCounters() {
    if (!storage) return;
    storage.set('ad_counters', counters, Infinity);
  }

  function hasRemoveAdsPurchase() {
    if (!storage) return false;
    return storage.hasPurchased('remove_ads');
  }

  function isEnabled() {
    return enabled;
  }

  function isInitialized() {
    return initialized;
  }

  function canShowAd(adType) {
    if (!enabled) return false;
    if (!initialized) return false;
    if (hasRemoveAdsPurchase()) return false;
    return true;
  }

  function shouldShowPreroll() {
    if (!canShowAd('preroll')) return false;
    
    const freq = frequency.preroll;
    if (freq === 'never') return false;
    if (freq === 'always') return true;
    if (freq === 'every_session') {
      return counters.preroll === 0;
    }
    
    return true;
  }

  function shouldShowInterstitial() {
    if (!canShowAd('interstitial')) return false;
    
    const freq = frequency.interstitial;
    if (freq === 'never') return false;
    if (freq === 'always') return true;
    
    if (freq && freq.startsWith('every_')) {
      const n = parseInt(freq.split('_')[1]);
      if (isNaN(n)) return false;
      return counters.levelCount > 0 && counters.levelCount % n === 0;
    }
    
    return false;
  }

  function shouldShowBanner(placement) {
    if (!canShowAd('banner')) return false;
    
    const freq = frequency.banner;
    if (freq === 'never') return false;
    if (freq === 'always') return true;
    
    if (placement && placements[placement]) {
      return placements[placement].banner === true;
    }
    
    return true;
  }

  function showPreroll(onComplete, onSkip) {
    if (!shouldShowPreroll()) {
      if (onSkip) onSkip();
      return false;
    }

    counters.preroll++;
    saveCounters();

    if (analytics) {
      analytics.trackAdShow('preroll', 'game_start');
    }

    if (config && config.log) {
      config.log('info', 'Showing preroll ad', {count: counters.preroll});
    }

    simulateAd('preroll', 3000, onComplete);
    return true;
  }

  function showInterstitial(onComplete, onSkip) {
    if (!shouldShowInterstitial()) {
      if (onSkip) onSkip();
      return false;
    }

    counters.interstitial++;
    saveCounters();

    if (analytics) {
      analytics.trackAdShow('interstitial', 'level_complete');
    }

    if (config && config.log) {
      config.log('info', 'Showing interstitial ad', {count: counters.interstitial});
    }

    simulateAd('interstitial', 5000, onComplete);
    return true;
  }

  function showBanner(placement) {
    if (!shouldShowBanner(placement)) {
      return false;
    }

    if (analytics) {
      analytics.trackAdShow('banner', placement || 'unknown');
    }

    if (config && config.log) {
      config.log('info', 'Showing banner ad', {placement: placement});
    }

    const bannerId = getBannerId(placement);
    if (bannerId) {
      renderBanner(bannerId);
    }

    return true;
  }

  function hideBanner(placement) {
    const bannerId = getBannerId(placement);
    if (bannerId && typeof document !== 'undefined') {
      const el = document.getElementById(bannerId);
      if (el) el.style.display = 'none';
    }
  }

  function showRewardAd(onReward, onSkip) {
    if (!canShowAd('reward')) {
      if (onSkip) onSkip();
      return false;
    }

    if (analytics) {
      analytics.trackAdShow('reward', 'user_requested');
    }

    if (config && config.log) {
      config.log('info', 'Showing reward ad');
    }

    simulateAd('reward', 15000, function() {
      if (onReward) onReward();
    });
    return true;
  }

  function getBannerId(placement) {
    if (!placement) return null;
    if (!placements[placement]) return null;
    return placements[placement].bannerId || null;
  }

  function renderBanner(bannerId) {
    if (typeof document === 'undefined') return;
    
    const el = document.getElementById(bannerId);
    if (!el) return;

    el.style.display = 'block';
    el.style.backgroundColor = '#f0f0f0';
    el.style.textAlign = 'center';
    el.style.padding = '10px';
    el.style.minHeight = '90px';
    el.innerHTML = '<div style="color: #999;">Advertisement</div>';
  }

  function simulateAd(type, duration, onComplete) {
    setTimeout(function() {
      if (config && config.log) {
        config.log('info', 'Ad completed', {type: type, duration: duration});
      }
      if (onComplete) onComplete();
    }, duration);
  }

  function incrementLevelCount() {
    counters.levelCount++;
    saveCounters();
  }

  function resetCounters() {
    counters.preroll = 0;
    counters.interstitial = 0;
    counters.levelCount = 0;
    saveCounters();
  }

  function getCounters() {
    return {
      preroll: counters.preroll,
      interstitial: counters.interstitial,
      levelCount: counters.levelCount
    };
  }

  function getConfig() {
    return {
      enabled: enabled,
      adsenseId: adsenseId,
      frequency: frequency,
      placements: placements,
      initialized: initialized,
      hasRemoveAds: hasRemoveAdsPurchase()
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
    canShowAd: canShowAd,
    shouldShowPreroll: shouldShowPreroll,
    shouldShowInterstitial: shouldShowInterstitial,
    shouldShowBanner: shouldShowBanner,
    showPreroll: showPreroll,
    showInterstitial: showInterstitial,
    showBanner: showBanner,
    hideBanner: hideBanner,
    showRewardAd: showRewardAd,
    incrementLevelCount: incrementLevelCount,
    resetCounters: resetCounters,
    getCounters: getCounters,
    getConfig: getConfig
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Ads;
if (typeof window !== 'undefined') window.Ads = Ads;
