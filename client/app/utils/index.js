//client side activityitem function
import { likeActivity } from './activityitem'
import { unLikeActivity } from './activityitem'
import { createActivity } from './activityitem'
import { getActivityDetail } from './activityitem'
import { getAllActivities } from './activityitem'
import { acceptActivityRequest } from './activityitem'
import { postActivityDetailComment, getActivityItemCommments, getActivityMessages } from './activityitem'

//client side authentication request function
import { signup } from './authentication'
import { login } from './authentication'

//cliend side chat request function
import { getMessages, getSessionId } from './chat'

//client side credentials function
import { socket } from './credentials'
import { getUserDataFromLocal, getUserId } from './credentials'
import { updateCredentials } from './credentials'
import { isUserLoggedIn } from './credentials'
import { logout } from './credentials'

//client side notification request function
import { deleteNotification } from './notification'
import { acceptFriendRequest, hasNewNotification } from './notification'

//client side postitem request function
import { likePost } from './postitem'
import { unLikePost } from './postitem'
import { postComment } from './postitem'
import { postStatus } from './postitem'
import { getAllPosts, getPostComments } from './postitem'

//client side httprequest function
import { searchquery } from './server'

//client side settings request function
import { changeUserInfo } from './settings'
import { ChangeAvatar } from './settings'
import { changeEmail, changePassword } from './settings'

//client side user get request function
import { getNotificationData } from './usergetrequest'
import { getPostFeedData } from './usergetrequest'
import { getActivityFeedData } from './usergetrequest'
import { getUserData } from './usergetrequest'
import { getSessions } from './usergetrequest'

//client side util function
import { hideElement, disabledElement, didUserLike, isBottom, uploadImg } from './util';

//unsolve repeate name
//import {getUserData} from './credentials'


export {
    //export activityitem function
    likeActivity,
    unLikeActivity,
    createActivity,
    getAllActivities,
    getActivityDetail,
    postActivityDetailComment,
    getActivityItemCommments,
    getActivityMessages,
    acceptActivityRequest,

    //export authentication function
    signup,
    login,

    //export credentials function
    socket,
    getUserDataFromLocal,
    getUserId,
    updateCredentials,
    isUserLoggedIn,
    logout,

    //export chat function
    getMessages,
    getSessionId,

    //export notification function
    deleteNotification,
    acceptFriendRequest,
    hasNewNotification,

    //export postitem function
    likePost,
    unLikePost,
    postComment,
    postStatus,
    getAllPosts,
    getPostComments,

    //server function
    searchquery,

    //export settings function
    changeUserInfo,
    ChangeAvatar,
    changeEmail,
    changePassword,

    //export usergetrequest function
    getNotificationData,
    getPostFeedData,
    getActivityFeedData,
    getUserData,
    getSessions,

    //export util function
    hideElement,
    disabledElement,
    didUserLike,
    isBottom,
    uploadImg
    //unsolve repeate name
    //,getUserData
}
