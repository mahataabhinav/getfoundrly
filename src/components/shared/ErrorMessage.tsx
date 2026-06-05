import { AlertCircle, Clock, Database, Globe } from 'lucide-react';

interface ErrorMessageProps {
  error: Error | string | unknown;
  className?: string;
}

export default function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  const message = error instanceof Error ? error.message : String(error);
  
  let Icon = AlertCircle;
  let title = 'Something went wrong';
  let description = message;
  let bgColor = 'bg-red-50';
  let textColor = 'text-red-700';
  let borderColor = 'border-red-200';
  let iconColor = 'text-red-500';

  // Categorize errors
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('time') || lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    Icon = Clock;
    title = 'Request Timed Out';
    description = 'The operation took too long to complete. Please try again later when the service is less busy.';
    bgColor = 'bg-orange-50';
    textColor = 'text-orange-700';
    borderColor = 'border-orange-200';
    iconColor = 'text-orange-500';
  } else if (lowerMessage.includes('quota') || lowerMessage.includes('rate limit') || lowerMessage.includes('429')) {
    Icon = Database;
    title = 'Usage Limit Reached';
    description = 'You have reached your API usage limit. Please wait a moment before trying again or upgrade your plan.';
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-700';
    borderColor = 'border-yellow-200';
    iconColor = 'text-yellow-500';
  } else if (lowerMessage.includes('url') || lowerMessage.includes('fetch') || lowerMessage.includes('network') || lowerMessage.includes('cors') || lowerMessage.includes('accessible')) {
    Icon = Globe;
    title = 'Connection Error';
    description = 'We could not connect to the specified URL or website. Please verify the link is correct and accessible publicly.';
    bgColor = 'bg-blue-50';
    textColor = 'text-blue-700';
    borderColor = 'border-blue-200';
    iconColor = 'text-blue-500';
  }

  return (
    <div className={`rounded-xl border p-4 ${bgColor} ${borderColor} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
        <div>
          <h4 className={`text-sm font-semibold ${textColor}`}>{title}</h4>
          <p className={`mt-1 text-sm ${textColor} opacity-90 leading-relaxed`}>{description}</p>
          {/* Detailed raw message below the friendly description */}
          {title !== 'Something went wrong' && (
            <p className={`mt-2 text-xs ${textColor} opacity-75 break-words`}>Details: {message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
