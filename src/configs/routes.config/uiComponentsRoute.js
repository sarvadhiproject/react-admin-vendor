import React from 'react'
import { UI_COMPONENTS_PREFIX_PATH } from 'constants/route.constant'
import { ADMIN, USER } from 'constants/roles.constant'

const uiComponentsRoute = [
    {
        key: 'uiComponent.common.button',
        path: `${UI_COMPONENTS_PREFIX_PATH}/button`,
        component: React.lazy(() =>
            import('views/ui-components/common/Button')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.common.grid',
        path: `${UI_COMPONENTS_PREFIX_PATH}/grid`,
        component: React.lazy(() => import('views/ui-components/common/Grid')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.common.typography',
        path: `${UI_COMPONENTS_PREFIX_PATH}/typography`,
        component: React.lazy(() =>
            import('views/ui-components/common/Typography')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.common.icons',
        path: `${UI_COMPONENTS_PREFIX_PATH}/icons`,
        component: React.lazy(() => import('views/ui-components/common/Icons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.alert',
        path: `${UI_COMPONENTS_PREFIX_PATH}/alert`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Alert')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.dialog',
        path: `${UI_COMPONENTS_PREFIX_PATH}/dialog`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Dialog')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.drawer',
        path: `${UI_COMPONENTS_PREFIX_PATH}/drawer`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Drawer')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.progress',
        path: `${UI_COMPONENTS_PREFIX_PATH}/progress`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Progress')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.skeleton',
        path: `${UI_COMPONENTS_PREFIX_PATH}/skeleton`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Skeleton')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.spinner',
        path: `${UI_COMPONENTS_PREFIX_PATH}/spinner`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Spinner')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.toast',
        path: `${UI_COMPONENTS_PREFIX_PATH}/toast`,
        component: React.lazy(() =>
            import('views/ui-components/feedback/Toast')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.avatar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/avatar`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Avatar')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.badge',
        path: `${UI_COMPONENTS_PREFIX_PATH}/badge`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Badge')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.calendar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/calendar`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Calendar')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.cards',
        path: `${UI_COMPONENTS_PREFIX_PATH}/cards`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Cards')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.table',
        path: `${UI_COMPONENTS_PREFIX_PATH}/table`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Table')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.tag',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tag`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Tag')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.timeline',
        path: `${UI_COMPONENTS_PREFIX_PATH}/timeline`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Timeline')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.tooltip',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tooltip`,
        component: React.lazy(() =>
            import('views/ui-components/data-display/Tooltip')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.checkbox',
        path: `${UI_COMPONENTS_PREFIX_PATH}/checkbox`,
        component: React.lazy(() =>
            import('views/ui-components/forms/Checkbox')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.datePicker',
        path: `${UI_COMPONENTS_PREFIX_PATH}/date-picker`,
        component: React.lazy(() =>
            import('views/ui-components/forms/DatePicker')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.formControl',
        path: `${UI_COMPONENTS_PREFIX_PATH}/form-control`,
        component: React.lazy(() =>
            import('views/ui-components/forms/FormControl')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.input',
        path: `${UI_COMPONENTS_PREFIX_PATH}/input`,
        component: React.lazy(() => import('views/ui-components/forms/Input')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.inputGroup',
        path: `${UI_COMPONENTS_PREFIX_PATH}/input-group`,
        component: React.lazy(() =>
            import('views/ui-components/forms/InputGroup')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.radio',
        path: `${UI_COMPONENTS_PREFIX_PATH}/radio`,
        component: React.lazy(() => import('views/ui-components/forms/Radio')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.segment',
        path: `${UI_COMPONENTS_PREFIX_PATH}/segment`,
        component: React.lazy(() =>
            import('views/ui-components/forms/Segment')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.select',
        path: `${UI_COMPONENTS_PREFIX_PATH}/select`,
        component: React.lazy(() => import('views/ui-components/forms/Select')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.switcher',
        path: `${UI_COMPONENTS_PREFIX_PATH}/switcher`,
        component: React.lazy(() =>
            import('views/ui-components/forms/Switcher')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.timeInput',
        path: `${UI_COMPONENTS_PREFIX_PATH}/time-input`,
        component: React.lazy(() =>
            import('views/ui-components/forms/TimeInput')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.upload',
        path: `${UI_COMPONENTS_PREFIX_PATH}/upload`,
        component: React.lazy(() => import('views/ui-components/forms/Upload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.upload',
        path: `${UI_COMPONENTS_PREFIX_PATH}/upload`,
        component: React.lazy(() => import('views/ui-components/forms/Upload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.dropdown',
        path: `${UI_COMPONENTS_PREFIX_PATH}/dropdown`,
        component: React.lazy(() =>
            import('views/ui-components/navigation/Dropdown')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.menu',
        path: `${UI_COMPONENTS_PREFIX_PATH}/menu`,
        component: React.lazy(() =>
            import('views/ui-components/navigation/Menu')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.pagination',
        path: `${UI_COMPONENTS_PREFIX_PATH}/pagination`,
        component: React.lazy(() =>
            import('views/ui-components/navigation/Pagination')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.steps',
        path: `${UI_COMPONENTS_PREFIX_PATH}/steps`,
        component: React.lazy(() =>
            import('views/ui-components/navigation/Steps')
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.tabs',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tabs`,
        component: React.lazy(() =>
            import('views/ui-components/navigation/Tabs')
        ),
        authority: [ADMIN, USER],
    },

]

export default uiComponentsRoute
