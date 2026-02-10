export const OPEN_CLIENT_SIDEBAR = "OPEN_CLIENT_SIDEBAR";
export const OPEN_DEVELOPER_SIDEBAR = "OPEN_DEVELOPER_SIDEBAR";
export const OPEN_ADMIN_SIDEBAR = "OPEN_ADMIN_SIDEBAR";
export const OPEN_SIGNOUT_MODAL = "OPEN_SIGNOUT_MODAL"

export const openClientSidebar = (open: boolean) => ({
    type: OPEN_CLIENT_SIDEBAR,
    payload: open
});

export const openDeveloperSidebar = (open: boolean) => ({
    type: OPEN_DEVELOPER_SIDEBAR,
    payload: open
});

export const openAdminSidebar = (open: boolean) => ({
    type: OPEN_ADMIN_SIDEBAR,
    payload: open
});

export const openSignoutModal = (open:boolean) => ({
    type: OPEN_SIGNOUT_MODAL,
    payload: open
})