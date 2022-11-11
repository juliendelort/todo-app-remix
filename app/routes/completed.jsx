
import { getCompletedTasks } from '~/service';
import { json } from '@remix-run/node';
import { useLoaderData } from "@remix-run/react";
import { TasksList } from '~/components/TasksList';

export const loader = async () => {
    return json(await getCompletedTasks());
};

export default function Completed() {
    const tasks = useLoaderData();

    return <TasksList tasks={tasks} />;
};
