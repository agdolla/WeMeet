(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ "./app/components/layouts/notification.jsx":
/*!*************************************************!*\
  !*** ./app/components/layouts/notification.jsx ***!
  \*************************************************/
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');

var Notification = function (_React$Component) {
    _inherits(Notification, _React$Component);

    function Notification(props) {
        _classCallCheck(this, Notification);

        var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, props));

        _this.onNotification = function () {
            _this.getData();
        };

        _this.handleDelete = function (id) {
            (0, _utils.deleteNotification)(id, _this.props.user._id).then(function (response) {
                var notificationData = response.data;
                var FR = [];
                var AN = [];
                notificationData.contents.forEach(function (notification) {
                    if (notification.type === "FR") {
                        FR.insert(0, notification);
                    } else {
                        AN.insert(0, notification);
                    }
                });
                _this.setState({
                    FR: FR,
                    AN: AN
                });
            });
        };

        _this.handleFriendAccept = function (id, user) {
            (0, _utils.acceptFriendRequest)(id, _this.props.user._id).then(function () {
                _this.getData();
                _credentials.socket.emit("accept notification", {
                    target: user
                });
                location.reload();
            });
        };

        _this.handleActivityAccept = function (notificationid, user) {
            (0, _utils.acceptActivityRequest)(notificationid, _this.props.user._id).then(function () {
                _this.getData();
                _credentials.socket.emit("accept notification", {
                    target: user
                });
            });
        };

        _this.state = {
            FR: [],
            AN: []
        };
        return _this;
    }

    _createClass(Notification, [{
        key: 'getData',
        value: function getData() {
            var _this2 = this;

            (0, _utils.getNotificationData)(this.props.user._id).then(function (response) {
                var notificationData = response.data;
                var FR = [];
                var AN = [];
                notificationData.contents.map(function (notification) {
                    if (notification.type === "FR") {
                        FR.insert(0, notification);
                    } else {
                        AN.insert(0, notification);
                    }
                });
                _this2.setState({
                    FR: FR,
                    AN: AN
                });
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.getData();
            _credentials.socket.on('notification', this.onNotification);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _credentials.socket.removeEventListener('notification');
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: { marginTop: '50px' } },
                _react2.default.createElement(_containers.Navbar, { user: this.props.user, notification: 'active' }),
                _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row notification' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12' },
                            _react2.default.createElement(_containers.NotificationBody, { AN: this.state.AN, FR: this.state.FR,
                                handleDelete: this.handleDelete,
                                handleActivityAccept: this.handleActivityAccept,
                                handleFriendAccept: this.handleFriendAccept
                            })
                        )
                    )
                )
            );
        }
    }]);

    return Notification;
}(_react2.default.Component);

exports.default = Notification;

/***/ })

}]);
//# sourceMappingURL=10.app.js.map