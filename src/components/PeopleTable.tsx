/* eslint-disable jsx-a11y/control-has-associated-label */
type Person = {
  slug: string;
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  motherName?: string;
  fatherName?: string;
};

type Props = {
  people: Person[];
  sortField: string | null;
  sortOrder: string | null;
  onSort: (field: string) => void;
  onSelectPerson: (slug: string) => void;
  selectedSlug?: string;
};

export const PeopleTable: React.FC<Props> = ({
  people,
  sortField,
  sortOrder,
  onSort,
  onSelectPerson,
  selectedSlug,
}) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <i className="fas fa-sort" />;
    }

    if (sortOrder === 'desc') {
      return <i className="fas fa-sort-down" />;
    }

    return <i className="fas fa-sort-up" />;
  };

  // Функція для знаходження людини за іменем
  const findPersonByName = (name: string) => {
    return people.find(person => person.name === name);
  };

  // Функція для обробки кліку з запобіганням стандартній поведінці
  const handleLinkClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    onSelectPerson(slug);
  };

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Name
              <button
                type="button"
                className="button is-white p-0 ml-1"
                onClick={() => onSort('name')}
              >
                <span className="icon">{renderSortIcon('name')}</span>
              </button>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Sex
              <button
                type="button"
                className="button is-white p-0 ml-1"
                onClick={() => onSort('sex')}
              >
                <span className="icon">{renderSortIcon('sex')}</span>
              </button>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Born
              <button
                type="button"
                className="button is-white p-0 ml-1"
                onClick={() => onSort('born')}
              >
                <span className="icon">{renderSortIcon('born')}</span>
              </button>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Died
              <button
                type="button"
                className="button is-white p-0 ml-1"
                onClick={() => onSort('died')}
              >
                <span className="icon">{renderSortIcon('died')}</span>
              </button>
            </span>
          </th>

          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => (
          <tr
            key={person.slug}
            data-cy="person"
            className={
              person.slug === selectedSlug ? 'has-background-warning' : ''
            }
          >
            <td>
              <a
                href={`#/people/${person.slug}`}
                className={person.sex === 'f' ? 'has-text-danger' : ''}
                onClick={e => handleLinkClick(e, person.slug)}
              >
                {person.name}
              </a>
            </td>
            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            <td>
              {person.motherName ? (
                findPersonByName(person.motherName) ? (
                  <a
                    href={`#/people/${findPersonByName(person.motherName)!.slug}`}
                    className="has-text-danger"
                    onClick={e => {
                      e.preventDefault();
                      onSelectPerson(
                        findPersonByName(person.motherName!)!.slug,
                      );
                    }}
                  >
                    {person.motherName}
                  </a>
                ) : (
                  // Матері немає в таблиці - показуємо як текст
                  person.motherName
                )
              ) : (
                '-'
              )}
            </td>
            <td>
              {person.fatherName ? (
                findPersonByName(person.fatherName) ? (
                  <a
                    href={`#/people/${findPersonByName(person.fatherName)!.slug}`}
                    onClick={e => {
                      e.preventDefault();
                      onSelectPerson(
                        findPersonByName(person.fatherName!)!.slug,
                      );
                    }}
                  >
                    {person.fatherName}
                  </a>
                ) : (
                  // Батька немає в таблиці - показуємо як текст
                  person.fatherName
                )
              ) : (
                '-'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
