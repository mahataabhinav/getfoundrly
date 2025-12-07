import { Check, X, AlertCircle } from 'lucide-react';

interface DiffViewProps {
  field: string;
  oldValue: any;
  newValue: any;
  onAccept?: () => void;
  onReject?: () => void;
  compact?: boolean;
}

export default function DiffView({ 
  field, 
  oldValue, 
  newValue, 
  onAccept,
  onReject,
  compact = false 
}: DiffViewProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '(empty)';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const hasChanges = JSON.stringify(oldValue) !== JSON.stringify(newValue);
  const isRemoved = oldValue !== undefined && newValue === undefined;
  const isAdded = oldValue === undefined && newValue !== undefined;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-700 truncate">{field}</div>
          {hasChanges && (
            <div className="text-xs text-gray-500 mt-1">
              {isRemoved ? 'Removed' : isAdded ? 'Added' : 'Changed'}
            </div>
          )}
        </div>
        {onAccept && onReject && (
          <div className="flex gap-1 ml-2">
            <button
              onClick={onAccept}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Accept change"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onReject}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Reject change"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-gray-900">{field}</span>
        </div>
        {onAccept && onReject && (
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={onReject}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">Current Value</div>
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-gray-800 font-mono whitespace-pre-wrap break-words">
            {formatValue(oldValue)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">New Value</div>
          <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-gray-800 font-mono whitespace-pre-wrap break-words">
            {formatValue(newValue)}
          </div>
        </div>
      </div>
    </div>
  );
}

