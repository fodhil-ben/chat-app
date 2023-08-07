import { createContext, useReducer, useState } from "react";

export const GroupsContext = createContext()

const editGroups = (state, action) => {
    state.groups.map((g) => {
        if (g.group_id === action.payload.group_id) {
            g = action.payload
        }
    })
    return state.groups
}

export const GroupsReducer = (state, action) => {
    switch (action.type) {
        case "SET_GROUPS":
            return { groups: action.payload }
        case "ADD_GROUPS":
            return { groups: [...state.groups, action.payload] }
        case "EDIT_GROUPS":
            return { groups: editGroups(state, action) }
        case "DELETE_GROUP":
            return { groups: state.groups.filter((g) => g.group_id !== action.payload.group_id) }
        default:
            return state
    }
}

export default function GroupsContextProvider({ children }) {

    const [groups, dispatch] = useReducer(GroupsReducer, { groups: [] })
    const [activeGroup, setActiveGroup] = useState(JSON.parse(localStorage.getItem('activeGroup')) || null)
    return (
        <GroupsContext.Provider value={{ ...groups, dispatch, activeGroup, setActiveGroup }} >
            {children}
        </GroupsContext.Provider >
    )
}

