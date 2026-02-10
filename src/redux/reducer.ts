import { OPEN_CLIENT_SIDEBAR } from "./action";
import { OPEN_DEVELOPER_SIDEBAR } from "./action";
import { OPEN_ADMIN_SIDEBAR } from "./action";
import { OPEN_SIGNOUT_MODAL } from "./action";

const initialState = {
    clientSidebar: false,
    developerSidebar: false,
    adminSidebar: false,
};

const sidebar_reducer = (state = initialState, action) => {
    switch(action.type) {
        case OPEN_CLIENT_SIDEBAR:
            return { ...state, clientSidebar: action.payload };
        case OPEN_DEVELOPER_SIDEBAR:
            return { ...state, developerSidebar: action.payload };
        case OPEN_ADMIN_SIDEBAR:
            return { ...state, adminSidebar: action.payload };
        default:
            return state;
    }
};

const signout_reducer = (state = false, action) => {
    switch(action.type){
        case OPEN_SIGNOUT_MODAL:
            return action.payload
        default:
            return state
    }
}

export { signout_reducer };
export default sidebar_reducer;
