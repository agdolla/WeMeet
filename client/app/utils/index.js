//client side request function
import {getlocation} from '../server'
import {setlocation} from '../server'
import {deleteNotification} from '../server'
import {acceptFriendRequest} from '../server'
import {acceptActivityRequest} from '../server'
import {getNotificationData} from '../server'
import {likePost} from '../server'
import {unLikePost} from '../server'
import {likeActivity} from '../server'
import {unLikeActivity} from '../server'
import {changeUserInfo} from '../server'
import {ChangeAvatar} from '../server'
import {changeEmail} from '../server'
import {postComment} from '../server'
import {postStatus} from '../server'
import {createActivity} from '../server'
import {getPostFeedData} from '../server'
import {getActivityFeedData} from '../server'
import {getAllActivities} from '../server'
import {getAllPosts} from '../server'
import {getUserData} from '../server'
import {getSessions} from '../server'
import {getActivityDetail} from '../server'
import {adpostComment} from '../server'
import {getMessages} from '../server'
import {postMessage} from '../server'
import {getSessionId} from '../server'
import {signup} from '../server'
import {login} from '../server'
import {searchquery} from '../server'
import {addFriend} from '../server'
import {sendJoinActivityRequest} from '../server'
import {sendInviteActivityRequest} from '../server'

//client side util function
import {hideElement} from './util'
import {disabledElement} from './util'

//client side credentials function
import {socket} from '../credentials'
import {getToken} from '../credentials'
import {getUserId} from '../credentials'
import {getUserFullName} from '../credentials'
import {updateCredentials} from '../credentials'
import {isUserLoggedIn} from '../credentials'
import {logout} from '../credentials'


//unsolve repeate name
//import {getUserData} from '../credentials'


export{
    getlocation,
    setlocation,
    deleteNotification,
    acceptFriendRequest,
    acceptActivityRequest,
    getNotificationData,
    likePost,
    unLikePost,
    likeActivity,
    unLikeActivity,
    changeUserInfo,
    ChangeAvatar,
    changeEmail,
    postComment,
    postStatus,
    createActivity,
    getPostFeedData,
    getActivityFeedData,
    getAllActivities,
    getAllPosts,
    getUserData,
    getSessions,
    getActivityDetail,
    adpostComment,
    getMessages,
    postMessage,
    getSessionId,
    signup,
    login,
    searchquery,
    addFriend,
    sendJoinActivityRequest,
    sendInviteActivityRequest,

    //export {util function
    hideElement,
    disabledElement,

    //export {credentials function
    socket,
    getToken,
    getUserId,
    getUserFullName,
    updateCredentials,
    isUserLoggedIn,
    logout

    //unsolve repeate name
    //,getUserData

}
