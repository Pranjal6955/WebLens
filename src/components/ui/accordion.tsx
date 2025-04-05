import React from 'react';

type AccordionType = "single" | "multiple";

interface AccordionProps {
    type?: AccordionType;
    collapsible?: boolean;
    children: React.ReactNode;
}

interface AccordionItemProps {
    value: string;
    children: React.ReactNode;
}

interface AccordionTriggerProps {
    children: React.ReactNode;
    className?: string;
}

interface AccordionContentProps {
    children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ type = "single", collapsible = true, children }) => {
    return (
        <div className="border rounded-lg mb-2">
            {children}
        </div>
    );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, children }) => {
    return (
        <div className="border-b">
            {children}
        </div>
    );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className }) => {
    return (
        <button className={className}>
            {children}
        </button>
    );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({ children }) => {
    return (
        <div className="px-4 py-2">
            {children}
        </div>
    );
};
