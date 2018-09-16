(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "./app/components/layouts/profile.jsx":
/*!********************************************!*\
  !*** ./app/components/layouts/profile.jsx ***!
  \********************************************/
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

var _Tabs = __webpack_require__(/*! @material-ui/core/Tabs */ "./node_modules/@material-ui/core/Tabs/index.js");

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = __webpack_require__(/*! @material-ui/core/Tab */ "./node_modules/@material-ui/core/Tab/index.js");

var _Tab2 = _interopRequireDefault(_Tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let debug = require('react-debug');

var Profile = function (_React$Component) {
    _inherits(Profile, _React$Component);

    function Profile(props) {
        _classCallCheck(this, Profile);

        var _this = _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).call(this, props));

        _this.handleChange = function (event, value) {
            _this.setState({ value: value });
        };

        _this.state = {
            user: {},
            commonFriends: [],
            value: 0
        };
        return _this;
    }

    _createClass(Profile, [{
        key: 'getData',
        value: function getData(user) {
            var _this2 = this;

            (0, _utils.getUserData)(user).then(function (userData) {
                var userFriendsList = userData.data.friends.map(function (friend) {
                    return friend._id;
                });
                var currentUserFriendsList = _this2.props.currUser.friends.map(function (friend) {
                    return friend._id;
                });
                var commonFriends = userFriendsList.filter(function (friend) {
                    return currentUserFriendsList.indexOf(friend) !== -1;
                });
                _this2.setState({
                    user: userData.data,
                    commonFriends: commonFriends
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
            if (JSON.stringify(prevProps.currUser) !== JSON.stringify(this.props.currUser) || prevProps.user !== this.props.user) {
                this.getData(this.props.user);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: { marginTop: '70px' } },
                _react2.default.createElement(_containers.Navbar, { user: this.props.currUser }),
                _react2.default.createElement(
                    'div',
                    { className: 'container profile' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-4' },
                            _react2.default.createElement(_containers.ProfilePersonalInfo, { user: this.state.user, currentUser: this.props.currUser._id, commonFriends: this.state.commonFriends })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'col-md-7 col-md-offset-1' },
                            _react2.default.createElement(
                                _Tabs2.default,
                                { value: this.state.value,
                                    onChange: this.handleChange,
                                    style: { backgroundColor: 'white' },
                                    indicatorColor: 'primary',
                                    textColor: 'primary',
                                    fullWidth: true, centered: true },
                                _react2.default.createElement(_Tab2.default, { label: 'Activities' }),
                                _react2.default.createElement(_Tab2.default, { label: 'Posts' })
                            ),
                            this.state.value === 0 && _react2.default.createElement(_containers.ProfileRecentActivityFeed, { user: this.props.user, currentUser: this.props.currUser._id }),
                            this.state.value === 1 && _react2.default.createElement(_containers.ProfileRecentPostFeed, { user: this.props.user, currentUser: this.props.currUser._id })
                        )
                    )
                )
            );
        }
    }]);

    return Profile;
}(_react2.default.Component);

exports.default = Profile;

/***/ })

}]);
//# sourceMappingURL=8.app.js.map