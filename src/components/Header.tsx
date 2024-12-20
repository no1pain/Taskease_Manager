import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  title: string;
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onChange: (value: string) => void;
  onReset: () => void;
  onError: (error: string) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  title,
  todos,
  onSubmit,
  onChange,
  onReset,
  onError,
  onToggleAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onError('');
    event.preventDefault();

    if (!title.trim()) {
      onError('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: 939,
      title: title.trim(),
      completed: false,
    };

    setLoading(true);
    onSubmit(newTodo)
      .then(() => {
        onReset();
        titleField.current?.focus();
      })
      .catch(() => {
        onError('Unable to add a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          disabled={loading}
        />
      </form>
    </header>
  );
};
