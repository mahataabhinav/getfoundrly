import { AlertCircle, ExternalLink } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export default function ErrorMessage({ error, onRetry, onSkip, showSkip }: ErrorMessageProps) {
  // Parse error type
  const isBillingError = error.includes('BILLING_ERROR') || error.includes('credits exceeded');
  const isRateLimitError = error.includes('rate limit');
  const isAuthError = error.includes('Invalid') || error.includes('API key');
  const isTimeoutError = error.includes('timed out') || error.includes('took too long');
  const isQuotaError = error.includes('quota') || error.includes('limit exceeded') || error.includes('API quota');
  const isURLError = error.includes('URL') || error.includes('accessible') || error.includes('Failed to scrape');

  // Extract clean error message
  const cleanError = error.replace('BILLING_ERROR: ', '');

  return (
    <div className={`p-4 rounded-xl border ${
      isBillingError
        ? 'bg-yellow-500/10 border-yellow-500/20'
        : 'bg-red-500/10 border-red-500/20'
    }`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          isBillingError ? 'text-yellow-400' : 'text-red-400'
        }`} />
        <div className="flex-1 space-y-3">
          <p className={`text-sm ${isBillingError ? 'text-yellow-400' : 'text-red-400'}`}>
            {cleanError}
          </p>

          {/* Billing error - show helpful actions */}
          {isBillingError && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">To resolve this:</p>
              <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
                <li>Go to OpenAI billing settings</li>
                <li>Add prepaid credits (minimum $10 recommended)</li>
                <li>Check usage limits are not set to $0</li>
                <li>Wait 2-5 minutes for credits to activate</li>
              </ol>
              <a
                href="https://platform.openai.com/settings/organization/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#CCFF00] hover:underline"
              >
                Open OpenAI Billing Settings
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Rate limit error - show helpful actions */}
          {isRateLimitError && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                Please wait a few moments before trying again. This error occurs when too many requests are made in a short time.
              </p>
            </div>
          )}

          {/* Auth error - show helpful actions */}
          {isAuthError && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                Your OpenAI API key may be invalid or revoked. Please check your .env file.
              </p>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#CCFF00] hover:underline"
              >
                Manage API Keys
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Timeout error - show helpful actions */}
          {isTimeoutError && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                The website took too long to respond. This could be due to:
              </p>
              <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                <li>Slow server response</li>
                <li>Large website with many pages</li>
                <li>Network connectivity issues</li>
              </ul>
              <p className="text-xs text-zinc-400">Try again in a moment.</p>
            </div>
          )}

          {/* Quota error - show helpful actions */}
          {isQuotaError && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                API usage limit reached. Possible solutions:
              </p>
              <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                <li>Wait an hour for quota reset</li>
                <li>Upgrade your API plan</li>
                <li>Check your usage dashboard</li>
              </ul>
            </div>
          )}

          {/* URL error - show helpful actions */}
          {isURLError && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">
                Unable to access the website. Please verify:
              </p>
              <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                <li>The URL is correct and complete (include https://)</li>
                <li>The website is publicly accessible</li>
                <li>The website is not blocking automated access</li>
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition-all"
              >
                Try Again
              </button>
            )}
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-2 bg-white/5 text-zinc-300 rounded-lg font-medium text-sm hover:bg-white/10 transition-all border border-white/10"
              >
                Skip for Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
