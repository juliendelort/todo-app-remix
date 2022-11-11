
import { getCompletedTasks } from '~/service';
import { json } from '@remix-run/node';
import { useLoaderData } from "@remix-run/react";
import { TasksList } from '~/components/TasksList';

export const loader = async () => {
    try {
        return json({ tasks: await getCompletedTasks() });
    } catch (error) {
        return json({ error: { message: 'Failed loading data!' } });
    }
};

export default function Completed() {
    return <TasksList />;

};
