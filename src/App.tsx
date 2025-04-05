import { useState, useCallback } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { URLForm } from './components/url-form';
import { Results, type ResultsProps } from './components/results';
import { ComplianceIssue } from './components/types';
import { generatePDF } from './utils/generatePDF';

interface APIResponse {
  url: string;
  compliance_score: number;
  summary: {
    total_issues: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  issues_by_type: Record<string, any>;
  recommendations: Array<{
    type: string;
    priority: string;
    suggestion: string;
    impact: string;
    wcag_criteria: string;
  }>;
  metrics: {
    element_counts: {
      total: number;
      interactive: number;
      images: number;
      forms: number;
      headings: number;
      landmarks: number;
    };
    accessibility_coverage: {
      alt_text_coverage: number;
      form_labels_coverage: number;
      interactive_elements_accessibility: number;
    };
    wcag_compliance: {
      perceivable: number;
      operable: number;
      understandable: number;
      robust: number;
    };
  };
}

const checkCompliance = async (url: string) => {
  try {
    const response = await fetch('http://localhost:8000/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail?.message || 'Failed to check compliance');
    }
    
    const data: APIResponse = await response.json();
    
    // Transform the data to match expected structure
    return {
      score: data.compliance_score,
      summary: data.summary,
      issuesByType: data.issues_by_type,
      recommendations: data.recommendations,
      metrics: data.metrics || {
        element_counts: {
          total: 0,
          interactive: 0,
          images: 0,
          forms: 0,
          headings: 0,
          landmarks: 0
        },
        accessibility_coverage: {
          alt_text_coverage: 0,
          form_labels_coverage: 0,
          interactive_elements_accessibility: 0
        },
        wcag_compliance: {
          perceivable: 0,
          operable: 0,
          understandable: 0,
          robust: 0
        }
      }
    };
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to the compliance checker service.');
    }
    throw err;
  }
};

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Omit<ResultsProps, 'url' | 'onDownload'> | null>(null);

  const handleSubmit = useCallback(async (submittedUrl: string) => {
    if (isLoading) return; // Prevent multiple submissions while loading
    
    setUrl(submittedUrl);
    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await checkCompliance(submittedUrl);
      setResults({
        score: data.score,
        summary: data.summary,
        issuesByType: data.issuesByType,
        recommendations: data.recommendations,
        metrics: data.metrics
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check website compliance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleDownload = () => {
    if (results && url) {
      generatePDF({
        url,
        score: results.score,
        summary: results.summary,
        issuesByType: results.issuesByType,
        recommendations: results.recommendations,
        metrics: results.metrics,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WCAG Compliance Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check your website's accessibility compliance with WCAG 2.1 AA guidelines.
            Get detailed reports and recommendations for improvement.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <URLForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing website accessibility...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {results && (
            <Results
              url={url}
              score={results.score}
              summary={results.summary}
              issuesByType={results.issuesByType}
              recommendations={results.recommendations}
              metrics={results.metrics}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;