import { useEffect, useEffectEvent, useMemo, useState } from "react";

type Props = {
  onChange?: (query: string, matches: string[]) => void;
  values: string[];
  debounceMs?: number;
  placeholder?: string;
};

const MAX_SUGGESTIONS = 5;

function getMatchScore(value: string, normalizedQuery: string): number {
  const normalizedValue = value.toLowerCase();

  if (normalizedValue === normalizedQuery) {
    return 0;
  }

  if (normalizedValue.startsWith(normalizedQuery)) {
    return 1;
  }

  const wordStartIndex = normalizedValue.indexOf(` ${normalizedQuery}`);
  if (wordStartIndex >= 0) {
    return 2 + wordStartIndex;
  }

  const containsIndex = normalizedValue.indexOf(normalizedQuery);
  if (containsIndex >= 0) {
    return 100 + containsIndex;
  }

  return Number.POSITIVE_INFINITY;
}

export default function Search({ onChange, values, debounceMs = 200, placeholder = "Search" }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const uniqueValues = useMemo(() => {
    const seen = new Set<string>();

    return values.filter((value) => {
      const normalizedValue = value.trim().toLowerCase();

      if (!normalizedValue || seen.has(normalizedValue)) {
        return false;
      }

      seen.add(normalizedValue);
      return true;
    });
  }, [values]);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return uniqueValues.slice(0, MAX_SUGGESTIONS);
    }

    return [...uniqueValues]
      .map((value) => ({
        score: getMatchScore(value, normalizedQuery),
        value,
      }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((left, right) => {
        if (left.score !== right.score) {
          return left.score - right.score;
        }

        return left.value.localeCompare(right.value);
      })
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => entry.value);
  }, [query, uniqueValues]);

  const debouncedMatches = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return uniqueValues;
    }

    return uniqueValues.filter((value) => value.toLowerCase().includes(normalizedQuery));
  }, [debouncedQuery, uniqueValues]);

  const debouncedMatchesKey = useMemo(() => {
    return debouncedMatches.join("\0");
  }, [debouncedMatches]);

  const emitChange = useEffectEvent(() => {
    onChange?.(debouncedQuery.trim(), debouncedMatches);
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, query]);

  useEffect(() => {
    emitChange();
  }, [debouncedMatchesKey, debouncedQuery]);

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className="relative h-full w-full">
      <input
        className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
        onBlur={() => {
          window.setTimeout(() => {
            setIsFocused(false);
          }, 100);
        }}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        type="search"
        value={query}
      />

      {showSuggestions ? (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="divide-y divide-gray-100">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onMouseDown={() => {
                    setQuery(suggestion);
                    setDebouncedQuery(suggestion);
                    setIsFocused(false);
                  }}
                  type="button"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
