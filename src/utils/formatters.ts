export function formatCurrency(amount: string | number): string {
  if (typeof amount === 'number') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return amount || 'Competitive';
}

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Recently';
  return dateStr;
}

export function getMatchScoreColor(score: number): {
  badge: string;
  text: string;
  border: string;
  glow: string;
  bg: string;
} {
  if (score >= 82) {
    return {
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      bg: 'bg-emerald-500',
    };
  }
  if (score >= 70) {
    return {
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      text: 'text-blue-400',
      border: 'border-blue-500/40',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
      bg: 'bg-blue-500',
    };
  }
  if (score >= 50) {
    return {
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      bg: 'bg-amber-500',
    };
  }
  return {
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
    bg: 'bg-rose-500',
  };
}

export function truncateText(text: string, maxLength: number = 180): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
