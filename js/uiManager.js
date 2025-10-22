// Boosty Supporters Generator - UI Manager
// Handles all UI state changes, user interactions, and visual feedback

class UIManager {
  constructor() {
    this.currentFile = null;
    this.processingResults = null;
    this.paddingValue = 0;
    this.animationDurationValue = 30;
    this.titleValue = 'Спасибо!';
    this.filterDateValue = null;
    this.debouncedTitleChange = this.debounce((value) => this.handleTitleChange(value), 300);
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSettings();
    this.resetInterface();
    this.initializeTooltips();
  }

  bindEvents() {
    // File input events
    const fileInput = document.getElementById('file-input');
    const fileInputBtn = document.getElementById('file-input-btn');
    const dropzone = document.getElementById('dropzone');

    // File selection button
    fileInputBtn.addEventListener('click', () => {
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFileSelection(file);
      }
    });

    // Drag and drop events
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelection(files[0]);
      }
    });

    // Process button
    const processBtn = document.getElementById('process-btn');
    processBtn.addEventListener('click', () => {
      this.startProcessing();
    });

    // Download buttons
    const downloadAllBtn = document.getElementById('download-all-btn');
    downloadAllBtn.addEventListener('click', () => {
      this.downloadAllAsZip();
    });

    // Padding input
    const paddingInput = document.getElementById('padding-input');
    paddingInput.addEventListener('input', (e) => {
      this.handlePaddingChange(e.target.value);
    });

    // Animation duration input
    const animationDurationInput = document.getElementById('animation-duration-input');
    animationDurationInput.addEventListener('input', (e) => {
      this.handleAnimationDurationChange(e.target.value);
    });

    // Title input
    const titleInput = document.getElementById('title-input');
    titleInput.addEventListener('input', (e) => {
      this.debouncedTitleChange(e.target.value);
    });

    // Filter date input
    const filterDateInput = document.getElementById('filter-date-input');
    filterDateInput.addEventListener('change', (e) => {
      this.handleFilterDateChange(e.target.value);
    });

    // Reset settings button
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    resetSettingsBtn.addEventListener('click', () => {
      this.resetSettings();
    });
  }


  async handleFileSelection(file) {
    this.currentFile = file;
    this.showFileInfo(file);

    // Auto-process immediately
    await this.startProcessing();
  }

  showFileInfo(file) {
    const fileNameEl = document.getElementById('file-name');
    const fileSizeEl = document.getElementById('file-size');

    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = this.formatFileSize(file.size);

    // Switch to file info view
    document.getElementById('dropzone-content').classList.add('d-none');
    document.getElementById('file-info').classList.remove('d-none');

    // Hide process button since we auto-process
    document.getElementById('process-btn').classList.add('d-none');
  }
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  startProcessing() {
    if (!this.currentFile) {
      this.showError(labels.noFileSelected);
      return;
    }

    this.showProcessingStatus();
    this.processFile();
  }

  async processFile() {
    try {
      this.processingResults = await processFile(this.currentFile);
      this.showResults(this.processingResults);
    } catch (error) {
      this.showError(error.message);
      this.resetInterface();
      this.resetInterface();
      this.resetInterface();
    }
  }

  showProcessingStatus() {
    const processingSection = document.getElementById('processing-status');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress-bar');

    // Reset progress
    progressBar.style.width = '0%';
    statusText.textContent = labels.processingCsvFile;

    // Show processing section
    processingSection.classList.remove('d-none');

    // Animate progress
    this.animateProgress([labels.parsingCsv, labels.filteringData, labels.generatingFiles]);
  }

  animateProgress(steps) {
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    let currentStep = 0;

    const updateProgress = () => {
      if (currentStep < steps.length) {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = progress + '%';
        statusText.textContent = steps[currentStep];
        currentStep++;
        setTimeout(updateProgress, 500);
      }
    };

    updateProgress();
  }

  showResults(results) {
    // Hide processing status
    document.getElementById('processing-status').classList.add('d-none');

    // Show results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('d-none');

    // Generate file cards
    this.generateFileCards(results);

    // Show success message
    this.showSuccess(labels.filesGeneratedSuccessfully);
  }

  generateFileCards(results) {
    const fileCardsContainer = document.getElementById('file-cards');
    fileCardsContainer.innerHTML = '';

    const files = [
      { key: 'html', name: 'supporters-page.html', icon: 'bi-filetype-html', mime: 'text/html' },
      { key: 'txt', name: 'supporters-list.txt', icon: 'bi-filetype-txt', mime: 'text/plain' },
      { key: 'md', name: 'supporters-list.md', icon: 'bi-filetype-md', mime: 'text/markdown' }
    ];

    files.forEach(file => {
      const card = this.createFileCard(file, results[file.key]);
      fileCardsContainer.appendChild(card);
    });
  }

  createFileCard(fileConfig, content) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card file-card h-100">
        <div class="card-body text-center">
          <i class="bi ${fileConfig.icon} display-4 text-primary mb-3"></i>
          <h5 class="card-title">${fileConfig.name}</h5>
          <p class="card-text text-muted">${this.formatFileSize(new Blob([content]).size)}</p>
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary btn-sm" onclick="uiManager.downloadFile('${fileConfig.key}')">
              <i class="bi bi-download me-1"></i>Скачать
            </button>
            ${fileConfig.key === 'html' ? `
              <button class="btn btn-outline-secondary btn-sm" onclick="uiManager.previewHTML()">
                <i class="bi bi-eye me-1"></i>Предпросмотр
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    return card;
  }

  downloadFile(type) {
    if (!this.processingResults || !this.processingResults[type]) {
      this.showError(labels.noFileAvailableForDownload);
      return;
    }

    const content = this.processingResults[type];
    const filenames = {
      html: 'supporters-page.html',
      txt: 'supporters-list.txt',
      md: 'supporters-list.md'
    };

    const mimes = {
      html: 'text/html',
      txt: 'text/plain',
      md: 'text/markdown'
    };

    this.downloadBlob(content, filenames[type], mimes[type]);
  }

  downloadBlob(content, filename, mimeType) {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 100);

      this.showSuccess(`${filename} ${labels.fileDownloadedSuccessfully}`);
    } catch (error) {
      this.showError(labels.failedToDownloadFile + error.message);
    }
  }

  async downloadAllAsZip() {
    if (!this.processingResults) {
      this.showError(labels.noFilesAvailableForDownload);
      return;
    }

    try {
      const zip = new JSZip();

      // Add files to ZIP
      zip.file('supporters-page.html', this.processingResults.html);
      zip.file('supporters-list.txt', this.processingResults.txt);
      zip.file('supporters-list.md', this.processingResults.md);

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      this.downloadBlob(content, 'supporters-files.zip', 'application/zip');

    } catch (error) {
      this.showError(labels.failedToCreateZipFile + error.message);
    }
  }

  previewHTML() {
    if (!this.processingResults || !this.processingResults.html) {
      this.showError(labels.noHtmlFileAvailableForPreview);
      return;
    }

    const blob = new Blob([this.processingResults.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  showError(message) {
    this.showAlert(message, 'danger');
  }

  showSuccess(message) {
    this.showAlert(message, 'success');
  }

  showAlert(message, type) {
    const alertContainer = document.getElementById('error-container');

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      <i class="bi ${type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    alertContainer.appendChild(alertDiv);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }

  loadSettings() {
    const savedPadding = localStorage.getItem('paddingSetting');
    this.paddingValue = savedPadding ? parseInt(savedPadding) : 0;
    document.getElementById('padding-input').value = this.paddingValue;

    const savedDuration = localStorage.getItem('animationDurationSetting');
    this.animationDurationValue = savedDuration ? parseInt(savedDuration) : 30;
    document.getElementById('animation-duration-input').value = this.animationDurationValue;

    const savedTitle = localStorage.getItem('titleSetting');
    this.titleValue = savedTitle || 'Спасибо!';
    document.getElementById('title-input').value = this.titleValue;

    // Always reset filter date to current date on page load
    this.filterDateValue = this.getTodayDateString();
    // проброс для дальнейшего использования при рендере (копипаста, да)
    localStorage.setItem('filterDateSetting', this.filterDateValue);
    document.getElementById('filter-date-input').value = this.filterDateValue;
  }

  saveSettings() {
    localStorage.setItem('paddingSetting', this.paddingValue.toString());
    localStorage.setItem('animationDurationSetting', this.animationDurationValue.toString());
    localStorage.setItem('titleSetting', this.titleValue);
    localStorage.setItem('filterDateSetting', this.filterDateValue);
  }

  async handlePaddingChange(value) {
    const newPadding = parseInt(value) || 0;
    if (newPadding < 0) return;

    this.paddingValue = newPadding;
    this.saveSettings();

    // Re-render if we have results
    if (this.processingResults && this.currentFile) {
      await this.reRenderFiles();
    }
  }

  async handleAnimationDurationChange(value) {
    const newDuration = parseInt(value) || 30;
    if (newDuration < 1 || newDuration > 300) return;

    this.animationDurationValue = newDuration;
    this.saveSettings();

    // Re-render if we have results
    if (this.processingResults && this.currentFile) {
      await this.reRenderFiles();
    }
  }

  async handleTitleChange(value) {
    this.titleValue = value || 'Спасибо!';
    this.saveSettings();

    // Re-render if we have results
    if (this.processingResults && this.currentFile) {
      await this.reRenderFiles();
    }
  }

  async handleFilterDateChange(value) {
    this.filterDateValue = value || this.getTodayDateString();
    this.saveSettings();

    // Re-render if we have results
    if (this.processingResults && this.currentFile) {
      await this.reRenderFiles();
    }
  }

  getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async reRenderFiles() {
    try {
      // Re-process with new settings
      const results = await processFile(this.currentFile);

      // Update HTML result with new settings
      this.processingResults.html = results.html;

      // Update file cards with new sizes
      this.updateFileCards();

      // Show success toast
      this.showSuccess(labels.filesReRenderedWithNewSettings);

    } catch (error) {
      this.showError(labels.failedToReRenderFiles + error.message);
    }
  }

  updateFileCards() {
    const fileCardsContainer = document.getElementById('file-cards');
    const cards = fileCardsContainer.querySelectorAll('.file-card');

    cards.forEach(card => {
      const fileType = card.querySelector('button').onclick.toString().match(/'(\w+)'/)[1];
      const sizeElement = card.querySelector('.card-text');
      const newSize = this.formatFileSize(new Blob([this.processingResults[fileType]]).size);
      sizeElement.textContent = newSize;
    });
  }

  resetInterface() {
    // Hide all sections
    document.getElementById('file-info').classList.add('d-none');
    document.getElementById('processing-status').classList.add('d-none');
    document.getElementById('results-section').classList.add('d-none');

    // Show initial dropzone
    document.getElementById('dropzone-content').classList.remove('d-none');

    // Reset file input
    document.getElementById('file-input').value = '';

    // Clear results
    this.currentFile = null;
    this.processingResults = null;

    // Clear file cards
    document.getElementById('file-cards').innerHTML = '';
  }

  initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize collapse toggle icon
    this.initializeCollapseIcon();
  }

  initializeCollapseIcon() {
    const collapseElement = document.getElementById('settings-content');
    const iconElement = document.querySelector('.card-header i.float-end');

    if (collapseElement && iconElement) {
      collapseElement.addEventListener('show.bs.collapse', () => {
        iconElement.classList.remove('bi-chevron-down');
        iconElement.classList.add('bi-chevron-up');
      });

      collapseElement.addEventListener('hide.bs.collapse', () => {
        iconElement.classList.remove('bi-chevron-up');
        iconElement.classList.add('bi-chevron-down');
      });
    }
  }

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  resetSettings() {
    // копипаста
    // Reset to default values
    this.paddingValue = 0;
    this.animationDurationValue = 30;
    this.titleValue = 'Спасибо!';
    this.filterDateValue = this.getTodayDateString();

    // Update input fields
    document.getElementById('padding-input').value = this.paddingValue;
    document.getElementById('animation-duration-input').value = this.animationDurationValue;
    document.getElementById('title-input').value = this.titleValue;
    document.getElementById('filter-date-input').value = this.filterDateValue;

    // Save to localStorage
    this.saveSettings();

    // Re-render if we have results
    if (this.processingResults && this.currentFile) {
      this.reRenderFiles();
    }

    // Show success message
    this.showSuccess(labels.settingsResetSuccess);
  }
}

// Global instance
const uiManager = new UIManager();