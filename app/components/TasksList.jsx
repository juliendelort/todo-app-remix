import { useLoaderData } from '@remix-run/react';
import { Task } from './Task';

export const TasksList = () => {

    const { error, tasks } = useLoaderData();

    return error ? <div className="error">Error fetching data!</div> :
        tasks?.map(task => (
            <Task
                task={task}
                key={task.id}
            />

        ));
};
