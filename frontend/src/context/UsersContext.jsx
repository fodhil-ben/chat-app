import { createContext, useState } from "react";

export const UsersContext = createContext()

export const UsersReducer = (state, action) => {
    switch (action.type) {
        case "SET_USERS":
            return { users: action.payload }
        case "ADD_USERS":
            return { users: [...state.users, action.payload] }
        case "DELETE_USER":
            return { users: state.users.filter((g) => g.user_id !== action.payload.user_id) }
        default:
            return state
    }
}

export default function UsersContextProvider({ children }) {

    const [users, setUsers] = useState([])
    return (
        <UsersContext.Provider value={{ users, setUsers }} >
            {children}
        </UsersContext.Provider >
    )
}

