import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  trustScore: number;
  extractionMethod?: 'auto' | 'user' | 'hybrid';
  size?: 'sm' | 'md';
}

export default function ConfidenceBadge({ 
  trustScore, 
  extractionMethod = 'auto',
  size = 'md' 
}: ConfidenceBadgeProps) {
  const isVerified = trustScore >= 100 || extractionMethod === 'user';
  const isHighConfidence = trustScore >= 70 && !isVerified;
  const isLowConfidence = trustScore < 70;

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  if (isVerified) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 ${textSize} font-medium`}>
        <CheckCircle2 className={iconSize} />
        Verified
      </span>
    );
  }

  if (isHighConfidence) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 ${textSize} font-medium`}>
        <HelpCircle className={iconSize} />
        Suggested ({trustScore}%)
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 ${textSize} font-medium`}>
      <AlertCircle className={iconSize} />
      Review ({trustScore}%)
    </span>
  );
}

