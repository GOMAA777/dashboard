"use client";

import { useEffect, useState } from "react";

/**
 * Loads API data once on mount. Keeps `initial` as fallback when request fails
 * so UI design/behavior stays unchanged offline.
 */
export function useApiData<T>(
  loader: () => Promise<T>,
  initial: T,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    loader()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "API request failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  return {
    data,
    setData,
    error,
    loading,
    reload: () => setReloadKey((v) => v + 1),
  };
}
