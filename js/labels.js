// Boosty Supporters Generator - Localization Labels
// All user-facing text in Russian for easy editing

const labels = {
  // Page titles and headings
  pageTitle: "Генератор Списка Поддерживающих на Boosty",
  mainHeading: "Генератор Списка Поддерживающих на Boosty",
  description: "Загрузите CSV и сгенерируйте списки поддерживающих",

  // File upload section
  dragDropText: "Перетащите CSV файл сюда",
  orText: "или",
  chooseFileButton: "Выбрать файл",
  processFileButton: "Обработать файл",

  // Processing status
  processingCsvFile: "Обработка CSV файла...",
  parsingCsv: "Парсинг CSV...",
  filteringData: "Фильтрация данных...",
  generatingFiles: "Генерация файлов...",

  // Settings section
  settingsTitle: "Настройки",
  paddingLinesLabel: "Строки отступа",

  // Results section
  generatedFilesTitle: "Сгенерированные файлы",
  downloadAllAsZip: "Скачать все как ZIP",
  downloadButton: "Скачать",
  previewButton: "Предпросмотр",

  // Footer
  authorText: "Автор: Сурен Хоренян | ",
  sourceCodeText: "Исходный код на GitHub",

  // Error messages
  noFileSelected: "Файл не выбран",
  pleaseSelectCsvFile: "Пожалуйста, выберите CSV файл",
  fileTooLarge: "Файл слишком большой. Максимальный размер 10MB",
  failedToReadFile: "Не удалось прочитать файл",
  csvParsingErrors: "Ошибки парсинга CSV",
  missingRequiredColumns: "Отсутствуют обязательные столбцы",
  failedToParseCsv: "Не удалось распарсить CSV",
  failedToRenderHtmlTemplate: "Не удалось рендерить HTML шаблон",
  failedToRenderTxtTemplate: "Не удалось рендерить TXT шаблон",
  failedToRenderMdTemplate: "Не удалось рендерить MD шаблон",
  noFileAvailableForDownload: "Файл недоступен для скачивания",
  failedToDownloadFile: "Не удалось скачать файл",
  noFilesAvailableForDownload: "Файлы недоступны для скачивания",
  failedToCreateZipFile: "Не удалось создать ZIP файл",
  noHtmlFileAvailableForPreview: "HTML файл недоступен для предпросмотра",
  failedToReRenderFiles: "Не удалось перерендерить файлы: ",

  // Success messages
  filesGeneratedSuccessfully: "Файлы успешно сгенерированы!",
  fileDownloadedSuccessfully: "успешно скачан!",
  filesReRenderedWithNewPadding: "Файлы перерендерены с новыми настройками отступа!",
  filesReRenderedWithNewSettings: "Файлы перерендерены с новыми настройками",

  // Browser compatibility
  browserNotSupported: "Браузер не поддерживается",
  browserNotSupportedMessage: "Ваш браузер не поддерживает необходимые функции для этого приложения.",
  useModernBrowser: "Пожалуйста, используйте современный браузер, такой как Chrome, Firefox, Safari или Edge.",

  // Console messages
  initializingApp: "Инициализация Генератора Списка Поддерживающих на Boosty...",
  appInitializedSuccessfully: "Приложение инициализировано успешно",

  // Error handling
  unexpectedError: "Произошла непредвиденная ошибка. Пожалуйста, обновите страницу и попробуйте снова.",
  youAppearToBeOffline: "Похоже, вы не в сети. Некоторые функции могут работать некорректно.",

  // File size formatting (these are programmatic but included for completeness)
  bytes: "Bytes",
  kb: "KB",
  mb: "MB",
  gb: "GB",

  // Visually hidden text
  processing: "Обработка..."
};

// Function to replace template literals in HTML
function renderLabels() {
  document.querySelectorAll('[data-label]').forEach(element => {
    const labelKey = element.getAttribute('data-label');
    if (labels[labelKey]) {
      element.textContent = labels[labelKey];
    }
  });

  // Handle title
  const titleElement = document.querySelector('title');
  if (titleElement && titleElement.textContent.includes('labels.pageTitle')) {
    titleElement.textContent = labels.pageTitle;
  }
}

// Initialize labels when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderLabels);
} else {
  renderLabels();
}