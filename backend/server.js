const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tax_calculator',
  password: 'abaomar',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'client/build')));

// ---------- API ROUTES ----------

// Get all tax sections
app.get('/api/tax-sections', async (req, res) => {
  console.log('[REQUEST] GET /api/tax-sections');
  try {
    const result = await pool.query('SELECT * FROM tax_sections ORDER BY name');
    console.log(`[SUCCESS] Retrieved ${result.rows.length} tax sections`);
    res.json(result.rows);
  } catch (err) {
    console.error('[ERROR] Failed to fetch tax sections:', err.message);
    res.status(500).json({ error: 'Failed to fetch tax sections' });
  }
});

// Get subsections for a section
app.get('/api/tax-subsections/:sectionId', async (req, res) => {
  const { sectionId } = req.params;
  console.log(`[REQUEST] GET /api/tax-subsections/${sectionId}`);
  try {
    const result = await pool.query(
      'SELECT * FROM tax_subsections WHERE section_id = $1 ORDER BY name',
      [sectionId]
    );
    console.log(`[SUCCESS] Retrieved ${result.rows.length} subsections for sectionId: ${sectionId}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`[ERROR] Failed to fetch tax subsections for sectionId ${sectionId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch tax subsections' });
  }
});

// Get categories for a subsection
app.get('/api/tax-categories/:subSectionId', async (req, res) => {
  const { subSectionId } = req.params;
  console.log(`[REQUEST] GET /api/tax-categories/${subSectionId}`);
  try {
    const result = await pool.query(
      'SELECT * FROM tax_categories WHERE subsection_id = $1 ORDER BY name',
      [subSectionId]
    );
    console.log(`[SUCCESS] Retrieved ${result.rows.length} categories for subSectionId: ${subSectionId}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`[ERROR] Failed to fetch tax categories for subSectionId ${subSectionId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch tax categories' });
  }
});

// Get subcategories for a category
app.get('/api/tax-subcategories/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  console.log(`[REQUEST] GET /api/tax-subcategories/${categoryId}`);
  try {
    const result = await pool.query(
      'SELECT * FROM tax_subcategories WHERE category_id = $1 ORDER BY name',
      [categoryId]
    );
    console.log(`[SUCCESS] Retrieved ${result.rows.length} subcategories for categoryId: ${categoryId}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`[ERROR] Failed to fetch tax subcategories for categoryId ${categoryId}:, err.message`);
    res.status(500).json({ error: 'Failed to fetch tax subcategories' });
  }
});

// Calculate tax based on subcategory, filer status, and gross amount
app.post('/api/calculate-tax', async (req, res) => {
  const { subCategoryId, filerStatus, grossAmount } = req.body;
  console.log('[REQUEST] POST /api/calculate-tax');
  console.log(`[INFO] Input - SubCategory ID: ${subCategoryId}, Filer Status: ${filerStatus}, Gross Amount: ${grossAmount}`);

  try {
    const taxInfoQuery = await pool.query(
      'SELECT filer_rate, non_filer_rate, tax_nature FROM tax_subcategories WHERE id = $1',
      [subCategoryId]
    );

    if (taxInfoQuery.rows.length === 0) {
      console.warn(`[WARN] No tax subcategory found for ID: ${subCategoryId}`);
      return res.status(404).json({ error: 'Tax subcategory not found' });
    }

    const { filer_rate, non_filer_rate, tax_nature } = taxInfoQuery.rows[0];
    const taxRate = filerStatus === 'filer' ? filer_rate : non_filer_rate;

    const taxAmount = (grossAmount * taxRate) / 100;
    const netAmount = grossAmount - taxAmount;

    console.log(`[SUCCESS] Tax Calculated - Rate: ${taxRate}%, Tax: ${taxAmount}, Net: ${netAmount}, Nature: ${tax_nature}`);

    res.json({
      grossAmount,
      taxRate,
      taxAmount,
      netAmount,
      taxNature: tax_nature
    });
  } catch (err) {
    console.error('[ERROR] Tax calculation failed:', err.message);
    res.status(500).json({ error: 'Failed to calculate tax' });
  }
});

// // Fallback for React client-side routing (uncomment for production)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`[STARTUP] Server running on port ${PORT}`);
});