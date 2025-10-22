// Boosty Supporters Generator - Data Processing
// Handles CSV parsing, data filtering, grouping, and template rendering

// Configuration constants
const CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  REQUIRED_COLUMNS: ['name', 'email', 'level_name', 'start_date'],
  SKIP_LEVELS: new Set(['Follower'])
};

// Configure Nunjucks
nunjucks.configure({
  autoescape: false,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true
});

/**
 * Validates file before processing
 * @param {File} file - The uploaded file
 * @throws {Error} If file is invalid
 */
function validateFile(file) {
  if (!file) {
    throw new Error('Файл не выбран');
  }

  if (!file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('Пожалуйста, выберите CSV файл');
  }

  if (file.size > CONFIG.MAX_FILE_SIZE) {
    throw new Error('Файл слишком большой. Максимальный размер 10MB');
  }
}

/**
 * Reads file content as text
 * @param {File} file - The file to read
 * @returns {Promise<string>} File content
 */
function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'));
    };

    reader.readAsText(file, 'utf-8');
  });
}

/**
 * Parses CSV content using PapaParse
 * @param {string} csvText - Raw CSV content
 * @returns {Array} Parsed data array
 * @throws {Error} If parsing fails or required columns missing
 */
function parseCSV(csvText) {
  const parseConfig = {
    delimiter: ";",
    header: true,
    skipEmptyLines: true,
    encoding: "utf-8-sig",
    transformHeader: (header) => header.trim(),
    transform: (value, field) => {
      // Type conversion for numeric fields
      if (field === 'level_price' || field === 'user_price' || field === 'total_money') {
        const numValue = parseFloat(value.replace(',', '.'));
        return isNaN(numValue) ? 0 : numValue;
      }
      return value.trim();
    }
  };

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      ...parseConfig,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            const errorMessages = results.errors.map(e => e.message).join('; ');
            throw new Error(`Ошибки парсинга CSV: ${errorMessages}`);
          }

          // Validate required columns
          const headers = results.meta.fields;
          const missingCols = CONFIG.REQUIRED_COLUMNS.filter(col => !headers.includes(col));

          if (missingCols.length > 0) {
            throw new Error(`Отсутствуют обязательные столбцы: ${missingCols.join(', ')}`);
          }

          resolve(results.data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Не удалось распарсить CSV: ${error.message}`));
      }
    });
  });
}

/**
 * Filters and sorts subscription data
 * @param {Array} data - Raw parsed data
 * @param {Date} filterDate - Date to use for filtering active subscriptions (optional, defaults to today)
 * @returns {Array} Filtered and sorted active subscriptions
 */
function filterAndSortData(data, filterDate = null) {
  const today = filterDate || new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // Filter out "Follower" level and expired subscriptions
  const activeSubscriptions = data.filter(row => {
    // Skip "Follower" level
    if (CONFIG.SKIP_LEVELS.has(row.level_name)) {
      return false;
    }

    // Check end_date
    const endDateStr = row.end_date?.trim();
    if (!endDateStr || endDateStr === "-") {
      return true; // Ongoing subscription
    }

    try {
      const endDate = new Date(endDateStr + 'T00:00:00');
      return endDate >= today;
    } catch (error) {
      console.warn(`Invalid end_date format: ${endDateStr}`);
      return true; // Include on error (safer approach)
    }
  });

  // Sort by start_date (ascending), then by name (alphabetical)
  activeSubscriptions.sort((a, b) => {
    const dateA = new Date(a.start_date + 'T00:00:00');
    const dateB = new Date(b.start_date + 'T00:00:00');

    const dateComparison = dateA - dateB;
    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.name.localeCompare(b.name);
  });

  return activeSubscriptions;
}

/**
 * Groups data by level_name and sorts groups by level_price
 * @param {Array} data - Filtered and sorted data
 * @returns {Array} Grouped data as [level_name, entries][] sorted by price
 */
function groupData(data) {
  const groupedData = new Map();

  // Group by level_name
  data.forEach(row => {
    const levelName = row.level_name;
    if (!groupedData.has(levelName)) {
      groupedData.set(levelName, []);
    }
    groupedData.get(levelName).push(row);
  });

  // Convert to array and sort by level_price (highest first)
  const sortedGroups = Array.from(groupedData.entries())
    .sort((a, b) => {
      const priceA = a[1][0]?.level_price || 0;
      const priceB = b[1][0]?.level_price || 0;
      return priceB - priceA; // Descending order
    });

  return sortedGroups;
}

/**
 * Renders HTML template
 * @param {Array} groups - Grouped data
 * @param {number} padding - Number of padding lines before and after content
 * @param {number} duration - Animation duration in seconds
 * @returns {string} Rendered HTML
 */
function renderHTML(groups, padding = 50, duration = 30) {
  try {
    const title = localStorage.getItem('titleSetting') || 'Спасибо!';
    return nunjucks.renderString(templates.html, { groups, padding, duration, title });
  } catch (error) {
    console.error('HTML template rendering error:', error);
    throw new Error('Не удалось рендерить HTML шаблон');
  }
}

/**
 * Renders text template
 * @param {Array} groups - Grouped data
 * @returns {string} Rendered text
 */
function renderTXT(groups) {
  try {
    return nunjucks.renderString(templates.txt, { groups });
  } catch (error) {
    console.error('TXT template rendering error:', error);
    throw new Error(labels.failedToRenderTxtTemplate);
  }
}

/**
 * Renders markdown template
 * @param {Array} groups - Grouped data
 * @returns {string} Rendered markdown
 */
function renderMD(groups) {
  try {
    return nunjucks.renderString(templates.md, { groups });
  } catch (error) {
    console.error('MD template rendering error:', error);
    throw new Error(labels.failedToRenderMdTemplate);
  }
}

/**
 * Processes complete workflow from file to rendered outputs
 * @param {File} file - Uploaded CSV file
 * @returns {Promise<Object>} Processing results
 */
async function processFileForRes(file) {
  // Step 1: Validate file
  validateFile(file);

  // Step 2: Read file content
  const csvText = await readFileContent(file);

  // Step 3: Parse CSV
  const parsedData = await parseCSV(csvText);

  // Step 4: Filter and sort data
  const filterDateStr = localStorage.getItem('filterDateSetting');
  const filterDate = filterDateStr ? new Date(filterDateStr + 'T00:00:00') : null;
  const filteredData = filterAndSortData(parsedData, filterDate);

  // Step 5: Group data
  const groupedData = groupData(filteredData);

  // Step 6: Render all templates
  const padding = parseInt(localStorage.getItem('paddingSetting')) || 0;
  const duration = parseInt(localStorage.getItem('animationDurationSetting')) || 30;
  return {
    html: renderHTML(groupedData, padding, duration),
    txt: renderTXT(groupedData),
    md: renderMD(groupedData),
    stats: {
      totalRows: parsedData.length,
      activeSubscriptions: filteredData.length,
      groups: groupedData.length
    }
  };
}

/**
 * Processes complete workflow from file to rendered outputs
 * @param {File} file - Uploaded CSV file
 * @returns {Promise<Object>} Processing results
 */
async function processFile(file) {
  try {
    return await processFileForRes(file);
  } catch (error) {
    console.error('Processing error:', error);
    throw error;
  }
}

