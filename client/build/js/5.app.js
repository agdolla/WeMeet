(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "./app/components/layouts/activityDetail.jsx":
/*!***************************************************!*\
  !*** ./app/components/layouts/activityDetail.jsx ***!
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

var _containers = __webpack_require__(/*! ../containers */ "./app/components/containers/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActivityDetail = function (_React$Component) {
    _inherits(ActivityDetail, _React$Component);

    function ActivityDetail(props) {
        _classCallCheck(this, ActivityDetail);

        return _possibleConstructorReturn(this, (ActivityDetail.__proto__ || Object.getPrototypeOf(ActivityDetail)).call(this, props));
    }

    _createClass(ActivityDetail, [{
        key: 'render',
        value: function render() {
            return _React2.default.createElement(
                'div',
                { style: { marginTop: '70px' } },
                _React2.default.createElement(_containers.Navbar, { activity: 'active', user: this.props.user }),
                _React2.default.createElement(_containers.ActivityDetailBody, { id: this.props.activityId, avatar: this.props.user.avatar,
                    currentUser: this.props.user._id, friends: this.props.user.friends })
            );
        }
    }]);

    return ActivityDetail;
}(_React2.default.Component);

exports.default = ActivityDetail;

/***/ })

}]);
//# sourceMappingURL=5.app.js.map