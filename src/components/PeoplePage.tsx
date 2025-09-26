import { useEffect, useMemo, useState } from 'react';
import {
  useSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';

type Person = {
  name: string;
  motherName?: string;
  fatherName?: string;
  born: number;
  died?: number;
  sex?: string;
  slug: string;
};

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  // --- Params from URL ---
  const query = searchParams.get('query') || '';
  const centuries = searchParams.getAll('centuries');
  const sortField = searchParams.get('sort');
  const sortOrder = searchParams.get('order'); // "desc" | null

  // --- Load people ---
  useEffect(() => {
    setLoading(true);
    fetch('/people.json')
      .then(res => {
        if (!res.ok) throw new Error('Error loading');
        return res.json();
      })
      .then((data: unknown) => {
        if (Array.isArray(data)) setPeople(data as Person[]);
        else setError(true);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // --- Filtering + Sorting ---
  const visiblePeople = useMemo(() => {
    let result = [...people];

    // Filter by query
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p: Person) =>
        p.name.toLowerCase().includes(q) ||
        (p.motherName && p.motherName.toLowerCase().includes(q)) ||
        (p.fatherName && p.fatherName.toLowerCase().includes(q))
      );
    }

    // Filter by centuries
    if (centuries.length > 0) {
      result = result.filter((p: Person) => {
        const bornCentury = Math.ceil(p.born / 100);
        return centuries.includes(String(bornCentury));
      });
    }

    // Sorting
    if (sortField) {
      type SortableField = keyof Person;
      result.sort((a: Person, b: Person) => {
        const valA = a[sortField as SortableField];
        const valB = b[sortField as SortableField];

        if (sortField === 'born' || sortField === 'died') {
          return sortOrder === 'desc'
            ? (valB as number) - (valA as number)
            : (valA as number) - (valB as number);
        }

        const strA = String(valA);
        const strB = String(valB);

        if (strA < strB) return sortOrder === 'desc' ? 1 : -1;
        if (strA > strB) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [people, query, centuries, sortField, sortOrder]);

  // --- Sorting handler ---
  const handleSort = (field: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (sortField !== field) {
      newParams.set('sort', field);
      newParams.delete('order');
    } else if (!sortOrder) {
      newParams.set('sort', field);
      newParams.set('order', 'desc');
    } else {
      newParams.delete('sort');
      newParams.delete('order');
    }

    setSearchParams(newParams);
  };

  // --- Select person (avoid shadowing slug) ---
  const handleSelectPerson = (personSlug: string) => {
    navigate(`/people/${personSlug}${location.search}`);
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          {/* Filters only if people are loaded */}
          {people.length > 0 && (
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          )}

          <div className="column">
            <div className="box table-container">
              {loading && <Loader />}

              {error && <p data-cy="peopleLoadingError">Something went wrong</p>}

              {!loading && !error && people.length === 0 && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              {!loading && !error && people.length > 0 && (
                <PeopleTable
                  people={visiblePeople}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onSelectPerson={handleSelectPerson}
                  selectedSlug={slug}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
