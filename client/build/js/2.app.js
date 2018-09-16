(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./app/components/layouts/landing.jsx":
/*!********************************************!*\
  !*** ./app/components/layouts/landing.jsx ***!
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

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");

var _utils = __webpack_require__(/*! ../../utils */ "./app/utils/index.js");

var _containers = __webpack_require__(/*! ../containers */ "./app/components/containers/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var debug = require('react-debug');


var Landing = function (_React$Component) {
    _inherits(Landing, _React$Component);

    function Landing(props) {
        _classCallCheck(this, Landing);

        var _this = _possibleConstructorReturn(this, (Landing.__proto__ || Object.getPrototypeOf(Landing)).call(this, props));

        _this.handleOpen = function (value) {
            return function () {
                _this.setState(_defineProperty({}, value, true));
            };
        };

        _this.handleClose = function (value) {
            return function () {
                _this.setState(_defineProperty({}, value, false));
            };
        };

        _this.state = {
            signUpOpen: false,
            loginOpen: false
        };
        return _this;
    }

    _createClass(Landing, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if ((0, _utils.isUserLoggedIn)()) {
                this.props.history.push('/activity');
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_containers.LandingBackground, { handleOpen: this.handleOpen }),
                _react2.default.createElement(_containers.LandingSignin, { open: this.state.loginOpen, handleClose: this.handleClose }),
                _react2.default.createElement(_containers.LandingSignup, { open: this.state.signUpOpen, handleClose: this.handleClose }),
                _react2.default.createElement(
                    'div',
                    { className: 'row footer' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-8 col-md-offset-2' },
                        _react2.default.createElement(
                            'h3',
                            { style: { color: 'white' } },
                            _react2.default.createElement(
                                'span',
                                null,
                                _react2.default.createElement('img', { src: '../img/logo/mipmap-xxxhdpi/ic_launcher.png', width: '50px' })
                            )
                        ),
                        _react2.default.createElement(
                            'h5',
                            null,
                            'Copyright (c) 2016-2018 Copyright WeMeet. All Rights Reserved.'
                        )
                    )
                )
            );
        }
    }]);

    return Landing;
}(_react2.default.Component);

exports.default = (0, _reactRouterDom.withRouter)(Landing);

/***/ })

}]);
//# sourceMappingURL=2.app.js.map