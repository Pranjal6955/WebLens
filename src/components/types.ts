export interface ComplianceIssue {
    type: string;
    description: string;
    impact: "serious" | "moderate" | "minor";
    recommendation: string;
    details: string;
}
