import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut, IDataAuth } from '../../features/auth/authSlice'



const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState}) => {
        const token = (getState() as IDataAuth).auth.token
        if(token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args:any, api:any, extraOptions:any ) => {
    let result = await baseQuery(args, api, extraOptions)

    // @ts-ignore try with status after!! 
    if(result?.error?.originalStatus === 403){
        console.log('sending refresh token')
        // send refresh token to get a new refresh token
        const refreshResult = await baseQuery(`/auth`, api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const user = api.getState().auth.user
            // store the new token
            // @ts-ignore
            api.dispatch(setCredentials({...refreshResult.data, user}))
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        }else{
            // @ts-ignore
            api.dispatch(logOut())
        }
        }
        return result
    }

    export const apiSlice = createApi({
        baseQuery: baseQueryWithReauth,
        endpoints: builder => ({})
    })