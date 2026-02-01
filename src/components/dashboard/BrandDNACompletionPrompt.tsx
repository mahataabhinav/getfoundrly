import { AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import type { BrandDNA } from '../../types/database';

interface BrandDNACompletionPromptProps {
  brandDNA: BrandDNA | null;
  onNavigateToBrandDNA?: () => void;
}

export default function BrandDNACompletionPrompt({ brandDNA, onNavigateToBrandDNA }: BrandDNACompletionPromptProps) {
  if (!brandDNA) return null;

  const completionScore = brandDNA.completion_score ?? 0;

  // Only show if completion is below 70%
  if (completionScore >= 70) return null;

  // Determine severity based on completion score
  const isLowCompletion = completionScore < 30;
  const isMediumCompletion = completionScore >= 30 && completionScore < 70;

  return (
    <div className={`mb-6 p-4 rounded-xl border ${
      isLowCompletion
        ? 'bg-yellow-500/10 border-yellow-500/20'
        : 'bg-blue-500/10 border-blue-500/20'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isLowCompletion ? (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-blue-400" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className={`text-sm font-semibold ${
              isLowCompletion ? 'text-yellow-400' : 'text-blue-400'
            }`}>
              {isLowCompletion
                ? 'Brand DNA Partially Extracted'
                : 'Improve Your Brand DNA'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {isLowCompletion ? (
                <>
                  Your Brand DNA was extracted using basic data only (OpenAI unavailable).
                  Completion: <span className="font-semibold text-yellow-400">{completionScore}%</span>
                </>
              ) : (
                <>
                  Your Brand DNA is <span className="font-semibold">{completionScore}% complete</span>.
                  Completing it will improve content generation quality.
                </>
              )}
            </p>
          </div>

          {/* Low completion - explain Firecrawl-only extraction */}
          {isLowCompletion && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                We extracted basic information from your website, but couldn't perform AI analysis. You can:
              </p>
              <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
                <li>Manually complete your Brand DNA in the Brand DNA section</li>
                <li>Re-extract when OpenAI credits are available for full analysis</li>
                <li>Continue using Foundrly with current data (30-40% accuracy)</li>
              </ol>
            </div>
          )}

          {/* Medium completion - encourage completion */}
          {isMediumCompletion && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                Complete the missing sections to unlock better content generation:
              </p>
              <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                <li>Voice & tone examples</li>
                <li>Target audience personas</li>
                <li>Value propositions & messaging pillars</li>
                <li>Product details & differentiators</li>
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onNavigateToBrandDNA}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-2 ${
                isLowCompletion
                  ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30'
                  : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isLowCompletion ? 'Complete Brand DNA' : 'Improve Brand DNA'}
            </button>

            {isLowCompletion && (
              <a
                href="https://platform.openai.com/settings/organization/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/5 text-zinc-300 rounded-lg font-medium text-sm hover:bg-white/10 transition-all border border-white/10 inline-flex items-center gap-2"
              >
                Add OpenAI Credits
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Completion Progress</span>
          <span>{completionScore}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isLowCompletion
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                : 'bg-gradient-to-r from-blue-500 to-blue-400'
            }`}
            style={{ width: `${completionScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
