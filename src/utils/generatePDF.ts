import { jsPDF as JsPDF } from 'jspdf';
import { jsPDF } from "jspdf";
import { UserOptions } from 'jspdf-autotable';
import 'jspdf-autotable';
import type { ResultsProps } from '../components/results';

type PDFData = Omit<ResultsProps, 'onDownload'>;

declare global {
  interface Window {
    jspdf: any;
  }
}

export const generatePDF = (data: PDFData) => {
  // Create document with window namespace
  const doc = new window.jspdf.jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.text('WCAG Compliance Report', pageWidth / 2, 20, { align: 'center' });
  
  // URL and Date
  doc.setFontSize(12);
  doc.text(`URL: ${data.url}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
  
  // Compliance Score
  doc.setFontSize(16);
  doc.text('Compliance Score', pageWidth / 2, 55, { align: 'center' });
  doc.setFontSize(24);
  doc.text(`${Math.round(data.score)}%`, pageWidth / 2, 65, { align: 'center' });
  
  // Summary Table
  doc.setFontSize(14);
  doc.text('Issue Summary', 20, 80);
  const summaryData = [
    ['Critical', data.summary.critical],
    ['Serious', data.summary.serious],
    ['Moderate', data.summary.moderate],
    ['Minor', data.summary.minor],
    ['Total Issues', data.summary.total_issues],
  ];

  // Update all autoTable calls
  window.jspdf.jsPDF.API.autoTable.call(doc, {
    startY: 85,
    head: [['Severity', 'Count']],
    body: summaryData,
    theme: 'grid',
    styles: { cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  // Metrics
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Site Metrics', 20, 20);
  
  const metricsData = [
    ['Total Elements', data.metrics.element_counts.total],
    ['Interactive Elements', data.metrics.element_counts.interactive],
    ['Images', data.metrics.element_counts.images],
    ['Forms', data.metrics.element_counts.forms],
    ['Headings', data.metrics.element_counts.headings],
    ['Landmarks', data.metrics.element_counts.landmarks],
  ];

  window.jspdf.jsPDF.API.autoTable.call(doc, {
    startY: 25,
    head: [['Metric', 'Count']],
    body: metricsData,
    theme: 'grid',
    styles: { cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  // WCAG Compliance Breakdown
  const lastY = doc.previousAutoTable?.finalY || 20;
  doc.text('WCAG Compliance Breakdown', 20, lastY + 20);
  
  const wcagData = [
    ['Perceivable', `${Math.round(data.metrics.wcag_compliance.perceivable)}%`],
    ['Operable', `${Math.round(data.metrics.wcag_compliance.operable)}%`],
    ['Understandable', `${Math.round(data.metrics.wcag_compliance.understandable)}%`],
    ['Robust', `${Math.round(data.metrics.wcag_compliance.robust)}%`],
  ];

  window.jspdf.jsPDF.API.autoTable.call(doc, {
    startY: lastY + 25,
    head: [['Principle', 'Score']],
    body: wcagData,
    theme: 'grid',
    styles: { cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  // Recommendations
  doc.addPage();
  doc.text('Recommendations', 20, 20);
  
  const recommendationsData = data.recommendations.map(rec => [
    rec.type,
    rec.priority,
    rec.suggestion,
  ]);

  window.jspdf.jsPDF.API.autoTable.call(doc, {
    startY: 25,
    head: [['Type', 'Priority', 'Suggestion']],
    body: recommendationsData,
    theme: 'grid',
    styles: { cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202] },
    columnStyles: {
      2: { cellWidth: 100 },
    },
  });
  
  // Save the PDF
  doc.save(`wcag-report-${data.url.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
};
