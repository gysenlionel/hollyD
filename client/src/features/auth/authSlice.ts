import { createSlice } from "@reduxjs/toolkit"
import { IUser } from "../../types/user"

export interface IDataAuth {
    auth:{
        token:string,
        user: any
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, token: null},
    reducers: {
        setCredentials: (state, action) => {
            const {user, accessToken } = action.payload
            state.user = user
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state:IDataAuth) => state.auth.user 
export const selectCurrentToken = (state:IDataAuth) => state.auth.token 