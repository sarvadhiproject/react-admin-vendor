import React from 'react'
import {
    HiOutlineChartSquareBar,
    HiOutlineUserGroup,
    HiOutlineTrendingUp,
    HiOutlineUserCircle,
    HiOutlineBookOpen,
    HiOutlineCurrencyDollar,
    HiOutlineShieldCheck,
    HiOutlineColorSwatch,
    HiOutlineChatAlt,
    HiOutlineDesktopComputer,
    HiOutlinePaperAirplane,
    HiOutlineChartPie,
    HiOutlineUserAdd,
    HiOutlineKey,
    HiOutlineBan,
    HiOutlineHand,
    HiOutlineDocumentText,
    HiOutlineTemplate,
    HiOutlineLockClosed,
    HiOutlineDocumentDuplicate,
    HiOutlineViewGridAdd,
    HiOutlineShare,
    HiOutlineVariable,
    HiOutlineCode,
} from 'react-icons/hi'
import { GiBigDiamondRing, GiDropEarrings } from 'react-icons/gi'
import { MdOutlineSell, MdOutlineShoppingCart, MdSell } from 'react-icons/md'
import { IoSettingsOutline } from 'react-icons/io5'
import { FaChartPie, FaRegChartBar } from 'react-icons/fa'
import { GiCrystalEarrings } from 'react-icons/gi'
import { ImUsers } from 'react-icons/im'
import { MdOutlineBookmarks } from 'react-icons/md'
import { MdOutlineReviews } from 'react-icons/md'

const navigationIcon = {
    apps: <HiOutlineViewGridAdd />,
    project: <HiOutlineChartSquareBar />,
    crm: <HiOutlineUserGroup style={{ fontSize: '22px' }} />,
    sales: <HiOutlineTrendingUp />,
    crypto: <HiOutlineCurrencyDollar />,
    knowledgeBase: <HiOutlineBookOpen />,
    account: <HiOutlineUserCircle />,
    uiComponents: <HiOutlineTemplate />,
    common: <HiOutlineColorSwatch />,
    feedback: <HiOutlineChatAlt />,
    dataDisplay: <HiOutlineDesktopComputer />,
    forms: <HiOutlineDocumentText />,
    navigation: <HiOutlinePaperAirplane />,
    graph: <HiOutlineChartPie />,
    authentication: <HiOutlineLockClosed />,
    signIn: <HiOutlineShieldCheck />,
    signUp: <HiOutlineUserAdd />,
    forgotPassword: <HiOutlineLockClosed />,
    resetPassword: <HiOutlineKey />,
    pages: <HiOutlineDocumentDuplicate />,
    welcome: <HiOutlineHand />,
    accessDenied: <HiOutlineBan />,
    guide: <HiOutlineBookOpen />,
    documentation: <HiOutlineDocumentText />,
    sharedComponentDoc: <HiOutlineShare />,
    utilsDoc: <HiOutlineVariable />,
    changeLog: <HiOutlineCode />,
    ring: <GiBigDiamondRing />,
    order: <MdOutlineShoppingCart />,
    coupons: <MdOutlineSell />,
    settings: <IoSettingsOutline style={{ fontSize: '22px' }} />,
    // overview: <FaChartPie style={{ fontSize: '22px' }} />,
    overview: <FaRegChartBar style={{ fontSize: '22px' }} />,
    categories: <GiDropEarrings />,
    users: <ImUsers style={{ fontSize: '22px' }} />,
    banner: <MdOutlineBookmarks style={{ fontSize: '22px' }} />,
    webreviews: <MdOutlineReviews style={{ fontSize: '22px' }} />,
}

export default navigationIcon
