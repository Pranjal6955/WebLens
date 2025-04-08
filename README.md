# WebLens: Web Accessibility Compliance Checker

A comprehensive tool for checking web accessibility compliance with WCAG guidelines, helping developers create more inclusive web experiences.

## Overview

WebLens analyzes web pages for accessibility issues according to the Web Content Accessibility Guidelines (WCAG), providing detailed reports and suggestions for improvement. The tool combines a React frontend with a Python-based FastAPI backend to deliver comprehensive accessibility audits.

## Project Description

WebLens was created to address the critical need for accessible web content in today's digital landscape. With over a billion people worldwide living with disabilities, ensuring websites are accessible is both a legal requirement in many jurisdictions and an ethical imperative.

### Purpose

WebLens serves as a specialized tool for developers, QA teams, content creators, and organizations to:

- Identify accessibility barriers that may prevent users with disabilities from accessing web content
- Provide actionable recommendations to fix accessibility issues
- Generate compliance reports suitable for internal audits and legal documentation
- Educate development teams about WCAG guidelines and best practices
- Streamline the process of making web applications more inclusive

### Leveraging AI and Human Expertise

WebLens combines automated testing with human-centered design principles. While the tool uses sophisticated algorithms to detect technical compliance issues, it also provides context-aware recommendations that consider user experience. This balanced approach recognizes that true accessibility goes beyond mere technical compliance.

### Privacy and Security

The tool is designed with privacy in mind. All analysis happens server-side without storing the full content of analyzed websites. Only accessibility metrics and detected issues are saved when users are authenticated, and all communication between the frontend and backend is secured.

## Features

### Accessibility Testing

- WCAG 2.1 compliance checking (A, AA, AAA levels)
- Detailed issue detection and classification by severity
- Analysis of elements for proper alt text, aria labels, and more
- Keyboard navigation accessibility verification
- Color contrast ratio analysis
- Form accessibility validation
- Table structure assessment
- Document landmarks validation
- Heading structure verification

### Reporting

- Compliance score calculation
- Issue categorization by type and severity
- Detailed recommendations with code snippets
- Exportable PDF reports with summary and detailed issues
- WCAG compliance breakdown by principle (Perceivable, Operable, Understandable, Robust)
- Element coverage metrics (alt text, form labels, interactive elements)

### Advanced Features

- Rate limiting for API protection
- CORS support for secure cross-origin requests
- Responsive UI design
- Authentication system using Supabase
- Dashboard for tracking historical reports

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- jsPDF for report generation
- Zustand for state management

### Backend
- FastAPI framework
- BeautifulSoup4 for HTML parsing
- WCAG contrast ratio calculator
- Pydantic for data validation
- Supabase for authentication and storage

## Use Cases

WebLens is valuable across multiple scenarios:

1. **Development Workflow Integration**: Developers can check pages during development to catch accessibility issues early
2. **Continuous Integration**: Automated accessibility checks as part of CI/CD pipelines
3. **Compliance Auditing**: Organizations can generate reports to demonstrate WCAG compliance efforts
4. **Education**: Teaching teams about accessibility best practices through practical examples
5. **User Experience Enhancement**: Improving overall UX by addressing accessibility concerns

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Node.js 16+ and npm/yarn

### Setting up Virtual Environment

1. Create a virtual environment:
```bash
# On Windows
python -m venv venv

# On macOS/Linux
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### Installing Dependencies

1. Install backend packages:
```bash
pip install -r requirements.txt
```

2. Install frontend packages:
```bash
npm install
# or
yarn
```

### Configuration

1. Create a `.env` file based on the example:
```bash
cp $env-example .env
```

2. Update Supabase credentials in the `.env` file if needed.

### Running the Application

1. Start the FastAPI backend:
```bash
# Navigate to the backend directory
cd backend

# Start the server with uvicorn
uvicorn main:app --reload --port 8000
```

2. Start the React frontend (in a separate terminal):
```bash
npm run dev
# or
yarn dev
```

3. Access the application:
   - Frontend: `http://localhost:5173` (or port shown in terminal)
   - Backend API: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

## API Endpoints

- `POST /check`: Check WCAG compliance for a given URL
  - Request body: `{ "url": "https://example.com" }`
  - Returns detailed compliance report

- `GET /health`: Health check endpoint
  - Returns status of the service

## How WebLens Works

1. **URL Submission**: The user submits a URL through the frontend interface
2. **Backend Processing**: The FastAPI backend:
   - Fetches the target webpage
   - Parses the HTML with BeautifulSoup
   - Runs various accessibility checks
   - Analyzes element structure and attributes
   - Checks color contrast ratios
   - Validates ARIA attributes
   - Verifies keyboard navigation
3. **Results Generation**: The system:
   - Calculates an overall compliance score
   - Categorizes issues by type and severity
   - Generates specific recommendations
   - Creates metrics on element coverage
4. **Report Display**: The frontend:
   - Displays a summary of findings
   - Shows compliance by WCAG principle
   - Lists detailed issues with code snippets
   - Provides recommendations for fixing problems
5. **Report Export**: Users can download a PDF report with comprehensive findings

## WCAG Principles Covered

WebLens evaluates websites against the four core principles of WCAG:

1. **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive
   - Text alternatives for non-text content
   - Captions and alternatives for multimedia
   - Content adaptability
   - Distinguishable content (color, contrast, etc.)

2. **Operable**: User interface components and navigation must be operable
   - Keyboard accessibility
   - Sufficient time to read and use content
   - Seizure prevention
   - Navigable content

3. **Understandable**: Information and operation of the user interface must be understandable
   - Readable text
   - Predictable behavior
   - Input assistance

4. **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents
   - Compatible with current and future tools

## Project Structure

```
WebLens/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── wcag_checker.py   # WCAG checking logic
│   └── utils/            # Utility functions
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # UI components
│   │   ├── results.tsx   # Results display
│   │   ├── types.ts      # TypeScript interfaces
│   │   └── url-form.tsx  # URL input form
│   ├── lib/              # Utility libraries
│   │   ├── supabase.ts   # Supabase client
│   │   └── utils.ts      # Helper functions
│   ├── pages/            # Page components
│   ├── store/            # State management
│   ├── utils/            # Utility functions
│   │   └── generatePDF.ts # PDF generation
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── tests/                # Test suite
├── index.html            # HTML entry point
├── package.json          # Frontend dependencies
├── requirements.txt      # Backend dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

## Development

To install development dependencies:
```bash
pip install -r requirements-dev.txt
```

### Code Quality Tools

- ESLint for TypeScript/JavaScript linting
- Prettier for code formatting
- Black for Python code formatting
- Pytest for backend testing

### Running Tests

```bash
# Backend tests
pytest tests/

# Frontend linting
npm run lint
```

## Building for Production

```bash
# Build frontend
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be served by a static file server.

## Authentication

WebLens uses Supabase for authentication. Users can:

1. Sign up with email and password
2. Sign in to existing accounts
3. View their saved reports
4. Sign out when finished

## Future Roadmap

The WebLens project has several planned enhancements:

1. **Automated Remediation Suggestions**: AI-powered code fixes for common accessibility issues
2. **Browser Extension**: Direct page analysis from within the browser
3. **Bulk URL Testing**: Analyze multiple pages or entire sites in a single operation
4. **Custom Rule Sets**: Allow organizations to define additional accessibility standards
5. **Integration APIs**: Connect with project management and issue tracking systems
6. **Accessibility Trends**: Track improvements over time with historical data visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License
