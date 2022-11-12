import { useFetcher } from '@remix-run/react';

export const Task = ({ task }) => {
    // Using this instead for <Form /> To avoid being redirected to /?index: https://stackoverflow.com/a/73603566
    const fetcher = useFetcher();

    const handleCompletedChange = (e) => {
        e.target.closest('form').requestSubmit();
    };
    return (
        <div
            className={`task-item${fetcher.submission ? ' pending' : ''}`}
            key={task.id}
        >
            <fetcher.Form method="POST" action="/">
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="_action" value="toggle" />
                <input
                    type="checkbox"
                    name="completed"
                    aria-label="Toggle completed"
                    checked={task.completed}
                    onChange={handleCompletedChange}
                />
            </fetcher.Form>
            <span className={`task-text${task.completed ? ' completed' : ''}`}>{task.text}</span>
        </div>
    );
};
