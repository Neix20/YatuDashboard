const initialState = {
    defaultValue: -1,
    userId: -1,
    homeId: -1,
    roomId: "",
    tuyaHomeId: 166388041,
    wifi: {
        ssid: null,
        password: null,
    },
    firstTimeLink: true,
    linkDeviceLs: [],
    linkTimer: -1,
    linkTsStart: -1,
    linkTotalDuration: 0,
    subUserAccess: {},
    dashboardReportFlag: {},
    premiumPayFlag: false,
    profileWorkspaceId: -1,
    loginAccess: 1,
    yatuAuth: -1,
    tutorial: false,
    viewerSession: {},
    userTariff: {
        Id: -1,
        Title: "",
        Value: -1
    },
    viewSesTutorial: false,
    advertisement: false,
};

function setReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "SET_DEFAULT_VALUE":
            return {
                ...state,
                defaultValue: action.defaultValue,
            };
        case "SET_USER_ID":
            return {
                ...state,
                userId: action.userId,
            };
        case "SET_HOME_ID":
            return {
                ...state,
                homeId: action.homeId,
            };
        case "SET_ROOM_ID":
            return {
                ...state,
                roomId: action.roomId,
            };
        case "SET_WIFI":
            return {
                ...state,
                wifi: action.wifi,
            };
        case "SET_TUYA_HOME_ID":
            return {
                ...state,
                tuyaHomeId: action.tuyaHomeId,
            };
        case "SET_FIRST_TIME_LINK":
            return {
                ...state,
                firstTimeLink: action.firstTimeLink,
            };
        case "SET_LINK_TIMER":
            return {
                ...state,
                linkTimer: action.linkTimer,
            };
        case "SET_LINK_TOTAL_DURATION":
            return {
                ...state,
                linkTotalDuration: action.linkTotalDuration,
            };
        case "SET_LINK_DEVICE_LS":
            return {
                ...state,
                linkDeviceLs: action.linkDeviceLs,
            };
        case "SET_LINK_TS_START":
            return {
                ...state,
                linkTsStart: action.linkTsStart,
            };
        case "SET_SUB_USER_ACCESS":
            return {
                ...state,
                subUserAccess: action.subUserAccess,
            };
        case "SET_DASHBOARD_REPORT_FLAG":
            return {
                ...state,
                dashboardReportFlag: action.dashboardReportFlag,
            };
        case "SET_PREMIUM_PAY_FLAG":
            return {
                ...state,
                premiumPayFlag: action.premiumPayFlag,
            };
        case "SET_PROFILE_WORKSPACE_ID":
            return {
                ...state,
                profileWorkspaceId: action.profileWorkspaceId,
            };
        case "SET_LOGIN_ACCESS":
            return {
                ...state,
                loginAccess: action.loginAccess,
            };
        case "SET_YATU_AUTH":
            return {
                ...state,
                yatuAuth: action.yatuAuth,
            };
        case "SET_TUTORIAL":
            return {
                ...state,
                tutorial: action.tutorial,
            };
        case "SET_VIEWER_SESSION":
            return {
                ...state,
                viewerSession: action.viewerSession,
            };
        case "SET_USER_TARIFF":
            return {
                ...state,
                userTariff: action.userTariff,
            };
        case "SET_VIEWER_SESSION_TUTORIAL":
            return {
                ...state,
                viewSesTutorial: action.viewSesTutorial,
            };
        case "SET_ADVERTISEMENT":
            return {
                ...state,
                advertisement: action.advertisement,
            };
        default: {
            return {
                ...state,
            }
        }
    }
}

export default setReducer;