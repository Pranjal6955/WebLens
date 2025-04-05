# WCAG Compliance Checker

A Python-based tool for checking web accessibility compliance with WCAG guidelines.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

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

Install all required packages using pip:
```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the FastAPI server:
```bash
# Navigate to the backend directory
cd backend

# Start the server with uvicorn
uvicorn main:app --reload --port 8000
```

2. The API will be available at:
- API Endpoint: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## API Endpoints

- POST `/check`: Check WCAG compliance for a given URL
- GET `/health`: Health check endpoint

## Development

To install development dependencies:
```bash
pip install -r requirements-dev.txt
```

## Project Structure

```
WCAG/
├── backend/
│   ├── main.py           # FastAPI application
│   └── wcag_checker.py   # WCAG checking logic
├── requirements.txt      # Project dependencies
├── requirements-dev.txt  # Development dependencies
└── README.md            # Project documentation
```

## Features

- WCAG 2.1 compliance checking
- Automated accessibility testing
- Detailed compliance reports
- Performance metrics
- Rate limiting
- CORS support

## License

MIT License
