const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
  useFetcher
} = require("@remix-run/react");

import { json, redirect, } from '@remix-run/node';

import globalStyles from "~/styles/global.css";
import layoutStyles from "~/styles/layout.css";
import taskItemStyles from "~/styles/task_item.css";
// styles is now something like /build/global-AE33KB2.css

import React from 'react';
import moon from '~/images/icon-moon.svg';
import sun from '~/images/icon-sun.svg';
import { NavLinks } from '~/components/NavLinks';
import { addTask, getCounts, clearCompleted, setCompleted } from './service';


export function links() {
  return [
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: layoutStyles },
    { rel: "stylesheet", href: taskItemStyles },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400&family=Public+Sans:wght@300;400;500;700&display=swap',
    },];
}

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async () => {
  return json(await getCounts());
};

export const action = async ({ request }) => {
  const body = await request.formData();
  const action = body.get('_action');

  try {
    if (action === 'add') {
      return json(await addTask(body.get('text')));
    } else if (action === 'clear') {
      return json(await clearCompleted());
    } else if (action === 'toggle') {
      const taskId = body.get('id');
      const completed = body.get('completed') === 'on';

      const result = await setCompleted(taskId, completed);
      return json(result);
    }
  } catch (e) {
    return json({ error: { message: 'Oops an error occurred!' } });
  }
};

export default function App() {
  const transition = useTransition();
  const [darkMode, setDarkMode] = React.useState(false);

  const handleThemeClick = () => {
    if (!darkMode) {
      document?.body.classList.add('dark');
    } else {
      document?.body.classList.remove('dark');
    }
    setDarkMode(darkMode => !darkMode);
  };

  const { countActive, countAll, countCompleted } = useLoaderData();
  // Using this instead for <Form /> to avoid being redirected to /?index: https://stackoverflow.com/a/73603566
  const fetcher = useFetcher();

  const isAdding = fetcher.submission && fetcher.submission.formData.get('_action') === 'add';

  const isClearing = fetcher.submission && fetcher.submission.formData.get('_action') === 'clear';

  const addFormRef = React.useRef(null);

  React.useEffect(() => {
    if (!isAdding) {
      addFormRef.current.reset();
    }
  }, [isAdding]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <div className="app layout">
          <div className="hero" />
          {!!fetcher.data?.error &&
            <div className="error-banner">
              An error occured: {fetcher.data?.error.message}
            </div>
          }
          < main >
            <div className="header">
              <h1>TODO</h1>
              <button aria-label={`Set ${darkMode ? 'light' : 'dark'} mode`} onClick={handleThemeClick}>
                <img src={darkMode ? sun : moon} alt="Toggle dark mode" /></button>
            </div>
            <div className={`add_todo_input${isAdding ? ' loading' : ''}`} >
              <div className="circle" />
              <fetcher.Form method="post" ref={addFormRef} >
                <input type="hidden" name="_action" value="add" />
                <input type="text" name="text" placeholder="Create a new todo..." disabled={isAdding} />
              </fetcher.Form>
            </div>
            <div className="tasks-container">
              {transition.type === 'normalLoad' ? 'Loading...' : <Outlet />}
              <div className="bottom-bar">
                <div>{countActive} items left</div>
                <div className="links">
                  <NavLinks countAll={countAll} countActive={countActive} countCompleted={countCompleted} />
                </div>
                <fetcher.Form method="POST" >
                  <button name="_action" value="clear" className={isClearing ? 'loading' : undefined}>Clear Completed </button>
                </fetcher.Form>
              </div>
            </div>

            <div className="mobile-links">
              <NavLinks countAll={countAll} countActive={countActive} countCompleted={countCompleted} />
            </div>

          </main>
        </div >
      </body >
    </html >
  );
};
