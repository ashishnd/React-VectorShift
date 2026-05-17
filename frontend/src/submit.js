import { useState } from 'react';
import { useStore } from './store';

const BACKEND_URL = 'http://localhost:8000/pipelines/parse';

export const SubmitButton = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not reach the backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <div className="flex items-center justify-center py-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Pipeline'}
        </button>
      </div>

      {(result || error) && (
        <ResultModal result={result} error={error} onClose={closeModal} />
      )}
    </>
  );
};

const ResultModal = ({ result, error, onClose }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {error ? (
        <>
          <h2 className="mb-2 text-lg font-semibold text-red-700">
            Submission failed
          </h2>
          <p className="text-sm text-zinc-600">{error}</p>
        </>
      ) : (
        <>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Pipeline analysis
          </h2>
          <div className="space-y-2 text-sm text-zinc-700">
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-zinc-500">Nodes</span>
              <span className="font-medium">{result.num_nodes}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-zinc-500">Edges</span>
              <span className="font-medium">{result.num_edges}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-zinc-500">Valid DAG?</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  result.is_dag
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {result.is_dag ? 'Yes' : 'No (cycle detected)'}
              </span>
            </div>
          </div>
        </>
      )}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
