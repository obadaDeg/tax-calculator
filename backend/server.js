/**
 * Pakistan Tax Calculator API Server
 * 
 * This server provides tax calculation functionality for Pakistan's tax system.
 * It serves both the API endpoints and static files for the frontend.
 * 
 * @author Obada Daghals
 * @version 1.0.0
 */

// Import required dependencies
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Database connection configuration
 * Using PostgreSQL with the 'pg' library
 * 
 * TODO: Move database credentials to environment variables for security
 */
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tax_calculator',
  password: process.env.DB_PASSWORD || 'abaomar',
  port: process.env.DB_PORT || 5432,
});

// Apply middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger
// app.use(express.static(path.join(__dirname, 'client/build'))); // Serve static files

/**
 * GET /api/tax-sections
 * 
 * Retrieves all tax sections from the database.
 * 
 * @returns {Array} List of tax sections with id and name
 */
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

/**
 * GET /api/tax-subsections/:sectionId
 * 
 * Retrieves tax subsections for a specific section ID.
 * 
 * @param {string} sectionId - The ID of the parent tax section
 * @returns {Array} List of tax subsections with id and name
 */
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

/**
 * GET /api/tax-categories/:subSectionId
 * 
 * Retrieves tax categories for a specific subsection ID.
 * 
 * @param {string} subSectionId - The ID of the parent tax subsection
 * @returns {Array} List of tax categories with id and name
 */
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

/**
 * GET /api/tax-subcategories/:categoryId
 * 
 * Retrieves tax subcategories for a specific category ID.
 * 
 * @param {string} categoryId - The ID of the parent tax category
 * @returns {Array} List of tax subcategories with id, name, and tax rates
 */
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
    console.error(`[ERROR] Failed to fetch tax subcategories for categoryId ${categoryId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch tax subcategories' });
  }
});

/**
 * POST /api/calculate-tax
 * 
 * Calculates tax based on subcategory, filer status, and gross amount.
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.subCategoryId - ID of the tax subcategory
 * @param {string} req.body.filerStatus - Either 'filer' or 'non-filer'
 * @param {number} req.body.grossAmount - Gross amount for tax calculation
 * @returns {Object} Tax calculation results including tax amount and net amount
 */
app.post('/api/calculate-tax', async (req, res) => {
  const { subCategoryId, filerStatus, grossAmount } = req.body;
  console.log('[REQUEST] POST /api/calculate-tax');
  console.log(`[INFO] Input - SubCategory ID: ${subCategoryId}, Filer Status: ${filerStatus}, Gross Amount: ${grossAmount}`);

  // Validate input parameters
  if (!subCategoryId || !filerStatus || !grossAmount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  if (isNaN(grossAmount) || grossAmount < 0) {
    return res.status(400).json({ error: 'Gross amount must be a positive number' });
  }

  try {
    // Get tax rates from the database
    const taxInfoQuery = await pool.query(
      'SELECT filer_rate, non_filer_rate, tax_nature FROM tax_subcategories WHERE id = $1',
      [subCategoryId]
    );

    if (taxInfoQuery.rows.length === 0) {
      console.warn(`[WARN] No tax subcategory found for ID: ${subCategoryId}`);
      return res.status(404).json({ error: 'Tax subcategory not found' });
    }

    // Extract tax information
    const { filer_rate, non_filer_rate, tax_nature } = taxInfoQuery.rows[0];
    const taxRate = filerStatus === 'filer' ? filer_rate : non_filer_rate;

    // Calculate tax amount and net amount
    const taxAmount = (grossAmount * taxRate) / 100;
    const netAmount = grossAmount - taxAmount;

    console.log(`[SUCCESS] Tax Calculated - Rate: ${taxRate}%, Tax: ${taxAmount}, Net: ${netAmount}, Nature: ${tax_nature}`);

    // Return calculation results
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

// Fallback route for SPA to handle client-side routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

// Start the server
app.listen(PORT, () => {
  console.log(`[STARTUP] Server running on port ${PORT}`);
});