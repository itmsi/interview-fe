import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Dashboard = React.lazy(() => import(/* webpackChunkName: "dasboard" */ './Dashboard/Index'));

const container = document.querySelector('#react-root');
const root = createRoot(container);

const props = JSON.parse(container.getAttribute('data-props'));

const router = createBrowserRouter([
    // {
    //     path: '*',
    //     element: <React.Suspense><Error {...props} /></React.Suspense>,
    //     errorElement: <FallbackError/>
    // },
    {
        path: '/*',
        element: <React.Suspense><Dashboard {...props} /></React.Suspense>,
        errorElement: <div>Error</div>
    },
])

root.render(<RouterProvider router={router}/>);