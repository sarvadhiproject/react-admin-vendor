import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const initialFilterData = {
    status: '',
}

const dataSlice = createSlice({
    name: 'salesDashboard/data',
    initialState: {
        loading: true,
        dashboardData: {},
    },
    reducers: {},
    extraReducers: {},
})

export default dataSlice.reducer
