# Pakistan Tax Calculator

![Pakistan Tax Calculator](docs\localhost_5173_.png)

## Overview

Pakistan Tax Calculator is a web application designed to help users calculate taxes according to ![Pakistan's tax regulations for the year 2025](docs\WithHoldingRatesTaxYear2025.pdf). The application provides a user-friendly interface for selecting tax categories and calculating tax amounts based on income and filer status.

## Features

- **Hierarchical Tax Category Selection**: Navigate through tax sections, subsections, categories, and subcategories
- **Filer vs Non-Filer Calculation**: Different tax rates for filers and non-filers
- **Instant Tax Calculation**: Real-time calculation of tax amounts and net income
- **Tax Information Display**: Shows detailed breakdown of tax calculations with tax nature information

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Morgan (HTTP request logger)
- CORS (Cross-Origin Resource Sharing)

### Frontend
- React.js
- Axios for API requests
- Tailwind CSS for styling

## Database Schema

The application relies on a PostgreSQL database with the following structure:

- **tax_sections**: Main tax categories
- **tax_subsections**: Subcategories under each tax section
- **tax_categories**: Specific tax categories under subsections
- **tax_subcategories**: Detailed tax items including tax rates information

### Key Fields in tax_subcategories
- `filer_rate`: Tax rate percentage for filers
- `non_filer_rate`: Tax rate percentage for non-filers
- `tax_nature`: Description of the tax type

## Installation and Setup

### Prerequisites
- Node.js (v12 or higher)
- PostgreSQL (v10 or higher)
- npm or yarn

### Database Setup
1. Create a PostgreSQL database named `tax_calculator`
2. Import the provided SQL dump or run the migration scripts

```bash
psql -U postgres -d tax_calculator -f schema.sql
```

### Server Setup
1. Clone the repository
```bash
git clone https://github.com/username/pakistan-tax-calculator.git
cd pakistan-tax-calculator
```

2. Install server dependencies
```bash
npm install
```

3. Configure the database connection in `server.js`
```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tax_calculator',
  password: 'your_password',
  port: 5432,
});
```

4. Start the server
```bash
npm start
```
The server will run on http://localhost:5000

### Client Setup
1. Navigate to the client directory
```bash
cd client
```

2. Install client dependencies
```bash
npm install
```

3. Start the React development server
```bash
npm start
```
The client will run on http://localhost:3000

## API Endpoints

### GET `/api/tax-sections`
Returns all available tax sections.

### GET `/api/tax-subsections/:sectionId`
Returns all subsections for a given tax section ID.

### GET `/api/tax-categories/:subSectionId`
Returns all categories for a given subsection ID.

### GET `/api/tax-subcategories/:categoryId`
Returns all subcategories for a given category ID.

### POST `/api/calculate-tax`
Calculates tax based on provided parameters.

Request Body:
```json
{
  "subCategoryId": "1",
  "filerStatus": "filer",
  "grossAmount": 100000
}
```

Response:
```json
{
  "grossAmount": 100000,
  "taxRate": 5,
  "taxAmount": 5000,
  "netAmount": 95000,
  "taxNature": "Withholding Tax"
}
```

## Usage Guide

1. **Select Tax Section**: Choose from available main tax categories
2. **Select Subsection**: Pick the relevant subsection within the chosen tax section
3. **Select Category**: Choose the specific tax category
4. **Select Subcategory**: Select the detailed tax item applicable to your case
5. **Set Filer Status**: Choose between "Filer" and "Non-Filer"
6. **Enter Gross Amount**: Input the amount in PKR on which tax will be calculated
7. **Calculate**: Click the "Calculate Tax" button to get your results
8. **View Results**: See the breakdown of gross amount, tax rate, tax amount, and net amount

## Contributing

We welcome contributions to the Pakistan Tax Calculator project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Pakistan Federal Board of Revenue (FBR) for tax regulations information
- The open-source community for providing the tools and libraries used in this project

## Contact

Project Link: [https://github.com/username/pakistan-tax-calculator](https://github.com/username/pakistan-tax-calculator)