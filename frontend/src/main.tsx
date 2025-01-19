import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Feed } from './features/feed/pages/Feed/Feed'
import { Login } from './features/authentication/pages/Login/Login'
import { Signup } from './features/authentication/pages/Signup/Signup'
import { ResetPassword } from './features/authentication/pages/ResetPassword/ResetPassword'
import { VerifyEmail } from './features/authentication/pages/VerifyEmail/VerifyEmail'
import { AuthenticationContextProvider } from './features/authentication/contexts/AuthenticationContextProvider'
import { AuthLayout } from './features/authentication/components/AuthLayout/AuthLayout'
import { ApplicationLayout } from './components/ApplicationLayout/ApplicationLayout'
import { Profile } from './features/authentication/pages/Profile/Profile'
import { Notifications } from './features/feed/pages/Notifications/Notifications'
import { PostPage } from './features/feed/pages/PostPage/PostPage'

const router = createBrowserRouter([
  

  {
    element: <AuthenticationContextProvider />,
    children: [
      {
        path: "/",
        element: <ApplicationLayout />,
        children: [
          {
            index: true,
            element: <Feed />
          },
          {
            path: "network",
            element: <div>Network</div>
          },
          {
            path: "jobs",
            element: <div>Messaging</div>
          },
          {
            path: "messaging",
            element: <div>Messaging</div>
          },
          {
            path: "notifications",
            element: <Notifications />
          },
          {
            path: "profile/:id",
            element: <div>Profile</div>
          },
          {
            path: "settings",
            element: <div>Settings & Privacy</div>
          },
          {
            path: "posts/:id",
            element: <PostPage />
          }
        ]
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />
          },
          {
            path: "signup",
            element: <Signup />
          },
          {
            path: "request-password-reset",
            element: <ResetPassword />
          },
          {
            path: "verify-email",
            element: <VerifyEmail />
          },
          {
            path: "profile/:id",
            element: <Profile />
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  }
  
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
