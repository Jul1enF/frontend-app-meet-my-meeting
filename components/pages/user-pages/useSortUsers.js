import { useMemo } from "react";


export default function useSortUsers(users, searchText) {

    // USERS SORTING
    
    // Sort by searched text
    const searchSortedUsers = useMemo(() => {
        if (!users) return []
        const regex = new RegExp(searchText, 'i')
        return users.filter(e => {
            return e.first_name.match(regex) || e.last_name.match(regex) || e.email.match(regex)
        })
    }, [users, searchText])

    const roleStatus = { owner: { name: "Gérants", priority: 9 }, admin: { name: "Administrateurs", priority: 8 }, employee: { name: "Employés", priority: 7 }, client: { name: "Clients", priority: 6 } }

    // Sort by role
    const usersByRoles = useMemo(() => {
        return searchSortedUsers.reduce((acc, user) => {
            const key = user.role;

            if (!acc[key]) acc[key] = { role: key, priority: roleStatus[key].priority, name: roleStatus[key].name, users: [] }

            acc[key].users.push(user);
            return acc;
        },
            { "allUsersRoles": { role: "allUsersRoles", name: "Tous les utilisateurs", users: searchSortedUsers, priority: 10 } });
    }, [searchSortedUsers])

    return usersByRoles
}