import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            // memory cache for not making req before in secondes default is 60s
            // keepUnusedDataFor: 5, 
        })
    })
})

export const {
    useGetUsersQuery
} = usersApiSlice