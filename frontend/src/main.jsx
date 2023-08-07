import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthContextProvider from './context/AuthContext'
import GroupsContextProvider from './context/GroupsContext'
import MessagesContextProvider from './context/MessagesContext'
import UsersContextProvider from './context/UsersContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GroupsContextProvider>
      <AuthContextProvider>
        <MessagesContextProvider>
          <UsersContextProvider>
            <App />
          </UsersContextProvider>
        </MessagesContextProvider>
      </AuthContextProvider>
    </GroupsContextProvider>

  </React.StrictMode>,
)
