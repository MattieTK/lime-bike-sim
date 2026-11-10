interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
    mobileOnly?: boolean;
    highlight?: string;
    sectionId?: string;
    openSectionId?: string | null;
    onOpen?: (sectionId: string) => void;
}
export declare function CollapsibleSection({ title, children, defaultCollapsed, mobileOnly, highlight, sectionId, openSectionId, onOpen, }: CollapsibleSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CollapsibleSection.d.ts.map