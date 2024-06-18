import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Tabs } from 'components/ui'
import { AdaptableCard, Container } from 'components/shared'
import { useNavigate, useLocation } from 'react-router-dom'


// const Profile = lazy(() => import('./components/Profile'))
const Password = lazy(() => import('./components/Password'))

const { TabNav, TabList } = Tabs

const settingsMenu = {
    // profile: { label: 'Profile', path: 'profile' },
    password: { label: 'Password', path: 'password' },
}

const Settings = () => {
    const [currentTab, setCurrentTab] = useState('profile')
    const [data, setData] = useState({})

    const navigate = useNavigate()

    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val) => {
        setCurrentTab(val)
        navigate(`/app/account/settings/${val}`)
    }

    useEffect(() => {
        setCurrentTab(path)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {/* {Object.keys(settingsMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {settingsMenu[key].label}
                            </TabNav>
                        ))} */}
                        {Object.keys(settingsMenu)
                            .slice(1, 2)
                            .map((key) => (
                                <TabNav key={key} value={key}>
                                    {settingsMenu[key].label}
                                </TabNav>
                            ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {/* {currentTab === 'profile' && (
                            <Profile data={data.profile} />
                        )} */}
                        {currentTab === 'password' && (
                            <Password data={data.loginHistory} />
                        )}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
