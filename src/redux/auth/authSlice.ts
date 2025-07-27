import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"

interface AuthState {
    loading: boolean;
    error: string | null;
    loginSuccess: boolean,
    loginPayload: any,
}

const initialState: AuthState = {
    loading: false,
    error: null,
    loginSuccess: false,
    loginPayload: [],
};

export const login = createAsyncThunk(
    'userLogin/login',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', payload);
            return response;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error?.response?.data?.message || 'Login failed');
        }
    }
);

const loginSlice = createSlice({
    name: 'userLogin',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
        })
    },
})

export default loginSlice.reducer;
