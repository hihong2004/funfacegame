/**
 * Fun Face Game - Analytics 追蹤系統 (GA4)
 * @version 1.0.0
 * @date 2024-12-30
 */

const Analytics = (function() {
  'use strict';

  let config = null;
  let enabled = false;
  let debugMode = false;
  let measurementId = null;
  let trackEvents = {};
  let initialized = false;
  let queue = [];

  function init() {
    if (typeof Config !== 'undefined') {
      config = Config;
      enabled = Config.analytics ? Config.analytics.enabled : false;
      debugMode = Config.analytics ? Config.analytics.debugMode : false;
      measurementId = Config.analytics ? Config.analytics.measurementId : null;
      trackEvents = Config.analytics ? Config.analytics.trackEvents : {};
    }

    if (!enabled) {
      if (debugMode && config && config.log) {
        config.log('info', 'Analytics disabled');
      }
      initialized = true;
      return false;
    }

    if (!measurementId) {
      if (debugMode && config && config.log) {
        config.log('warn', 'Analytics enabled but no measurementId');
      }
      enabled = false; // 沒有 measurementId 時強制禁用
      initialized = true;
      return false;
    }

    loadGA4Script();
    initialized = true;

    if (config && config.log) {
      config.log('info', 'Analytics initialized', {measurementId: measurementId});
    }

    processQueue();
    return true;
  }

  function loadGA4Script() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      debug_mode: debugMode
    });
  }

  function track(eventName, params) {
    if (!initialized) {
      queue.push({eventName: eventName, params: params});
      return false;
    }

    if (!enabled) {
      if (debugMode) {
        console.log('[Analytics] Track (disabled):', eventName, params);
      }
      return false;
    }

    if (debugMode) {
      console.log('[Analytics] Track:', eventName, params);
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
      return true;
    }

    return false;
  }

  function processQueue() {
    if (queue.length === 0) return;
    queue.forEach(function(item) {
      track(item.eventName, item.params);
    });
    queue = [];
  }

  function trackPageView(pagePath, pageTitle) {
    if (!shouldTrack('pageView')) return false;
    return track('page_view', {
      page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : 'Unknown')
    });
  }

  function trackGameStart(gameId, gameName) {
    if (!shouldTrack('gameStart')) return false;
    return track('game_start', {
      game_id: gameId,
      game_name: gameName,
      timestamp: Date.now()
    });
  }

  function trackGameComplete(gameId, gameName, score, duration) {
    if (!shouldTrack('gameComplete')) return false;
    return track('game_complete', {
      game_id: gameId,
      game_name: gameName,
      score: score,
      duration_ms: duration,
      timestamp: Date.now()
    });
  }

  function trackLevelComplete(gameId, level, score, duration) {
    if (!shouldTrack('levelComplete')) return false;
    return track('level_complete', {
      game_id: gameId,
      level: level,
      score: score,
      duration_ms: duration,
      timestamp: Date.now()
    });
  }

  function trackShare(platform, gameId, score) {
    if (!shouldTrack('share')) return false;
    return track('share', {
      method: platform,
      content_type: 'game_score',
      game_id: gameId,
      score: score
    });
  }

  function trackAdShow(adType, placement) {
    if (!shouldTrack('adShow')) return false;
    return track('ad_show', {
      ad_type: adType,
      ad_placement: placement,
      timestamp: Date.now()
    });
  }

  function trackPurchase(productId, price, currency) {
    if (!shouldTrack('purchase')) return false;
    return track('purchase', {
      transaction_id: 'txn_' + Date.now(),
      value: price,
      currency: currency || 'TWD',
      items: [{
        item_id: productId,
        item_name: productId
      }]
    });
  }

  function trackPWAInstall(source) {
    if (!shouldTrack('pwaInstall')) return false;
    return track('pwa_install', {
      source: source || 'prompt',
      timestamp: Date.now()
    });
  }

  function trackLanguageChange(from, to) {
    if (!shouldTrack('languageChange')) return false;
    return track('language_change', {
      from_language: from,
      to_language: to,
      timestamp: Date.now()
    });
  }

  function trackError(errorType, errorMessage, fatal) {
    return track('exception', {
      description: errorMessage,
      error_type: errorType,
      fatal: fatal || false
    });
  }

  function trackTiming(category, variable, value, label) {
    return track('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }

  function trackEvent(category, action, label, value) {
    return track(action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  function setUserProperties(properties) {
    if (!enabled) return false;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', properties);
      return true;
    }
    return false;
  }

  function setUserId(userId) {
    if (!enabled) return false;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', {user_id: userId});
      return true;
    }
    return false;
  }

  function shouldTrack(eventType) {
    if (!enabled) return false;
    if (!trackEvents[eventType]) return false;
    return true;
  }

  function isEnabled() {
    return enabled;
  }

  function isInitialized() {
    return initialized;
  }

  function getConfig() {
    return {
      enabled: enabled,
      debugMode: debugMode,
      measurementId: measurementId,
      trackEvents: trackEvents,
      initialized: initialized
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
    track: track,
    trackPageView: trackPageView,
    trackGameStart: trackGameStart,
    trackGameComplete: trackGameComplete,
    trackLevelComplete: trackLevelComplete,
    trackShare: trackShare,
    trackAdShow: trackAdShow,
    trackPurchase: trackPurchase,
    trackPWAInstall: trackPWAInstall,
    trackLanguageChange: trackLanguageChange,
    trackError: trackError,
    trackTiming: trackTiming,
    trackEvent: trackEvent,
    setUserProperties: setUserProperties,
    setUserId: setUserId,
    isEnabled: isEnabled,
    isInitialized: isInitialized,
    getConfig: getConfig
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Analytics;
if (typeof window !== 'undefined') window.Analytics = Analytics;
