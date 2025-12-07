import { ExternalLink, Clock, User } from 'lucide-react';
import type { BrandDNAProvenance as ProvenanceType } from '../../types/database';

interface ProvenanceIndicatorProps {
  provenance: ProvenanceType;
  compact?: boolean;
}

export default function ProvenanceIndicator({ 
  provenance, 
  compact = false 
}: ProvenanceIndicatorProps) {
  const isUserEdited = provenance.extraction_method === 'user' || provenance.edited_by;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {isUserEdited ? (
          <>
            <User className="w-3 h-3" />
            <span>User verified</span>
          </>
        ) : (
          <>
            <Clock className="w-3 h-3" />
            <span>Auto-extracted</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 text-gray-600">
        {isUserEdited ? (
          <>
            <User className="w-4 h-4 text-green-600" />
            <span className="font-medium">Verified by user</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Auto-extracted</span>
          </>
        )}
      </div>
      
      {provenance.source_url && (
        <a
          href={provenance.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="truncate max-w-xs">{provenance.source_url}</span>
        </a>
      )}
      
      <div className="text-xs text-gray-500">
        Last updated: {new Date(provenance.last_updated).toLocaleDateString()}
      </div>
    </div>
  );
}

