import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import routes from 'virtual:lazy-pages'

import GlobalLayout from './layouts/GlobalLayout';

import './index.css'

console.log(routes)

const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: routes
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider fallbackElement="router loading..." router={router} />
  </React.StrictMode>,
)
