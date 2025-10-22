// Boosty Supporters Generator - Main Application
// Entry point and initialization

class App {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    console.log(labels.initializingApp);

    // Check browser compatibility
    if (!this.checkBrowserSupport()) {
      this.showBrowserError();
      return;
    }

    // Global error handlers
    this.setupErrorHandlers();

    // Mark as initialized
    this.initialized = true;

    console.log(labels.appInitializedSuccessfully);
  }

  checkBrowserSupport() {
    // Check for required APIs
    const requiredFeatures = [
      'File', 'FileReader', 'Blob', 'URL', 'Promise',
      'fetch', 'Array.from', 'Map', 'Set'
    ];

    return requiredFeatures.every(feature => {
      try {
        switch(feature) {
          case 'File': return typeof File !== 'undefined';
          case 'FileReader': return typeof FileReader !== 'undefined';
          case 'Blob': return typeof Blob !== 'undefined';
          case 'URL': return typeof URL !== 'undefined' && URL.createObjectURL;
          case 'Promise': return typeof Promise !== 'undefined';
          case 'fetch': return typeof fetch !== 'undefined';
          case 'Array.from': return typeof Array.from !== 'undefined';
          case 'Map': return typeof Map !== 'undefined';
          case 'Set': return typeof Set !== 'undefined';
          default: return false;
        }
      } catch (e) {
        return false;
      }
    });
  }

  showBrowserError() {
    const container = document.querySelector('.container-fluid');
    container.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="alert alert-danger text-center">
            <h4 class="alert-heading">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ labels.browserNotSupported }}
            </h4>
            <p>{{ labels.browserNotSupportedMessage }}</p>
            <hr>
            <p class="mb-0">{{ labels.useModernBrowser }}</p>
          </div>
        </div>
      </div>
    `;
  }

  setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      uiManager.showError(labels.unexpectedError);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      uiManager.showError(labels.unexpectedError);
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      console.log('Connection restored');
    });

    window.addEventListener('offline', () => {
      uiManager.showError(labels.youAppearToBeOffline);
    });
  }
}

// Performance monitoring (optional)
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  startTiming(label) {
    this.metrics[label] = performance.now();
  }

  endTiming(label) {
    if (this.metrics[label]) {
      const duration = performance.now() - this.metrics[label];
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      delete this.metrics[label];
      return duration;
    }
    return 0;
  }

  measureFunction(label, fn) {
    this.startTiming(label);
    const result = fn();
    this.endTiming(label);
    return result;
  }
}

// Global instances
const app = new App();
const performanceMonitor = new PerformanceMonitor();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for debugging (optional)
if (typeof window !== 'undefined') {
  window.app = app;
  window.performanceMonitor = performanceMonitor;
  window.uiManager = uiManager;
}