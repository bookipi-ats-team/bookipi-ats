interface ScorePillProps {
  score?: number;
  label?: string;
  className?: string;
}

export const ScorePill: React.FC<ScorePillProps> = ({ score, label, className = '' }) => {
  if (score === undefined) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return { bg: '#E7F6EC', text: '#16A34A' };
    if (score >= 70) return { bg: '#FEF3C7', text: '#F59E0B' };
    return { bg: '#FDECEC', text: '#DC2626' };
  };

  const colors = getScoreColor(score);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label && <span className="text-[10px] font-medium opacity-75">{label}</span>}
      {score}
    </span>
  );
};
