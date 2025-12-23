import { useState } from 'react';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface ShareButtonsProps {
  totalDistance: number;
  stopCount: number;
  stopTime: number;
  stopRevenue: number;
}

function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)}km`;
}

export function ShareButtons({ totalDistance, stopCount, stopTime, stopRevenue }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `My ${formatDistance(totalDistance)} Lime ride:
Stopped at ${stopCount} traffic light${stopCount !== 1 ? 's' : ''} for ${formatTime(stopTime)}.
Stop-time revenue: ${formatCurrency(stopRevenue)}.

Lime charges by the minute. See your own ride costs:`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const handleCopyLink = async () => {
    const fullText = `${shareText}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.shareButtons}>
      <div className={styles.shareTitle}>Share your ride</div>
      <div className={styles.shareButtonGroup}>
        <button
          className={`${styles.shareButton} ${styles.shareTwitter}`}
          onClick={handleTwitterShare}
          title="Share on X (Twitter)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Tweet</span>
        </button>

        <button
          className={`${styles.shareButton} ${styles.shareLinkedIn}`}
          onClick={handleLinkedInShare}
          title="Share on LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span>LinkedIn</span>
        </button>

        <button
          className={`${styles.shareButton} ${styles.shareCopy}`}
          onClick={handleCopyLink}
          title="Copy to clipboard"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
