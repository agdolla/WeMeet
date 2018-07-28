//client side activityitem function
import {likeActivity} from './activityitem'
import {unLikeActivity} from './activityitem'
import {createActivity} from './activityitem'
import {getActivityDetail} from './activityitem'
import {getAllActivities} from './activityitem'
import {adpostComment} from './activityitem'

//client side authentication request function
import {signup} from './authentication'
import {login} from './authentication'

//cliend side chat request function
import {getMessages} from './chat'
import {postMessage} from './chat'

//client side credentials function
import {socket} from './credentials'
import {getToken} from './credentials'
import {getUserId} from './credentials'
import {getUserFullName} from './credentials'
import {updateCredentials} from './credentials'
import {isUserLoggedIn} from './credentials'
import {logout} from './credentials'

//client side notification request function
import {deleteNotification} from './notification'
import {acceptFriendRequest} from './notification'

//client side postitem request function
import {likePost} from './postitem'
import {unLikePost} from './postitem'
import {postComment} from './postitem'
import {postStatus} from './postitem'
import {getAllPosts} from './postitem'


//client side httprequest function
import {acceptActivityRequest} from './server'
import {getSessionId} from './server'
import {addFriend} from './server'
import {sendJoinActivityRequest} from './server'
import {sendInviteActivityRequest} from './server'

//client side search request function
import {searchquery} from './search'


//client side settings request function
import {changeUserInfo} from './settings'
import {ChangeAvatar} from './settings'
import {changeEmail} from './settings'

//client side user get request function
import {getNotificationData} from './usergetrequest'
import {getPostFeedData} from './usergetrequest'
import {getActivityFeedData} from './usergetrequest'
import {getUserData} from './usergetrequest'
import {getSessions} from './usergetrequest'

//client side util function
import {hideElement} from './util'
import {disabledElement} from './util'

//client side shedXHR function
import {sendXHR} from './xmlhttprequest'

//unsolve repeate name
//import {getUserData} from './credentials'


export{
    //export activityitem function
    likeActivity,
    unLikeActivity,
    createActivity,
    getAllActivities,
    getActivityDetail,
    adpostComment,

    //export authentication function
    signup,
    login,

    //export credentials function
    socket,
    getToken,
    getUserId,
    getUserFullName,
    updateCredentials,
    isUserLoggedIn,
    logout,

    //export chat function
    getMessages,
    postMessage,

    //export notification function
    deleteNotification,
    acceptFriendRequest,

    //export postitem function
    likePost,
    unLikePost,
    postComment,
    postStatus,
    getAllPosts,


    //export search function
    searchquery,


    //export httprequest function
    acceptActivityRequest,
    getSessionId,
    addFriend,
    sendJoinActivityRequest,
    sendInviteActivityRequest,

    //export settings function
    changeUserInfo,
    ChangeAvatar,
    changeEmail,

    //export usergetrequest function
    getNotificationData,
    getPostFeedData,
    getActivityFeedData,
    getUserData,
    getSessions,

    //export util function
    hideElement,
    disabledElement,

    //export xhr function
    sendXHR

    //unsolve repeate name
    //,getUserData

}
