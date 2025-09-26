import { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set('query', value);
    } else {
      newParams.delete('query');
    }

    setSearchParams(newParams);
  };

  const sex = searchParams.get('sex');
  const setSex = (value: string | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set('sex', value);
    } else {
      newParams.delete('sex');
    }

    setSearchParams(newParams);
  };

  const centuries = searchParams.getAll('centuries');
  const toggleCentury = (century: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (centuries.includes(century)) {
      newParams.delete('centuries');
      centuries
        .filter(c => c !== century)
        .forEach(c => newParams.append('centuries', c));
    } else {
      newParams.append('centuries', century);
    }

    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <a
          className={!sex ? 'is-active' : ''}
          onClick={() => setSex(null)}
          style={{ cursor: 'pointer' }}
        >
          All
        </a>
        <a
          className={sex === 'm' ? 'is-active' : ''}
          onClick={() => setSex('m')}
          style={{ cursor: 'pointer' }}
        >
          Male
        </a>
        <a
          className={sex === 'f' ? 'is-active' : ''}
          onClick={() => setSex('f')}
          style={{ cursor: 'pointer' }}
        >
          Female
        </a>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={handleQueryChange}
          />
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {[16, 17, 18, 19, 20].map(c => (
              <a
                key={c}
                data-cy="century"
                className={`button mr-1 ${
                  centuries.includes(String(c)) ? 'is-info' : ''
                }`}
                onClick={() => toggleCentury(String(c))}
                style={{ cursor: 'pointer' }}
              >
                {c}
              </a>
            ))}
          </div>

          <div className="level-right ml-4">
            <a
              data-cy="centuryALL"
              className="button is-success is-outlined"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('centuries');
                setSearchParams(newParams);
              }}
              style={{ cursor: 'pointer' }}
            >
              All
            </a>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <a
          className="button is-link is-outlined is-fullwidth"
          onClick={resetFilters}
          style={{ cursor: 'pointer' }}
        >
          Reset all filters
        </a>
      </div>
    </nav>
  );
};
