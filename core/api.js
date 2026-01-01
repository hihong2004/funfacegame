/**
 * Fun Face Game - API 後端介面
 * @version 1.0.0
 * @date 2024-12-30
 */

const API = (function() {
  'use strict';

  let config = null;
  let storage = null;
  let baseUrl = null;
  let timeout = 10000;
  let retryAttempts = 3;
  let endpoints = {};
  let initialized = false;
  let pendingRequests = {};

  function init() {
    if (typeof Config !== 'undefined') {
      config = Config;
      baseUrl = Config.api ? Config.api.baseUrl : null;
      timeout = Config.api ? Config.api.timeout : 10000;
      retryAttempts = Config.api ? Config.api.retryAttempts : 3;
      endpoints = Config.api ? Config.api.endpoints : {};
    }

    if (typeof Storage !== 'undefined') storage = Storage;

    initialized = true;

    if (config && config.log) {
      config.log('info', 'API initialized', {baseUrl: baseUrl || 'localStorage'});
    }

    return true;
  }

  function isInitialized() {
    return initialized;
  }

  function isOnline() {
    return baseUrl !== null;
  }

  function request(method, endpoint, data, options) {
    if (!initialized) {
      return Promise.reject({code: 'NOT_INITIALIZED', message: 'API not initialized'});
    }

    if (!isOnline()) {
      return handleOfflineRequest(method, endpoint, data);
    }

    const url = baseUrl + endpoint;
    const requestId = Date.now() + '_' + Math.random();

    const requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: options && options.timeout ? options.timeout : timeout
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    pendingRequests[requestId] = {method: method, endpoint: endpoint, data: data};

    return fetchWithTimeout(url, requestOptions, requestOptions.timeout)
      .then(function(response) {
        delete pendingRequests[requestId];
        
        if (!response.ok) {
          return response.json().then(function(error) {
            throw {
              code: 'HTTP_ERROR',
              status: response.status,
              message: error.message || response.statusText,
              data: error
            };
          }).catch(function() {
            throw {
              code: 'HTTP_ERROR',
              status: response.status,
              message: response.statusText
            };
          });
        }

        return response.json();
      })
      .then(function(result) {
        if (config && config.log) {
          config.log('info', 'API request success', {method: method, endpoint: endpoint});
        }
        return result;
      })
      .catch(function(error) {
        delete pendingRequests[requestId];
        
        if (config && config.log) {
          config.log('error', 'API request failed', {method: method, endpoint: endpoint, error: error});
        }

        throw error;
      });
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    return new Promise(function(resolve, reject) {
      const timer = setTimeout(function() {
        reject({code: 'TIMEOUT', message: 'Request timeout'});
      }, timeoutMs);

      fetch(url, options)
        .then(function(response) {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(function(error) {
          clearTimeout(timer);
          reject({code: 'NETWORK_ERROR', message: error.message || 'Network error'});
        });
    });
  }

  function handleOfflineRequest(method, endpoint, data) {
    if (!storage) {
      return Promise.reject({code: 'STORAGE_NOT_AVAILABLE', message: 'Storage not available'});
    }

    if (config && config.log) {
      config.log('info', 'Handling offline request', {method: method, endpoint: endpoint});
    }

    if (endpoint.includes('/user')) {
      return handleUserRequest(method, data);
    } else if (endpoint.includes('/scores')) {
      return handleScoresRequest(method, data);
    } else if (endpoint.includes('/leaderboard')) {
      return handleLeaderboardRequest(method, data);
    } else if (endpoint.includes('/purchases')) {
      return handlePurchasesRequest(method, data);
    } else if (endpoint.includes('/sync')) {
      return handleSyncRequest(method, data);
    }

    return Promise.reject({code: 'ENDPOINT_NOT_FOUND', message: 'Endpoint not found'});
  }

  function handleUserRequest(method, data) {
    if (method === 'GET') {
      const user = storage.get('user', {id: 'local_user', name: 'Guest'});
      return Promise.resolve({success: true, data: user});
    } else if (method === 'POST' || method === 'PUT') {
      storage.set('user', data, Infinity);
      return Promise.resolve({success: true, data: data});
    }
    return Promise.reject({code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed'});
  }

  function handleScoresRequest(method, data) {
    if (method === 'GET') {
      const scores = storage.getAllScores();
      return Promise.resolve({success: true, data: scores});
    } else if (method === 'POST') {
      storage.saveScore(data.gameId, data.score);
      return Promise.resolve({success: true, data: data});
    }
    return Promise.reject({code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed'});
  }

  function handleLeaderboardRequest(method, data) {
    if (method === 'GET') {
      const scores = storage.getAllScores();
      const leaderboard = Object.keys(scores).map(function(gameId) {
        return {
          gameId: gameId,
          highScore: scores[gameId].highScore,
          lastPlayed: scores[gameId].lastPlayed
        };
      }).sort(function(a, b) {
        return b.highScore - a.highScore;
      }).slice(0, 10);
      
      return Promise.resolve({success: true, data: leaderboard});
    }
    return Promise.reject({code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed'});
  }

  function handlePurchasesRequest(method, data) {
    if (method === 'GET') {
      const purchases = storage.getAllPurchases();
      return Promise.resolve({success: true, data: purchases});
    } else if (method === 'POST') {
      storage.savePurchase(data.productId);
      return Promise.resolve({success: true, data: data});
    }
    return Promise.reject({code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed'});
  }

  function handleSyncRequest(method, data) {
    if (method === 'POST') {
      if (data.scores) {
        Object.keys(data.scores).forEach(function(gameId) {
          storage.saveScore(gameId, data.scores[gameId].score);
        });
      }
      if (data.purchases) {
        data.purchases.forEach(function(productId) {
          storage.savePurchase(productId);
        });
      }
      return Promise.resolve({success: true, message: 'Sync completed'});
    }
    return Promise.reject({code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed'});
  }

  function get(endpoint, options) {
    return request('GET', endpoint, null, options);
  }

  function post(endpoint, data, options) {
    return request('POST', endpoint, data, options);
  }

  function put(endpoint, data, options) {
    return request('PUT', endpoint, data, options);
  }

  function del(endpoint, options) {
    return request('DELETE', endpoint, null, options);
  }

  function getUser() {
    return get(endpoints.user || '/user');
  }

  function saveUser(userData) {
    return post(endpoints.user || '/user', userData);
  }

  function getScores() {
    return get(endpoints.scores || '/scores');
  }

  function saveScore(gameId, score) {
    return post(endpoints.scores || '/scores', {gameId: gameId, score: score});
  }

  function getLeaderboard(gameId) {
    const endpoint = (endpoints.leaderboard || '/leaderboard') + (gameId ? '?gameId=' + gameId : '');
    return get(endpoint);
  }

  function getPurchases() {
    return get(endpoints.purchases || '/purchases');
  }

  function savePurchase(productId) {
    return post(endpoints.purchases || '/purchases', {productId: productId});
  }

  function sync(data) {
    return post(endpoints.sync || '/sync', data);
  }

  function getPendingRequests() {
    return Object.keys(pendingRequests).map(function(id) {
      return pendingRequests[id];
    });
  }

  function hasPendingRequests() {
    return Object.keys(pendingRequests).length > 0;
  }

  function getConfig() {
    return {
      baseUrl: baseUrl,
      timeout: timeout,
      retryAttempts: retryAttempts,
      endpoints: endpoints,
      initialized: initialized,
      online: isOnline(),
      pendingRequestsCount: Object.keys(pendingRequests).length
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
    isInitialized: isInitialized,
    isOnline: isOnline,
    request: request,
    get: get,
    post: post,
    put: put,
    del: del,
    getUser: getUser,
    saveUser: saveUser,
    getScores: getScores,
    saveScore: saveScore,
    getLeaderboard: getLeaderboard,
    getPurchases: getPurchases,
    savePurchase: savePurchase,
    sync: sync,
    getPendingRequests: getPendingRequests,
    hasPendingRequests: hasPendingRequests,
    getConfig: getConfig
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = API;
if (typeof window !== 'undefined') window.API = API;
