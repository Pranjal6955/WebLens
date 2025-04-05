import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface IssueDetail {
  element: string;
  location: string;
  severity: string;
  impact: string;
  description: string;
  code_snippet: string;
  wcag_criteria: string;
}

export interface ComplianceIssue {
  type: string;
  details: IssueDetail[];
}

export interface ResultsProps {
  url: string;
  score: number;
  summary: {
    total_issues: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  issuesByType: Record<string, IssueDetail[]>;
  recommendations: Array<{
    type: string;
    priority: string;
    suggestion: string;
    impact: string;
    wcag_criteria: string;
  }>;
  onDownload: () => void;
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

export function Results({ 
  url, 
  score, 
  summary = {
    total_issues: 0,
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0
  }, 
  issuesByType = {}, 
  recommendations = [], 
  metrics = {
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
  },
  onDownload 
}: ResultsProps) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Accessibility Report</h2>
        <p className="text-gray-600">URL: {url}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-4xl font-bold text-blue-700">{score}/100</div>
            <div className="text-sm text-blue-600">Compliance Score</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Critical Issues: <span className="font-bold text-red-600">{summary.critical}</span></div>
              <div>Serious Issues: <span className="font-bold text-orange-600">{summary.serious}</span></div>
              <div>Moderate Issues: <span className="font-bold text-yellow-600">{summary.moderate}</span></div>
              <div>Minor Issues: <span className="font-bold text-green-600">{summary.minor}</span></div>
            </div>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible>
        {Object.entries(issuesByType).map(([type, details]) => (
          <AccordionItem key={type} value={type}>
            <AccordionTrigger className="text-lg font-semibold">
              {type.replace(/_/g, ' ')} ({details.length} issues)
            </AccordionTrigger>
            <AccordionContent>
              {details.map((detail, idx) => (
                <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-sm text-gray-600">Element: {detail.element}</div>
                    <div className="text-sm text-gray-600">Location: {detail.location}</div>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs text-white ${
                      detail.severity === 'critical' ? 'bg-red-500' :
                      detail.severity === 'serious' ? 'bg-orange-500' :
                      detail.severity === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {detail.severity}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{detail.description}</p>
                  <pre className="bg-gray-800 text-white p-2 rounded text-xs overflow-x-auto">
                    {detail.code_snippet}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">{detail.wcag_criteria}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Page Structure</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Total Elements:</dt>
                  <dd>{metrics.element_counts.total}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Interactive Elements:</dt>
                  <dd>{metrics.element_counts.interactive}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Images:</dt>
                  <dd>{metrics.element_counts.images}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Forms:</dt>
                  <dd>{metrics.element_counts.forms}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Coverage Metrics</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Alt Text Coverage:</dt>
                  <dd>{metrics.accessibility_coverage.alt_text_coverage}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Form Labels:</dt>
                  <dd>{metrics.accessibility_coverage.form_labels_coverage}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Interactive Accessibility:</dt>
                  <dd>{metrics.accessibility_coverage.interactive_elements_accessibility}%</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section>
          <h4 className="font-medium mb-4">WCAG Compliance by Principle</h4>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(metrics.wcag_compliance).map(([principle, value]) => (
              <div key={principle} className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{value}%</div>
                <div className="text-sm capitalize">{principle}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <button
        onClick={onDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Download Report
      </button>
    </div>
  );
}