import { useState, useEffect } from 'react';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  mobileOnly?: boolean; // Only collapse on mobile
  highlight?: string; // Optional highlight value to show in header when collapsed
  sectionId?: string; // Unique ID for accordion behavior
  openSectionId?: string | null; // Currently open section (for accordion)
  onOpen?: (sectionId: string) => void; // Callback when section opens
}

export function CollapsibleSection({
  title,
  children,
  defaultCollapsed = false,
  mobileOnly = true,
  highlight,
  sectionId,
  openSectionId,
  onOpen,
}: CollapsibleSectionProps) {
  const [isCollapsedLocal, setIsCollapsedLocal] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update collapsed state when mobile changes
  useEffect(() => {
    if (mobileOnly) {
      setIsCollapsedLocal(isMobile && defaultCollapsed);
    }
  }, [isMobile, mobileOnly, defaultCollapsed]);

  // Accordion mode: use openSectionId to determine collapsed state on mobile
  const isAccordionMode = isMobile && sectionId && openSectionId !== undefined;
  const isCollapsed = isAccordionMode ? openSectionId !== sectionId : isCollapsedLocal;

  const handleToggle = () => {
    if (isAccordionMode && onOpen) {
      // In accordion mode, opening this section closes others
      onOpen(isCollapsed ? sectionId : '');
    } else {
      setIsCollapsedLocal(!isCollapsedLocal);
    }
  };

  const shouldShowCollapsible = mobileOnly ? isMobile : true;

  if (!shouldShowCollapsible) {
    return <>{children}</>;
  }

  return (
    <div
      className={`${styles.collapsibleSection} ${isCollapsed ? styles.collapsed : ''}`}
      data-component="collapsible-section"
      data-section={title.toLowerCase().replace(/\s+/g, '-')}
    >
      <button
        className={styles.collapsibleHeader}
        onClick={handleToggle}
        aria-expanded={!isCollapsed}
        data-action="toggle-section"
        data-section={title.toLowerCase().replace(/\s+/g, '-')}
        data-collapsed={isCollapsed}
      >
        <span className={styles.collapsibleTitle}>{title}</span>
        {isCollapsed && highlight && (
          <span className={styles.collapsibleHighlight}>{highlight}</span>
        )}
        <svg
          className={styles.collapsibleChevron}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={styles.collapsibleContent}>
        {children}
      </div>
    </div>
  );
}
