import { useState } from 'react';
import styles from '../styles/LimeBikeSimulator.module.css';

interface Props {
  text: string;
}

/** Share the result. The page URL already carries the route when it was picked here. */
export function ShareRow({ text }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the share links below still work.
    }
  };
  const open = (target: string) => window.open(target, '_blank', 'noopener,width=600,height=480');

  return (
    <div className={styles.share} data-component="share-buttons">
      <button type="button" className={styles.ghostButton} onClick={copy} data-action="share" data-platform="copy">
        {copied ? 'Copied' : 'Copy result'}
      </button>
      <button
        type="button"
        className={styles.ghostButton}
        data-action="share"
        data-platform="twitter"
        onClick={() =>
          open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        }
      >
        Post on X
      </button>
      <button
        type="button"
        className={styles.ghostButton}
        data-action="share"
        data-platform="linkedin"
        onClick={() =>
          open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        }
      >
        LinkedIn
      </button>
    </div>
  );
}
