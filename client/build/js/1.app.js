(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./app/components/containers/activityChatPanel.jsx":
/*!*********************************************************!*\
  !*** ./app/components/containers/activityChatPanel.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = __webpack_require__(/*! React */ "./node_modules/react/index.js");

var _React2 = _interopRequireDefault(_React);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');
var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");

moment.updateLocale('en', {
    longDateFormat: {
        LT: "h:mm:ss A"
    }
});

var ActivityChatPanel = function (_React$Component) {
    _inherits(ActivityChatPanel, _React$Component);

    function ActivityChatPanel(props) {
        _classCallCheck(this, ActivityChatPanel);

        var _this = _possibleConstructorReturn(this, (ActivityChatPanel.__proto__ || Object.getPrototypeOf(ActivityChatPanel)).call(this, props));

        _this.onUserJoined = function (data) {
            var joinMessage = {
                user: data.user,
                type: "joined"
            };

            var newMsgs = _this.state.msgs;
            newMsgs.push(joinMessage);

            _this.setState({
                numberOfUsers: data.numberOfUsers,
                msgs: newMsgs
            }, function () {
                _this.refs.activityChatWindow.scrollTop = _this.refs.activityChatWindow.scrollHeight;
            });
        };

        _this.onUserLeft = function (data) {
            var leftMessage = {
                user: data.user,
                type: "left"
            };

            var newMsgs = _this.state.msgs;
            newMsgs.push(leftMessage);

            _this.setState({
                numberOfUsers: data.numberOfUsers,
                msgs: newMsgs
            }, function () {
                _this.refs.activityChatWindow.scrollTop = _this.refs.activityChatWindow.scrollHeight;
            });
        };

        _this.onNewActivityChatMessage = function (data) {
            var newMsgs = Array.from(_this.state.msgs);
            newMsgs.push(data);
            _this.setState({
                msgs: newMsgs
            }, function () {
                _this.refs.activityChatWindow.scrollTop = _this.refs.activityChatWindow.scrollHeight;
            });
        };

        _this.state = {
            text: "",
            msgs: [],
            moreToLoad: true,
            numberOfUsers: 0
        };
        return _this;
    }

    _createClass(ActivityChatPanel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _credentials.socket.on('new activity chat message', this.onNewActivityChatMessage);
            _credentials.socket.on('user joined', this.onUserJoined);
            _credentials.socket.on('user left', this.onUserLeft);

            //join room
            _credentials.socket.emit('join activity chat room', {
                activityId: this.props.id,
                user: this.props.currentUser
            });

            this.getMessages(true);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            //leave room
            _credentials.socket.emit('leave activity chat room', {
                activityId: this.props.id,
                user: this.props.currentUser
            });

            //remove socket io listener
            _credentials.socket.removeListener('new activity chat message', this.onNewActivityChatMessage);
            _credentials.socket.removeListener('user joined', this.onUserJoined);
            _credentials.socket.removeListener('user left', this.onUserLeft);
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            e.preventDefault();
            this.setState({ text: emojione.shortnameToUnicode(e.target.value) });
        }
    }, {
        key: 'handleSendMsg',
        value: function handleSendMsg(e) {
            e.preventDefault();
            if (e.key === "Enter" || e.button === 0) {
                if (this.state.text.trim() !== "") {
                    this.sendMessages();
                    this.setState({ text: "" });
                }
            }
        }
    }, {
        key: 'getMessages',
        value: function getMessages(initialLoad) {
            var _this2 = this;

            var time = this.state.msgs.length > 0 ? this.state.msgs[0].postDate : new Date().getTime();
            (0, _utils.getActivityMessages)(this.props.id, time).then(function (messages) {
                var msgs = messages.data;
                var newMsgs = msgs.concat(initialLoad ? [] : _this2.state.msgs);
                _this2.setState({
                    msgs: newMsgs,
                    moreToLoad: msgs.length > 0
                }, function () {
                    if (initialLoad) _this2.refs.activityChatWindow.scrollTop = _this2.refs.activityChatWindow.scrollHeight;
                });
            });
        }
    }, {
        key: 'sendMessages',
        value: function sendMessages() {
            var data = {
                activityId: this.props.id,
                author: this.props.currentUser,
                text: this.state.text.trim()
            };
            _credentials.socket.emit('activity chat message', data);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _React2.default.createElement(
                'div',
                { className: 'panel panel-default' },
                _React2.default.createElement(
                    'div',
                    { className: 'panel-heading' },
                    _React2.default.createElement(
                        'div',
                        { className: 'container-fluid' },
                        _React2.default.createElement(
                            'h4',
                            { style: { 'color': 'grey' } },
                            'Chat (',
                            this.state.numberOfUsers,
                            ')'
                        )
                    )
                ),
                _React2.default.createElement(
                    'div',
                    { className: 'panel-body', ref: 'activityChatWindow', style: { height: '450px', overflowY: 'scroll' } },
                    _React2.default.createElement(
                        _Button2.default,
                        { onClick: function onClick() {
                                _this3.getMessages();
                            }, fullWidth: true, disabled: !this.state.moreToLoad || this.state.msgs.length === 0 },
                        this.state.moreToLoad ? "Load more messages" : "nothing more to load"
                    ),
                    _React2.default.createElement(
                        _List2.default,
                        null,
                        this.state.msgs.map(function (msg, i) {
                            if (msg.type !== undefined) {
                                return _React2.default.createElement(
                                    _ListItem2.default,
                                    { key: i },
                                    _React2.default.createElement(
                                        _Link2.default,
                                        { to: '/profile/' + msg.user._id },
                                        _React2.default.createElement(
                                            _ListItemAvatar2.default,
                                            null,
                                            _React2.default.createElement(_Avatar2.default, { src: msg.user.avatar })
                                        )
                                    ),
                                    _React2.default.createElement(_ListItemText2.default, { primary: _React2.default.createElement(
                                            'span',
                                            null,
                                            _React2.default.createElement(
                                                'strong',
                                                null,
                                                msg.user.fullname
                                            ),
                                            _React2.default.createElement(
                                                'span',
                                                { style: { marginLeft: '8px' } },
                                                msg.type
                                            )
                                        ) })
                                );
                            }
                            //default time format
                            var time = moment(msg.postDate).calendar();
                            //if less than 1 hour, use relative time
                            if (new Date().getTime() - msg.postDate <= 3600000) time = moment(msg.postDate).fromNow();

                            return _React2.default.createElement(
                                _ListItem2.default,
                                { key: i, style: {
                                        alignItems: "flex-start",
                                        marginBottom: '10px'
                                    } },
                                _React2.default.createElement(
                                    _Link2.default,
                                    { to: '/profile/' + msg.author._id },
                                    _React2.default.createElement(
                                        _ListItemAvatar2.default,
                                        null,
                                        _React2.default.createElement(_Avatar2.default, { src: msg.author.avatar })
                                    )
                                ),
                                _React2.default.createElement(_ListItemText2.default, { primary: _React2.default.createElement(
                                        'span',
                                        null,
                                        msg.author.fullname,
                                        _React2.default.createElement(
                                            'span',
                                            { style: { fontSize: '12px', marginLeft: '15px' } },
                                            time
                                        )
                                    ),
                                    secondary: msg.text })
                            );
                        })
                    )
                ),
                _React2.default.createElement(
                    'div',
                    { className: 'panel-footer', style: { height: '150px' } },
                    _React2.default.createElement(
                        'div',
                        { className: 'row' },
                        _React2.default.createElement(
                            'div',
                            { className: 'col-md-10 col-xs-10 col-sm-10' },
                            _React2.default.createElement('textarea', { id: 'chattext', className: 'form-control msg nohover non-active', name: 'name', rows: '5', value: this.state.text,
                                onChange: function onChange(e) {
                                    return _this3.handleChange(e);
                                },
                                onFocus: function onFocus(e) {
                                    return _this3.handleChange(e);
                                }, cols: '40', placeholder: 'please type text',
                                onKeyUp: function onKeyUp(e) {
                                    return _this3.handleSendMsg(e);
                                } })
                        ),
                        _React2.default.createElement(
                            'div',
                            { className: 'col-md-2 col-sm-2 col-xs-2 send' },
                            _React2.default.createElement(
                                'button',
                                { type: 'button', className: 'btn btn-default btn-blue-grey pull-right', name: 'button',
                                    onClick: function onClick(e) {
                                        return _this3.handleSendMsg(e);
                                    } },
                                'Send'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ActivityChatPanel;
}(_React2.default.Component);

exports.default = ActivityChatPanel;

/***/ }),

/***/ "./app/components/containers/activityDetailBody.jsx":
/*!**********************************************************!*\
  !*** ./app/components/containers/activityDetailBody.jsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = __webpack_require__(/*! React */ "./node_modules/react/index.js");

var _React2 = _interopRequireDefault(_React);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _ = __webpack_require__(/*! . */ "./app/components/containers/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Checkbox = __webpack_require__(/*! @material-ui/core/Checkbox */ "./node_modules/@material-ui/core/Checkbox/index.js");

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _FormControlLabel = __webpack_require__(/*! @material-ui/core/FormControlLabel */ "./node_modules/@material-ui/core/FormControlLabel/index.js");

var _FormControlLabel2 = _interopRequireDefault(_FormControlLabel);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _ListItemSecondaryAction = __webpack_require__(/*! @material-ui/core/ListItemSecondaryAction */ "./node_modules/@material-ui/core/ListItemSecondaryAction/index.js");

var _ListItemSecondaryAction2 = _interopRequireDefault(_ListItemSecondaryAction);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _IconButton = __webpack_require__(/*! @material-ui/core/IconButton */ "./node_modules/@material-ui/core/IconButton/index.js");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Snackbar = __webpack_require__(/*! @material-ui/core/Snackbar */ "./node_modules/@material-ui/core/Snackbar/index.js");

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = __webpack_require__(/*! @material-ui/core/SnackbarContent */ "./node_modules/@material-ui/core/SnackbarContent/index.js");

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _CheckCircle = __webpack_require__(/*! @material-ui/icons/CheckCircle */ "./node_modules/@material-ui/icons/CheckCircle.js");

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

var _Divider = __webpack_require__(/*! @material-ui/core/Divider */ "./node_modules/@material-ui/core/Divider/index.js");

var _Divider2 = _interopRequireDefault(_Divider);

var _Error = __webpack_require__(/*! @material-ui/icons/Error */ "./node_modules/@material-ui/icons/Error.js");

var _Error2 = _interopRequireDefault(_Error);

var _Dialog = __webpack_require__(/*! @material-ui/core/Dialog */ "./node_modules/@material-ui/core/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/DialogActions/index.js");

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/DialogContent/index.js");

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogTitle = __webpack_require__(/*! @material-ui/core/DialogTitle */ "./node_modules/@material-ui/core/DialogTitle/index.js");

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
// var debug = require('react-debug');

var ActivityDetailBody = function (_React$Component) {
  _inherits(ActivityDetailBody, _React$Component);

  function ActivityDetailBody(props) {
    _classCallCheck(this, ActivityDetailBody);

    var _this = _possibleConstructorReturn(this, (ActivityDetailBody.__proto__ || Object.getPrototypeOf(ActivityDetailBody)).call(this, props));

    _this.handleRequestClose = function () {
      _this.setState({
        snackOpen: false
      });
    };

    _this.handleError = function (res) {
      var err = res.error;
      var message = err ? 'failed to send request!' : 'request sent!';
      var backgroundColor = err ? '#f44336' : '#4CAF50';
      _this.setState({
        snackOpen: true,
        snackbarColor: backgroundColor,
        snackbarContent: message,
        snackbarType: err ? 'error' : 'success'
      });
    };

    _this.componentWillUnmount = function () {
      _credentials.socket.removeListener('activity notification', _this.handleError);
      _credentials.socket.removeListener('friend notification', _this.handleError);
    };

    _this.handleDialogClose = function () {
      _this.setState({
        inviteDialogOpen: false,
        invitedFriendList: []
      });
    };

    _this.handleDialogOpen = function () {
      _this.setState({
        inviteDialogOpen: true
      });
    };

    _this.handleUsersDialogClose = function () {
      _this.setState({
        usersDialogOpen: false
      });
    };

    _this.handleUsersDialogOpen = function () {
      _this.setState({
        usersDialogOpen: true
      });
    };

    _this.state = {
      activity: {},
      comments: [],
      ishost: false,
      joined: false,
      success: false,
      loadMore: true,
      snackOpen: false,
      snackbarContent: "",
      snackbarColor: 'green',
      snackbarType: 'success',
      inviteDialogOpen: false,
      usersDialogOpen: false,
      invitedFriendList: []

    };
    return _this;
  }

  _createClass(ActivityDetailBody, [{
    key: 'handleLikeClick',
    value: function handleLikeClick(e) {
      var _this2 = this;

      e.preventDefault();

      if (e.button === 0) {
        var handler = function handler(likeCounter) {
          var activity = _this2.state.activity;
          activity.likeCounter = likeCounter;
          _this2.setState({ activity: activity });
        };

        if (!(0, _utils.didUserLike)(this.state.activity.likeCounter, this.props.currentUser)) {
          (0, _utils.likeActivity)(this.state.activity._id, this.props.currentUser).then(function (response) {
            handler(response.data);
          });
        } else {
          (0, _utils.unLikeActivity)(this.state.activity._id, this.props.currentUser).then(function (response) {
            return handler(response.data);
          });
        }
      }
    }
  }, {
    key: 'handlePostComment',
    value: function handlePostComment(comment) {
      var _this3 = this;

      (0, _utils.postActivityDetailComment)(this.state.activity._id, this.props.currentUser, comment).then(function (response) {
        _this3.setState({
          activity: response.data
        }, function () {
          _this3.loadComments(true);
        });
      });
    }
  }, {
    key: 'getData',
    value: function getData() {
      var _this4 = this;

      (0, _utils.getActivityDetail)(this.props.id).then(function (response) {
        var activitydata = response.data;
        _this4.setState({ activity: activitydata }, function () {
          _this4.setState({
            ishost: _this4.isHost(),
            joined: _this4.checkJoined()
          });
        });
      });
    }
  }, {
    key: 'isHost',
    value: function isHost() {
      return this.props.currentUser === this.state.activity.author._id;
    }
  }, {
    key: 'checkJoined',
    value: function checkJoined() {
      var _this5 = this;

      if (this.state.activity.participants === undefined) {
        return false;
      }
      return this.state.activity.participants.filter(function (user) {
        return user._id == _this5.props.currentUser;
      }).length > 0;
    }
  }, {
    key: 'handleRequestJoin',
    value: function handleRequestJoin(e) {
      e.preventDefault();
      _credentials.socket.emit('activity notification', {
        sender: this.props.currentUser,
        target: this.state.activity.author._id,
        activityId: this.state.activity._id,
        type: 'request'
      });
    }
  }, {
    key: 'checkFriendsOfUser',
    value: function checkFriendsOfUser(friendId) {
      return this.props.currentUser === friendId || this.props.friends.filter(function (friend) {
        return friend._id === friendId;
      }).length > 0;
    }
  }, {
    key: 'handleAddFriend',
    value: function handleAddFriend(friendId) {
      _credentials.socket.emit('friend notification', {
        sender: this.props.currentUser,
        target: friendId
      });
    }
  }, {
    key: 'loadComments',
    value: function loadComments(justPosted) {
      var _this6 = this;

      var date = justPosted || this.state.comments.length == 0 ? new Date().getTime() : this.state.comments[this.state.comments.length - 1].postDate;

      (0, _utils.getActivityItemCommments)(this.props.id, date).then(function (response) {
        var load = response.data.length > 0;
        var activityComments = justPosted ? response.data : _this6.state.comments.concat(response.data);
        _this6.setState({
          loadMore: load,
          comments: activityComments
        });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getData();
      _credentials.socket.on('activity notification', this.handleError);
      _credentials.socket.on('friend notification', this.handleError);
    }
  }, {
    key: 'handleInvite',
    value: function handleInvite(value) {
      var newFriendList = Array.from(this.state.invitedFriendList);
      if (newFriendList.indexOf(value) == -1) newFriendList.push(value);else newFriendList.splice(newFriendList.indexOf(value), 1);
      this.setState({
        invitedFriendList: newFriendList
      });
    }
  }, {
    key: 'handleSendInvitation',
    value: function handleSendInvitation() {
      var _this7 = this;

      this.state.invitedFriendList.map(function (targetid) {
        _credentials.socket.emit('activity notification', {
          sender: _this7.props.currentUser,
          target: targetid,
          activityId: _this7.props.id,
          type: 'invite'
        });
      });
      this.handleDialogClose();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var buttonText;
      if (this.state.ishost && !this.state.joined) {
        buttonText = "You are the host";
      } else if (!this.state.ishost && this.state.joined) {
        buttonText = "You have joined";
      } else {
        buttonText = "Click to sign up";
      }
      var data = this.state.activity;
      var contents;
      var text;
      var name;
      var authorid;
      switch (data.type) {
        case "Event":
          contents = data.contents;
          name = this.state.activity.author.fullname;
          authorid = this.state.activity.author._id;
          text = contents.text.split("\n").map(function (line, i) {
            return _React2.default.createElement(
              'p',
              { key: "line" + i },
              line
            );
          });
          break;
        case "Entertainment":
          contents = data.contents;
          name = this.state.activity.author.fullname;
          authorid = this.state.activity.author._id;
          text = contents.text.split("\n").map(function (line, i) {
            return _React2.default.createElement(
              'p',
              { key: "line" + i },
              line
            );
          });
          break;
        case "Study":
          contents = data.contents;
          name = this.state.activity.author.fullname;
          authorid = this.state.activity.author._id;
          text = contents.text.split("\n").map(function (line, i) {
            return _React2.default.createElement(
              'p',
              { key: "line" + i },
              line
            );
          });
          break;
        default:
          text = null;
          name = null;
      }

      return _React2.default.createElement(
        'div',
        { className: 'activityDetail' },
        _React2.default.createElement(
          _Dialog2.default,
          {
            open: this.state.inviteDialogOpen,
            onClose: this.handleDialogClose },
          _React2.default.createElement(
            _DialogTitle2.default,
            null,
            "Invite your friends"
          ),
          _React2.default.createElement(
            _DialogContent2.default,
            { style: { width: '400px' } },
            _React2.default.createElement(
              _List2.default,
              null,
              this.props.friends.map(function (friend, i) {
                return _React2.default.createElement(
                  _ListItem2.default,
                  { key: i },
                  _React2.default.createElement(
                    _ListItemAvatar2.default,
                    null,
                    _React2.default.createElement(_Avatar2.default, { src: friend.avatar })
                  ),
                  _React2.default.createElement(_ListItemText2.default, { primary: friend.fullname }),
                  _React2.default.createElement(
                    _ListItemSecondaryAction2.default,
                    null,
                    _this8.state.activity.participants !== undefined && _this8.state.activity.participants.filter(function (participant) {
                      return participant._id === friend._id;
                    }).length === 0 ? _React2.default.createElement(_Checkbox2.default, {
                      onChange: function onChange() {
                        return _this8.handleInvite(friend._id);
                      },
                      checked: _this8.state.invitedFriendList.indexOf(friend._id) !== -1
                    }) : _React2.default.createElement(_Checkbox2.default, {
                      disabled: true,
                      checked: true
                    })
                  )
                );
              })
            )
          ),
          _React2.default.createElement(
            _DialogActions2.default,
            null,
            _React2.default.createElement(
              _Button2.default,
              { onClick: this.handleDialogClose },
              'Cancel'
            ),
            _React2.default.createElement(
              _Button2.default,
              { onClick: function onClick() {
                  return _this8.handleSendInvitation();
                }, color: 'primary', autoFocus: true },
              'Confirm'
            )
          )
        ),
        _React2.default.createElement(
          _Snackbar2.default,
          {
            autoHideDuration: 4000,
            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            open: this.state.snackOpen,
            onClose: this.handleRequestClose },
          _React2.default.createElement(_SnackbarContent2.default, {
            style: {
              backgroundColor: [this.state.snackbarColor]
            },
            message: _React2.default.createElement(
              'span',
              { style: {
                  display: 'flex',
                  alignItems: 'center'
                } },
              this.state.snackbarType === 'success' ? _React2.default.createElement(_CheckCircle2.default, { style: { fontSize: '20px', marginRight: '10px' } }) : _React2.default.createElement(_Error2.default, { style: { fontSize: '20px', marginRight: '10px' } }),
              this.state.snackbarContent
            )
          })
        ),
        _React2.default.createElement(
          _Dialog2.default,
          {
            open: this.state.usersDialogOpen,
            onClose: this.handleUsersDialogClose },
          _React2.default.createElement(
            _DialogTitle2.default,
            null,
            "Joined Users"
          ),
          _React2.default.createElement(
            _DialogContent2.default,
            { style: { width: '600px' } },
            _React2.default.createElement(
              _List2.default,
              null,
              this.state.activity.participants === undefined || this.state.activity.participants.length === 0 ? "No one has signed up yet!" : this.state.activity.participants.map(function (p, i) {
                var rightButton;
                if (_this8.checkFriendsOfUser(p._id)) {
                  rightButton = _React2.default.createElement(
                    _IconButton2.default,
                    { disabled: true },
                    _React2.default.createElement(_Icon2.default, { className: 'fas fa-check' })
                  );
                } else {
                  rightButton = _React2.default.createElement(
                    _IconButton2.default,
                    { onClick: function onClick() {
                        return _this8.handleAddFriend(p._id);
                      } },
                    _React2.default.createElement(_Icon2.default, { className: 'fas fa-plus' })
                  );
                }
                return _React2.default.createElement(
                  _ListItem2.default,
                  { key: i, style: { padding: '20px' } },
                  _React2.default.createElement(
                    _Link2.default,
                    { to: '/profile/' + p._id },
                    _React2.default.createElement(_Avatar2.default, { src: p.avatar })
                  ),
                  _React2.default.createElement(_ListItemText2.default, { primary: p.fullname,
                    secondary: p.description }),
                  _React2.default.createElement(
                    _ListItemSecondaryAction2.default,
                    null,
                    rightButton
                  )
                );
              })
            )
          )
        ),
        _React2.default.createElement('div', { className: 'adbackground', style: { "backgroundImage": "url(" + this.state.activity.img + ")" } }),
        _React2.default.createElement(
          'div',
          { className: 'container' },
          _React2.default.createElement(
            'div',
            { className: 'row' },
            _React2.default.createElement(
              'div',
              { className: 'col-lg-10 col-md-12 col-sm-12 col-xs-12 col-lg-offset-1' },
              _React2.default.createElement(
                'div',
                { className: 'panel panel-default body-title' },
                _React2.default.createElement(
                  'div',
                  { className: 'panel-heading' },
                  _React2.default.createElement(
                    'div',
                    { className: 'row' },
                    _React2.default.createElement(
                      'div',
                      { className: 'col-md-8' },
                      _React2.default.createElement(
                        'h2',
                        { style: { 'paddingLeft': '15px' } },
                        this.state.activity.title
                      ),
                      _React2.default.createElement('span', { className: 'glyphicon glyphicon-time', style: { 'paddingRight': '10px', 'paddingLeft': '15px' } }),
                      moment(this.state.activity.startTime).format('MMMM Do YYYY, h:mm:ss a'),
                      _React2.default.createElement('br', null),
                      _React2.default.createElement('span', { className: 'glyphicon glyphicon-map-marker',
                        style: { 'paddingRight': '10px', 'paddingTop': '5px', 'paddingLeft': '15px' } }),
                      this.state.activity.location,
                      _React2.default.createElement('br', null),
                      _React2.default.createElement('span', { className: 'glyphicon glyphicon-user',
                        style: { 'paddingRight': '10px', 'paddingTop': '5px', 'paddingLeft': '15px' } }),
                      _React2.default.createElement(
                        _Link2.default,
                        { to: "/profile/" + authorid },
                        name
                      )
                    ),
                    _React2.default.createElement(
                      'div',
                      { className: 'col-md-4', style: { 'paddingTop': '20px' } },
                      _React2.default.createElement(
                        'div',
                        { className: 'col-md-12 col-sm-12 col-xs-12 body-title-signed-in' },
                        this.state.activity.participants === undefined ? 0 : this.state.activity.participants.length,
                        ' people ',
                        _React2.default.createElement(
                          'font',
                          { style: { 'color': 'grey' } },
                          'joined'
                        ),
                        _React2.default.createElement(
                          'font',
                          { style: { 'color': '#61B4E4', 'fontSize': '10px', 'paddingLeft': '10px', 'cursor': 'pointer' },
                            onClick: this.handleUsersDialogOpen },
                          'View All'
                        ),
                        _React2.default.createElement('br', null)
                      )
                    )
                  ),
                  _React2.default.createElement(
                    'div',
                    { className: 'row' },
                    _React2.default.createElement(
                      'div',
                      { className: 'col-md-12 col-sm-12 col-xs-12 remain-places', style: { 'paddingTop': '25px', textAlign: "center" } },
                      _React2.default.createElement(
                        'div',
                        { className: "alert alert-success" + (0, _utils.hideElement)(!this.state.success), role: 'alert', style: {
                            marginLeft: '43%',
                            marginRight: '43%',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            marginBottom: '7px'
                          } },
                        _React2.default.createElement(
                          'font',
                          { className: (0, _utils.hideElement)(!this.state.success), style: { fontSize: 13 } },
                          'Request sent!'
                        )
                      ),
                      _React2.default.createElement(
                        _Button2.default,
                        { variant: 'outlined', disabled: this.state.ishost || this.state.joined, onClick: function onClick(e) {
                            return _this8.handleRequestJoin(e);
                          } },
                        buttonText
                      ),
                      this.state.ishost && _React2.default.createElement(
                        _Button2.default,
                        { onClick: this.handleDialogOpen, variant: 'outlined', color: 'primary', style: { marginLeft: '10px' } },
                        'Invite friends'
                      )
                    )
                  ),
                  _React2.default.createElement(
                    'div',
                    { className: 'row' },
                    _React2.default.createElement(
                      'div',
                      { className: 'col-md-12 col-sm-12 col-xs-12 body-title-icon', style: { textAlign: "right" } },
                      _React2.default.createElement(_FormControlLabel2.default, {
                        control: _React2.default.createElement(_Checkbox2.default, { onClick: function onClick(e) {
                            return _this8.handleLikeClick(e);
                          },
                          style: { width: '30px', height: '30px' },
                          checked: this.state.activity.likeCounter === undefined ? false : (0, _utils.didUserLike)(this.state.activity.likeCounter, this.props.currentUser),
                          icon: _React2.default.createElement(_Icon2.default, { style: { fontSize: '20px' }, className: 'far fa-heart' }),
                          checkedIcon: _React2.default.createElement(_Icon2.default, { className: 'fas fa-heart', style: { color: 'red', fontSize: '20px' } }) }),
                        label: this.state.activity.likeCounter === undefined ? 0 : this.state.activity.likeCounter.length
                      }),
                      _React2.default.createElement(_Icon2.default, { className: 'fas fa-comments', style: {
                          fontSize: '20px', width: '25px', marginRight: '8px', verticalAlign: 'middle'
                        } }),
                      this.state.activity.commentsCount
                    )
                  )
                )
              ),
              _React2.default.createElement(
                'div',
                { className: 'panel panel-default' },
                _React2.default.createElement(
                  'div',
                  { className: 'panel-heading' },
                  _React2.default.createElement(
                    'div',
                    { className: 'container-fluid body-detail' },
                    _React2.default.createElement(
                      'h4',
                      { style: { 'color': 'grey' } },
                      'Activity Details'
                    ),
                    _React2.default.createElement(
                      'div',
                      { className: 'row' },
                      _React2.default.createElement(
                        'div',
                        { className: 'col-md-12', style: { 'paddingTop': '20px' } },
                        text
                      )
                    )
                  )
                )
              ),
              _React2.default.createElement(_.ActivityChatPanel, { id: this.props.id, currentUser: this.props.currentUser })
            )
          )
        ),
        _React2.default.createElement(
          _presentations.ActivityCommentThread,
          { count: this.state.activity.commentsCount,
            user: this.props.currentUser, avatar: this.props.avatar, onPost: function onPost(comment) {
              return _this8.handlePostComment(comment);
            },
            onLoadComments: function onLoadComments() {
              return _this8.loadComments(false);
            }, loadMore: this.state.loadMore },
          this.state.comments.map(function (comment, i) {
            //default time format
            var commentTime = moment(comment.postDate).calendar();
            //if less than 24 hours, use relative time
            if (new Date().getTime() - comment.postDate <= 86400000) commentTime = moment(comment.postDate).fromNow();
            return _React2.default.createElement(
              'div',
              null,
              _React2.default.createElement(
                _ListItem2.default,
                { key: i },
                _React2.default.createElement(
                  _ListItemAvatar2.default,
                  null,
                  _React2.default.createElement(
                    _Link2.default,
                    { to: '/profile/' + comment.author._id },
                    _React2.default.createElement(_Avatar2.default, { src: comment.author.avatar })
                  )
                ),
                _React2.default.createElement(_ListItemText2.default, { primary: _React2.default.createElement(
                    'span',
                    null,
                    comment.author.fullname,
                    _React2.default.createElement(
                      'span',
                      { style: { fontSize: '12px', marginLeft: '15px' } },
                      commentTime
                    )
                  ),
                  secondary: comment.text })
              ),
              _React2.default.createElement(_Divider2.default, { light: true, inset: true })
            );
          })
        )
      );
    }
  }]);

  return ActivityDetailBody;
}(_React2.default.Component);

exports.default = ActivityDetailBody;

/***/ }),

/***/ "./app/components/containers/activityFeed.jsx":
/*!****************************************************!*\
  !*** ./app/components/containers/activityFeed.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _CircularProgress = __webpack_require__(/*! @material-ui/core/CircularProgress */ "./node_modules/@material-ui/core/CircularProgress/index.js");

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var debug = require('react-debug');


var ActivityFeed = function (_React$Component) {
    _inherits(ActivityFeed, _React$Component);

    function ActivityFeed(props) {
        _classCallCheck(this, ActivityFeed);

        var _this = _possibleConstructorReturn(this, (ActivityFeed.__proto__ || Object.getPrototypeOf(ActivityFeed)).call(this, props));

        _this.onNewActivity = function () {
            _this.setState({
                new: true
            });
        };

        _this.handleNew = function () {
            _this.handleLoad(true);
            window.scrollTo(0, 0);
        };

        _this.trackScrolling = function () {
            var wrappedElement = document.getElementById('activityFeed');
            if (wrappedElement !== null && (0, _utils.isBottom)(wrappedElement)) {
                _this.handleLoad(false);
            }
        };

        _this.state = {
            contents: [],
            moreToLoad: true,
            submitted: false,
            loading: true,
            new: false
        };
        return _this;
    }

    _createClass(ActivityFeed, [{
        key: 'handleLoad',
        value: function handleLoad(init) {
            var _this2 = this;

            document.removeEventListener('scroll', this.trackScrolling);
            if (init) {
                this.setState({
                    new: false,
                    loading: true
                });
            } else {
                this.setState({
                    loading: false
                });
            }
            var date = init || this.state.contents.length === 0 ? new Date().getTime() : this.state.contents[this.state.contents.length - 1].postDate;
            (0, _utils.getAllActivities)(date).then(function (response) {
                var activities = response.data;
                if (activities.length === 0) {
                    return _this2.setState({
                        moreToLoad: false,
                        loading: false
                    });
                }
                var newActivities = (init ? [] : _this2.state.contents).concat(activities);
                _this2.setState({
                    contents: newActivities,
                    moreToLoad: true,
                    loading: false
                }, function () {
                    document.addEventListener('scroll', _this2.trackScrolling);
                });
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.handleLoad(true);
            _credentials.socket.on('newActivity', this.onNewActivity);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('scroll', this.trackScrolling);
            _credentials.socket.removeEventListener('newActivity', this.onNewActivity);
        }

        // componentDidUpdate(prevProps, prevState) {
        //     if(JSON.stringify(this.state.contents) !== JSON.stringify(prevState.contents))
        //         this.getData;
        // }


    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'activityFeed' },
                this.state.new && _react2.default.createElement(
                    _Button2.default,
                    { variant: 'extendedFab', color: 'primary', style: {
                            position: 'fixed',
                            zIndex: 100,
                            left: '45%'
                        }, onClick: this.handleNew },
                    _react2.default.createElement(_Icon2.default, { style: { marginRight: '5px' }, className: 'fas fa-arrow-alt-circle-up' }),
                    'new activities'
                ),
                this.state.loading && _react2.default.createElement(
                    'div',
                    { style: { textAlign: 'center', color: '#61B4E4', marginTop: '30px', marginBottom: '30px' } },
                    _react2.default.createElement(_CircularProgress2.default, { size: 30 })
                ),
                !this.state.loading && this.state.contents.length === 0 ? _react2.default.createElement(
                    'div',
                    { className: 'alert alert-info', role: 'alert' },
                    'No one has posted any activities yet. Post your first activity',
                    _react2.default.createElement(
                        _Link2.default,
                        { to: '/createActivity' },
                        _react2.default.createElement(
                            'strong',
                            null,
                            'here'
                        )
                    )
                ) : this.state.contents.map(function (activityFeedItem) {
                    return _react2.default.createElement(_presentations.ActivityFeedItem, { key: activityFeedItem._id, data: activityFeedItem });
                }),
                !this.state.moreToLoad && _react2.default.createElement(
                    'div',
                    { style: { marginTop: '30px', marginBottom: '30px', textAlign: 'center' } },
                    'Nothing more to load'
                )
            );
        }
    }]);

    return ActivityFeed;
}(_react2.default.Component);

exports.default = ActivityFeed;

/***/ }),

/***/ "./app/components/containers/chatnavbody.jsx":
/*!***************************************************!*\
  !*** ./app/components/containers/chatnavbody.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = __webpack_require__(/*! React */ "./node_modules/react/index.js");

var _React2 = _interopRequireDefault(_React);

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');

var ChatNavBody = function (_React$Component) {
    _inherits(ChatNavBody, _React$Component);

    function ChatNavBody(props) {
        _classCallCheck(this, ChatNavBody);

        var _this = _possibleConstructorReturn(this, (ChatNavBody.__proto__ || Object.getPrototypeOf(ChatNavBody)).call(this, props));

        _this.state = props;
        return _this;
    }

    _createClass(ChatNavBody, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
                this.setState(this.props);
            }
        }
    }, {
        key: 'getMessageData',
        value: function getMessageData(friendId) {
            var sessions = this.props.sessions;
            var filterResult = Object.keys(sessions).filter(function (sessionId) {
                return sessions[sessionId].users.indexOf(friendId) !== -1;
            });

            if (filterResult.length === 0) {
                return {
                    lastmessage: '',
                    unread: {}
                };
            } else {
                return {
                    lastmessage: sessions[filterResult[0]].lastmessage,
                    unread: sessions[filterResult[0]].unread
                };
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var alert = _React2.default.createElement(
                'div',
                { className: 'alert alert-info', role: 'alert' },
                'You don\'t have any friends yet.'
            );

            return _React2.default.createElement(
                _List2.default,
                { style: { backgroundColor: '#FDFDFD', height: '100%', overflowY: 'auto', width: '300px' } },
                this.state.userData !== undefined && (this.state.userData.friends === undefined || this.state.userData.friends.length === 0 ? alert : this.state.userData.friends.map(function (friend) {
                    return _React2.default.createElement(_presentations.ChatNavChatItem, {
                        key: friend._id,
                        data: friend,
                        activeFriend: _this2.props.activeFriend,
                        currentUser: _this2.state.userData._id,
                        switchUser: _this2.props.switchUser,
                        messageData: _this2.getMessageData(friend._id) });
                }))
            );
        }
    }]);

    return ChatNavBody;
}(_React2.default.Component);

exports.default = ChatNavBody;

/***/ }),

/***/ "./app/components/containers/chatwindow.jsx":
/*!**************************************************!*\
  !*** ./app/components/containers/chatwindow.jsx ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = __webpack_require__(/*! React */ "./node_modules/react/index.js");

var _React2 = _interopRequireDefault(_React);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _IconButton = __webpack_require__(/*! @material-ui/core/IconButton */ "./node_modules/@material-ui/core/IconButton/index.js");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _Tooltip = __webpack_require__(/*! @material-ui/core/Tooltip */ "./node_modules/@material-ui/core/Tooltip/index.js");

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _GridList = __webpack_require__(/*! @material-ui/core/GridList */ "./node_modules/@material-ui/core/GridList/index.js");

var _GridList2 = _interopRequireDefault(_GridList);

var _GridListTile = __webpack_require__(/*! @material-ui/core/GridListTile */ "./node_modules/@material-ui/core/GridListTile/index.js");

var _GridListTile2 = _interopRequireDefault(_GridListTile);

var _Dialog = __webpack_require__(/*! @material-ui/core/Dialog */ "./node_modules/@material-ui/core/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/DialogActions/index.js");

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/DialogContent/index.js");

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _GridListTileBar = __webpack_require__(/*! @material-ui/core/GridListTileBar */ "./node_modules/@material-ui/core/GridListTileBar/index.js");

var _GridListTileBar2 = _interopRequireDefault(_GridListTileBar);

var _CircularProgress = __webpack_require__(/*! @material-ui/core/CircularProgress */ "./node_modules/@material-ui/core/CircularProgress/index.js");

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
var swal = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");
// let debug = require('react-debug');

moment.updateLocale('en', {
    longDateFormat: {
        LT: "h:mm:ss A"
    }
});

var ChatWindow = function (_React$Component) {
    _inherits(ChatWindow, _React$Component);

    function ChatWindow(props) {
        _classCallCheck(this, ChatWindow);

        var _this = _possibleConstructorReturn(this, (ChatWindow.__proto__ || Object.getPrototypeOf(ChatWindow)).call(this, props));

        _this.handleClose = function () {
            _this.setState({ open: false });
        };

        _this.state = {
            targetUser: props.target,
            message: props.message,
            open: false,
            selectedImgs: [],
            currentIdx: 0,
            loading: true,
            loadingMore: false,
            loadingMessage: false
        };
        return _this;
    }

    _createClass(ChatWindow, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.setState({
                targetUser: this.props.target,
                message: this.props.message
            }, function () {
                _this2.refs.chatwindow.scrollTop = _this2.refs.chatwindow.scrollHeight;
            });
        }
    }, {
        key: 'handlePostMessage',
        value: function handlePostMessage(text, imgs) {
            var _this3 = this;

            if (this.state.loadingMessage) return;
            this.setState({
                loadingMessage: true
            }, function () {
                setTimeout(function () {
                    if (!_this3.state.loadingMessage) return;
                    _this3.setState({
                        loadingMessage: false
                    });
                    swal({
                        title: 'Error sending messages',
                        text: "Do you want to send '" + text + "' again?",
                        icon: 'error',
                        buttons: {
                            cancel: "cancel",
                            resend: "resend"
                        }
                    }).then(function (value) {
                        switch (value) {
                            case 'resend':
                                _this3.handlePostMessage(text, imgs);
                                break;
                            default:
                                break;
                        }
                    });
                }, 5000);
                _this3.refs.chatwindow.scrollTop = _this3.refs.chatwindow.scrollHeight;
                _this3.props.onPost(text, imgs);
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            var _this4 = this;

            if (this.props.target._id !== prevProps.target._id || JSON.stringify({ object: this.props.message }) !== JSON.stringify({ object: prevProps.message })) {
                this.setState({
                    targetUser: this.props.target,
                    message: this.props.message,
                    loading: false,
                    loadingMore: false,
                    loadingMessage: false
                }, function () {
                    if (_this4.props.message.length <= 10 || _this4.props.message.length === prevProps.message.length + 1) _this4.refs.chatwindow.scrollTop = _this4.refs.chatwindow.scrollHeight;
                });
            }
        }
    }, {
        key: 'handleClickOpen',
        value: function handleClickOpen(imgs, idx) {
            this.setState({ open: true, selectedImgs: imgs, currentIdx: idx });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            return _React2.default.createElement(
                'div',
                { className: 'col-md-7 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12 chat-right' },
                _React2.default.createElement(
                    'div',
                    { className: 'panel panel-dafault chatwindow' },
                    _React2.default.createElement(
                        'div',
                        { className: 'panel-heading' },
                        _React2.default.createElement(
                            _Tooltip2.default,
                            { title: 'Friends' },
                            _React2.default.createElement(
                                _IconButton2.default,
                                { className: 'pull-right friend-btn', onClick: function onClick() {
                                        return _this5.props.onExpand();
                                    } },
                                _React2.default.createElement(_Icon2.default, { style: { width: '50px' }, className: 'fas fa-user-friends' })
                            )
                        ),
                        _React2.default.createElement(
                            'div',
                            { className: 'media' },
                            _React2.default.createElement(
                                'div',
                                { className: 'media-left' },
                                this.state.loading ? _React2.default.createElement(_CircularProgress2.default, { size: 30, style: { color: '#61B4E4' } }) : _React2.default.createElement(
                                    _Link2.default,
                                    { to: "/profile/" + this.state.targetUser._id },
                                    _React2.default.createElement('img', { className: 'media-object', src: this.state.targetUser.avatar, alt: 'image', height: '45', width: '45' })
                                )
                            ),
                            _React2.default.createElement(
                                'div',
                                { className: 'media-body' },
                                _React2.default.createElement(
                                    'div',
                                    { className: 'row' },
                                    _React2.default.createElement(
                                        'div',
                                        { className: 'col-md-10' },
                                        _React2.default.createElement(
                                            'div',
                                            { className: 'media-heading' },
                                            _React2.default.createElement(
                                                'div',
                                                { className: 'media' },
                                                _React2.default.createElement(
                                                    'div',
                                                    { className: 'media-left media-body' },
                                                    _React2.default.createElement(
                                                        'font',
                                                        { size: '3' },
                                                        this.state.targetUser.fullname
                                                    )
                                                )
                                            )
                                        ),
                                        _React2.default.createElement(
                                            'font',
                                            { size: '2', color: 'grey ' },
                                            this.state.targetUser.description
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    _React2.default.createElement(
                        _Dialog2.default,
                        {
                            open: this.state.open,
                            onClose: this.handleClose },
                        _React2.default.createElement(
                            _DialogContent2.default,
                            null,
                            _React2.default.createElement('img', { style: {
                                    maxHeight: '100%',
                                    maxWidth: '100%'
                                }, src: this.state.selectedImgs[this.state.currentIdx] })
                        ),
                        _React2.default.createElement(
                            _DialogActions2.default,
                            null,
                            _React2.default.createElement(
                                _IconButton2.default,
                                { onClick: function onClick() {
                                        _this5.setState({
                                            currentIdx: (_this5.state.currentIdx + _this5.state.selectedImgs.length - 1) % _this5.state.selectedImgs.length
                                        });
                                    } },
                                _React2.default.createElement(_Icon2.default, { className: 'fas fa-chevron-left' })
                            ),
                            _React2.default.createElement(
                                _IconButton2.default,
                                { onClick: function onClick() {
                                        _this5.setState({
                                            currentIdx: (_this5.state.currentIdx + 1) % _this5.state.selectedImgs.length
                                        });
                                    } },
                                _React2.default.createElement(_Icon2.default, { className: 'fas fa-chevron-right' })
                            ),
                            _React2.default.createElement(
                                _Button2.default,
                                { onClick: this.handleClose, color: 'primary' },
                                'Close'
                            )
                        )
                    ),
                    _React2.default.createElement(
                        'div',
                        { className: 'panel-body', ref: 'chatwindow' },
                        _React2.default.createElement(
                            _Button2.default,
                            { onClick: function onClick(e) {
                                    _this5.setState({
                                        loadingMore: true
                                    }, function () {
                                        _this5.props.onLoad(e);
                                    });
                                }, fullWidth: true,
                                disabled: this.props.btnText === "nothing more to load" || this.state.loadingMore },
                            this.props.btnText
                        ),
                        this.state.loadingMore && this.props.btnText !== "nothing more to load" && _React2.default.createElement(
                            'div',
                            { style: { textAlign: 'center' } },
                            _React2.default.createElement(_CircularProgress2.default, { size: 20, style: {
                                    color: '#61B4E4'
                                } })
                        ),
                        _React2.default.createElement(
                            _List2.default,
                            null,
                            this.state.message === undefined ? 0 : this.state.message.map(function (msg, i) {

                                //default time format
                                var time = moment(msg.date).calendar();

                                //if less than 1 hour, use relative time
                                if (new Date().getTime() - msg.date <= 3600000) time = moment(msg.date).fromNow();

                                var sender = msg.sender === _this5.props.curUser._id ? _this5.props.curUser : _this5.state.targetUser;
                                return _React2.default.createElement(
                                    _ListItem2.default,
                                    { key: i,
                                        style: {
                                            alignItems: "flex-start",
                                            marginBottom: '10px'
                                        } },
                                    _React2.default.createElement(
                                        _ListItemAvatar2.default,
                                        null,
                                        _React2.default.createElement(_Avatar2.default, { src: sender.avatar })
                                    ),
                                    _React2.default.createElement(_ListItemText2.default, {
                                        primary: _React2.default.createElement(
                                            'span',
                                            null,
                                            _React2.default.createElement(
                                                'strong',
                                                null,
                                                sender.fullname
                                            ),
                                            _React2.default.createElement(
                                                'span',
                                                { style: { fontSize: '12px', marginLeft: '15px' } },
                                                time
                                            )
                                        ),
                                        secondary: _React2.default.createElement(
                                            'span',
                                            null,
                                            _React2.default.createElement(
                                                _GridList2.default,
                                                { cellHeight: 160, cols: 3 },
                                                msg.imgs.map(function (img, idx) {
                                                    return _React2.default.createElement(
                                                        _GridListTile2.default,
                                                        { key: idx },
                                                        _React2.default.createElement('img', { src: img }),
                                                        _React2.default.createElement(_GridListTileBar2.default, {
                                                            actionIcon: _React2.default.createElement(
                                                                _IconButton2.default,
                                                                { onClick: function onClick() {
                                                                        return _this5.handleClickOpen(msg.imgs, idx);
                                                                    } },
                                                                _React2.default.createElement(_Icon2.default, { style: { color: 'white' }, className: 'fas fa-search-plus' })
                                                            )
                                                        })
                                                    );
                                                })
                                            ),
                                            msg.text
                                        )
                                    })
                                );
                            }),
                            this.state.loadingMessage && _React2.default.createElement(
                                _ListItem2.default,
                                null,
                                _React2.default.createElement(_CircularProgress2.default, { size: 30, style: { marginLeft: '8px', color: '#61B4E4' } })
                            )
                        )
                    ),
                    _React2.default.createElement(_presentations.ChatEntry, { onPost: function onPost(message, imgs) {
                            return _this5.handlePostMessage(message, imgs);
                        } })
                )
            );
        }
    }]);

    return ChatWindow;
}(_React2.default.Component);

exports.default = ChatWindow;

/***/ }),

/***/ "./app/components/containers/createActivityFeed.jsx":
/*!**********************************************************!*\
  !*** ./app/components/containers/createActivityFeed.jsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _reactCropper = __webpack_require__(/*! react-cropper */ "./node_modules/react-cropper/dist/react-cropper.js");

var _reactCropper2 = _interopRequireDefault(_reactCropper);

__webpack_require__(/*! node_modules/cropperjs/dist/cropper.css */ "./node_modules/cropperjs/dist/cropper.css");

var _MenuItem = __webpack_require__(/*! @material-ui/core/MenuItem */ "./node_modules/@material-ui/core/MenuItem/index.js");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Input = __webpack_require__(/*! @material-ui/core/Input */ "./node_modules/@material-ui/core/Input/index.js");

var _Input2 = _interopRequireDefault(_Input);

var _InputLabel = __webpack_require__(/*! @material-ui/core/InputLabel */ "./node_modules/@material-ui/core/InputLabel/index.js");

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = __webpack_require__(/*! @material-ui/core/FormControl */ "./node_modules/@material-ui/core/FormControl/index.js");

var _FormControl2 = _interopRequireDefault(_FormControl);

var _Select = __webpack_require__(/*! @material-ui/core/Select */ "./node_modules/@material-ui/core/Select/index.js");

var _Select2 = _interopRequireDefault(_Select);

var _materialUiPickers = __webpack_require__(/*! material-ui-pickers */ "./node_modules/material-ui-pickers/index.es.js");

var _MuiPickersUtilsProvider = __webpack_require__(/*! material-ui-pickers/utils/MuiPickersUtilsProvider */ "./node_modules/material-ui-pickers/utils/MuiPickersUtilsProvider.js");

var _MuiPickersUtilsProvider2 = _interopRequireDefault(_MuiPickersUtilsProvider);

var _momentUtils = __webpack_require__(/*! material-ui-pickers/utils/moment-utils */ "./node_modules/material-ui-pickers/utils/moment-utils.js");

var _momentUtils2 = _interopRequireDefault(_momentUtils);

var _Dialog = __webpack_require__(/*! @material-ui/core/Dialog */ "./node_modules/@material-ui/core/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/DialogActions/index.js");

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/DialogContent/index.js");

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogTitle = __webpack_require__(/*! @material-ui/core/DialogTitle */ "./node_modules/@material-ui/core/DialogTitle/index.js");

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//mui


// var debug = require('react-debug');
var swal = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");

var CreateActivityFeed = function (_React$Component) {
    _inherits(CreateActivityFeed, _React$Component);

    function CreateActivityFeed(props) {
        _classCallCheck(this, CreateActivityFeed);

        var _this = _possibleConstructorReturn(this, (CreateActivityFeed.__proto__ || Object.getPrototypeOf(CreateActivityFeed)).call(this, props));

        _this.handleRequestHide = function () {
            _this.setState({
                cropperOpen: false,
                img: null
            });
        };

        _this.handleCrop = function () {
            _this.setState({
                cropperOpen: false,
                img: _this.refs.cropper.getCroppedCanvas().toDataURL()
            });
        };

        _this.handleStartTime = function (date) {
            _this.setState({
                startTime: date
            });
        };

        _this.handleEndTime = function (date) {
            _this.setState({
                endTime: date
            });
        };

        _this.handleEvent = function (e) {
            _this.setState({
                type: e.target.value
            });
        };

        _this.state = {
            type: 1,
            title: "",
            img: null,
            cropperOpen: false,
            startTime: null,
            endTime: null,
            description: "",
            location: "",
            detail: "",
            alert: false,
            sizealert: false,
            fileWrongType: false
        };
        return _this;
    }

    _createClass(CreateActivityFeed, [{
        key: 'handleFile',
        value: function handleFile(e) {
            var _this2 = this;

            e.preventDefault();
            // Read the first file that the user selected (if the user selected multiple
            // files, we ignore the others).
            var reader = new FileReader();
            var file = e.target.files[0];
            if (!file.type.match('image.*')) {
                this.setState({ fileWrongType: true });
            } else if (file.size < 1100000) {
                // Called once the browser finishes loading the image.
                reader.onload = function (upload) {
                    _this2.setState({
                        img: upload.target.result,
                        cropperOpen: true
                    });
                };
                reader.readAsDataURL(file);
                this.setState({ sizealert: false });
                this.setState({ fileWrongType: false });
            } else {
                this.setState({ sizealert: true });
            }
        }
    }, {
        key: 'handleFileClick',
        value: function handleFileClick(e) {
            e.target.value = null;
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            var _this3 = this;

            e.preventDefault();
            if (this.state.type !== "------Select a Activity Type-----" && this.state.title.trim() !== "" && this.state.startTime !== null && this.state.endTime !== null && this.state.description.trim() !== "" && this.state.location.trim() !== "" && this.state.detail.trim() !== "") {
                //activity created succesfully
                var data = Object.assign({}, this.state);
                data.userData = this.props.user;
                var type = "";
                switch (data.type) {
                    case 1:
                        type = "Event";
                        break;
                    case 2:
                        type = "Entertainment";
                        break;
                    default:
                        type = "Study";
                        break;
                }
                data.type = type;
                (0, _utils.createActivity)(data).then(function (response) {
                    return swal({
                        title: "Success",
                        icon: "success",
                        button: "OK"
                    });
                }).then(function () {
                    _credentials.socket.emit('newActivity');
                    _this3.props.history.push('/activity');
                }).catch(function (err) {
                    return swal({
                        title: "Create Activity Failed",
                        icon: "error",
                        button: "OK"
                    });
                });
            } else {
                this.setState({ alert: true });
            }
        }
    }, {
        key: 'handleTitle',
        value: function handleTitle(e) {
            e.preventDefault();
            this.setState({
                title: e.target.value
            });
        }
    }, {
        key: 'handleLocation',
        value: function handleLocation(e) {
            e.preventDefault();
            this.setState({
                location: e.target.value
            });
        }
    }, {
        key: 'handleDetail',
        value: function handleDetail(e) {
            e.preventDefault();
            this.setState({
                detail: e.target.value
            });
        }
    }, {
        key: 'handleDescription',
        value: function handleDescription(e) {
            e.preventDefault();
            this.setState({
                description: e.target.value
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            return _react2.default.createElement(
                _MuiPickersUtilsProvider2.default,
                { utils: _momentUtils2.default },
                _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    this.state.cropperOpen && _react2.default.createElement(
                        _Dialog2.default,
                        {
                            open: this.state.cropperOpen,
                            onClose: this.handleRequestHide },
                        _react2.default.createElement(
                            _DialogTitle2.default,
                            null,
                            'Crop your image'
                        ),
                        _react2.default.createElement(
                            _DialogContent2.default,
                            null,
                            _react2.default.createElement(_reactCropper2.default, {
                                ref: 'cropper',
                                src: this.state.img,
                                style: { height: 400, width: '100%' },
                                aspectRatio: 18 / 9 })
                        ),
                        _react2.default.createElement(
                            _DialogActions2.default,
                            null,
                            _react2.default.createElement(
                                _Button2.default,
                                { onClick: this.handleRequestHide, color: 'primary' },
                                'Cancel'
                            ),
                            _react2.default.createElement(
                                _Button2.default,
                                { onClick: this.handleCrop, color: 'primary' },
                                'Submit'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1' },
                            _react2.default.createElement(
                                'h4',
                                null,
                                _react2.default.createElement(
                                    'span',
                                    { style: {
                                            "marginRight": '10px'
                                        } },
                                    _react2.default.createElement('i', { className: 'glyphicon glyphicon-list-alt', 'aria-hidden': 'true' })
                                ),
                                'Create Activity'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 infos' },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel panel-default' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'panel-heading' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'row' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            _react2.default.createElement(
                                                'h4',
                                                null,
                                                'Activity Info'
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: (0, _utils.hideElement)(!this.state.alert) },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'alert alert-warning alert-dismissible', role: 'alert' },
                                                    _react2.default.createElement(
                                                        'strong',
                                                        null,
                                                        'Please fill in blanks'
                                                    )
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: (0, _utils.hideElement)(!this.state.sizealert) },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'alert alert-warning alert-dismissible', role: 'alert' },
                                                    _react2.default.createElement(
                                                        'strong',
                                                        null,
                                                        'File is too large'
                                                    )
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: "alert alert-warning alert-dismissible " + (0, _utils.hideElement)(!this.state.fileWrongType), role: 'alert' },
                                                _react2.default.createElement(
                                                    'strong',
                                                    null,
                                                    'File is not a image file'
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'row' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'col-md-12' },
                                                    _react2.default.createElement(
                                                        _FormControl2.default,
                                                        { fullWidth: true, style: { marginBottom: '20px' } },
                                                        _react2.default.createElement(
                                                            _InputLabel2.default,
                                                            {
                                                                style: { color: '#607D8B' },
                                                                htmlFor: 'activityTitle' },
                                                            'Title'
                                                        ),
                                                        _react2.default.createElement(_Input2.default, {
                                                            id: 'activityTitle',
                                                            value: this.state.title,
                                                            onChange: function onChange(e) {
                                                                return _this4.handleTitle(e);
                                                            }
                                                        })
                                                    )
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'row' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'col-md-6' },
                                                    _react2.default.createElement(_materialUiPickers.DateTimePicker, { fullWidth: true,
                                                        style: { marginBottom: '20px' },
                                                        value: this.state.startTime,
                                                        onChange: this.handleStartTime,
                                                        label: 'Start Time'
                                                    })
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'col-md-6' },
                                                    _react2.default.createElement(_materialUiPickers.DateTimePicker, {
                                                        fullWidth: true,
                                                        style: { marginBottom: '20px' },
                                                        value: this.state.endTime,
                                                        onChange: this.handleEndTime,
                                                        label: 'End Time'
                                                    })
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'row' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'col-md-6' },
                                                    _react2.default.createElement(
                                                        _FormControl2.default,
                                                        { fullWidth: true, style: { marginBottom: '20px' } },
                                                        _react2.default.createElement(
                                                            _InputLabel2.default,
                                                            {
                                                                style: { color: '#607D8B' },
                                                                htmlFor: 'activityLocation' },
                                                            'Location'
                                                        ),
                                                        _react2.default.createElement(_Input2.default, {
                                                            id: 'activityLocation',
                                                            value: this.state.location,
                                                            onChange: function onChange(e) {
                                                                return _this4.handleLocation(e);
                                                            }
                                                        })
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'col-md-6' },
                                                    _react2.default.createElement(
                                                        _FormControl2.default,
                                                        { fullWidth: true, style: { marginBottom: '20px' } },
                                                        _react2.default.createElement(
                                                            _InputLabel2.default,
                                                            { style: { color: '#607D8B' }, htmlFor: 'type' },
                                                            'Select the type of your activity'
                                                        ),
                                                        _react2.default.createElement(
                                                            _Select2.default,
                                                            {
                                                                value: this.state.type,
                                                                onChange: this.handleEvent,
                                                                inputProps: { id: 'type' } },
                                                            _react2.default.createElement(
                                                                _MenuItem2.default,
                                                                { value: 1 },
                                                                'Event'
                                                            ),
                                                            _react2.default.createElement(
                                                                _MenuItem2.default,
                                                                { value: 2 },
                                                                'Entertainment'
                                                            ),
                                                            _react2.default.createElement(
                                                                _MenuItem2.default,
                                                                { value: 3 },
                                                                'Study'
                                                            )
                                                        )
                                                    )
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'row' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'col-md-12' },
                                                    _react2.default.createElement(
                                                        _FormControl2.default,
                                                        { fullWidth: true, style: { marginBottom: '20px' } },
                                                        _react2.default.createElement(
                                                            _InputLabel2.default,
                                                            {
                                                                style: { color: '#607D8B' },
                                                                htmlFor: 'activityDescription' },
                                                            'Description'
                                                        ),
                                                        _react2.default.createElement(_Input2.default, { multiline: true,
                                                            rows: '2',
                                                            id: 'activityDescription',
                                                            value: this.state.description,
                                                            onChange: function onChange(e) {
                                                                return _this4.handleDescription(e);
                                                            }
                                                        })
                                                    ),
                                                    _react2.default.createElement(
                                                        _FormControl2.default,
                                                        { fullWidth: true, style: { marginBottom: '20px' } },
                                                        _react2.default.createElement(
                                                            _InputLabel2.default,
                                                            {
                                                                style: { color: '#607D8B' },
                                                                htmlFor: 'activityDetails' },
                                                            'Details'
                                                        ),
                                                        _react2.default.createElement(_Input2.default, { multiline: true,
                                                            rows: '4',
                                                            id: 'activityDetails',
                                                            value: this.state.detail,
                                                            onChange: function onChange(e) {
                                                                return _this4.handleDetail(e);
                                                            }
                                                        })
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'panel-footer' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'row' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'col-md-6 nopadding' },
                                                _react2.default.createElement(
                                                    'label',
                                                    { type: 'button', className: 'btn btn-blue-grey pull-left', name: 'button' },
                                                    'Upload activity header ',
                                                    _react2.default.createElement('input', { type: 'file', style: { "display": "none" },
                                                        onClick: function onClick(e) {
                                                            return _this4.handleFileClick(e);
                                                        }, onChange: function onChange(e) {
                                                            return _this4.handleFile(e);
                                                        } })
                                                )
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'col-md-6 nopadding' },
                                                _react2.default.createElement(
                                                    'button',
                                                    { type: 'button', className: 'btn btn-blue-grey pull-right nomargin', onClick: function onClick(e) {
                                                            return _this4.handleSubmit(e);
                                                        } },
                                                    'Submit'
                                                )
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'row' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'col-md-12' },
                                                _react2.default.createElement('img', { src: this.state.img, style: { marginTop: '20px' }, className: (0, _utils.hideElement)(this.state.cropperOpen), width: '100%' })
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return CreateActivityFeed;
}(_react2.default.Component);

exports.default = (0, _reactRouterDom.withRouter)(CreateActivityFeed);

/***/ }),

/***/ "./app/components/containers/index.js":
/*!********************************************!*\
  !*** ./app/components/containers/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SettingSystemInfo = exports.SettingProfileInfo = exports.SearchEntry = exports.ProfileRecentPostFeed = exports.ProfileRecentActivityFeed = exports.ProfilePersonalInfo = exports.PostFeed = exports.CreateActivityFeed = exports.NotificationBody = exports.Navbar = exports.LandingSignup = exports.LandingSignin = exports.LandingBackground = exports.ChatWindow = exports.ChatNavBody = exports.ActivityChatPanel = exports.ActivityDetailBody = exports.ActivityFeed = undefined;

var _activityFeed = __webpack_require__(/*! ./activityFeed */ "./app/components/containers/activityFeed.jsx");

var _activityFeed2 = _interopRequireDefault(_activityFeed);

var _activityDetailBody = __webpack_require__(/*! ./activityDetailBody */ "./app/components/containers/activityDetailBody.jsx");

var _activityDetailBody2 = _interopRequireDefault(_activityDetailBody);

var _activityChatPanel = __webpack_require__(/*! ./activityChatPanel */ "./app/components/containers/activityChatPanel.jsx");

var _activityChatPanel2 = _interopRequireDefault(_activityChatPanel);

var _chatnavbody = __webpack_require__(/*! ./chatnavbody */ "./app/components/containers/chatnavbody.jsx");

var _chatnavbody2 = _interopRequireDefault(_chatnavbody);

var _chatwindow = __webpack_require__(/*! ./chatwindow */ "./app/components/containers/chatwindow.jsx");

var _chatwindow2 = _interopRequireDefault(_chatwindow);

var _landingbackground = __webpack_require__(/*! ./landingbackground */ "./app/components/containers/landingbackground.jsx");

var _landingbackground2 = _interopRequireDefault(_landingbackground);

var _landingsignin = __webpack_require__(/*! ./landingsignin */ "./app/components/containers/landingsignin.jsx");

var _landingsignin2 = _interopRequireDefault(_landingsignin);

var _landingsignup = __webpack_require__(/*! ./landingsignup */ "./app/components/containers/landingsignup.jsx");

var _landingsignup2 = _interopRequireDefault(_landingsignup);

var _navbar = __webpack_require__(/*! ./navbar */ "./app/components/containers/navbar.jsx");

var _navbar2 = _interopRequireDefault(_navbar);

var _notificationBody = __webpack_require__(/*! ./notificationBody */ "./app/components/containers/notificationBody.jsx");

var _notificationBody2 = _interopRequireDefault(_notificationBody);

var _createActivityFeed = __webpack_require__(/*! ./createActivityFeed */ "./app/components/containers/createActivityFeed.jsx");

var _createActivityFeed2 = _interopRequireDefault(_createActivityFeed);

var _postFeed = __webpack_require__(/*! ./postFeed */ "./app/components/containers/postFeed.jsx");

var _postFeed2 = _interopRequireDefault(_postFeed);

var _profilePersonalInfo = __webpack_require__(/*! ./profilePersonalInfo */ "./app/components/containers/profilePersonalInfo.jsx");

var _profilePersonalInfo2 = _interopRequireDefault(_profilePersonalInfo);

var _profileRecentActivityFeed = __webpack_require__(/*! ./profileRecentActivityFeed */ "./app/components/containers/profileRecentActivityFeed.jsx");

var _profileRecentActivityFeed2 = _interopRequireDefault(_profileRecentActivityFeed);

var _profileRecentPostFeed = __webpack_require__(/*! ./profileRecentPostFeed */ "./app/components/containers/profileRecentPostFeed.jsx");

var _profileRecentPostFeed2 = _interopRequireDefault(_profileRecentPostFeed);

var _searchEntry = __webpack_require__(/*! ./searchEntry */ "./app/components/containers/searchEntry.jsx");

var _searchEntry2 = _interopRequireDefault(_searchEntry);

var _settingprofileinfo = __webpack_require__(/*! ./settingprofileinfo */ "./app/components/containers/settingprofileinfo.jsx");

var _settingprofileinfo2 = _interopRequireDefault(_settingprofileinfo);

var _settingsysteminfo = __webpack_require__(/*! ./settingsysteminfo */ "./app/components/containers/settingsysteminfo.jsx");

var _settingsysteminfo2 = _interopRequireDefault(_settingsysteminfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ActivityFeed = _activityFeed2.default;
exports.ActivityDetailBody = _activityDetailBody2.default;
exports.ActivityChatPanel = _activityChatPanel2.default;
exports.ChatNavBody = _chatnavbody2.default;
exports.ChatWindow = _chatwindow2.default;
exports.LandingBackground = _landingbackground2.default;
exports.LandingSignin = _landingsignin2.default;
exports.LandingSignup = _landingsignup2.default;
exports.Navbar = _navbar2.default;
exports.NotificationBody = _notificationBody2.default;
exports.CreateActivityFeed = _createActivityFeed2.default;
exports.PostFeed = _postFeed2.default;
exports.ProfilePersonalInfo = _profilePersonalInfo2.default;
exports.ProfileRecentActivityFeed = _profileRecentActivityFeed2.default;
exports.ProfileRecentPostFeed = _profileRecentPostFeed2.default;
exports.SearchEntry = _searchEntry2.default;
exports.SettingProfileInfo = _settingprofileinfo2.default;
exports.SettingSystemInfo = _settingsysteminfo2.default;

/***/ }),

/***/ "./app/components/containers/landingbackground.jsx":
/*!*********************************************************!*\
  !*** ./app/components/containers/landingbackground.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');

var LandingBackground = function (_React$Component) {
    _inherits(LandingBackground, _React$Component);

    function LandingBackground() {
        _classCallCheck(this, LandingBackground);

        return _possibleConstructorReturn(this, (LandingBackground.__proto__ || Object.getPrototypeOf(LandingBackground)).apply(this, arguments));
    }

    _createClass(LandingBackground, [{
        key: 'render',
        value: function render() {
            var btn_style = {
                margin: '10px',
                outline: '0px'
            };
            return _react2.default.createElement(
                'div',
                { className: 'bg' },
                _react2.default.createElement(
                    'div',
                    { className: 'text-vertical-center' },
                    _react2.default.createElement(
                        'h1',
                        { style: { color: 'white' } },
                        _react2.default.createElement(
                            'span',
                            null,
                            _react2.default.createElement('img', { src: '../img/logo/mipmap-xxxhdpi/ic_launcher.png', width: '70px' })
                        ),
                        ' WeMeet'
                    ),
                    _react2.default.createElement(
                        'h2',
                        { style: { color: 'white' } },
                        'Join nearby activities and make friends!'
                    ),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(
                        _Button2.default,
                        { variant: 'contained', color: 'primary', style: btn_style, onClick: this.props.handleOpen("signUpOpen") },
                        'Sign up'
                    ),
                    _react2.default.createElement(
                        _Button2.default,
                        { variant: 'contained', color: 'secondary', style: btn_style, onClick: this.props.handleOpen("loginOpen") },
                        'Log in'
                    ),
                    _react2.default.createElement(
                        _Button2.default,
                        { variant: 'contained', color: 'default', style: {
                                fontSize: '14px',
                                margin: '10px',
                                outline: '0px',
                                color: 'white',
                                backgroundColor: '#3b5998'
                            }, href: '/auth/facebook' },
                        _react2.default.createElement(_Icon2.default, { className: 'fab fa-facebook-f' }),
                        'Facebook'
                    )
                )
            );
        }
    }]);

    return LandingBackground;
}(_react2.default.Component);

exports.default = LandingBackground;

/***/ }),

/***/ "./app/components/containers/landingsignin.jsx":
/*!*****************************************************!*\
  !*** ./app/components/containers/landingsignin.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Input = __webpack_require__(/*! @material-ui/core/Input */ "./node_modules/@material-ui/core/Input/index.js");

var _Input2 = _interopRequireDefault(_Input);

var _InputLabel = __webpack_require__(/*! @material-ui/core/InputLabel */ "./node_modules/@material-ui/core/InputLabel/index.js");

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = __webpack_require__(/*! @material-ui/core/FormControl */ "./node_modules/@material-ui/core/FormControl/index.js");

var _FormControl2 = _interopRequireDefault(_FormControl);

var _Dialog = __webpack_require__(/*! @material-ui/core/Dialog */ "./node_modules/@material-ui/core/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/DialogActions/index.js");

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/DialogContent/index.js");

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogTitle = __webpack_require__(/*! @material-ui/core/DialogTitle */ "./node_modules/@material-ui/core/DialogTitle/index.js");

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LandingSignin = function (_React$Component) {
    _inherits(LandingSignin, _React$Component);

    function LandingSignin(props) {
        _classCallCheck(this, LandingSignin);

        var _this = _possibleConstructorReturn(this, (LandingSignin.__proto__ || Object.getPrototypeOf(LandingSignin)).call(this, props));

        _this.state = {
            signInEmail: "",
            signInPass: "",
            failedLogin: false,
            submitted: false,
            open: false
        };
        return _this;
    }

    _createClass(LandingSignin, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (this.props.open !== prevProps.open) {
                this.setState({
                    open: this.props.open
                });
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(field, e) {
            e.preventDefault();
            var update = {};
            update[field] = e.target.value;
            this.setState(update);
        }
    }, {
        key: 'handleSignIn',
        value: function handleSignIn(e) {
            var _this2 = this;

            e.preventDefault();
            if (this.state.signInPass !== "" && this.state.signInEmail !== "" && (e.key === "Enter" || e.button === 0)) {
                this.setState({
                    submitted: true
                });
                (0, _utils.login)(this.state.signInEmail, this.state.signInPass, function (success) {
                    if (success) {
                        _this2.setState({
                            signInPass: "",
                            signInEmail: "",
                            failedLogin: false,
                            submitted: false
                        });
                        _this2.props.history.push("/activity");
                    } else {
                        _this2.setState({
                            failedLogin: true,
                            submitted: false
                        });
                    }
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                _Dialog2.default,
                {
                    open: this.state.open,
                    onClose: this.props.handleClose('loginOpen') },
                _react2.default.createElement(
                    _DialogTitle2.default,
                    null,
                    "Log in"
                ),
                _react2.default.createElement(
                    _DialogContent2.default,
                    null,
                    _react2.default.createElement(
                        'div',
                        { className: "alert alert-danger " + (0, _utils.hideElement)(!this.state.failedLogin), role: 'alert' },
                        _react2.default.createElement(
                            'strong',
                            null,
                            'Invalid email address or password.'
                        ),
                        _react2.default.createElement('br', null),
                        'Please try a different email address or password, and try logging in again.'
                    ),
                    _react2.default.createElement(
                        _FormControl2.default,
                        { style: { width: '100%', marginBottom: '20px' } },
                        _react2.default.createElement(
                            _InputLabel2.default,
                            {
                                style: { color: '#607D8B' },
                                htmlFor: 'signInEmail' },
                            'Email'
                        ),
                        _react2.default.createElement(_Input2.default, {
                            id: 'signInEmail',
                            value: this.state.signInEmail,
                            onChange: function onChange(e) {
                                return _this3.handleChange("signInEmail", e);
                            },
                            onKeyUp: function onKeyUp(e) {
                                return _this3.handleSignIn(e);
                            }
                        })
                    ),
                    _react2.default.createElement(
                        _FormControl2.default,
                        { style: { width: '100%' } },
                        _react2.default.createElement(
                            _InputLabel2.default,
                            {
                                style: { color: '#607D8B' },
                                htmlFor: 'signInPass' },
                            'Password'
                        ),
                        _react2.default.createElement(_Input2.default, {
                            id: 'signInPass',
                            value: this.state.signInPass,
                            onChange: function onChange(e) {
                                return _this3.handleChange("signInPass", e);
                            },
                            onKeyUp: function onKeyUp(e) {
                                return _this3.handleSignIn(e);
                            },
                            type: 'password'
                        })
                    )
                ),
                _react2.default.createElement(
                    _DialogActions2.default,
                    null,
                    _react2.default.createElement(
                        _Button2.default,
                        { variant: 'contained', style: { fontSize: '14px' }, className: 'pull-right', disabled: this.state.submitted,
                            onClick: function onClick(e) {
                                return _this3.handleSignIn(e);
                            } },
                        'Log in'
                    )
                )
            );
        }
    }]);

    return LandingSignin;
}(_react2.default.Component);

exports.default = (0, _reactRouterDom.withRouter)(LandingSignin);

/***/ }),

/***/ "./app/components/containers/landingsignup.jsx":
/*!*****************************************************!*\
  !*** ./app/components/containers/landingsignup.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Input = __webpack_require__(/*! @material-ui/core/Input */ "./node_modules/@material-ui/core/Input/index.js");

var _Input2 = _interopRequireDefault(_Input);

var _InputLabel = __webpack_require__(/*! @material-ui/core/InputLabel */ "./node_modules/@material-ui/core/InputLabel/index.js");

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = __webpack_require__(/*! @material-ui/core/FormControl */ "./node_modules/@material-ui/core/FormControl/index.js");

var _FormControl2 = _interopRequireDefault(_FormControl);

var _Dialog = __webpack_require__(/*! @material-ui/core/Dialog */ "./node_modules/@material-ui/core/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/DialogActions/index.js");

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/DialogContent/index.js");

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogTitle = __webpack_require__(/*! @material-ui/core/DialogTitle */ "./node_modules/@material-ui/core/DialogTitle/index.js");

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LandingSignup = function (_React$Component) {
    _inherits(LandingSignup, _React$Component);

    function LandingSignup(props) {
        _classCallCheck(this, LandingSignup);

        var _this = _possibleConstructorReturn(this, (LandingSignup.__proto__ || Object.getPrototypeOf(LandingSignup)).call(this, props));

        _this.state = {
            signUpEmail: "",
            signUpName: "",
            signUpPass: "",
            signUpPass2: "",
            failedLogin: false,
            failedSignUp: false,
            submitted: false,
            passwordStrength: 0,
            passwordClass: "progress-bar-danger",
            passwordTooSimple: false,
            open: false
        };
        return _this;
    }

    _createClass(LandingSignup, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (this.props.open !== prevProps.open) {
                this.setState({
                    open: this.props.open
                });
            }
        }
    }, {
        key: 'handleSignUp',
        value: function handleSignUp(e) {
            var _this2 = this;

            e.preventDefault();
            if (this.state.signUpName.trim() !== "" && this.state.signUpEmail !== "" && this.state.signUpPass !== "" && this.state.passwordStrength >= 60 && this.state.signUpPass === this.state.signUpPass2 && (e.key === "Enter" || e.button === 0)) {
                this.setState({
                    submitted: true
                });
                (0, _utils.signup)(this.state.signUpEmail, this.state.signUpName, this.state.signUpPass, function (success) {
                    if (success) {
                        (0, _utils.login)(_this2.state.signUpEmail, _this2.state.signUpPass, function (success) {
                            if (success) {
                                _this2.setState({
                                    signInPass: "",
                                    signInEmail: "",
                                    signUpEmail: "",
                                    signUpPass: "",
                                    signUpName: "",
                                    failedLogin: false,
                                    submitted: false,
                                    passwordError: false
                                });
                                _this2.props.history.push('/activity');
                            } else {
                                _this2.setState({
                                    failedLogin: true,
                                    submitted: false
                                });
                            }
                        });
                    } else {
                        _this2.setState({
                            failedSignUp: true,
                            submitted: false
                        });
                    }
                });
            } else if (this.state.passwordStrength < 60 && this.state.signUpPass !== "" && (e.key === "Enter" || e.button === 0)) {
                this.setState({
                    passwordTooSimple: true,
                    submitted: false
                });
            } else if (this.state.signUpPass2 !== this.state.signUpPass && (e.key === "Enter" || e.button === 0)) {
                this.setState({
                    passwordError: true,
                    submitted: false
                });
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(field, e) {
            e.preventDefault();
            if (field === "signUpPass") {
                this.setState({
                    passwordTooSimple: false
                });
                var strength = zxcvbn(e.target.value);
                switch (strength.score) {
                    case 0:
                        {
                            this.setState({
                                passwordStrength: 20
                            });
                        }
                        break;
                    case 1:
                        {
                            this.setState({
                                passwordStrength: 40
                            });
                        }
                        break;
                    case 2:
                        {
                            this.setState({
                                passwordStrength: 60,
                                passwordClass: "progress-bar-success",
                                passwordTooSimple: false
                            });
                        }
                        break;
                    case 3:
                        {
                            this.setState({
                                passwordStrength: 80,
                                passwordClass: "progress-bar-success",
                                passwordTooSimple: false
                            });
                        }
                        break;
                    case 4:
                        {
                            this.setState({
                                passwordStrength: 100,
                                passwordClass: "progress-bar-success",
                                passwordTooSimple: false
                            });
                        }
                        break;
                    default:
                }
                if (e.target.value === "") {
                    this.setState({
                        passwordStrength: 0,
                        passwordClass: "progress-bar-danger"
                    });
                }
            }
            var update = {};
            update[field] = e.target.value;
            this.setState(update);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                _Dialog2.default,
                {
                    open: this.state.open,
                    onClose: this.props.handleClose('signUpOpen') },
                _react2.default.createElement(
                    _DialogTitle2.default,
                    null,
                    "Sign up"
                ),
                _react2.default.createElement(
                    _DialogContent2.default,
                    null,
                    _react2.default.createElement(
                        'div',
                        { className: (0, _utils.hideElement)(!this.state.failedSignUp) + " alert alert-danger", role: 'alert' },
                        _react2.default.createElement(
                            'strong',
                            null,
                            'Invalid account signup.'
                        ),
                        _react2.default.createElement('br', null),
                        '1.It is possible that you already have an account with that particular email address',
                        _react2.default.createElement('br', null),
                        '2.you didn\'t fill in all the blanks.',
                        _react2.default.createElement('br', null),
                        '3.email format is not correct'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: (0, _utils.hideElement)(!this.state.passwordError) + " alert alert-danger", role: 'alert' },
                        _react2.default.createElement(
                            'strong',
                            null,
                            'Invalid account signup.'
                        ),
                        ' two passwords don\'t match'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: (0, _utils.hideElement)(!this.state.passwordTooSimple) + " alert alert-danger", role: 'alert' },
                        _react2.default.createElement(
                            'strong',
                            null,
                            'Password is too simple'
                        )
                    ),
                    _react2.default.createElement(
                        _FormControl2.default,
                        { style: { width: '100%', marginBottom: '20px' } },
                        _react2.default.createElement(
                            _InputLabel2.default,
                            {
                                style: { color: '#607D8B' },
                                htmlFor: 'signUpUsername' },
                            'Username'
                        ),
                        _react2.default.createElement(_Input2.default, {
                            id: 'signUpUsername',
                            value: this.state.signUpName,
                            onChange: function onChange(e) {
                                return _this3.handleChange("signUpName", e);
                            },
                            onKeyUp: function onKeyUp(e) {
                                return _this3.handleSignUp(e);
                            }
                        })
                    ),
                    _react2.default.createElement(
                        _FormControl2.default,
                        { style: { width: '100%', marginBottom: '20px' } },
                        _react2.default.createElement(
                            _InputLabel2.default,
                            {
                                style: { color: '#607D8B' },
                                htmlFor: 'signUpEmail' },
                            'Email'
                        ),
                        _react2.default.createElement(_Input2.default, {
                            id: 'signUpEmail',
                            value: this.state.signUpEmail,
                            onChange: function onChange(e) {
                                return _this3.handleChange("signUpEmail", e);
                            },
                            onKeyUp: function onKeyUp(e) {
                                return _this3.handleSignUp(e);
                            }
                        })
                    ),
                    _react2.default.createElement(
                        _FormControl2.default,
                        { style: { width: '100%', marginBottom: '20px' } },
                        _react2.default.createElement(
                            _InputLabel2.default,
                            {
                                style: { color: '#607D8B' },
                                htmlFor: 'signUpPass' },
                            'Password'
                        ),
                        _react2.default.createElement(_Input2.default, {
                            id: 'signUpPass',
                            type: 'password',
                            value: this.state.signUpPass,
                            onChange: function onChange(e) {
                                return _this3.handleChange("signUpPass", e);
                            },
                            onKeyUp: function onKeyUp(e) {
                                return _this3.handleSignUp(e);
                            }
                        })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'progress', style: { height: '6px', marginTop: '-15px', borderRadius: '0' } },
                        _react2.default.createElement('div', { className: "progress-bar " + this.state.passwordClass,
                            role: 'progressbar',
                            'aria-valuemin': '0',
                            'aria-valuemax': '100',
                            style: { width: this.state.passwordStrength + "%" } })
                    ),
                    _react2.default.createElement(
                        _FormControl2.default,
                        { style: { width: '100%', marginBottom: '20px' } },
                        _react2.default.createElement(
                            _InputLabel2.default,
                            {
                                style: { color: '#607D8B' },
                                htmlFor: 'signUpPass2' },
                            'Confirm password'
                        ),
                        _react2.default.createElement(_Input2.default, {
                            id: 'signUpPass2',
                            type: 'password',
                            value: this.state.signUpPass2,
                            onChange: function onChange(e) {
                                return _this3.handleChange("signUpPass2", e);
                            },
                            onKeyUp: function onKeyUp(e) {
                                return _this3.handleSignUp(e);
                            }
                        })
                    )
                ),
                _react2.default.createElement(
                    _DialogActions2.default,
                    null,
                    _react2.default.createElement(
                        _Button2.default,
                        { className: 'pull-right', style: { backgroundColor: '#403e3e', color: 'white' },
                            variant: 'contained',
                            onClick: function onClick(e) {
                                return _this3.handleSignUp(e);
                            } },
                        'Join us!'
                    )
                )
            );
        }
    }]);

    return LandingSignup;
}(_react2.default.Component);

exports.default = (0, _reactRouterDom.withRouter)(LandingSignup);

/***/ }),

/***/ "./app/components/containers/navbar.jsx":
/*!**********************************************!*\
  !*** ./app/components/containers/navbar.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _Badge = __webpack_require__(/*! @material-ui/core/Badge */ "./node_modules/@material-ui/core/Badge/index.js");

var _Badge2 = _interopRequireDefault(_Badge);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _IconButton = __webpack_require__(/*! @material-ui/core/IconButton */ "./node_modules/@material-ui/core/IconButton/index.js");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Person = __webpack_require__(/*! @material-ui/icons/Person */ "./node_modules/@material-ui/icons/Person.js");

var _Person2 = _interopRequireDefault(_Person);

var _SettingsApplications = __webpack_require__(/*! @material-ui/icons/SettingsApplications */ "./node_modules/@material-ui/icons/SettingsApplications.js");

var _SettingsApplications2 = _interopRequireDefault(_SettingsApplications);

var _Create = __webpack_require__(/*! @material-ui/icons/Create */ "./node_modules/@material-ui/icons/Create.js");

var _Create2 = _interopRequireDefault(_Create);

var _PowerOff = __webpack_require__(/*! @material-ui/icons/PowerOff */ "./node_modules/@material-ui/icons/PowerOff.js");

var _PowerOff2 = _interopRequireDefault(_PowerOff);

var _Divider = __webpack_require__(/*! @material-ui/core/Divider */ "./node_modules/@material-ui/core/Divider/index.js");

var _Divider2 = _interopRequireDefault(_Divider);

var _Snackbar = __webpack_require__(/*! @material-ui/core/Snackbar */ "./node_modules/@material-ui/core/Snackbar/index.js");

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _ListItemIcon = __webpack_require__(/*! @material-ui/core/ListItemIcon */ "./node_modules/@material-ui/core/ListItemIcon/index.js");

var _ListItemIcon2 = _interopRequireDefault(_ListItemIcon);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _ListItemSecondaryAction = __webpack_require__(/*! @material-ui/core/ListItemSecondaryAction */ "./node_modules/@material-ui/core/ListItemSecondaryAction/index.js");

var _ListItemSecondaryAction2 = _interopRequireDefault(_ListItemSecondaryAction);

var _ExpandMore = __webpack_require__(/*! @material-ui/icons/ExpandMore */ "./node_modules/@material-ui/icons/ExpandMore.js");

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _Menu = __webpack_require__(/*! @material-ui/core/Menu */ "./node_modules/@material-ui/core/Menu/index.js");

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = __webpack_require__(/*! @material-ui/core/MenuItem */ "./node_modules/@material-ui/core/MenuItem/index.js");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Drawer = __webpack_require__(/*! @material-ui/core/Drawer */ "./node_modules/@material-ui/core/Drawer/index.js");

var _Drawer2 = _interopRequireDefault(_Drawer);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Close = __webpack_require__(/*! @material-ui/icons/Close */ "./node_modules/@material-ui/icons/Close.js");

var _Close2 = _interopRequireDefault(_Close);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var swal = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");
// var debug = require('react-debug');

var Navbar = function (_React$Component) {
  _inherits(Navbar, _React$Component);

  function Navbar(props) {
    _classCallCheck(this, Navbar);

    var _this = _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).call(this, props));

    _this.onChat = function () {
      _this.setState({
        chat: true,
        snackBar: true
      });
    };

    _this.onNotification = function () {
      _this.setState({
        notification: true
      });
    };

    _this.handleClick = function (event) {
      _this.setState({ anchorEl: event.currentTarget });
    };

    _this.handleClose = function () {
      _this.setState({ anchorEl: null });
    };

    _this.state = {
      activity: false,
      post: false,
      chat: false,
      notification: false,
      notificationCount: 0,
      open: false,
      snackBar: false,
      anchorEl: null
    };
    return _this;
  }

  _createClass(Navbar, [{
    key: 'handleLogOut',
    value: function handleLogOut(e) {
      e.preventDefault();
      (0, _utils.logout)();
      this.props.history.push('/');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        chat: false,
        notification: false
      });
      _credentials.socket.on('chat', this.onChat);
      _credentials.socket.on('notification', this.onNotification);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _credentials.socket.removeListener("chat", this.onChat);
      _credentials.socket.removeListener("notification", this.onNotification);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (Object.keys(this.props.user).length > 0) {
        (0, _utils.hasNewNotification)(this.props.user._id).then(function (response) {
          var count = response.data.count;
          if (prevState.notificationCount !== count) {
            _this2.setState({
              notification: count > 0,
              notificationCount: count,
              activity: false,
              post: false,
              chat: false
            });
          }
        });
      }
    }
  }, {
    key: 'notifyMe',
    value: function notifyMe(route, message) {
      var _this3 = this;

      if (!Notification) {
        swal({
          title: 'Desktop notifications not available in your browser!',
          text: 'Please try with a different browser.',
          type: 'error'
        });
        return;
      }
      if (Notification.permission !== "granted") Notification.requestPermission();else {
        var notification = new Notification('WeMeet', {
          icon: 'https://www.w1meet.com/img/logo/mipmap-xxhdpi/ic_launcher.png',
          body: message
        });
        notification.onclick = function (event) {
          event.preventDefault();
          _this3.props.history.push(route);
          location.reload();
          event.target.close();
        };
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var iconMenu = _react2.default.createElement(
        _Menu2.default,
        {
          id: 'simple-menu',
          anchorEl: this.state.anchorEl,
          open: Boolean(this.state.anchorEl),
          onClose: this.handleClose
        },
        _react2.default.createElement(
          _reactRouterDom.Link,
          { style: { textDecoration: 'none', outline: '0px' }, to: "/profile/" + this.props.user._id },
          _react2.default.createElement(
            _MenuItem2.default,
            null,
            _react2.default.createElement(
              _ListItemIcon2.default,
              null,
              _react2.default.createElement(_Person2.default, null)
            ),
            _react2.default.createElement(_ListItemText2.default, { inset: true, primary: _react2.default.createElement(
                'h5',
                null,
                'Profile'
              ) })
          )
        ),
        _react2.default.createElement(
          _reactRouterDom.Link,
          { style: { textDecoration: 'none', outline: '0px' }, to: '/settings' },
          _react2.default.createElement(
            _MenuItem2.default,
            null,
            _react2.default.createElement(
              _ListItemIcon2.default,
              null,
              _react2.default.createElement(_SettingsApplications2.default, null)
            ),
            _react2.default.createElement(_ListItemText2.default, { inset: true, primary: _react2.default.createElement(
                'h5',
                null,
                'Settings'
              ) })
          )
        ),
        _react2.default.createElement(
          _reactRouterDom.Link,
          { style: { textDecoration: 'none', outline: '0px' }, to: '/createActivity' },
          _react2.default.createElement(
            _MenuItem2.default,
            null,
            _react2.default.createElement(
              _ListItemIcon2.default,
              null,
              _react2.default.createElement(_Create2.default, null)
            ),
            _react2.default.createElement(_ListItemText2.default, { inset: true, primary: _react2.default.createElement(
                'h5',
                null,
                'Create Activity'
              ) })
          )
        ),
        _react2.default.createElement(_Divider2.default, null),
        _react2.default.createElement(
          _MenuItem2.default,
          { onClick: function onClick(e) {
              return _this4.handleLogOut(e);
            } },
          _react2.default.createElement(
            _ListItemIcon2.default,
            null,
            _react2.default.createElement(_PowerOff2.default, null)
          ),
          _react2.default.createElement(_ListItemText2.default, { inset: true, primary: _react2.default.createElement(
              'h5',
              null,
              'Logout'
            ) })
        )
      );

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Snackbar2.default, _defineProperty({
          open: this.state.snackBar && this.props.chat !== 'active',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          message: "You have new messages",
          action: 'check',
          autoHideDuration: 4000,
          onClose: function onClose() {
            _this4.setState({ snackBar: false });
          }
        }, 'action', [_react2.default.createElement(
          _Button2.default,
          { key: 'undo', color: 'secondary', size: 'small', onClick: function onClick() {
              _this4.props.history.push('/chat');
            } },
          'Check'
        ), _react2.default.createElement(
          _IconButton2.default,
          {
            key: 'close',
            'aria-label': 'Close',
            color: 'inherit',
            onClick: function onClick() {
              _this4.setState({ snackBar: false });
            } },
          _react2.default.createElement(_Close2.default, null)
        )])),
        _react2.default.createElement(
          'nav',
          { className: 'navbar navbar-default navbar-fixed-top', role: 'navigation' },
          _react2.default.createElement(
            'div',
            { className: 'container-fluid' },
            _react2.default.createElement(
              'div',
              { className: 'navbar-header' },
              _react2.default.createElement(
                'button',
                { type: 'button', className: 'navbar-toggle', onClick: function onClick() {
                    _this4.setState({ open: !_this4.state.open });
                  } },
                _react2.default.createElement(
                  'span',
                  { className: 'sr-only' },
                  'Toggle navigation'
                ),
                _react2.default.createElement('span', { className: 'icon-bar' }),
                _react2.default.createElement('span', { className: 'icon-bar' }),
                _react2.default.createElement('span', { className: 'icon-bar' })
              ),
              _react2.default.createElement(
                _reactRouterDom.Link,
                { className: 'navbar-brand', to: '/activity' },
                _react2.default.createElement('img', { src: './img/logo/mipmap-xxhdpi/ic_launcher.png', width: '50px', height: '50px', alt: '' })
              )
            ),
            _react2.default.createElement(
              _Drawer2.default,
              {
                open: this.state.open,
                onClose: function onClose() {
                  return _this4.setState({ open: false });
                },
                style: { width: '300px' } },
              _react2.default.createElement(
                _List2.default,
                { style: { width: '300px' } },
                _react2.default.createElement(
                  _ListItem2.default,
                  { style: { paddingBottom: '0px' } },
                  _react2.default.createElement(
                    _ListItemAvatar2.default,
                    null,
                    _react2.default.createElement(_Avatar2.default, { src: this.props.user.avatar })
                  ),
                  _react2.default.createElement(_ListItemText2.default, {
                    primary: _react2.default.createElement(
                      'h4',
                      null,
                      this.props.user.fullname
                    ) }),
                  _react2.default.createElement(
                    _ListItemSecondaryAction2.default,
                    null,
                    _react2.default.createElement(
                      _IconButton2.default,
                      { 'aria-haspopup': 'true',
                        onClick: this.handleClick,
                        'aria-owns': this.state.anchorEl ? 'simple-menu' : null },
                      _react2.default.createElement(_ExpandMore2.default, null)
                    )
                  )
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { style: { textDecoration: 'none' }, to: '/activity' },
                  _react2.default.createElement(
                    _ListItem2.default,
                    null,
                    _react2.default.createElement(
                      _ListItemIcon2.default,
                      null,
                      _react2.default.createElement(_Icon2.default, { className: 'fas fa-list-alt' })
                    ),
                    _react2.default.createElement(_ListItemText2.default, { inset: true, primary: 'Activities' })
                  )
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { style: { textDecoration: 'none' }, to: '/post' },
                  _react2.default.createElement(
                    _ListItem2.default,
                    null,
                    _react2.default.createElement(
                      _ListItemIcon2.default,
                      null,
                      _react2.default.createElement(_Icon2.default, { className: 'fas fa-book' })
                    ),
                    _react2.default.createElement(_ListItemText2.default, { inset: true, primary: 'Trend' })
                  )
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { style: { textDecoration: 'none' }, to: '/chat' },
                  _react2.default.createElement(
                    _ListItem2.default,
                    null,
                    _react2.default.createElement(
                      _ListItemIcon2.default,
                      null,
                      _react2.default.createElement(_Icon2.default, { className: 'fas fa-comment-alt' })
                    ),
                    _react2.default.createElement(_ListItemText2.default, { inset: true, primary: 'Chat' })
                  )
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { style: { textDecoration: 'none' }, to: '/search' },
                  _react2.default.createElement(
                    _ListItem2.default,
                    null,
                    _react2.default.createElement(
                      _ListItemIcon2.default,
                      null,
                      _react2.default.createElement(_Icon2.default, { className: 'fas fa-search' })
                    ),
                    _react2.default.createElement(_ListItemText2.default, { inset: true, primary: 'Search' })
                  )
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { style: { textDecoration: 'none' }, to: '/notification' },
                  _react2.default.createElement(
                    _ListItem2.default,
                    null,
                    _react2.default.createElement(
                      _ListItemIcon2.default,
                      null,
                      _react2.default.createElement(_Icon2.default, { className: 'fas fa-bell' })
                    ),
                    _react2.default.createElement(_ListItemText2.default, { inset: true, primary: 'Notification' })
                  )
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'collapse navbar-collapse', id: 'navbar' },
              _react2.default.createElement(
                'ul',
                { className: 'nav navbar-nav nav-left' },
                _react2.default.createElement(
                  'li',
                  { className: this.props.activity },
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/activity' },
                    'Activities'
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: this.props.post },
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/post' },
                    'Trend'
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: this.props.chat },
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/chat' },
                    'Chat ',
                    _react2.default.createElement('i', { className: "fa fa-circle " + (0, _utils.hideElement)(!this.state.chat || this.props.chat === "active"), style: { fontSize: '12px', marginLeft: '2px', color: '#EF9A9A' }, 'aria-hidden': 'true' })
                  )
                )
              ),
              _react2.default.createElement(
                'ul',
                { className: 'nav navbar-nav navbar-right' },
                _react2.default.createElement(
                  'div',
                  { className: 'pull-left' },
                  _react2.default.createElement(
                    _ListItem2.default,
                    { style: { paddingBottom: '0px' } },
                    _react2.default.createElement(
                      _ListItemAvatar2.default,
                      null,
                      _react2.default.createElement(_Avatar2.default, { src: this.props.user.avatar })
                    ),
                    _react2.default.createElement(
                      _ListItemSecondaryAction2.default,
                      null,
                      _react2.default.createElement(
                        _IconButton2.default,
                        { 'aria-haspopup': 'true',
                          onClick: this.handleClick,
                          'aria-owns': this.state.anchorEl ? 'simple-menu' : null },
                        _react2.default.createElement(_ExpandMore2.default, null)
                      )
                    )
                  ),
                  iconMenu
                ),
                _react2.default.createElement(
                  'li',
                  { className: this.props.search },
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/search' },
                    _react2.default.createElement('i', { className: 'fa fa-search', 'aria-hidden': 'true' })
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: this.props.notification },
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: "/notification" },
                    !this.state.notification ? _react2.default.createElement('i', { className: 'far fa-bell', 'aria-hidden': 'true' }) : _react2.default.createElement(
                      _Badge2.default,
                      {
                        style: { width: '20px' },
                        badgeContent: this.state.notificationCount,
                        color: 'secondary' },
                      _react2.default.createElement('i', { className: 'far fa-bell', 'aria-hidden': 'true' })
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Navbar;
}(_react2.default.Component);

exports.default = (0, _reactRouterDom.withRouter)(Navbar);

/***/ }),

/***/ "./app/components/containers/notificationBody.jsx":
/*!********************************************************!*\
  !*** ./app/components/containers/notificationBody.jsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _Tabs = __webpack_require__(/*! @material-ui/core/Tabs */ "./node_modules/@material-ui/core/Tabs/index.js");

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = __webpack_require__(/*! @material-ui/core/Tab */ "./node_modules/@material-ui/core/Tab/index.js");

var _Tab2 = _interopRequireDefault(_Tab);

var _Badge = __webpack_require__(/*! @material-ui/core/Badge */ "./node_modules/@material-ui/core/Badge/index.js");

var _Badge2 = _interopRequireDefault(_Badge);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _ListItemSecondaryAction = __webpack_require__(/*! @material-ui/core/ListItemSecondaryAction */ "./node_modules/@material-ui/core/ListItemSecondaryAction/index.js");

var _ListItemSecondaryAction2 = _interopRequireDefault(_ListItemSecondaryAction);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _IconButton = __webpack_require__(/*! @material-ui/core/IconButton */ "./node_modules/@material-ui/core/IconButton/index.js");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Divider = __webpack_require__(/*! @material-ui/core/Divider */ "./node_modules/@material-ui/core/Divider/index.js");

var _Divider2 = _interopRequireDefault(_Divider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');


Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

var NotificationBody = function (_React$Component) {
    _inherits(NotificationBody, _React$Component);

    function NotificationBody(props) {
        _classCallCheck(this, NotificationBody);

        var _this = _possibleConstructorReturn(this, (NotificationBody.__proto__ || Object.getPrototypeOf(NotificationBody)).call(this, props));

        _this.handleChange = function (event, value) {
            _this.setState({ value: value });
        };

        _this.state = {
            value: 0
        };
        return _this;
    }

    _createClass(NotificationBody, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var frbadge = this.props.FR.length === 0 ? _react2.default.createElement(_Icon2.default, { className: 'fas fa-user-plus', style: { width: '30px' } }) : _react2.default.createElement(
                _Badge2.default,
                { badgeContent: this.props.FR.length, color: 'secondary' },
                _react2.default.createElement(_Icon2.default, { className: 'fas fa-user-plus', style: { width: '30px' } })
            );

            var anbadge = this.props.AN.length === 0 ? _react2.default.createElement(_Icon2.default, { className: 'fas fa-bell' }) : _react2.default.createElement(
                _Badge2.default,
                { badgeContent: this.props.AN.length, color: 'secondary' },
                _react2.default.createElement(_Icon2.default, { className: 'fas fa-bell' })
            );

            var friendRequestContent = _react2.default.createElement(
                _List2.default,
                { style: { backgroundColor: '#ffffff', padding: 0, boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' } },
                this.props.FR.length === 0 ? "Nothing here" : this.props.FR.map(function (fr, i) {
                    var content = "";
                    if (fr.accept) {
                        content = "accepted your friend request.";
                    } else {
                        content = "wants to be your friend.";
                    }
                    return _react2.default.createElement(
                        'div',
                        { key: i },
                        _react2.default.createElement(
                            _ListItem2.default,
                            { style: { padding: '20px' } },
                            _react2.default.createElement(
                                _Link2.default,
                                { to: "/profile/" + fr.sender._id },
                                _react2.default.createElement(
                                    _ListItemAvatar2.default,
                                    null,
                                    _react2.default.createElement(_Avatar2.default, { src: fr.sender.avatar })
                                )
                            ),
                            _react2.default.createElement(_ListItemText2.default, { primary: fr.sender.fullname,
                                secondary: content }),
                            _react2.default.createElement(
                                _ListItemSecondaryAction2.default,
                                null,
                                !fr.accept && _react2.default.createElement(
                                    _IconButton2.default,
                                    { onClick: function onClick() {
                                            return _this2.props.handleFriendAccept(fr._id, fr.sender._id);
                                        } },
                                    _react2.default.createElement(_Icon2.default, { className: 'fas fa-check', style: { color: '#43A047' } })
                                ),
                                _react2.default.createElement(
                                    _IconButton2.default,
                                    { onClick: function onClick() {
                                            return _this2.props.handleDelete(fr._id);
                                        } },
                                    _react2.default.createElement(_Icon2.default, { className: 'fas fa-trash', style: { color: '#e53935' } })
                                )
                            )
                        ),
                        _react2.default.createElement(_Divider2.default, { inset: true })
                    );
                })
            );
            var activityRequestContent = _react2.default.createElement(
                _List2.default,
                { style: { backgroundColor: '#ffffff', padding: 0, boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' } },
                this.props.AN.length === 0 ? "Nothing here" : this.props.AN.map(function (an, i) {
                    var text = "";
                    if (an.RequestOrInvite === "request") {
                        if (an.accept) {
                            text = "accepted your request to join activity";
                        } else {
                            text = "sent you a request to join activity";
                        }
                    } else {
                        if (an.accept) {
                            text = "accepted your invitation";
                        } else {
                            text = "invited you to join activity";
                        }
                    }
                    return _react2.default.createElement(
                        'div',
                        { key: i },
                        _react2.default.createElement(
                            _ListItem2.default,
                            { style: { padding: '20px' } },
                            _react2.default.createElement(
                                _Link2.default,
                                { to: "/profile/" + an.sender._id },
                                _react2.default.createElement(
                                    _ListItemAvatar2.default,
                                    null,
                                    _react2.default.createElement(_Avatar2.default, { src: an.sender.avatar })
                                )
                            ),
                            _react2.default.createElement(_ListItemText2.default, { primary: an.sender.fullname,
                                secondary: _react2.default.createElement(
                                    _Link2.default,
                                    { to: "/activityDetail/" + an.activityid, target: '_blank' },
                                    text
                                ) }),
                            _react2.default.createElement(
                                _ListItemSecondaryAction2.default,
                                null,
                                !an.accept && _react2.default.createElement(
                                    _IconButton2.default,
                                    { onClick: function onClick() {
                                            return _this2.props.handleActivityAccept(an._id, an.sender._id);
                                        } },
                                    _react2.default.createElement(_Icon2.default, { className: 'fas fa-check', style: { color: '#43A047' } })
                                ),
                                _react2.default.createElement(
                                    _IconButton2.default,
                                    { onClick: function onClick() {
                                            return _this2.props.handleDelete(an._id);
                                        } },
                                    _react2.default.createElement(_Icon2.default, { className: 'fas fa-trash', style: { color: '#e53935' } })
                                )
                            )
                        ),
                        _react2.default.createElement(_Divider2.default, { inset: true })
                    );
                })
            );
            return _react2.default.createElement(
                'div',
                { style: { marginTop: '30px' } },
                _react2.default.createElement(
                    _Tabs2.default,
                    {
                        value: this.state.value,
                        style: { backgroundColor: 'white' },
                        indicatorColor: 'primary',
                        textColor: 'primary',
                        onChange: this.handleChange,
                        fullWidth: true, centered: true },
                    _react2.default.createElement(_Tab2.default, { icon: frbadge }),
                    _react2.default.createElement(_Tab2.default, { icon: anbadge })
                ),
                this.state.value === 0 && friendRequestContent,
                this.state.value === 1 && activityRequestContent
            );
        }
    }]);

    return NotificationBody;
}(_react2.default.Component);

exports.default = NotificationBody;

/***/ }),

/***/ "./app/components/containers/postFeed.jsx":
/*!************************************************!*\
  !*** ./app/components/containers/postFeed.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _CircularProgress = __webpack_require__(/*! @material-ui/core/CircularProgress */ "./node_modules/@material-ui/core/CircularProgress/index.js");

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var debug = require('react-debug');

var PostFeed = function (_React$Component) {
    _inherits(PostFeed, _React$Component);

    function PostFeed(props) {
        _classCallCheck(this, PostFeed);

        var _this = _possibleConstructorReturn(this, (PostFeed.__proto__ || Object.getPrototypeOf(PostFeed)).call(this, props));

        _this.trackScrolling = function () {
            var wrappedElement = document.getElementById('postFeed');
            if (wrappedElement !== null && (0, _utils.isBottom)(wrappedElement)) {
                _this.handleLoad(false);
            }
        };

        _this.onNewPost = function () {
            _this.setState({
                new: true
            });
        };

        _this.handleNew = function () {
            _this.handleLoad(true);
            window.scrollTo(0, 0);
        };

        _this.state = {
            contents: [],
            moreToLoad: true,
            loading: true,
            new: false
        };
        return _this;
    }

    _createClass(PostFeed, [{
        key: 'handleLoad',
        value: function handleLoad(init) {
            var _this2 = this;

            document.removeEventListener('scroll', this.trackScrolling);
            if (init) {
                this.setState({
                    new: false,
                    loading: true
                });
            } else {
                this.setState({
                    loading: false
                });
            }
            var date = init || this.state.contents.length === 0 ? new Date().getTime() : this.state.contents[this.state.contents.length - 1].contents.postDate;
            (0, _utils.getAllPosts)(date).then(function (response) {
                var postFeedData = response.data;
                if (postFeedData.length === 0) {
                    return _this2.setState({
                        moreToLoad: false,
                        loading: false
                    });
                }
                var newPostData = (init ? [] : _this2.state.contents).concat(postFeedData);
                _this2.setState({
                    contents: newPostData,
                    moreToLoad: true,
                    loading: false
                }, function () {
                    document.addEventListener('scroll', _this2.trackScrolling);
                });
            });
        }
    }, {
        key: 'onPost',
        value: function onPost(text, img) {
            var _this3 = this;

            this.setState({
                loading: true
            });
            (0, _utils.postStatus)(this.props.user._id, text, img).then(function () {
                _credentials.socket.emit('newPost');
                _this3.handleLoad(true);
            });
        }

        // componentDidUpdate(prevProps, prevState) {
        //     if(this.state.contents.count === prevState.count)
        //         this.handleLoadMore();
        // }


    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.handleLoad(true);
            _credentials.socket.on('newPost', this.onNewPost);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('scroll', this.trackScrolling);
            _credentials.socket.removeEventListener('newPost', this.onNewPost);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            return _react2.default.createElement(
                'div',
                { className: 'postFeedItem', id: 'postFeed' },
                this.state.new && _react2.default.createElement(
                    _Button2.default,
                    { variant: 'extendedFab', color: 'primary', style: {
                            position: 'fixed',
                            zIndex: 100,
                            left: '45%'
                        }, onClick: this.handleNew },
                    _react2.default.createElement(_Icon2.default, { style: { marginRight: '5px' }, className: 'fas fa-arrow-alt-circle-up' }),
                    'new posts'
                ),
                _react2.default.createElement(_presentations.PostEntry, { userData: this.props.user, onPost: function onPost(text, img) {
                        return _this4.onPost(text, img);
                    } }),
                this.state.loading ? _react2.default.createElement(
                    'div',
                    { style: { textAlign: 'center', color: '#61B4E4', marginTop: '30px', marginBottom: '30px' } },
                    _react2.default.createElement(_CircularProgress2.default, { size: 30 })
                ) : _react2.default.createElement('div', null),
                !this.state.loading && this.state.contents.length === 0 ? _react2.default.createElement(
                    'div',
                    { className: 'alert alert-info', role: 'alert' },
                    'No one has posted anthing yet!'
                ) : this.state.contents.map(function (postFeedItem, i) {
                    return _react2.default.createElement(_presentations.PostFeedItem, { key: i, data: postFeedItem, currentUser: _this4.props.user._id });
                }),
                !this.state.moreToLoad && _react2.default.createElement(
                    'div',
                    { style: { marginTop: '30px', marginBottom: '30px', textAlign: 'center' } },
                    'Nothing more to load'
                )
            );
        }
    }]);

    return PostFeed;
}(_react2.default.Component);

exports.default = PostFeed;

/***/ }),

/***/ "./app/components/containers/profilePersonalInfo.jsx":
/*!***********************************************************!*\
  !*** ./app/components/containers/profilePersonalInfo.jsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _Snackbar = __webpack_require__(/*! @material-ui/core/Snackbar */ "./node_modules/@material-ui/core/Snackbar/index.js");

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _IconButton = __webpack_require__(/*! @material-ui/core/IconButton */ "./node_modules/@material-ui/core/IconButton/index.js");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemIcon = __webpack_require__(/*! @material-ui/core/ListItemIcon */ "./node_modules/@material-ui/core/ListItemIcon/index.js");

var _ListItemIcon2 = _interopRequireDefault(_ListItemIcon);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _ListSubheader = __webpack_require__(/*! @material-ui/core/ListSubheader */ "./node_modules/@material-ui/core/ListSubheader/index.js");

var _ListSubheader2 = _interopRequireDefault(_ListSubheader);

var _ExpandLess = __webpack_require__(/*! @material-ui/icons/ExpandLess */ "./node_modules/@material-ui/icons/ExpandLess.js");

var _ExpandLess2 = _interopRequireDefault(_ExpandLess);

var _ExpandMore = __webpack_require__(/*! @material-ui/icons/ExpandMore */ "./node_modules/@material-ui/icons/ExpandMore.js");

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _ListItemSecondaryAction = __webpack_require__(/*! @material-ui/core/ListItemSecondaryAction */ "./node_modules/@material-ui/core/ListItemSecondaryAction/index.js");

var _ListItemSecondaryAction2 = _interopRequireDefault(_ListItemSecondaryAction);

var _Collapse = __webpack_require__(/*! @material-ui/core/Collapse */ "./node_modules/@material-ui/core/Collapse/index.js");

var _Collapse2 = _interopRequireDefault(_Collapse);

var _CheckCircle = __webpack_require__(/*! @material-ui/icons/CheckCircle */ "./node_modules/@material-ui/icons/CheckCircle.js");

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

var _SnackbarContent = __webpack_require__(/*! @material-ui/core/SnackbarContent */ "./node_modules/@material-ui/core/SnackbarContent/index.js");

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Error = __webpack_require__(/*! @material-ui/icons/Error */ "./node_modules/@material-ui/icons/Error.js");

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// material ui


var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
// let debug = require('react-debug');

var ProfilePersonalInfo = function (_React$Component) {
    _inherits(ProfilePersonalInfo, _React$Component);

    function ProfilePersonalInfo(props) {
        _classCallCheck(this, ProfilePersonalInfo);

        var _this = _possibleConstructorReturn(this, (ProfilePersonalInfo.__proto__ || Object.getPrototypeOf(ProfilePersonalInfo)).call(this, props));

        _this.handleRequestClose = function () {
            _this.setState({
                snackOpen: false
            });
        };

        _this.handleClick = function () {
            _this.setState(function (state) {
                return { collapseOpen: !state.collapseOpen };
            });
        };

        _this.componentDidMount = function () {
            _credentials.socket.on('friend notification', _this.handleFriendNotification);
        };

        _this.componentWillUnmount = function () {
            _credentials.socket.removeListener('friend notification', _this.handleFriendNotification);
        };

        _this.handleFriendNotification = function (err) {
            _this.setState({
                snackOpen: true,
                sentRequestFailed: err.error
            });
        };

        _this.state = {
            snackOpen: false,
            collapseOpen: false,
            sentRequestFailed: false
        };
        return _this;
    }

    _createClass(ProfilePersonalInfo, [{
        key: 'isCommon',
        value: function isCommon(id) {
            return this.props.commonFriends.indexOf(id) !== -1 || id === this.props.currentUser;
        }
    }, {
        key: 'handleAddFriend',
        value: function handleAddFriend(targetId) {
            _credentials.socket.emit('friend notification', {
                sender: this.props.currentUser,
                target: targetId
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Snackbar2.default,
                    {
                        autoHideDuration: 4000,
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        open: this.state.snackOpen,
                        onClose: this.handleRequestClose },
                    _react2.default.createElement(_SnackbarContent2.default, {
                        style: {
                            backgroundColor: [this.state.sentRequestFailed ? '#f44336' : '#4CAF50']
                        },
                        message: _react2.default.createElement(
                            'span',
                            { style: {
                                    display: 'flex',
                                    alignItems: 'center'
                                } },
                            this.state.sentRequestFailed ? _react2.default.createElement(_Error2.default, { style: { fontSize: '20px', marginRight: '10px' } }) : _react2.default.createElement(_CheckCircle2.default, { style: { fontSize: '20px', marginRight: '10px' } }),
                            this.state.sentRequestFailed ? 'failed to send request!' : 'request sent!'
                        )
                    })
                ),
                _react2.default.createElement(
                    _List2.default,
                    { style: { backgroundColor: '#ffffff', padding: 0, boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' },
                        subheader: _react2.default.createElement(
                            _ListSubheader2.default,
                            { style: { fontSize: '20px' } },
                            'Profile'
                        ) },
                    _react2.default.createElement(
                        _ListItem2.default,
                        null,
                        _react2.default.createElement(_Avatar2.default, { src: this.props.user.avatar }),
                        _react2.default.createElement(_ListItemText2.default, { primary: this.props.user.fullname })
                    ),
                    _react2.default.createElement(
                        _ListItem2.default,
                        null,
                        _react2.default.createElement(
                            _ListItemIcon2.default,
                            null,
                            _react2.default.createElement(_Icon2.default, { style: { width: '30px', textAlign: 'center' }, className: 'fas fa-info-circle' })
                        ),
                        _react2.default.createElement(_ListItemText2.default, { primary: this.props.user.description })
                    ),
                    _react2.default.createElement(
                        _ListItem2.default,
                        null,
                        _react2.default.createElement(
                            _ListItemIcon2.default,
                            null,
                            _react2.default.createElement(_Icon2.default, { style: { width: '30px', textAlign: 'center' }, className: 'fas fa-birthday-cake' })
                        ),
                        _react2.default.createElement(_ListItemText2.default, { primary: moment(this.props.user.birthday).calendar() })
                    ),
                    _react2.default.createElement(
                        _ListItem2.default,
                        null,
                        _react2.default.createElement(
                            _ListItemIcon2.default,
                            null,
                            _react2.default.createElement(_Icon2.default, { style: { width: '30px', textAlign: 'center' }, className: 'fas fa-envelope' })
                        ),
                        _react2.default.createElement(_ListItemText2.default, { primary: this.props.user.email })
                    ),
                    _react2.default.createElement(
                        _ListItem2.default,
                        { button: true, onClick: this.handleClick },
                        _react2.default.createElement(
                            _ListItemIcon2.default,
                            null,
                            _react2.default.createElement(_Icon2.default, { style: { width: '30px', textAlign: 'center' }, className: 'fas fa-users' })
                        ),
                        _react2.default.createElement(_ListItemText2.default, { primary: 'Connections' }),
                        this.state.collapseOpen ? _react2.default.createElement(_ExpandLess2.default, null) : _react2.default.createElement(_ExpandMore2.default, null)
                    ),
                    _react2.default.createElement(
                        _Collapse2.default,
                        { 'in': this.state.collapseOpen, timeout: 'auto', unmountOnExit: true },
                        _react2.default.createElement(
                            _List2.default,
                            { component: 'div', disablePadding: true },
                            (this.props.user.friends === undefined ? [] : this.props.user.friends).map(function (friend, i) {
                                var rightButton;
                                if (_this2.isCommon(friend._id)) {
                                    rightButton = _react2.default.createElement(
                                        _IconButton2.default,
                                        { disabled: true },
                                        _react2.default.createElement(_Icon2.default, { className: 'fas fa-check' })
                                    );
                                } else {
                                    rightButton = _react2.default.createElement(
                                        _IconButton2.default,
                                        { onClick: function onClick() {
                                                return _this2.handleAddFriend(friend._id);
                                            } },
                                        _react2.default.createElement(_Icon2.default, { className: 'fas fa-plus' })
                                    );
                                }
                                return _react2.default.createElement(
                                    _ListItem2.default,
                                    { key: i },
                                    _react2.default.createElement(
                                        _Link2.default,
                                        { to: '/profile/' + friend._id },
                                        _react2.default.createElement(_Avatar2.default, { src: friend.avatar })
                                    ),
                                    _react2.default.createElement(_ListItemText2.default, { primary: friend.fullname,
                                        secondary: friend.description }),
                                    _react2.default.createElement(
                                        _ListItemSecondaryAction2.default,
                                        null,
                                        rightButton
                                    )
                                );
                            })
                        )
                    )
                )
            );
        }
    }]);

    return ProfilePersonalInfo;
}(_react2.default.Component);

exports.default = ProfilePersonalInfo;

/***/ }),

/***/ "./app/components/containers/profileRecentActivityFeed.jsx":
/*!*****************************************************************!*\
  !*** ./app/components/containers/profileRecentActivityFeed.jsx ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//request function


// let debug = require('react-debug');

var ProfileRecentActivityFeed = function (_React$Component) {
    _inherits(ProfileRecentActivityFeed, _React$Component);

    function ProfileRecentActivityFeed(props) {
        _classCallCheck(this, ProfileRecentActivityFeed);

        var _this = _possibleConstructorReturn(this, (ProfileRecentActivityFeed.__proto__ || Object.getPrototypeOf(ProfileRecentActivityFeed)).call(this, props));

        _this.state = {
            contents: [],
            loadMore: true
        };
        return _this;
    }

    _createClass(ProfileRecentActivityFeed, [{
        key: 'getData',
        value: function getData(user, refreshed) {
            var _this2 = this;

            var count = refreshed ? 0 : this.state.contents.length;
            (0, _utils.getActivityFeedData)(user, count).then(function (response) {
                var activities = refreshed ? response.data.contents : _this2.state.contents.concat(response.data.contents);
                _this2.setState({
                    contents: activities,
                    loadMore: response.data.contents.length > 0
                });
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (prevProps.user !== this.props.user) {
                this.getData(this.props.user, true);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.getData(this.props.user);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                { style: { marginTop: '15px', marginBottom: '20px' } },
                this.state.contents.map(function (activityItem) {
                    return _react2.default.createElement(_presentations.ActivityFeedItem, { key: activityItem._id, data: activityItem, currentUser: _this3.props.currentUser });
                }),
                _react2.default.createElement(
                    _Button2.default,
                    { onClick: function onClick() {
                            _this3.getData(_this3.props.user, false);
                        },
                        fullWidth: true, style: { backgroundColor: "#fdfdfd" },
                        disabled: !this.state.loadMore },
                    this.state.loadMore ? "Load More" : "Nothing more to load"
                )
            );
        }
    }]);

    return ProfileRecentActivityFeed;
}(_react2.default.Component);

exports.default = ProfileRecentActivityFeed;

/***/ }),

/***/ "./app/components/containers/profileRecentPostFeed.jsx":
/*!*************************************************************!*\
  !*** ./app/components/containers/profileRecentPostFeed.jsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProfileRecentPostFeed = function (_React$Component) {
    _inherits(ProfileRecentPostFeed, _React$Component);

    function ProfileRecentPostFeed(props) {
        _classCallCheck(this, ProfileRecentPostFeed);

        var _this = _possibleConstructorReturn(this, (ProfileRecentPostFeed.__proto__ || Object.getPrototypeOf(ProfileRecentPostFeed)).call(this, props));

        _this.state = {
            contents: [],
            loadMore: true
        };
        return _this;
    }

    _createClass(ProfileRecentPostFeed, [{
        key: 'getData',
        value: function getData(user, refreshed) {
            var _this2 = this;

            var count = refreshed ? 0 : this.state.contents.length;
            (0, _utils.getPostFeedData)(user, count).then(function (response) {
                var activities = refreshed ? response.data.contents : _this2.state.contents.concat(response.data.contents);
                _this2.setState({
                    contents: activities,
                    loadMore: response.data.contents.length > 0
                });
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.getData(this.props.user);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (prevProps.user !== this.props.user) {
                this.getData(this.props.user, true);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                { style: { marginTop: '15px', marginBottom: '20px' } },
                this.state.contents.map(function (postItem) {
                    return _react2.default.createElement(_presentations.PostFeedItem, { key: postItem._id, data: postItem, currentUser: _this3.props.currentUser });
                }),
                _react2.default.createElement(
                    _Button2.default,
                    { onClick: function onClick() {
                            _this3.getData(_this3.props.user, false);
                        },
                        fullWidth: true, style: { backgroundColor: "#fdfdfd" },
                        disabled: !this.state.loadMore },
                    this.state.loadMore ? "Load More" : "Nothing more to load"
                )
            );
        }
    }]);

    return ProfileRecentPostFeed;
}(_react2.default.Component);

exports.default = ProfileRecentPostFeed;

/***/ }),

/***/ "./app/components/containers/searchEntry.jsx":
/*!***************************************************!*\
  !*** ./app/components/containers/searchEntry.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _presentations = __webpack_require__(/*! ../presentations */ "./app/components/presentations/index.js");

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _Input = __webpack_require__(/*! @material-ui/core/Input */ "./node_modules/@material-ui/core/Input/index.js");

var _Input2 = _interopRequireDefault(_Input);

var _InputLabel = __webpack_require__(/*! @material-ui/core/InputLabel */ "./node_modules/@material-ui/core/InputLabel/index.js");

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = __webpack_require__(/*! @material-ui/core/FormControl */ "./node_modules/@material-ui/core/FormControl/index.js");

var _FormControl2 = _interopRequireDefault(_FormControl);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _ListItemSecondaryAction = __webpack_require__(/*! @material-ui/core/ListItemSecondaryAction */ "./node_modules/@material-ui/core/ListItemSecondaryAction/index.js");

var _ListItemSecondaryAction2 = _interopRequireDefault(_ListItemSecondaryAction);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _IconButton = __webpack_require__(/*! @material-ui/core/IconButton */ "./node_modules/@material-ui/core/IconButton/index.js");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _Snackbar = __webpack_require__(/*! @material-ui/core/Snackbar */ "./node_modules/@material-ui/core/Snackbar/index.js");

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = __webpack_require__(/*! @material-ui/core/SnackbarContent */ "./node_modules/@material-ui/core/SnackbarContent/index.js");

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _CheckCircle = __webpack_require__(/*! @material-ui/icons/CheckCircle */ "./node_modules/@material-ui/icons/CheckCircle.js");

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

var _Error = __webpack_require__(/*! @material-ui/icons/Error */ "./node_modules/@material-ui/icons/Error.js");

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//mui


// var debug = require('react-debug');

var SearchEntry = function (_React$Component) {
    _inherits(SearchEntry, _React$Component);

    function SearchEntry(props) {
        _classCallCheck(this, SearchEntry);

        var _this = _possibleConstructorReturn(this, (SearchEntry.__proto__ || Object.getPrototypeOf(SearchEntry)).call(this, props));

        _this.handleRequestClose = function () {
            _this.setState({
                snackOpen: false
            });
        };

        _this.componentDidMount = function () {
            _credentials.socket.on('friend notification', _this.handleFriendNotification);
        };

        _this.componentWillUnmount = function () {
            _credentials.socket.removeListener('friend notification', _this.handleFriendNotification);
        };

        _this.handleFriendNotification = function (err) {
            _this.setState({
                snackOpen: true,
                sentRequestFailed: err.error
            });
        };

        _this.state = {
            value: "",
            searchDataResult: {},
            title: "",
            snackOpen: false,
            sentRequestFailed: false
        };
        return _this;
    }

    _createClass(SearchEntry, [{
        key: 'handleChange',
        value: function handleChange(e) {
            e.preventDefault();
            this.setState({ value: e.target.value });
        }
    }, {
        key: 'handleKeyUp',
        value: function handleKeyUp(e) {
            var _this2 = this;

            e.preventDefault();
            if (e.key === "Enter") {
                var query = this.state.value.trim();
                if (query !== "") {
                    (0, _utils.searchquery)(query).then(function (response) {
                        var searchData = response.data;
                        _this2.setState({
                            searchDataResult: searchData,
                            title: "Search result for " + query + ": "
                        });
                    });
                }
            }
        }
    }, {
        key: 'checkFriendsOfUser',
        value: function checkFriendsOfUser(friendId) {
            return this.props.user._id === friendId || this.props.user.friends.filter(function (friend) {
                return friend._id === friendId;
            }).length > 0;
        }
    }, {
        key: 'handleAddFriend',
        value: function handleAddFriend(friendId) {
            _credentials.socket.emit('friend notification', {
                sender: this.props.user._id,
                target: friendId
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'panel panel-default' },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-heading' },
                        _react2.default.createElement(
                            'div',
                            { className: 'media' },
                            _react2.default.createElement(
                                'div',
                                { className: 'media-body' },
                                _react2.default.createElement(
                                    _FormControl2.default,
                                    { style: { width: '100%', marginBottom: '10px', paddingTop: '8px' } },
                                    _react2.default.createElement(
                                        _InputLabel2.default,
                                        {
                                            style: { color: '#607D8B' },
                                            htmlFor: 'search' },
                                        'Search...'
                                    ),
                                    _react2.default.createElement(_Input2.default, {
                                        style: { paddingBottom: '5px' },
                                        id: 'search',
                                        value: this.state.value,
                                        onChange: function onChange(e) {
                                            return _this3.handleChange(e);
                                        },
                                        onKeyUp: function onKeyUp(e) {
                                            return _this3.handleKeyUp(e);
                                        },
                                        type: 'search'
                                    })
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'h4',
                    { style: { marginBottom: '10px' } },
                    this.state.title
                ),
                _react2.default.createElement(
                    _Snackbar2.default,
                    {
                        autoHideDuration: 4000,
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        open: this.state.snackOpen,
                        onClose: this.handleRequestClose },
                    _react2.default.createElement(_SnackbarContent2.default, {
                        style: {
                            backgroundColor: [this.state.sentRequestFailed ? '#f44336' : '#4CAF50']
                        },
                        message: _react2.default.createElement(
                            'span',
                            { style: {
                                    display: 'flex',
                                    alignItems: 'center'
                                } },
                            this.state.sentRequestFailed ? _react2.default.createElement(_Error2.default, { style: { fontSize: '20px', marginRight: '10px' } }) : _react2.default.createElement(_CheckCircle2.default, { style: { fontSize: '20px', marginRight: '10px' } }),
                            this.state.sentRequestFailed ? 'failed to send request!' : 'request sent!'
                        )
                    })
                ),
                _react2.default.createElement(
                    _List2.default,
                    { style: {
                            backgroundColor: '#ffffff',
                            padding: 0, boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)',
                            marginBottom: '30px'
                        } },
                    this.state.searchDataResult.users === undefined ? [] : this.state.searchDataResult.users.map(function (user, i) {
                        var rightButton;
                        if (_this3.checkFriendsOfUser(user._id)) {
                            rightButton = _react2.default.createElement(
                                _IconButton2.default,
                                { disabled: true },
                                _react2.default.createElement(_Icon2.default, { className: 'fas fa-check' })
                            );
                        } else {
                            rightButton = _react2.default.createElement(
                                _IconButton2.default,
                                { onClick: function onClick() {
                                        return _this3.handleAddFriend(user._id);
                                    } },
                                _react2.default.createElement(_Icon2.default, { className: 'fas fa-plus' })
                            );
                        }
                        return _react2.default.createElement(
                            _ListItem2.default,
                            { key: i, style: { padding: '20px' } },
                            _react2.default.createElement(
                                _Link2.default,
                                { to: '/profile/' + user._id },
                                _react2.default.createElement(_Avatar2.default, { src: user.avatar })
                            ),
                            _react2.default.createElement(_ListItemText2.default, { primary: user.fullname,
                                secondary: user.description }),
                            _react2.default.createElement(
                                _ListItemSecondaryAction2.default,
                                null,
                                rightButton
                            )
                        );
                    })
                ),
                this.state.searchDataResult.activities === undefined ? [] : this.state.searchDataResult.activities.map(function (activity, i) {
                    return _react2.default.createElement(_presentations.ActivityFeedItem, { key: i, data: activity });
                }),
                this.state.searchDataResult.posts === undefined ? [] : this.state.searchDataResult.posts.map(function (post, i) {
                    return _react2.default.createElement(_presentations.PostFeedItem, { key: i, data: post, currentUser: _this3.props.user._id });
                })
            );
        }
    }]);

    return SearchEntry;
}(_react2.default.Component);

exports.default = SearchEntry;

/***/ }),

/***/ "./app/components/containers/settingprofileinfo.jsx":
/*!**********************************************************!*\
  !*** ./app/components/containers/settingprofileinfo.jsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _Snackbar = __webpack_require__(/*! @material-ui/core/Snackbar */ "./node_modules/@material-ui/core/Snackbar/index.js");

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = __webpack_require__(/*! @material-ui/core/SnackbarContent */ "./node_modules/@material-ui/core/SnackbarContent/index.js");

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Input = __webpack_require__(/*! @material-ui/core/Input */ "./node_modules/@material-ui/core/Input/index.js");

var _Input2 = _interopRequireDefault(_Input);

var _InputLabel = __webpack_require__(/*! @material-ui/core/InputLabel */ "./node_modules/@material-ui/core/InputLabel/index.js");

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = __webpack_require__(/*! @material-ui/core/FormControl */ "./node_modules/@material-ui/core/FormControl/index.js");

var _FormControl2 = _interopRequireDefault(_FormControl);

var _materialUiPickers = __webpack_require__(/*! material-ui-pickers */ "./node_modules/material-ui-pickers/index.es.js");

var _MuiPickersUtilsProvider = __webpack_require__(/*! material-ui-pickers/utils/MuiPickersUtilsProvider */ "./node_modules/material-ui-pickers/utils/MuiPickersUtilsProvider.js");

var _MuiPickersUtilsProvider2 = _interopRequireDefault(_MuiPickersUtilsProvider);

var _momentUtils = __webpack_require__(/*! material-ui-pickers/utils/moment-utils */ "./node_modules/material-ui-pickers/utils/moment-utils.js");

var _momentUtils2 = _interopRequireDefault(_momentUtils);

var _Warning = __webpack_require__(/*! @material-ui/icons/Warning */ "./node_modules/@material-ui/icons/Warning.js");

var _Warning2 = _interopRequireDefault(_Warning);

var _CheckCircle = __webpack_require__(/*! @material-ui/icons/CheckCircle */ "./node_modules/@material-ui/icons/CheckCircle.js");

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//mui


var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
// const debug = require('react-debug');

var SettingProfileInfo = function (_React$Component) {
    _inherits(SettingProfileInfo, _React$Component);

    function SettingProfileInfo(props) {
        _classCallCheck(this, SettingProfileInfo);

        var _this = _possibleConstructorReturn(this, (SettingProfileInfo.__proto__ || Object.getPrototypeOf(SettingProfileInfo)).call(this, props));

        _this.handleBirthday = function (date) {
            var updatedProfileInfo = Object.assign({}, _this.state.userData);
            updatedProfileInfo['birthday'] = date;
            _this.setState({
                userData: updatedProfileInfo,
                modified: true
            });
        };

        _this.handleSnackBarClose = function () {
            _this.setState({
                open: false
            }, function () {
                location.reload();
            });
        };

        _this.state = {
            userData: _this.props.userData,
            changeInfoFailed: false,
            open: false,
            snackBarMsg: "",
            snackBarColor: "",
            modified: false
        };
        return _this;
    }

    // componentDidMount(){
    //     this.setState({
    //         userData: this.props.userData
    //     })
    // }

    _createClass(SettingProfileInfo, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) this.setState({
                userData: this.props.userData
            });
        }
    }, {
        key: 'handleChangeUserInfo',
        value: function handleChangeUserInfo(e) {
            var _this2 = this;

            e.preventDefault();
            if (this.state.userData.fullname !== "" && this.state.userData.description !== "" && this.state.modified) {
                (0, _utils.changeUserInfo)({
                    userId: this.state.userData._id,
                    fullname: this.state.userData.fullname,
                    nickname: this.state.userData.nickname,
                    description: this.state.userData.description,
                    birthday: moment(this.state.userData.birthday).toDate()
                }).then(function (response) {
                    // let userData = response.data;
                    _this2.setState({
                        changeInfoFailed: false,
                        snackBarMsg: "Successfully Changed Info!",
                        snackBarColor: "#2E7D32",
                        open: true,
                        modified: false
                    });
                });
            } else if (this.state.modified) {
                this.setState({
                    changeInfoFailed: true,
                    snackBarColor: "#d32f2f",
                    snackBarMsg: "Your Name and About You can not be empty!",
                    open: true,
                    modified: false
                });
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            e.preventDefault();
            var updatedProfileInfo = Object.assign({}, this.state.userData);
            updatedProfileInfo[e.target.id] = e.target.value;
            this.setState({
                userData: updatedProfileInfo,
                modified: true
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                _MuiPickersUtilsProvider2.default,
                { utils: _momentUtils2.default },
                _react2.default.createElement(
                    'div',
                    { className: 'setting-profile-info' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-7 col-md-offset-1 infos' },
                        _react2.default.createElement(
                            'h4',
                            null,
                            _react2.default.createElement(
                                'span',
                                null,
                                _react2.default.createElement('i', { className: 'fa fa-cog', 'aria-hidden': 'true' })
                            ),
                            ' Settings'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'panel panel-default personal-info-1' },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel-heading' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'row' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'col-md-12' },
                                        _react2.default.createElement(
                                            'h4',
                                            null,
                                            'Personal Info'
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            null,
                                            _react2.default.createElement(
                                                _Snackbar2.default,
                                                {
                                                    autoHideDuration: 4000,
                                                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                                                    open: this.state.open,
                                                    onClose: this.handleSnackBarClose },
                                                _react2.default.createElement(_SnackbarContent2.default, {
                                                    style: {
                                                        backgroundColor: this.state.snackBarColor
                                                    },
                                                    message: _react2.default.createElement(
                                                        'span',
                                                        { style: {
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            } },
                                                        this.state.changeInfoFailed ? _react2.default.createElement(_Warning2.default, { style: { fontSize: '20px', marginRight: '10px' } }) : _react2.default.createElement(_CheckCircle2.default, { style: { fontSize: '20px', marginRight: '10px' } }),
                                                        this.state.snackBarMsg
                                                    )
                                                })
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'row' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'col-md-12' },
                                                _react2.default.createElement(
                                                    _FormControl2.default,
                                                    { style: { width: '100%', marginBottom: '20px' } },
                                                    _react2.default.createElement(
                                                        _InputLabel2.default,
                                                        {
                                                            style: { color: '#607D8B' },
                                                            htmlFor: 'fullname' },
                                                        'Your Name'
                                                    ),
                                                    _react2.default.createElement(_Input2.default, {
                                                        id: 'fullname',
                                                        value: this.state.userData.fullname,
                                                        onChange: function onChange(e) {
                                                            return _this3.handleChange(e);
                                                        }
                                                    })
                                                )
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'row' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'col-md-12' },
                                                _react2.default.createElement(
                                                    _FormControl2.default,
                                                    { style: { width: '100%', marginBottom: '20px' } },
                                                    _react2.default.createElement(
                                                        _InputLabel2.default,
                                                        {
                                                            style: { color: '#607D8B' },
                                                            htmlFor: 'nickname' },
                                                        'NickName'
                                                    ),
                                                    _react2.default.createElement(_Input2.default, {
                                                        id: 'nickname',
                                                        value: this.state.userData.nickname,
                                                        onChange: function onChange(e) {
                                                            return _this3.handleChange(e);
                                                        }
                                                    })
                                                ),
                                                _react2.default.createElement(_materialUiPickers.DatePicker, {
                                                    fullWidth: true,
                                                    format: 'MMM Do YY',
                                                    style: { marginBottom: '20px' },
                                                    value: this.state.userData.birthday,
                                                    onChange: this.handleBirthday,
                                                    label: 'Birthday'
                                                }),
                                                _react2.default.createElement(
                                                    _FormControl2.default,
                                                    { style: { width: '100%', marginBottom: '20px' } },
                                                    _react2.default.createElement(
                                                        _InputLabel2.default,
                                                        {
                                                            style: { color: '#607D8B' },
                                                            htmlFor: 'description' },
                                                        'About you'
                                                    ),
                                                    _react2.default.createElement(_Input2.default, { multiline: true, rows: '4',
                                                        id: 'description',
                                                        value: this.state.userData.description,
                                                        onChange: function onChange(e) {
                                                            return _this3.handleChange(e);
                                                        }
                                                    })
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement('div', null),
                            _react2.default.createElement(
                                'div',
                                { className: 'panel-footer' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'row' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'col-md-12' },
                                        _react2.default.createElement(
                                            'button',
                                            { type: 'button', className: 'btn btn-blue-grey pull-right', name: 'button',
                                                onClick: function onClick(e) {
                                                    return _this3.handleChangeUserInfo(e);
                                                } },
                                            'Save'
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SettingProfileInfo;
}(_react2.default.Component);

exports.default = SettingProfileInfo;

/***/ }),

/***/ "./app/components/containers/settingsysteminfo.jsx":
/*!*********************************************************!*\
  !*** ./app/components/containers/settingsysteminfo.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

__webpack_require__(/*! node_modules/cropperjs/dist/cropper.css */ "./node_modules/cropperjs/dist/cropper.css");

var _reactCropper = __webpack_require__(/*! react-cropper */ "./node_modules/react-cropper/dist/react-cropper.js");

var _reactCropper2 = _interopRequireDefault(_reactCropper);

var _Snackbar = __webpack_require__(/*! @material-ui/core/Snackbar */ "./node_modules/@material-ui/core/Snackbar/index.js");

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = __webpack_require__(/*! @material-ui/core/SnackbarContent */ "./node_modules/@material-ui/core/SnackbarContent/index.js");

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Input = __webpack_require__(/*! @material-ui/core/Input */ "./node_modules/@material-ui/core/Input/index.js");

var _Input2 = _interopRequireDefault(_Input);

var _InputLabel = __webpack_require__(/*! @material-ui/core/InputLabel */ "./node_modules/@material-ui/core/InputLabel/index.js");

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = __webpack_require__(/*! @material-ui/core/FormControl */ "./node_modules/@material-ui/core/FormControl/index.js");

var _FormControl2 = _interopRequireDefault(_FormControl);

var _Dialog = __webpack_require__(/*! @material-ui/core/Dialog */ "./node_modules/@material-ui/core/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/DialogActions/index.js");

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/DialogContent/index.js");

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogTitle = __webpack_require__(/*! @material-ui/core/DialogTitle */ "./node_modules/@material-ui/core/DialogTitle/index.js");

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _Warning = __webpack_require__(/*! @material-ui/icons/Warning */ "./node_modules/@material-ui/icons/Warning.js");

var _Warning2 = _interopRequireDefault(_Warning);

var _CheckCircle = __webpack_require__(/*! @material-ui/icons/CheckCircle */ "./node_modules/@material-ui/icons/CheckCircle.js");

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

var _ExpansionPanel = __webpack_require__(/*! @material-ui/core/ExpansionPanel */ "./node_modules/@material-ui/core/ExpansionPanel/index.js");

var _ExpansionPanel2 = _interopRequireDefault(_ExpansionPanel);

var _ExpandMore = __webpack_require__(/*! @material-ui/icons/ExpandMore */ "./node_modules/@material-ui/icons/ExpandMore.js");

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _ExpansionPanelDetails = __webpack_require__(/*! @material-ui/core/ExpansionPanelDetails */ "./node_modules/@material-ui/core/ExpansionPanelDetails/index.js");

var _ExpansionPanelDetails2 = _interopRequireDefault(_ExpansionPanelDetails);

var _ExpansionPanelSummary = __webpack_require__(/*! @material-ui/core/ExpansionPanelSummary */ "./node_modules/@material-ui/core/ExpansionPanelSummary/index.js");

var _ExpansionPanelSummary2 = _interopRequireDefault(_ExpansionPanelSummary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//mui


var swal = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");
// let debug = require('react-debug');

var SettingSystemInfo = function (_React$Component) {
    _inherits(SettingSystemInfo, _React$Component);

    function SettingSystemInfo(props) {
        _classCallCheck(this, SettingSystemInfo);

        var _this = _possibleConstructorReturn(this, (SettingSystemInfo.__proto__ || Object.getPrototypeOf(SettingSystemInfo)).call(this, props));

        _this.handleRequestHide = function () {
            _this.setState({
                cropperOpen: false,
                img: null
            });
        };

        _this.handleCrop = function () {
            _this.setState({
                cropperOpen: false,
                img: _this.refs.cropper.getCroppedCanvas().toDataURL()
            });
        };

        _this.handleSnackBarClose = function () {
            _this.setState({ open: false });
        };

        _this.state = {
            userData: props.userData,
            oldEmail: "",
            newEmail: "",
            img: null,
            cropperOpen: false,
            snackBarColor: "",
            snackBarMsg: "",
            open: false,
            changeEmailFailed: false,
            oldPass: "",
            newPass: "",
            newPass2: "",
            passwordStrength: 0,
            passwordClass: "progress-bar-danger"
        };
        return _this;
    }

    _createClass(SettingSystemInfo, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) this.setState({
                userData: this.props.userData
            });
        }
    }, {
        key: 'handleOldEmail',
        value: function handleOldEmail(e) {
            e.preventDefault();
            this.setState({ oldEmail: e.target.value });
        }
    }, {
        key: 'handleNewEmail',
        value: function handleNewEmail(e) {
            e.preventDefault();
            this.setState({ newEmail: e.target.value });
        }
    }, {
        key: 'handleOldPass',
        value: function handleOldPass(e) {
            this.setState({ oldPass: e.target.value });
        }
    }, {
        key: 'handleNewPass',
        value: function handleNewPass(e) {
            switch (zxcvbn(e.target.value).score) {
                case 0:
                    this.setState({
                        passwordStrength: 0,
                        newPass: e.target.value,
                        passwordClass: 'progress-bar-danger'
                    });
                    break;
                case 1:
                    this.setState({
                        passwordStrength: 40,
                        newPass: e.target.value,
                        passwordClass: 'progress-bar-danger'
                    });
                    break;
                case 2:
                    this.setState({
                        passwordStrength: 60,
                        newPass: e.target.value,
                        passwordClass: "progress-bar-success"
                    });
                    break;
                case 3:
                    this.setState({
                        passwordStrength: 80,
                        newPass: e.target.value,
                        passwordClass: "progress-bar-success"
                    });
                    break;
                case 4:
                    this.setState({
                        passwordStrength: 100,
                        newPass: e.target.value,
                        passwordClass: "progress-bar-success"
                    });
                    break;
                default:
                    break;
            }
        }
    }, {
        key: 'handleNewPass2',
        value: function handleNewPass2(e) {
            this.setState({ newPass2: e.target.value });
        }

        //1.password is strong, two passwords match

    }, {
        key: 'handleChangePass',
        value: function handleChangePass() {
            if (this.state.oldPass === "" || this.state.newPass === "" || this.state.newPass2 === "") {
                swal('Error', 'Please fill all the fields', 'error');
                return;
            }
            var data = {
                oldPass: this.state.oldPass,
                newPass: this.state.newPass
            };
            if (data.oldPass === data.newPass) {
                swal('Error', "New password can't be the same as the old one", 'error');
                return;
            }
            if (this.state.passwordStrength >= 60 && this.state.newPass === this.state.newPass2) {
                (0, _utils.changePassword)(this.state.userData._id, data).then(function (response) {
                    var err = response.data;
                    if (err) {
                        swal('Error', 'Old password is wrong', 'error');
                    } else {
                        swal('Success', '', 'success');
                    }
                });
            } else {
                if (this.state.passwordStrength < 60) swal('Error', 'Password is too simple', 'error');else swal('Error', "Comfirm your password", 'error');
            }
        }
    }, {
        key: 'handleEmailChange',
        value: function handleEmailChange(e) {
            var _this2 = this;

            e.preventDefault();
            if (this.state.oldEmail !== "" && this.state.newEmail !== "") {
                (0, _utils.changeEmail)(this.state.userData._id, {
                    oldEmail: this.state.oldEmail,
                    newEmail: this.state.newEmail
                }).then(function (response) {
                    var msg = "";
                    var color = "";
                    var invalid = false;
                    if (response.data) {
                        msg = "Old email is wrong or new email has wrong format";
                        color = "#d32f2f";
                        invalid = true;
                    } else {
                        msg = "Successfully Changed  Email";
                        color = "#43A047";
                        invalid = false;
                    }
                    _this2.setState({
                        oldEmail: "",
                        newEmail: "",
                        snackBarColor: color,
                        snackBarMsg: msg,
                        open: true,
                        changeEmailFailed: invalid
                    });
                });
            } else {
                this.setState({
                    oldEmail: "",
                    newEmail: "",
                    snackBarColor: "#d32f2f",
                    snackBarMsg: "Please fill in blanks",
                    open: true,
                    changeEmailFailed: true
                });
            }
        }
    }, {
        key: 'handleFile',
        value: function handleFile(e) {
            var _this3 = this;

            e.preventDefault();
            // Read the first file that the user selected (if the user selected multiple
            // files, we ignore the others).
            var reader = new FileReader();
            var file = e.target.files[0];
            // Called once the browser finishes loading the image.
            if (file.size > 1100000 || !file.type.match('image.*')) {
                var msg = file.size > 1100000 ? "File should be less than 1.1 MB" : "File is not an image file";
                this.setState({
                    snackBarColor: "#d32f2f",
                    snackBarMsg: msg,
                    open: true
                });
                return;
            }
            reader.onload = function (upload) {
                _this3.setState({
                    img: upload.target.result,
                    cropperOpen: true
                });
            };
            reader.readAsDataURL(file);
        }
    }, {
        key: 'handleFileClick',
        value: function handleFileClick(e) {
            e.target.value = null;
        }
    }, {
        key: 'handleAvatarChange',
        value: function handleAvatarChange(e) {
            var _this4 = this;

            e.preventDefault();
            if (this.state.img !== null) {
                (0, _utils.ChangeAvatar)(this.state.userData._id, this.state.img).then(function (response) {
                    var userData = response.data;
                    _this4.setState({ userData: userData });
                    var user = {};
                    user._id = userData._id;
                    user.avatar = userData.avatar;
                    user.friends = userData.friends;
                    user.fullname = userData.fullname;
                    localStorage.setItem('user', JSON.stringify(user));
                    swal({
                        title: "Success!",
                        icon: "success",
                        button: "OK"
                    }).then(function () {
                        _this4.handleRequestHide();
                        location.reload();
                    });
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            return _react2.default.createElement(
                'div',
                { className: 'setting-system-info' },
                this.state.cropperOpen && _react2.default.createElement(
                    _Dialog2.default,
                    {
                        open: this.state.cropperOpen,
                        onClose: this.handleRequestHide },
                    _react2.default.createElement(
                        _DialogTitle2.default,
                        null,
                        'Adjust your avatar image'
                    ),
                    _react2.default.createElement(
                        _DialogContent2.default,
                        null,
                        _react2.default.createElement(_reactCropper2.default, {
                            ref: 'cropper',
                            src: this.state.img,
                            style: { height: 400, width: '100%' },
                            aspectRatio: 1 / 1 })
                    ),
                    _react2.default.createElement(
                        _DialogActions2.default,
                        null,
                        _react2.default.createElement(
                            _Button2.default,
                            { onClick: this.handleRequestHide, color: 'primary' },
                            'Cancel'
                        ),
                        _react2.default.createElement(
                            _Button2.default,
                            { onClick: this.handleCrop, color: 'primary' },
                            'Submit'
                        )
                    )
                ),
                _react2.default.createElement(
                    _Snackbar2.default,
                    {
                        autoHideDuration: 4000,
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        open: this.state.open,
                        onClose: this.handleSnackBarClose },
                    _react2.default.createElement(_SnackbarContent2.default, {
                        style: {
                            backgroundColor: this.state.snackBarColor
                        },
                        message: _react2.default.createElement(
                            'span',
                            { style: {
                                    display: 'flex',
                                    alignItems: 'center'
                                } },
                            this.state.changeEmailFailed ? _react2.default.createElement(_Warning2.default, { style: { fontSize: '20px', marginRight: '10px' } }) : _react2.default.createElement(_CheckCircle2.default, { style: { fontSize: '20px', marginRight: '10px' } }),
                            this.state.snackBarMsg
                        )
                    })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'col-md-3 system-settings' },
                    !('facebookID' in this.state.userData) && _react2.default.createElement(
                        _ExpansionPanel2.default,
                        { style: { boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' } },
                        _react2.default.createElement(
                            _ExpansionPanelSummary2.default,
                            { expandIcon: _react2.default.createElement(_ExpandMore2.default, null) },
                            'Change Password'
                        ),
                        _react2.default.createElement(
                            _ExpansionPanelDetails2.default,
                            null,
                            _react2.default.createElement(
                                'div',
                                { className: 'row' },
                                _react2.default.createElement(
                                    _FormControl2.default,
                                    { fullWidth: true, style: { marginBottom: '20px' } },
                                    _react2.default.createElement(
                                        _InputLabel2.default,
                                        {
                                            style: { color: '#607D8B' },
                                            htmlFor: 'oldpass' },
                                        'Old password'
                                    ),
                                    _react2.default.createElement(_Input2.default, {
                                        type: 'password',
                                        id: 'oldpass',
                                        onChange: function onChange(e) {
                                            return _this5.handleOldPass(e);
                                        }
                                    })
                                ),
                                _react2.default.createElement(
                                    _FormControl2.default,
                                    { fullWidth: true, style: { marginBottom: '20px' } },
                                    _react2.default.createElement(
                                        _InputLabel2.default,
                                        {
                                            style: { color: '#607D8B' },
                                            htmlFor: 'newpass' },
                                        'New Password'
                                    ),
                                    _react2.default.createElement(_Input2.default, {
                                        type: 'password',
                                        id: 'newpass',
                                        onChange: function onChange(e) {
                                            return _this5.handleNewPass(e);
                                        }
                                    })
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'progress', style: { height: '6px', marginTop: '-20px', borderRadius: '0' } },
                                    _react2.default.createElement('div', { className: "progress-bar " + this.state.passwordClass,
                                        role: 'progressbar',
                                        'aria-valuemin': '0',
                                        'aria-valuemax': '100',
                                        style: { width: this.state.passwordStrength + "%" } })
                                ),
                                _react2.default.createElement(
                                    _FormControl2.default,
                                    { fullWidth: true, style: { marginBottom: '20px' } },
                                    _react2.default.createElement(
                                        _InputLabel2.default,
                                        {
                                            style: { color: '#607D8B' },
                                            htmlFor: 'confirmpass' },
                                        'Confirm Password'
                                    ),
                                    _react2.default.createElement(_Input2.default, {
                                        type: 'password',
                                        id: 'confirmpass',
                                        onChange: function onChange(e) {
                                            return _this5.handleNewPass2(e);
                                        }
                                    })
                                ),
                                _react2.default.createElement(
                                    'button',
                                    { type: 'button', onClick: function onClick() {
                                            return _this5.handleChangePass();
                                        },
                                        className: 'btn btn-blue-grey pull-right', name: 'button' },
                                    'Submit'
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        _ExpansionPanel2.default,
                        { style: { boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' } },
                        _react2.default.createElement(
                            _ExpansionPanelSummary2.default,
                            { expandIcon: _react2.default.createElement(_ExpandMore2.default, null) },
                            'Change Email'
                        ),
                        _react2.default.createElement(
                            _ExpansionPanelDetails2.default,
                            null,
                            _react2.default.createElement(
                                'div',
                                { className: 'row' },
                                _react2.default.createElement(
                                    _FormControl2.default,
                                    { fullWidth: true, style: { marginBottom: '20px' } },
                                    _react2.default.createElement(
                                        _InputLabel2.default,
                                        {
                                            style: { color: '#607D8B' },
                                            htmlFor: 'oldemail' },
                                        'Old Email'
                                    ),
                                    _react2.default.createElement(_Input2.default, {
                                        id: 'oldemail',
                                        value: this.state.oldEmail,
                                        onChange: function onChange(e) {
                                            return _this5.handleOldEmail(e);
                                        }
                                    })
                                ),
                                _react2.default.createElement(
                                    _FormControl2.default,
                                    { fullWidth: true, style: { marginBottom: '20px' } },
                                    _react2.default.createElement(
                                        _InputLabel2.default,
                                        {
                                            style: { color: '#607D8B' },
                                            htmlFor: 'newemail' },
                                        'New Email'
                                    ),
                                    _react2.default.createElement(_Input2.default, {
                                        id: 'newemail',
                                        value: this.state.newEmail,
                                        onChange: function onChange(e) {
                                            return _this5.handleNewEmail(e);
                                        }
                                    })
                                ),
                                _react2.default.createElement(
                                    'button',
                                    { type: 'button', className: 'btn btn-blue-grey pull-right', name: 'button', onClick: function onClick(e) {
                                            return _this5.handleEmailChange(e);
                                        } },
                                    'Submit'
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        _ExpansionPanel2.default,
                        { style: { boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' } },
                        _react2.default.createElement(
                            _ExpansionPanelSummary2.default,
                            { expandIcon: _react2.default.createElement(_ExpandMore2.default, null) },
                            'Change Avatar'
                        ),
                        _react2.default.createElement(
                            _ExpansionPanelDetails2.default,
                            null,
                            _react2.default.createElement(
                                'div',
                                { className: 'row' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'col-md-8 col-md-offset-3' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'btn-group', role: 'group' },
                                        _react2.default.createElement(
                                            'label',
                                            { htmlFor: 'pic' },
                                            _react2.default.createElement(
                                                'a',
                                                null,
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'thumbnail', style: { border: "1px dashed black", width: "100px", height: "120px" } },
                                                    _react2.default.createElement('i', { className: 'fa fa-camera', 'aria-hidden': 'true' }),
                                                    _react2.default.createElement('img', { src: this.state.img, className: (0, _utils.hideElement)(this.state.cropperOpen),
                                                        width: '100px', height: '100px' })
                                                )
                                            )
                                        ),
                                        _react2.default.createElement('input', { type: 'file', accept: '.jpg,.jpeg,.png,.gif', id: 'pic', onClick: function onClick(e) {
                                                return _this5.handleFileClick(e);
                                            },
                                            onChange: function onChange(e) {
                                                return _this5.handleFile(e);
                                            } })
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'col-md-12' },
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', className: 'btn btn-blue-grey pull-right', name: 'button', onClick: function onClick(e) {
                                                return _this5.handleAvatarChange(e);
                                            } },
                                        'Submit'
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SettingSystemInfo;
}(_react2.default.Component);

exports.default = SettingSystemInfo;

/***/ }),

/***/ "./app/components/presentations/activityCommentThread.jsx":
/*!****************************************************************!*\
  !*** ./app/components/presentations/activityCommentThread.jsx ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _ = __webpack_require__(/*! . */ "./app/components/presentations/index.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActivityCommentThread = function (_React$Component) {
    _inherits(ActivityCommentThread, _React$Component);

    function ActivityCommentThread(props) {
        _classCallCheck(this, ActivityCommentThread);

        return _possibleConstructorReturn(this, (ActivityCommentThread.__proto__ || Object.getPrototypeOf(ActivityCommentThread)).call(this, props));
    }

    _createClass(ActivityCommentThread, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-10 col-md-12 col-sm-12 col-xs-12 col-lg-offset-1' },
                        _react2.default.createElement(
                            'div',
                            { className: 'panel panel-default body-comments' },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel-heading' },
                                _react2.default.createElement(
                                    'font',
                                    { style: { color: "grey", fontSize: "20px" } },
                                    'Comments (',
                                    this.props.count,
                                    ')'
                                ),
                                _react2.default.createElement(_.ActivityDetailCommentEntry, { user: this.props.user, avatar: this.props.avatar, onPost: this.props.onPost }),
                                _react2.default.createElement('hr', null),
                                _react2.default.createElement(
                                    _List2.default,
                                    null,
                                    _react2.default.Children.map(this.props.children, function (child) {
                                        return child;
                                    })
                                ),
                                this.props.loadMore && _react2.default.createElement(
                                    _Button2.default,
                                    { fullWidth: true, disabled: !this.props.loadMore || this.props.count === 0 || this.props.count === this.props.children.length, onClick: function onClick() {
                                            return _this2.props.onLoadComments();
                                        } },
                                    'Load Comments'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ActivityCommentThread;
}(_react2.default.Component);

exports.default = ActivityCommentThread;

/***/ }),

/***/ "./app/components/presentations/activityDetailCommentEntry.jsx":
/*!*********************************************************************!*\
  !*** ./app/components/presentations/activityDetailCommentEntry.jsx ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActivityDetailCommentEntry = function (_React$Component) {
    _inherits(ActivityDetailCommentEntry, _React$Component);

    function ActivityDetailCommentEntry(props) {
        _classCallCheck(this, ActivityDetailCommentEntry);

        var _this = _possibleConstructorReturn(this, (ActivityDetailCommentEntry.__proto__ || Object.getPrototypeOf(ActivityDetailCommentEntry)).call(this, props));

        _this.state = {
            text: ""
        };
        return _this;
    }

    _createClass(ActivityDetailCommentEntry, [{
        key: 'handleChange',
        value: function handleChange(e) {
            e.preventDefault();
            this.setState({ text: e.target.value });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();
            if (this.state.text.trim() !== "") {
                this.setState({ text: "" });
                this.props.onPost(this.state.text);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this,
                _React$createElement;

            return _react2.default.createElement(
                'div',
                { className: 'panel-heading' },
                _react2.default.createElement(
                    'div',
                    { className: 'media' },
                    _react2.default.createElement(
                        'div',
                        { className: 'media-left' },
                        _react2.default.createElement(
                            _Link2.default,
                            { to: "/profile/" + this.props.user },
                            _react2.default.createElement('img', { className: 'media-object', src: this.props.avatar, height: '45px', style: { marginTop: '1px' } })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'media-body' },
                        _react2.default.createElement('textarea', { name: 'name', rows: '8', cols: '40', placeholder: 'Post your comments', value: this.state.text, onChange: function onChange(e) {
                                return _this2.handleChange(e);
                            } }),
                        _react2.default.createElement(
                            'button',
                            (_React$createElement = { type: 'button', className: 'btn btn-blue-grey pull-right waves-effect waves-light' }, _defineProperty(_React$createElement, 'type', 'button'), _defineProperty(_React$createElement, 'name', 'button'), _defineProperty(_React$createElement, 'onClick', function onClick(e) {
                                return _this2.handleSubmit(e);
                            }), _React$createElement),
                            'Post'
                        )
                    )
                )
            );
        }
    }]);

    return ActivityDetailCommentEntry;
}(_react2.default.Component);

exports.default = ActivityDetailCommentEntry;

/***/ }),

/***/ "./app/components/presentations/activityFeedItem.jsx":
/*!***********************************************************!*\
  !*** ./app/components/presentations/activityFeedItem.jsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _Card = __webpack_require__(/*! @material-ui/core/Card */ "./node_modules/@material-ui/core/Card/index.js");

var _Card2 = _interopRequireDefault(_Card);

var _CardHeader = __webpack_require__(/*! @material-ui/core/CardHeader */ "./node_modules/@material-ui/core/CardHeader/index.js");

var _CardHeader2 = _interopRequireDefault(_CardHeader);

var _CardMedia = __webpack_require__(/*! @material-ui/core/CardMedia */ "./node_modules/@material-ui/core/CardMedia/index.js");

var _CardMedia2 = _interopRequireDefault(_CardMedia);

var _CardContent = __webpack_require__(/*! @material-ui/core/CardContent */ "./node_modules/@material-ui/core/CardContent/index.js");

var _CardContent2 = _interopRequireDefault(_CardContent);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Chip = __webpack_require__(/*! @material-ui/core/Chip */ "./node_modules/@material-ui/core/Chip/index.js");

var _Chip2 = _interopRequireDefault(_Chip);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
// var debug = require('react-debug');

var ActivityFeedItem = function (_React$Component) {
    _inherits(ActivityFeedItem, _React$Component);

    function ActivityFeedItem(props) {
        _classCallCheck(this, ActivityFeedItem);

        var _this = _possibleConstructorReturn(this, (ActivityFeedItem.__proto__ || Object.getPrototypeOf(ActivityFeedItem)).call(this, props));

        _this.state = props.data;
        return _this;
    }

    _createClass(ActivityFeedItem, [{
        key: 'render',
        value: function render() {
            var startTime = moment(this.state.startTime).calendar();
            var endTime = moment(this.state.endTime).calendar();
            return _react2.default.createElement(
                _Card2.default,
                { style: { marginBottom: '30px', boxShadow: '0 10px 28px 0 rgba(137, 157, 197, .12)' } },
                _react2.default.createElement(_CardHeader2.default, {
                    style: { fontFamily: 'inherit' },
                    title: this.state.author.fullname,
                    subheader: this.state.author.description,
                    avatar: _react2.default.createElement(
                        _Link2.default,
                        { to: "/profile/" + this.state.author._id },
                        _react2.default.createElement(_Avatar2.default, { src: this.state.author.avatar })
                    )
                }),
                _react2.default.createElement(
                    _Link2.default,
                    { to: "/activityDetail/" + this.state._id },
                    _react2.default.createElement(_CardMedia2.default, { image: this.state.img,
                        style: { height: '400px' }
                    })
                ),
                _react2.default.createElement(
                    _CardContent2.default,
                    null,
                    _react2.default.createElement(
                        'div',
                        { className: 'row', style: { marginBottom: '20px' } },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-12' },
                            _react2.default.createElement(
                                'div',
                                { className: 'row', style: { marginTop: '10px' } },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'col-md-12' },
                                    _react2.default.createElement(_Chip2.default, {
                                        avatar: _react2.default.createElement(
                                            _Avatar2.default,
                                            null,
                                            _react2.default.createElement(_Icon2.default, { style: { fontSize: '20px' }, className: 'fas fa-location-arrow' })
                                        ),
                                        label: this.state.location
                                    }),
                                    _react2.default.createElement(_Chip2.default, { className: 'pull-right', style: {
                                            marginRight: '10px',
                                            backgroundColor: "#607D8B", color: 'white'
                                        },
                                        label: this.state.type })
                                )
                            ),
                            _react2.default.createElement(
                                'h3',
                                null,
                                this.state.title
                            ),
                            _react2.default.createElement(
                                'h4',
                                null,
                                startTime + "--" + endTime
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: { marginBottom: '10px' } },
                        this.state.description
                    )
                )
            );
        }
    }]);

    return ActivityFeedItem;
}(_react2.default.Component);

exports.default = ActivityFeedItem;

/***/ }),

/***/ "./app/components/presentations/chatentry.jsx":
/*!****************************************************!*\
  !*** ./app/components/presentations/chatentry.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _GridList = __webpack_require__(/*! @material-ui/core/GridList */ "./node_modules/@material-ui/core/GridList/index.js");

var _GridList2 = _interopRequireDefault(_GridList);

var _GridListTile = __webpack_require__(/*! @material-ui/core/GridListTile */ "./node_modules/@material-ui/core/GridListTile/index.js");

var _GridListTile2 = _interopRequireDefault(_GridListTile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var emojione = require('emojione');
var swal = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");

var ChatEntry = function (_React$Component) {
    _inherits(ChatEntry, _React$Component);

    function ChatEntry(props) {
        _classCallCheck(this, ChatEntry);

        var _this = _possibleConstructorReturn(this, (ChatEntry.__proto__ || Object.getPrototypeOf(ChatEntry)).call(this, props));

        _this.state = {
            text: "",
            imgs: []
        };
        return _this;
    }

    _createClass(ChatEntry, [{
        key: 'handleChange',
        value: function handleChange(e) {
            e.preventDefault();
            this.setState({ text: emojione.shortnameToUnicode(e.target.value) });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();
            if (e.key === "Enter" || e.button === 0) {
                if (this.state.text.trim() !== "" || this.state.imgs.length != 0) {
                    this.props.onPost(this.state.text.trim(), this.state.imgs);
                    this.setState({ text: "", imgs: [] });
                }
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            $('#chattext').jemoji({
                folder: 'emojis/',
                btn: $('#openchatemoji'),
                container: $('#chattext').parent().parent(),
                navigation: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'panel-footer' },
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-10 col-xs-10 col-sm-10' },
                        _react2.default.createElement('textarea', { id: 'chattext', className: 'form-control msg nohover non-active', name: 'name', rows: '5', value: this.state.text,
                            onChange: function onChange(e) {
                                return _this2.handleChange(e);
                            }, onFocus: function onFocus(e) {
                                return _this2.handleChange(e);
                            }, cols: '40', placeholder: 'please type text',
                            onKeyUp: function onKeyUp(e) {
                                return _this2.handleSubmit(e);
                            } }),
                        _react2.default.createElement(
                            'div',
                            { className: 'btn-group', role: 'group', 'aria-label': '...' },
                            _react2.default.createElement(
                                'label',
                                { htmlFor: 'pics', style: { marginRight: '20px' } },
                                _react2.default.createElement(
                                    'a',
                                    null,
                                    _react2.default.createElement('i', { className: 'fa fa-camera', 'aria-hidden': 'true' })
                                )
                            ),
                            _react2.default.createElement('input', { type: 'file', accept: '.jpg,.jpeg,.png,.gif', id: 'pics', multiple: true, onChange: function onChange(e) {
                                    return (0, _utils.uploadImg)(e, function () {
                                        swal("Error", "Only 3 images at a time please", "error");
                                    }, function () {
                                        swal("Error", "File size is too large", "error");
                                    }, function () {
                                        swal("Error", "File type is wrong", "error");
                                    }, function (res) {
                                        var imgs = _this2.state.imgs;
                                        imgs.push(res.target.result);
                                        _this2.setState({
                                            imgs: imgs
                                        });
                                    });
                                } }),
                            _react2.default.createElement(
                                'a',
                                { id: 'openchatemoji' },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    _react2.default.createElement('i', { className: 'far fa-smile', 'aria-hidden': 'true' })
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-2 col-sm-2 col-xs-2 send' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-default btn-blue-grey pull-right', name: 'button',
                                onClick: function onClick(e) {
                                    return _this2.handleSubmit(e);
                                } },
                            'Send'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        _GridList2.default,
                        { cellHeight: 160, cols: 3 },
                        this.state.imgs.map(function (img, idx) {
                            return _react2.default.createElement(
                                _GridListTile2.default,
                                { key: idx },
                                _react2.default.createElement('img', { src: img })
                            );
                        })
                    )
                )
            );
        }
    }]);

    return ChatEntry;
}(_react2.default.Component);

exports.default = ChatEntry;

/***/ }),

/***/ "./app/components/presentations/chatnavchatitem.jsx":
/*!**********************************************************!*\
  !*** ./app/components/presentations/chatnavchatitem.jsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = __webpack_require__(/*! React */ "./node_modules/react/index.js");

var _React2 = _interopRequireDefault(_React);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Divider = __webpack_require__(/*! @material-ui/core/Divider */ "./node_modules/@material-ui/core/Divider/index.js");

var _Divider2 = _interopRequireDefault(_Divider);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemSecondaryAction = __webpack_require__(/*! @material-ui/core/ListItemSecondaryAction */ "./node_modules/@material-ui/core/ListItemSecondaryAction/index.js");

var _ListItemSecondaryAction2 = _interopRequireDefault(_ListItemSecondaryAction);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Badge = __webpack_require__(/*! @material-ui/core/Badge */ "./node_modules/@material-ui/core/Badge/index.js");

var _Badge2 = _interopRequireDefault(_Badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');

var ChatNavChatItem = function (_React$Component) {
    _inherits(ChatNavChatItem, _React$Component);

    function ChatNavChatItem(props) {
        _classCallCheck(this, ChatNavChatItem);

        var _this = _possibleConstructorReturn(this, (ChatNavChatItem.__proto__ || Object.getPrototypeOf(ChatNavChatItem)).call(this, props));

        _this.state = {
            online: false
        };
        return _this;
    }

    _createClass(ChatNavChatItem, [{
        key: 'handleClick',
        value: function handleClick(e) {
            e.preventDefault();
            this.props.switchUser(this.props.data);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var icon = this.props.data.online ? _React2.default.createElement(_Icon2.default, { className: 'fas fa-circle', style: { color: 'green', fontSize: '20px' } }) : _React2.default.createElement(_Icon2.default, { className: 'far fa-circle', style: { fontSize: '20px' } });
            var lastmessage = this.props.messageData.lastmessage;
            var messagePreview = "";
            if (lastmessage !== undefined && Object.keys(lastmessage).length !== 0) {
                if (lastmessage.text.length === 0 && lastmessage.imgs.length !== 0) {
                    messagePreview = "[Image]";
                } else if (lastmessage.text.length < 60) {
                    messagePreview = lastmessage.text;
                } else {
                    messagePreview = lastmessage.text.substring(0, 60) + '...';
                }
            }

            var unreadCount = this.props.messageData.unread[this.props.currentUser];

            return _React2.default.createElement(
                'div',
                null,
                _React2.default.createElement(
                    _ListItem2.default,
                    { button: true, onClick: function onClick(e) {
                            return _this2.handleClick(e);
                        },
                        style: {
                            alignItems: "flex-start"
                        } },
                    _React2.default.createElement(
                        _ListItemAvatar2.default,
                        {
                            style: {
                                marginTop: "5px"
                            } },
                        unreadCount !== undefined && unreadCount !== 0 ? _React2.default.createElement(
                            _Badge2.default,
                            { badgeContent: unreadCount, color: 'secondary' },
                            _React2.default.createElement(_Avatar2.default, { src: this.props.data.avatar })
                        ) : _React2.default.createElement(_Avatar2.default, { src: this.props.data.avatar })
                    ),
                    _React2.default.createElement(_ListItemText2.default, {
                        primary: this.props.data.fullname,
                        secondary: _React2.default.createElement(
                            'span',
                            null,
                            messagePreview
                        )
                    }),
                    _React2.default.createElement(
                        _ListItemSecondaryAction2.default,
                        { style: { marginRight: '10px' } },
                        icon
                    )
                ),
                _React2.default.createElement(_Divider2.default, { inset: true })
            );
        }
    }]);

    return ChatNavChatItem;
}(_React2.default.Component);

exports.default = ChatNavChatItem;

/***/ }),

/***/ "./app/components/presentations/index.js":
/*!***********************************************!*\
  !*** ./app/components/presentations/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChatNavChatItem = exports.ChatEntry = exports.PostFeedItem = exports.PostEntry = exports.PostCommentThread = exports.PostCommentEntry = exports.ActivityCommentThread = exports.ActivityDetailCommentEntry = exports.ActivityFeedItem = undefined;

var _activityFeedItem = __webpack_require__(/*! ./activityFeedItem */ "./app/components/presentations/activityFeedItem.jsx");

var _activityFeedItem2 = _interopRequireDefault(_activityFeedItem);

var _activityDetailCommentEntry = __webpack_require__(/*! ./activityDetailCommentEntry */ "./app/components/presentations/activityDetailCommentEntry.jsx");

var _activityDetailCommentEntry2 = _interopRequireDefault(_activityDetailCommentEntry);

var _activityCommentThread = __webpack_require__(/*! ./activityCommentThread */ "./app/components/presentations/activityCommentThread.jsx");

var _activityCommentThread2 = _interopRequireDefault(_activityCommentThread);

var _postCommentEntry = __webpack_require__(/*! ./postCommentEntry */ "./app/components/presentations/postCommentEntry.jsx");

var _postCommentEntry2 = _interopRequireDefault(_postCommentEntry);

var _postCommentThread = __webpack_require__(/*! ./postCommentThread */ "./app/components/presentations/postCommentThread.jsx");

var _postCommentThread2 = _interopRequireDefault(_postCommentThread);

var _postEntry = __webpack_require__(/*! ./postEntry */ "./app/components/presentations/postEntry.jsx");

var _postEntry2 = _interopRequireDefault(_postEntry);

var _postFeedItem = __webpack_require__(/*! ./postFeedItem */ "./app/components/presentations/postFeedItem.jsx");

var _postFeedItem2 = _interopRequireDefault(_postFeedItem);

var _chatentry = __webpack_require__(/*! ./chatentry */ "./app/components/presentations/chatentry.jsx");

var _chatentry2 = _interopRequireDefault(_chatentry);

var _chatnavchatitem = __webpack_require__(/*! ./chatnavchatitem */ "./app/components/presentations/chatnavchatitem.jsx");

var _chatnavchatitem2 = _interopRequireDefault(_chatnavchatitem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Chat presentations


//import Post presentations


//import activityDetail presentations
exports.ActivityFeedItem = _activityFeedItem2.default;
exports.ActivityDetailCommentEntry = _activityDetailCommentEntry2.default;
exports.ActivityCommentThread = _activityCommentThread2.default;
exports.PostCommentEntry = _postCommentEntry2.default;
exports.PostCommentThread = _postCommentThread2.default;
exports.PostEntry = _postEntry2.default;
exports.PostFeedItem = _postFeedItem2.default;
exports.ChatEntry = _chatentry2.default;
exports.ChatNavChatItem = _chatnavchatitem2.default; //import Activity presentations

/***/ }),

/***/ "./app/components/presentations/postCommentEntry.jsx":
/*!***********************************************************!*\
  !*** ./app/components/presentations/postCommentEntry.jsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PostCommentEntry = function (_React$Component) {
    _inherits(PostCommentEntry, _React$Component);

    function PostCommentEntry(props) {
        _classCallCheck(this, PostCommentEntry);

        var _this = _possibleConstructorReturn(this, (PostCommentEntry.__proto__ || Object.getPrototypeOf(PostCommentEntry)).call(this, props));

        _this.state = {
            text: ""
        };
        return _this;
    }

    _createClass(PostCommentEntry, [{
        key: "handleChange",
        value: function handleChange(e) {
            e.preventDefault();
            this.setState({ text: e.target.value });
        }
    }, {
        key: "handleSubmit",
        value: function handleSubmit(e) {
            e.preventDefault();
            if (this.state.text.trim() !== "") {
                this.setState({ text: "" });
                this.props.onPostComment(this.state.text);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement("textarea", { name: "name", rows: "8", cols: "40", placeholder: "Write a comment", value: this.state.text, onChange: function onChange(e) {
                        return _this2.handleChange(e);
                    } }),
                _react2.default.createElement(
                    "button",
                    { className: "btn btn-blue-grey pull-right", type: "button", name: "button", onClick: function onClick(e) {
                            return _this2.handleSubmit(e);
                        } },
                    "Submit"
                )
            );
        }
    }]);

    return PostCommentEntry;
}(_react2.default.Component);

exports.default = PostCommentEntry;

/***/ }),

/***/ "./app/components/presentations/postCommentThread.jsx":
/*!************************************************************!*\
  !*** ./app/components/presentations/postCommentThread.jsx ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _ = __webpack_require__(/*! . */ "./app/components/presentations/index.js");

var _Button = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/Button/index.js");

var _Button2 = _interopRequireDefault(_Button);

var _List = __webpack_require__(/*! @material-ui/core/List */ "./node_modules/@material-ui/core/List/index.js");

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');

var PostCommentThread = function (_React$Component) {
    _inherits(PostCommentThread, _React$Component);

    function PostCommentThread() {
        _classCallCheck(this, PostCommentThread);

        return _possibleConstructorReturn(this, (PostCommentThread.__proto__ || Object.getPrototypeOf(PostCommentThread)).apply(this, arguments));
    }

    _createClass(PostCommentThread, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _List2.default,
                    null,
                    this.props.children
                ),
                _react2.default.createElement(
                    _Button2.default,
                    { fullWidth: true, disabled: !this.props.loadMore || this.props.commentsCount === 0 || this.props.children.length === this.props.commentsCount, onClick: function onClick() {
                            return _this2.props.loadCommentClick();
                        } },
                    'Load comments'
                ),
                _react2.default.createElement(_.PostCommentEntry, { onPostComment: this.props.onPostComment })
            );
        }
    }]);

    return PostCommentThread;
}(_react2.default.Component);

exports.default = PostCommentThread;

/***/ }),

/***/ "./app/components/presentations/postEntry.jsx":
/*!****************************************************!*\
  !*** ./app/components/presentations/postEntry.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var debug = require('react-debug');
// var emojione = require('emojione');
var swal = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");

var PostEntry = function (_React$Component) {
    _inherits(PostEntry, _React$Component);

    function PostEntry(props) {
        _classCallCheck(this, PostEntry);

        var _this = _possibleConstructorReturn(this, (PostEntry.__proto__ || Object.getPrototypeOf(PostEntry)).call(this, props));

        _this.state = {
            text: "",
            img: [],
            fileTooLarge: false,
            fileWrongType: false,
            tooManyFiles: false
        };
        return _this;
    }

    _createClass(PostEntry, [{
        key: 'handleChange',
        value: function handleChange(e) {
            e.preventDefault();
            this.setState({ text: emojione.shortnameToUnicode(e.target.value) });
        }
    }, {
        key: 'handlePost',
        value: function handlePost(e) {
            e.preventDefault();
            var text = this.state.text.trim();
            if (text !== "") {
                this.props.onPost(text, this.state.img);
                this.setState({
                    text: "",
                    img: []
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            $('#inputtext').jemoji({
                folder: 'emojis/',
                btn: $('#openEmoji'),
                container: $('#inputtext').parent()
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'panel panel-default post-send' },
                _react2.default.createElement(
                    'div',
                    { className: 'panel-heading' },
                    _react2.default.createElement(
                        'div',
                        { className: 'media' },
                        _react2.default.createElement(
                            'div',
                            { className: 'media-left' },
                            _react2.default.createElement(
                                _Link2.default,
                                { to: "/profile/" + this.props.userData._id },
                                _react2.default.createElement('img', { className: 'media-object', src: this.props.userData.avatar, height: '50px', alt: '...' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'media-body' },
                            _react2.default.createElement('textarea', { name: 'name', id: 'inputtext', rows: '8', cols: '40', placeholder: 'What\'s on your mind',
                                value: this.state.text, onChange: function onChange(e) {
                                    return _this2.handleChange(e);
                                }, onFocus: function onFocus(e) {
                                    return _this2.handleChange(e);
                                } }),
                            _react2.default.createElement(
                                'div',
                                { className: 'btn-group', role: 'group', 'aria-label': '...' },
                                _react2.default.createElement(
                                    'label',
                                    { htmlFor: 'pic' },
                                    _react2.default.createElement(
                                        'a',
                                        null,
                                        _react2.default.createElement('i', { className: 'fa fa-camera', 'aria-hidden': 'true' })
                                    )
                                ),
                                _react2.default.createElement('input', { type: 'file', accept: '.jpg,.jpeg,.png,.gif', id: 'pic', onChange: function onChange(e) {
                                        return (0, _utils.uploadImg)(e, function () {
                                            swal("Error", "Only 3 images at a time please", "error");
                                        }, function () {
                                            swal("Error", "File size is too large", "error");
                                        }, function () {
                                            swal("Error", "File type is wrong", "error");
                                        }, function (res) {
                                            var img = _this2.state.img;
                                            img.push(res.target.result);
                                            _this2.setState({
                                                img: img
                                            });
                                        });
                                    }, multiple: true }),
                                _react2.default.createElement(
                                    'a',
                                    { id: 'openEmoji' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        _react2.default.createElement('i', { className: 'far fa-smile', 'aria-hidden': 'true' })
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'button',
                                { type: 'button', className: 'btn btn-blue-grey pull-right', name: 'button', onClick: function onClick(e) {
                                        return _this2.handlePost(e);
                                    } },
                                'Submit'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'media-footer' },
                            _react2.default.createElement(
                                'div',
                                { className: 'postImg' },
                                this.state.img.map(function (element, index) {
                                    return _react2.default.createElement(
                                        'a',
                                        { key: index, style: { "width": "calc(" + 100 / (_this2.state.img.length > 2 ? 2 : _this2.state.img.length) + "% - 4px)" } },
                                        _react2.default.createElement('img', { src: element, alt: '', style: { 'width': "100%" } })
                                    );
                                })
                            )
                        )
                    )
                )
            );
        }
    }]);

    return PostEntry;
}(_react2.default.Component);

exports.default = PostEntry;

/***/ }),

/***/ "./app/components/presentations/postFeedItem.jsx":
/*!*******************************************************!*\
  !*** ./app/components/presentations/postFeedItem.jsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _Link = __webpack_require__(/*! react-router-dom/Link */ "./node_modules/react-router-dom/Link.js");

var _Link2 = _interopRequireDefault(_Link);

var _reactImages = __webpack_require__(/*! react-images */ "./node_modules/react-images/lib/Lightbox.js");

var _reactImages2 = _interopRequireDefault(_reactImages);

var _ = __webpack_require__(/*! . */ "./app/components/presentations/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _Checkbox = __webpack_require__(/*! @material-ui/core/Checkbox */ "./node_modules/@material-ui/core/Checkbox/index.js");

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _FormControlLabel = __webpack_require__(/*! @material-ui/core/FormControlLabel */ "./node_modules/@material-ui/core/FormControlLabel/index.js");

var _FormControlLabel2 = _interopRequireDefault(_FormControlLabel);

var _Icon = __webpack_require__(/*! @material-ui/core/Icon */ "./node_modules/@material-ui/core/Icon/index.js");

var _Icon2 = _interopRequireDefault(_Icon);

var _ListItem = __webpack_require__(/*! @material-ui/core/ListItem */ "./node_modules/@material-ui/core/ListItem/index.js");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemText = __webpack_require__(/*! @material-ui/core/ListItemText */ "./node_modules/@material-ui/core/ListItemText/index.js");

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Avatar = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/Avatar/index.js");

var _Avatar2 = _interopRequireDefault(_Avatar);

var _ListItemAvatar = __webpack_require__(/*! @material-ui/core/ListItemAvatar */ "./node_modules/@material-ui/core/ListItemAvatar/index.js");

var _ListItemAvatar2 = _interopRequireDefault(_ListItemAvatar);

var _GridList = __webpack_require__(/*! @material-ui/core/GridList */ "./node_modules/@material-ui/core/GridList/index.js");

var _GridList2 = _interopRequireDefault(_GridList);

var _GridListTile = __webpack_require__(/*! @material-ui/core/GridListTile */ "./node_modules/@material-ui/core/GridListTile/index.js");

var _GridListTile2 = _interopRequireDefault(_GridListTile);

var _Divider = __webpack_require__(/*! @material-ui/core/Divider */ "./node_modules/@material-ui/core/Divider/index.js");

var _Divider2 = _interopRequireDefault(_Divider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");

moment.updateLocale('en', {
    longDateFormat: {
        LT: "h:mm:ss A"
    }
});

var PostFeedItem = function (_React$Component) {
    _inherits(PostFeedItem, _React$Component);

    function PostFeedItem(props) {
        _classCallCheck(this, PostFeedItem);

        var _this = _possibleConstructorReturn(this, (PostFeedItem.__proto__ || Object.getPrototypeOf(PostFeedItem)).call(this, props));

        _this.state = {
            data: props.data,
            comments: [],
            isOpen: false,
            currentImage: 0,
            loadMore: true
        };
        return _this;
    }

    _createClass(PostFeedItem, [{
        key: 'handlePostComment',
        value: function handlePostComment(comment) {
            var _this2 = this;

            (0, _utils.postComment)(this.state.data._id, this.props.currentUser, comment).then(function (response) {
                var newFeedItem = response.data;
                _this2.setState({
                    data: newFeedItem
                }, function () {
                    _this2.loadComments(true);
                });
            });
        }
    }, {
        key: 'handleImgClick',
        value: function handleImgClick(index, e) {
            e.preventDefault();
            this.setState({
                currentImage: index,
                isOpen: true
            });
        }
    }, {
        key: 'closeLightbox',
        value: function closeLightbox(e) {
            e.preventDefault();
            this.setState({
                isOpen: false
            });
        }
    }, {
        key: 'handleLikeClick',
        value: function handleLikeClick(e) {
            var _this3 = this;

            e.preventDefault();

            if (e.button === 0) {
                var handler = function handler(likeCounter) {
                    _this3.state.data.likeCounter = likeCounter;
                    var newData = _this3.state.data;
                    _this3.setState({
                        data: newData
                    });
                };

                if (!(0, _utils.didUserLike)(this.state.data.likeCounter, this.props.currentUser)) {
                    (0, _utils.likePost)(this.state.data._id, this.props.currentUser).then(function (response) {
                        return handler(response.data);
                    });
                } else {
                    (0, _utils.unLikePost)(this.state.data._id, this.props.currentUser).then(function (response) {
                        return handler(response.data);
                    });
                }
            }
        }
    }, {
        key: 'loadComments',
        value: function loadComments(justPosted) {
            var _this4 = this;

            var date = justPosted || this.state.comments.length == 0 ? new Date().getTime() : this.state.comments[this.state.comments.length - 1].postDate;

            (0, _utils.getPostComments)(this.state.data._id, date).then(function (response) {
                var load = response.data.length > 0;
                var postComments = justPosted ? response.data : _this4.state.comments.concat(response.data);
                _this4.setState({
                    loadMore: load,
                    comments: postComments
                });
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
                this.setState({
                    data: this.props.data,
                    comments: []
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var data = this.state.data;
            var contents;
            switch (data.type) {
                case "general":
                    contents = data.contents;
                    break;
                default:
                    throw new Error("Unknown FeedItem: " + data.type);
            }

            var imgs = [];
            var images = [];
            var display = [];
            imgs = contents.img;
            imgs.map(function (obj, i) {
                display.push(_react2.default.createElement(
                    _GridListTile2.default,
                    { key: i },
                    _react2.default.createElement(
                        'a',
                        { onClick: function onClick(e) {
                                return _this5.handleImgClick(i, e);
                            } },
                        _react2.default.createElement('img', { src: obj, style: { 'width': "100%" } })
                    )
                ));
                images.push({
                    src: obj,
                    caption: contents.text
                });
            });

            var time = moment(contents.postDate).calendar();

            if (new Date().getTime() - contents.postDate <= 3600000) time = moment(contents.postDate).fromNow();

            return _react2.default.createElement(
                'div',
                { className: 'panel panel-default' },
                _react2.default.createElement(
                    'div',
                    { className: 'panel-heading' },
                    _react2.default.createElement(
                        'div',
                        { className: 'media' },
                        _react2.default.createElement(
                            'div',
                            { className: 'media-left' },
                            _react2.default.createElement(
                                _Link2.default,
                                { to: "/profile/" + contents.author._id },
                                _react2.default.createElement('img', { className: 'media-object', src: contents.author.avatar, height: '50px', alt: '...' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'media-body' },
                            _react2.default.createElement(
                                'h4',
                                { className: 'media-heading' },
                                contents.author.fullname,
                                ' '
                            ),
                            _react2.default.createElement(
                                'span',
                                { style: { "fontSize": "12px" } },
                                time
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'panel-body' },
                    _react2.default.createElement(
                        'p',
                        null,
                        contents.text
                    ),
                    display.length > 0 && _react2.default.createElement(_Divider2.default, { light: true }),
                    _react2.default.createElement(_reactImages2.default, {
                        images: images,
                        isOpen: this.state.isOpen,
                        currentImage: this.state.currentImage,
                        onClose: function onClose(e) {
                            return _this5.closeLightbox(e);
                        },
                        showThumbnails: true,
                        onClickThumbnail: function onClickThumbnail(index) {
                            _this5.setState({
                                currentImage: index
                            });
                        },
                        onClickPrev: function onClickPrev() {
                            _this5.setState({
                                currentImage: (_this5.state.currentImage + images.length - 1) % images.length
                            });
                        },
                        onClickNext: function onClickNext() {
                            _this5.setState({
                                currentImage: (_this5.state.currentImage + 1) % images.length
                            });
                        }
                    }),
                    _react2.default.createElement(
                        _GridList2.default,
                        { cellHeight: 160, cols: 3, style: { marginTop: '20px' } },
                        display
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'panel-footer' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-12' },
                            _react2.default.createElement(
                                'div',
                                { style: { display: 'flex', flexDirection: 'row' } },
                                _react2.default.createElement(_FormControlLabel2.default, {
                                    style: { marginTop: '3px', marginLeft: '5px' },
                                    control: _react2.default.createElement(_Checkbox2.default, { onClick: function onClick(e) {
                                            return _this5.handleLikeClick(e);
                                        },
                                        style: { width: '30px', height: '30px' },
                                        checked: (0, _utils.didUserLike)(this.state.data.likeCounter, this.props.currentUser),
                                        icon: _react2.default.createElement(_Icon2.default, { style: { fontSize: '20px' }, className: 'far fa-heart' }),
                                        checkedIcon: _react2.default.createElement(_Icon2.default, { className: 'fas fa-heart', style: { color: 'red', fontSize: '20px' } }) }),
                                    label: data.likeCounter.length
                                }),
                                _react2.default.createElement(_Icon2.default, { className: 'fas fa-comments', style: { marginTop: '8px', fontSize: '20px', width: '25px' } }),
                                _react2.default.createElement(
                                    'div',
                                    { style: { marginTop: '8px' } },
                                    _react2.default.createElement(
                                        'span',
                                        { style: { marginLeft: '5px' } },
                                        this.state.data.commentsCount
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                _.PostCommentThread,
                                { onPostComment: function onPostComment(comment) {
                                        return _this5.handlePostComment(comment);
                                    },
                                    loadCommentClick: function loadCommentClick() {
                                        return _this5.loadComments(false);
                                    }, loadMore: this.state.loadMore,
                                    commentsCount: this.state.data.commentsCount },
                                this.state.comments.map(function (comment, i) {
                                    //default time c
                                    var commentTime = moment(comment.postDate).calendar();
                                    //if less than 24 hours, use relative time
                                    if (new Date().getTime() - comment.postDate <= 86400000) commentTime = moment(comment.postDate).fromNow();
                                    return _react2.default.createElement(
                                        'div',
                                        null,
                                        _react2.default.createElement(
                                            _ListItem2.default,
                                            { key: i },
                                            _react2.default.createElement(
                                                _ListItemAvatar2.default,
                                                null,
                                                _react2.default.createElement(
                                                    _Link2.default,
                                                    { to: '/profile/' + comment.author._id },
                                                    _react2.default.createElement(_Avatar2.default, { src: comment.author.avatar })
                                                )
                                            ),
                                            _react2.default.createElement(_ListItemText2.default, { primary: _react2.default.createElement(
                                                    'span',
                                                    null,
                                                    comment.author.fullname,
                                                    _react2.default.createElement(
                                                        'span',
                                                        { style: { fontSize: '12px', marginLeft: '15px' } },
                                                        commentTime
                                                    )
                                                ),
                                                secondary: comment.text })
                                        )
                                    );
                                })
                            )
                        )
                    )
                )
            );
        }
    }]);

    return PostFeedItem;
}(_react2.default.Component);

exports.default = PostFeedItem;

/***/ })

}]);
//# sourceMappingURL=1.app.js.map