/**
 * SplitText Helper Utility
 * Splits text into individual character spans wrapped in masking containers.
 * Retains accessibility via aria-hidden and aria-label.
 * Compatible with GSAP stagger, overshoot eases, and ScrollTrigger.
 */

export interface SplitCharProps {
  text: string;
  className?: string;
  charClassName?: string;
  wordClassName?: string;
}

export function splitTextIntoChars(text: string): { word: string; chars: string[] }[] {
  const words = text.split(' ');
  return words.map((word) => ({
    word,
    chars: Array.from(word),
  }));
}
