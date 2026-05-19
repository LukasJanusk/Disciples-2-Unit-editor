import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppRoute, AppRouteSearchParam } from "@/routes";
import SearchIcon from "./SearchIcon";

const MAX_SUGGESTIONS = 10;

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

type Props = {
  onChange?: (query: string, matches: string[]) => void;
  onSearch?: (query: string, matches: string[]) => void;
  values: string[];
  placeholder?: string;
  className?: string;
};

export default function Search({ onChange, onSearch, values, placeholder = "Search", className }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialRouteQuery = searchParams.get(AppRouteSearchParam.Query) ?? "";
  const [query, setQuery] = useState(initialRouteQuery);
  const [isFocused, setIsFocused] = useState(false);

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

  const getMatches = (nextQuery: string) => {
    const normalizedQuery = nextQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return uniqueValues;
    }

    return uniqueValues.filter((value) => value.toLowerCase().includes(normalizedQuery));
  };

  const handleSearch = (nextQuery: string) => {
    const trimmedQuery = nextQuery.trim();
    const matches = getMatches(nextQuery);
    const nextSearch = trimmedQuery ? `?${new URLSearchParams({ [AppRouteSearchParam.Query]: trimmedQuery }).toString()}` : "";

    if (location.pathname !== AppRoute.Units || location.search !== nextSearch) {
      void navigate({ pathname: AppRoute.Units, search: nextSearch });
    }

    onSearch?.(trimmedQuery, matches);
    setIsFocused(false);
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className={`relative h-full w-full max-w-96 ${className}`}>
      <div className="relative">
        <input
          className="w-full rounded-md border bg-gray-200 border-gray-400 px-4 py-3 pr-12 outline-none focus:border-gray-100"
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 100);
          }}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            onChange?.(nextQuery.trim(), getMatches(nextQuery));
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch(query);
            }
          }}
          placeholder={placeholder}
          type="search"
          value={query}
        />
        <button
          aria-label="Search"
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-600 transition-colors hover:text-gray-900"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() => handleSearch(query)}
          type="button"
        >
          <SearchIcon />
        </button>
      </div>

      {showSuggestions ? (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-md border border-gray-400 bg-gray-200 shadow-lg">
          <ul className="divide-y divide-gray-100">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onMouseDown={() => {
                    setQuery(suggestion);
                    onChange?.(suggestion, getMatches(suggestion));
                    handleSearch(suggestion);
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
