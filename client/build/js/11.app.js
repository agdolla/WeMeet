(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ "./app/components/layouts/chat.jsx":
/*!*****************************************!*\
  !*** ./app/components/layouts/chat.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _containers = __webpack_require__(/*! ../containers */ "./app/components/containers/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _credentials = __webpack_require__(/*! ../../utils/credentials */ "./app/utils/credentials.js");

var _Drawer = __webpack_require__(/*! @material-ui/core/Drawer */ "./node_modules/@material-ui/core/Drawer/index.js");

var _Drawer2 = _interopRequireDefault(_Drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');
var Promise = __webpack_require__(/*! bluebird */ "./node_modules/bluebird/js/browser/bluebird.js");

var Chat = function (_React$Component) {
    _inherits(Chat, _React$Component);

    function Chat(props) {
        _classCallCheck(this, Chat);

        var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

        _this.state = {
            user: props.user,
            message: [],
            sessions: {},
            friend: "",
            sessionId: "",
            btnText: "load earier messages",
            open: false
        };
        return _this;
    }

    _createClass(Chat, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.getData();

            _credentials.socket.on('online', function (data) {
                var tmp = Object.assign({}, _this2.state.user);
                tmp.friends.forEach(function (i) {
                    if (i._id === data.user) i.online = data.online;
                });
                _this2.setState({ user: tmp });
            });

            _credentials.socket.on('chat', function (data) {
                var updatedSession = data.sessionData;
                var newSessions = Object.assign({}, _this2.state.sessions);
                newSessions[updatedSession._id] = updatedSession;
                if (_this2.state.sessionId === updatedSession._id.toString()) {
                    var newMsgs = Array.from(_this2.state.message);
                    newMsgs.push({
                        sender: data.sender,
                        text: data.message,
                        date: data.date,
                        imgs: data.imgs
                    });
                    _this2.setState({
                        sessions: newSessions,
                        btnText: "load earier messages",
                        message: newMsgs
                    });
                } else {
                    _this2.setState({
                        sessions: newSessions
                    });
                }
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _credentials.socket.removeAllListeners("chat");
            _credentials.socket.removeAllListeners('online');
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (JSON.stringify(this.state.user) !== JSON.stringify(prevState.user)) {
                this.getData();
            }
        }
    }, {
        key: 'getData',
        value: async function getData() {
            var user = await (0, _utils.getUserData)(this.state.user._id);
            var userData = user.data;
            var sessions = await (0, _utils.getSessions)(userData._id);
            sessions = sessions.data;
            var sessionsData = {};
            sessions.forEach(function (session) {
                sessionsData[session._id] = session;
            });
            var sessionData = await this.getSession(userData.friends[0]._id);
            var messages = await (0, _utils.getMessages)(new Date().getTime(), userData._id, sessionData);

            this.setState({
                user: userData,
                sessions: sessionsData,
                friend: userData.friends[0],
                sessionId: sessionData,
                message: messages.data,
                btnText: messages.data.length === 0 ? "say hello to your friend!" : "load earier messages"
            });
        }
    }, {
        key: 'getSession',
        value: function getSession(friend) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var sessions = _this3.state.sessions;
                var keys = Object.keys(sessions).filter(function (sessionId) {
                    return sessions[sessionId].users.indexOf(friend) !== -1;
                });
                if (keys.length === 0) {
                    (0, _utils.getSessionId)(_this3.state.user._id, friend).then(function (response) {
                        resolve(response.data._id);
                    });
                } else {
                    resolve(keys[0]);
                }
            });
        }
    }, {
        key: 'handlePostMessage',
        value: function handlePostMessage(message, imgs) {
            _credentials.socket.emit('chat', {
                sessionId: this.state.sessionId,
                date: new Date().getTime(),
                sender: this.state.user._id,
                target: this.state.friend._id,
                message: message,
                imgs: imgs
            });
        }
    }, {
        key: 'handleSwitchFriends',
        value: function handleSwitchFriends(friendData) {
            var _this4 = this;

            this.getMessagesForUser(friendData._id).then(function (data) {
                _this4.setState({
                    friend: friendData,
                    sessionId: data.sessionId,
                    message: data.messages.data,
                    btnText: data.messages.data.length === 0 ? "say hello to your friend!" : "load earier messages"
                });
            });
        }
    }, {
        key: 'getMessagesForUser',
        value: async function getMessagesForUser(userId) {
            var sessionId = await this.getSession(userId);
            var messages = await (0, _utils.getMessages)(new Date().getTime(), this.state.user._id, sessionId);
            return {
                sessionId: sessionId,
                messages: messages
            };
        }
    }, {
        key: 'handleLoadMessage',
        value: function handleLoadMessage() {
            var _this5 = this;

            var time = this.state.message === undefined || this.state.message.length === 0 ? new Date().getTime() : this.state.message[0].date;
            (0, _utils.getMessages)(time, this.state.user._id, this.state.sessionId).then(function (response) {
                var messages = response.data;
                if (messages.length === 0) {
                    return _this5.setState({
                        btnText: "nothing more to load"
                    });
                }
                var newMessages = messages.concat(_this5.state.message);
                _this5.setState({
                    message: newMessages
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var chatwindow = _react2.default.createElement(_containers.ChatWindow, { target: this.state.friend, curUser: this.state.user,
                onPost: function onPost(message, imgs) {
                    return _this6.handlePostMessage(message, imgs);
                },
                message: this.state.message,
                onLoad: function onLoad() {
                    return _this6.handleLoadMessage();
                },
                onExpand: function onExpand() {
                    return _this6.setState({ open: !_this6.state.open });
                },
                btnText: this.state.btnText,
                failed: this.state.failed });
            if (this.state.user.friends === undefined ? true : this.state.user.friends.length === 0) {
                chatwindow = _react2.default.createElement(
                    'div',
                    { className: 'col-md-7 col-sm-7 col-xs-7' },
                    _react2.default.createElement(
                        'div',
                        { className: 'alert alert-info', role: 'alert' },
                        'You don\'t have any chats yet'
                    )
                );
            }
            return _react2.default.createElement(
                'div',
                { style: { marginTop: '70px' } },
                _react2.default.createElement(
                    _Drawer2.default,
                    { open: this.state.open,
                        style: { width: '500px' },
                        onClose: function onClose() {
                            return _this6.setState({ open: false });
                        } },
                    _react2.default.createElement(_containers.ChatNavBody, { sessions: this.state.sessions,
                        userData: this.state.user, activeFriend: this.state.friend._id, switchUser: function switchUser(id) {
                            return _this6.handleSwitchFriends(id);
                        } })
                ),
                _react2.default.createElement(_containers.Navbar, { chat: 'active', user: this.state.user }),
                _react2.default.createElement(
                    'div',
                    { className: 'container mainElement' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { style: { marginRight: '-50px' },
                                className: 'col-md-5 col-sm-5 col-xs-5 col-md-offset-1 col-sm-offset-1 col-xs-offset-1 chat-left' },
                            _react2.default.createElement(_containers.ChatNavBody, { sessions: this.state.sessions,
                                userData: this.state.user, activeFriend: this.state.friend._id, switchUser: function switchUser(id) {
                                    return _this6.handleSwitchFriends(id);
                                } })
                        ),
                        chatwindow
                    )
                )
            );
        }
    }]);

    return Chat;
}(_react2.default.Component);

exports.default = Chat;

/***/ })

}]);
//# sourceMappingURL=11.app.js.map