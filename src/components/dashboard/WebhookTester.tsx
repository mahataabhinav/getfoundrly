import { useState } from 'react';
import { sendPostToN8n } from '../../lib/n8n-webhook';

export default function WebhookTester() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [log, setLog] = useState<string>('');

    const testConnection = async () => {
        setStatus('loading');
        setLog('Starting test...\n');

        try {
            const payload = {
                userId: 'test-user-id',
                brandId: 'test-brand-id',
                content: 'This is a test post from the debugger.',
                platform: 'linkedin' as const,
                metadata: { source: 'debugger' }
            };

            setLog(prev => prev + `Payload: ${JSON.stringify(payload, null, 2)}\n`);
            setLog(prev => prev + `Target URL: ${import.meta.env.VITE_N8N_PUBLISH_WEBHOOK_URL}\n`);

            await sendPostToN8n(payload);

            setStatus('success');
            setLog(prev => prev + '✅ Success! Webhook returned 200 OK.');
        } catch (error: any) {
            setStatus('error');
            setLog(prev => prev + `❌ Error: ${error.message}\n`);
            console.error(error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-white border border-gray-300 shadow-xl rounded-lg p-4 w-96 max-h-[500px] overflow-auto">
            <h3 className="font-bold text-lg mb-2">n8n Connection Tester</h3>
            <div className="mb-4 text-xs bg-gray-100 p-2 rounded break-all font-mono">
                ENV URL: {import.meta.env.VITE_N8N_PUBLISH_WEBHOOK_URL || 'UNDEFINED'}
            </div>
            <button
                onClick={testConnection}
                disabled={status === 'loading'}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
                {status === 'loading' ? 'Testing...' : 'Send Test Event'}
            </button>
            <pre className="text-xs font-mono whitespace-pre-wrap bg-slate-900 text-green-400 p-2 rounded min-h-[100px]">
                {log}
            </pre>
        </div>
    );
}
