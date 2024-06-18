import React from 'react'
import SalesDashboardHeader from './components/SalesDashboardHeader'
import SalesDashboardBody from './components/SalesDashboardBody'


const SalesDashboard = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <SalesDashboardHeader />
            <SalesDashboardBody />
        </div>
    )
}

export default SalesDashboard
