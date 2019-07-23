/* IMPORTMODULES ------------------------------------------------------------ */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* jQuery connect ---------------- */
/* Slick connect ----------------- */
/// <reference path="@types/slick/index.d.ts"/>
/* module DOM services ---------------- */
function getAttrVal(el, attr_name) {
    return el.querySelector("[" + attr_name + "]").getAttribute(attr_name);
}
/* module Tooltip perform ------------- */
function performTooltip(el, text) {
    var hidden_class = "hidden-tooltip";
    var time = 1000;
    var tooltip = document.getElementById("tooltip");
    var win_width;
    tooltip.classList.add(hidden_class);
    tooltip.style.display = "none";
    tooltip.style.width = "auto";
    tooltip.style.right = "auto";
    win_width = document.documentElement.clientWidth;
    var el_coord = el.getBoundingClientRect();
    var el_dimens = {
        top: el_coord.top + (window.scrollY || window.pageYOffset),
        left: el_coord.left,
        width: el_coord.right - el_coord.left
    };
    var tt_dimens = {
        top: el_coord.bottom,
        left: el_dimens.left + (el_dimens.width / 2)
    };
    tooltip.style.display = "block";
    tooltip.innerHTML = text;
    tooltip.style.top = tt_dimens.top + "px";
    tooltip.style.left = tt_dimens.left + "px";
    tooltip.classList.remove(hidden_class);
    var tt_coord = tooltip.getBoundingClientRect();
    tt_dimens.width = tt_coord.right - tt_coord.left;
    if (tt_dimens.width > +(win_width / 100 * 95).toFixed(0)) {
        tt_dimens.width = +(win_width / 100 * 95).toFixed(0);
    }
    if (tt_dimens.width + tt_dimens.left > win_width) {
        if (win_width - tt_dimens.left + tt_dimens.width > win_width) {
            if (tt_dimens.left > win_width / 2) {
                tooltip.style.left = "auto";
                tooltip.style.right = (win_width / 100 * 2).toFixed(0) + "px";
            }
            else {
                tooltip.style.left = (win_width / 100 * 2).toFixed(0) + "px";
            }
        }
        else {
            tooltip.style.left = "auto";
            tooltip.style.right = tt_dimens.left + "px";
        }
    }
    tooltip.style.width = tt_dimens.width + "px";
    setTimeout(function () {
        tooltip.classList.add(hidden_class);
    }, time);
}
/* module Copy Text Element to Buffer ------------- */
function CopyTextToBuffer(trigger_id, text_el_selector, tooltip_msg) {
    if (tooltip_msg === void 0) { tooltip_msg = "The text was copied"; }
    var trigger_el = document.getElementById(trigger_id);
    if (trigger_el) {
        var text_el_1 = trigger_el.querySelector(text_el_selector);
        trigger_el.onclick = function (e) {
            e.preventDefault();
            if (document.createRange) {
                var range = document.createRange();
                range.selectNodeContents(text_el_1);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand("copy", false, null);
                selection.removeAllRanges();
                performTooltip(text_el_1, tooltip_msg);
            }
        };
    }
}
/* module Load More ---------------- */
function loadMore(operation) {
    var loader = document.getElementById("loader");
    var body = document.body;
    var style_open = "open";
    var style_blocked_body = "noscroll";
    var act_open = "open";
    var act_close = "close";
    if (operation == act_open) {
        loader.classList.add(style_open);
        body.classList.add(style_blocked_body);
    }
    else if (operation == act_close) {
        loader.classList.remove(style_open);
        body.classList.remove(style_blocked_body);
    }
}
/* An initial trigger element must to contain 'data-popup-init' attribute with string that contain a target popup block in the attribute 'data-popup-targ'
*/
var POPUP_DEF_PROP = {
    body_class: "noscroll",
    container_class: "display-popup",
    container_animate_class: "animate-popup",
    popup_class: "display-popup",
    container_id: "popups",
    wrap_selector: ".popups-frame_wrap",
    popup_data_attr: "data-popup-targ",
    init_data_attr: "data-popup-init",
    close_data_attr: "data-popup-close"
};
var PopupTrigger = /** @class */ (function () {
    function PopupTrigger(prop) {
        if (prop === void 0) { prop = POPUP_DEF_PROP; }
        this.prop = prop;
        this.body_El = document.body;
        this.container = document.getElementById(this.prop.container_id);
        if (prop.wrap_selector) {
            var wrap_El = document.querySelector(prop.wrap_selector);
            if (wrap_El)
                this.wrap_El = wrap_El;
        }
        this.init_El = document.querySelectorAll("[" + this.prop.init_data_attr + "]");
        this.close_El = document.querySelectorAll("[" + this.prop.close_data_attr + "]");
        var targ_El = document.querySelectorAll("[" + this.prop.popup_data_attr + "]");
        this.targ_El = {};
        for (var i = 0; i < targ_El.length; i++) {
            var title = targ_El[i].getAttribute(this.prop.popup_data_attr);
            this.targ_El[title] = targ_El[i];
        }
        this._active_title = "cart";
    }
    PopupTrigger.prototype.open = function (title, callback) {
        if (this._active_title)
            this.close(this._active_title);
        this.container.classList.add(this.prop.container_class);
        this.body_El.classList.add(this.prop.body_class);
        var target = this.targ_El[title];
        target.classList.add(this.prop.popup_class);
        this._active_title = title;
        if (callback)
            this._active_callback = callback;
    };
    PopupTrigger.prototype.close = function (title) {
        var _this = this;
        var active_title = title || this._active_title;
        var target;
        if (active_title) {
            target = this.targ_El[active_title];
            this._active_title = false;
            if (title)
                target.classList.remove(this.prop.popup_class);
        }
        if (!title) {
            this.container.classList.remove(this.prop.container_animate_class);
            setTimeout((function () {
                _this.container.classList.remove(_this.prop.container_class);
                _this.body_El.classList.remove(_this.prop.body_class);
                target.classList.remove(_this.prop.popup_class);
                _this.container.classList.add(_this.prop.container_animate_class);
                if (_this._active_callback) {
                    _this._active_callback();
                    _this._active_callback = null;
                }
            }).bind(this), 400);
        }
    };
    PopupTrigger.prototype.launchModule = function () {
        var _this = this;
        for (var i = 0; i < this.init_El.length; i++) {
            this.init_El[i].addEventListener("click", (function (e) {
                e.preventDefault();
                var title = e.currentTarget.getAttribute(_this.prop.init_data_attr);
                _this.open(title);
            }).bind(this));
        }
        for (var j = 0; j < this.close_El.length; j++) {
            this.close_El[j].addEventListener("click", (function (e) {
                e.preventDefault();
                _this.close();
            }).bind(this));
        }
        if (this.wrap_El) {
            this.wrap_El.addEventListener("click", (function (e) {
                if (e.currentTarget == e.target) {
                    _this.close();
                }
            }).bind(this));
        }
    };
    return PopupTrigger;
}());
var rangeDefQuerySelectors = {
    range_space: ".range_space",
    range_inner_space: ".range_inner-space",
    top_label: ".range_end-number",
    bottom_label: ".range_start-number",
    top_input: "#price_range_top_field",
    bottom_input: "#price_range_bottom_field",
    top_point: ".range_end-point",
    bottom_point: ".range_start-point",
    invalid_msg: ".range-invalid-msg",
    limit_top: "data-range-max-val",
    limit_bottom: "data-range-min-val",
    value_top: "data-range-top-val",
    value_bottom: "data-range-bottom-val",
    precision: 10
};
var RANGE_ERROR_MSG = {
    limit_top: "Maximum value can not be higher ",
    limit_bottom: "Minimum value can not be lower ",
    value_top: "Maximum value can not be lower than minimum",
    value_bottom: "Minimum value can not be higher than maximum"
};
var RANGE_DEFAULTS = {
    percent_top: 100,
    percent_bottom: 0,
    absolute_side: "50%",
    transform_top: "translateX(50%)",
    transform_bottom: "translateX(-50%)"
};
var RangeFilter = /** @class */ (function () {
    function RangeFilter(block_id, err_msg, properties, DOM_selectors) {
        this.wrap_el = document.getElementById(block_id);
        this.default_val = RANGE_DEFAULTS;
        var prop = {
            limit_top: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.limit_top),
            limit_bottom: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.limit_bottom),
            value_top: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.value_top),
            value_bottom: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.value_bottom),
            precision: rangeDefQuerySelectors.precision
        };
        this._prop = properties || prop;
        this.DOM = {
            range_space: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.range_space) || rangeDefQuerySelectors.range_space),
            range_inner_space: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.range_inner_space) || rangeDefQuerySelectors.range_inner_space),
            top_label: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_label) || rangeDefQuerySelectors.top_label),
            bottom_label: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_label) || rangeDefQuerySelectors.bottom_label),
            top_input: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_input) || rangeDefQuerySelectors.top_input),
            bottom_input: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_input) || rangeDefQuerySelectors.bottom_input),
            top_point: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_point) || rangeDefQuerySelectors.top_point),
            bottom_point: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_point) || rangeDefQuerySelectors.bottom_point),
            invalid_msg: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.invalid_msg) || rangeDefQuerySelectors.invalid_msg),
            top_lb_parent: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_label) || rangeDefQuerySelectors.top_label).parentElement,
            bottom_lb_parent: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_label) || rangeDefQuerySelectors.bottom_label).parentElement
        };
        var values = this._prop.limit_top - this._prop.limit_bottom;
        var wrap_space_clientRect = this.DOM.range_space.getBoundingClientRect();
        var pixel_per_value = +(wrap_space_clientRect.width / values).toFixed(2);
        var percent_per_pixel = +(this.default_val.percent_top / wrap_space_clientRect.width).toFixed(2);
        this._work_prop = {
            values: values,
            pixel_top: +((this._prop.value_top - this._prop.limit_bottom) * pixel_per_value).toFixed(2),
            pixel_bottom: +((this._prop.value_bottom - this._prop.limit_bottom) * pixel_per_value).toFixed(2),
            pixel_per_value: pixel_per_value,
            percent_per_pixel: percent_per_pixel,
            wrap_space_width: wrap_space_clientRect.width,
            wrap_space_x: wrap_space_clientRect.left,
            space_width: this.DOM.range_inner_space.getBoundingClientRect().width,
            width_lab_t: this.DOM.top_lb_parent.getBoundingClientRect().width,
            width_lab_b: this.DOM.bottom_lb_parent.getBoundingClientRect().width
        };
        this.error_msg = {
            limit_top: ((err_msg && err_msg.limit_top) || RANGE_ERROR_MSG.limit_top) + this._prop.limit_top,
            limit_bottom: ((err_msg && err_msg.limit_bottom) || RANGE_ERROR_MSG.limit_bottom) + this._prop.limit_bottom,
            value_top: (err_msg && err_msg.value_top) || RANGE_ERROR_MSG.value_top,
            value_bottom: (err_msg && err_msg.value_bottom) || RANGE_ERROR_MSG.value_bottom
        };
        this._temp_val_top = this._prop.value_top;
        this._temp_val_bottom = this._prop.value_bottom;
        this._active_top_point = false;
        this._active_bottom_point = false;
    }
    RangeFilter.prototype.setValue = function (el, val) {
        el.value = val.toString();
    };
    RangeFilter.prototype.setText = function (el, text) {
        el.innerHTML = text.toString();
    };
    RangeFilter.prototype.changeSpaceWidth = function () {
        this._work_prop.space_width = this.DOM.range_inner_space.getBoundingClientRect().width;
        this._work_prop.width_lab_t = this.DOM.top_lb_parent.getBoundingClientRect().width;
        this._work_prop.width_lab_b = this.DOM.bottom_lb_parent.getBoundingClientRect().width;
        var between_label = (this._work_prop.width_lab_t + this._work_prop.width_lab_b) / 2;
        if (between_label > this._work_prop.space_width) {
            this.DOM.top_lb_parent.style.right = "auto";
            this.DOM.top_lb_parent.style.left = this.default_val.absolute_side;
            this.DOM.top_lb_parent.style.transform = "translateX(" + (-(this._work_prop.space_width / 2 - 2) + "px") + ")";
            this.DOM.bottom_lb_parent.style.left = "auto";
            this.DOM.bottom_lb_parent.style.right = this.default_val.absolute_side;
            this.DOM.bottom_lb_parent.style.transform = "translateX(" + (this._work_prop.space_width / 2 - 2) + "px" + ")";
        }
        else {
            this.DOM.top_lb_parent.style.right = this.default_val.absolute_side;
            this.DOM.top_lb_parent.style.left = "auto";
            this.DOM.top_lb_parent.style.transform = this.default_val.transform_top;
            this.DOM.bottom_lb_parent.style.left = this.default_val.absolute_side;
            this.DOM.bottom_lb_parent.style.right = "auto";
            this.DOM.bottom_lb_parent.style.transform = this.default_val.transform_bottom;
        }
    };
    RangeFilter.prototype.setPadding = function (side) {
        var value;
        if (side == "top") {
            value = +((this._work_prop.wrap_space_width - this._work_prop.pixel_top) * this._work_prop.percent_per_pixel).toFixed();
            this.DOM.range_space.style.paddingRight = value + "%";
        }
        else if (side == "bottom") {
            value = +(this._work_prop.pixel_bottom * this._work_prop.percent_per_pixel).toFixed();
            this.DOM.range_space.style.paddingLeft = value + "%";
        }
        this.changeSpaceWidth();
    };
    RangeFilter.prototype.setTop = function (val) {
        this._prop.value_top = val;
        this._work_prop.pixel_top = +((this._prop.value_top - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
        this.setText(this.DOM.top_label, this._prop.value_top);
        this.setPadding("top");
    };
    RangeFilter.prototype.setBottom = function (val) {
        this._prop.value_bottom = val;
        this._work_prop.pixel_bottom = +((this._prop.value_bottom - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
        this.setText(this.DOM.bottom_label, this._prop.value_bottom);
        this.setPadding("bottom");
    };
    RangeFilter.prototype.setPointTop = function () {
        this.setText(this.DOM.top_label, this._prop.value_top);
        this.setPadding("top");
    };
    RangeFilter.prototype.setPointBottom = function () {
        this.setText(this.DOM.bottom_label, this._prop.value_bottom);
        this.setPadding("bottom");
    };
    RangeFilter.prototype.applyResize = function (e) {
        var wrap_space_clientRect = this.DOM.range_space.getBoundingClientRect();
        this._work_prop.wrap_space_width = wrap_space_clientRect.width;
        this._work_prop.wrap_space_x = wrap_space_clientRect.left;
        this._work_prop.pixel_per_value = +(wrap_space_clientRect.width / this._work_prop.values).toFixed(2);
        this._work_prop.percent_per_pixel = +(this.default_val.percent_top / wrap_space_clientRect.width).toFixed(2);
        this._work_prop.pixel_top = +((this._prop.value_top - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
        this._work_prop.pixel_bottom = +((this._prop.value_bottom - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
        var tem = this._work_prop;
    };
    RangeFilter.prototype.initOnInput = function (e) {
        var el = e.target;
        var el_input = el;
        var value = el_input.value;
        var num_val, side;
        var reg_number = /^[0-9]+$/;
        if (el_input.name == this.DOM.top_input.name) {
            side = "top";
        }
        else if (el_input.name == this.DOM.bottom_input.name) {
            side = "bottom";
        }
        if (value !== "" && !reg_number.test(value)) {
            if (side == "top") {
                el_input.value = this._temp_val_top.toString();
            }
            else if (side == "bottom") {
                el_input.value = this._temp_val_bottom.toString();
            }
        }
        else {
            if (side == "top") {
                this._temp_val_top = parseInt(value);
            }
            else if (side == "bottom") {
                this._temp_val_bottom = parseInt(value);
            }
        }
    };
    RangeFilter.prototype.initOnChange = function (e) {
        var _this = this;
        var el = e.target;
        var el_input = el;
        var value = el_input.value;
        var num_val, side, valid_bool = true, valid_msg;
        if (el_input.name == this.DOM.top_input.name) {
            side = "top";
        }
        else if (el_input.name == this.DOM.bottom_input.name) {
            side = "bottom";
        }
        if (value == "" || isNaN(parseInt(value))) {
            valid_bool = false;
        }
        else {
            num_val = parseInt(value);
            if (side == "top") {
                if (num_val > this._prop.limit_top) {
                    valid_bool = false;
                    valid_msg = this.error_msg.limit_top;
                }
                else if (num_val < (this._prop.value_bottom + this._prop.precision * 2)) {
                    valid_bool = false;
                    valid_msg = this.error_msg.value_bottom;
                }
                else {
                    this.setTop(num_val);
                }
            }
            else if (side == "bottom") {
                if (num_val < this._prop.limit_bottom) {
                    valid_bool = false;
                    valid_msg = this.error_msg.limit_bottom;
                }
                else if (num_val > (this._prop.value_top - this._prop.precision * 2)) {
                    valid_bool = false;
                    valid_msg = this.error_msg.value_top;
                }
                else {
                    this.setBottom(num_val);
                }
            }
        }
        if (!valid_bool) {
            if (valid_msg) {
                this.DOM.invalid_msg.innerHTML = valid_msg;
                this.DOM.invalid_msg.classList.remove("hidden");
                setTimeout(function () {
                    _this.DOM.invalid_msg.classList.add("hidden");
                }, 3500);
            }
            if (side == "top") {
                el_input.value = this._prop.value_top.toString();
            }
            else if (side == "bottom") {
                el_input.value = this._prop.value_bottom.toString();
            }
        }
    };
    RangeFilter.prototype.selectInput = function (e) {
        var el = e.target;
        var el_input = el;
        el_input.select();
    };
    RangeFilter.prototype.mouseDownTop = function (e) {
        if (e.target == e.currentTarget) {
            this.wrap_el.onmousemove = this.mouseMoveTop.bind(this);
            this.wrap_el.onmouseleave = this.mouseEndTop.bind(this);
            this._active_top_point = true;
        }
    };
    RangeFilter.prototype.mouseMoveTop = function (e) {
        var mouseX = e.clientX;
        var pixel_top = mouseX - this._work_prop.wrap_space_x;
        var value_top = ~~(pixel_top / this._work_prop.pixel_per_value);
        if (value_top < this._prop.limit_top && value_top > (this._prop.value_bottom + this._prop.precision * 2)) {
            this._prop.value_top = Math.ceil(value_top / this._prop.precision) * this._prop.precision;
            this._work_prop.pixel_top = pixel_top;
            this.setPointTop();
        }
    };
    RangeFilter.prototype.mouseEndTop = function (e) {
        if (this._active_top_point) {
            this.setValue(this.DOM.top_input, this._prop.value_top);
            this.wrap_el.onmousemove = undefined;
            this.wrap_el.onmouseleave = undefined;
            this._active_top_point = false;
        }
    };
    RangeFilter.prototype.mouseDownBottom = function (e) {
        if (e.target == e.currentTarget) {
            this.wrap_el.onmousemove = this.mouseMoveBottom.bind(this);
            this.wrap_el.onmouseleave = this.mouseEndBottom.bind(this);
            this._active_bottom_point = true;
        }
    };
    RangeFilter.prototype.mouseMoveBottom = function (e) {
        var mouseX = e.clientX;
        var pixel_bottom = mouseX - this._work_prop.wrap_space_x;
        var value_bottom = ~~(pixel_bottom / this._work_prop.pixel_per_value);
        if (value_bottom > this._prop.limit_bottom && value_bottom < (this._prop.value_top - this._prop.precision * 2)) {
            this._prop.value_bottom = Math.floor(value_bottom / this._prop.precision) * this._prop.precision;
            this._work_prop.pixel_bottom = pixel_bottom;
            this.setPointBottom();
        }
    };
    RangeFilter.prototype.mouseEndBottom = function (e) {
        if (this._active_bottom_point) {
            this.setValue(this.DOM.bottom_input, this._prop.value_bottom);
            this.wrap_el.onmousemove = undefined;
            this.wrap_el.onmouseleave = undefined;
            this._active_bottom_point = false;
        }
    };
    RangeFilter.prototype.launchModule = function () {
        this.setTop(this._prop.value_top);
        this.setBottom(this._prop.value_bottom);
        this.DOM.top_input.addEventListener("input", this.initOnInput.bind(this));
        this.DOM.top_input.addEventListener("change", this.initOnChange.bind(this));
        this.DOM.top_input.addEventListener("focus", this.selectInput);
        this.DOM.bottom_input.addEventListener("input", this.initOnInput.bind(this));
        this.DOM.bottom_input.addEventListener("change", this.initOnChange.bind(this));
        this.DOM.bottom_input.addEventListener("focus", this.selectInput);
        this.DOM.top_point.addEventListener("mousedown", this.mouseDownTop.bind(this));
        document.addEventListener("mouseup", this.mouseEndTop.bind(this));
        this.DOM.bottom_point.addEventListener("mousedown", this.mouseDownBottom.bind(this));
        document.addEventListener("mouseup", this.mouseEndBottom.bind(this));
        var applyResize = this.applyResize.bind(this);
        var resizeTimer;
        window.addEventListener("resize", function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(applyResize, 250);
        });
    };
    Object.defineProperty(RangeFilter.prototype, "getValues", {
        get: function () {
            var values = {
                top: this._prop.value_top,
                bottom: this._prop.value_bottom
            };
            return values;
        },
        enumerable: true,
        configurable: true
    });
    RangeFilter.prototype.setTopValue = function (val) {
        if (val < this._prop.limit_top && val > this._prop.value_bottom + this._prop.precision) {
            this.setTop(val);
            return true;
        }
        else
            return false;
    };
    RangeFilter.prototype.setBottomValue = function (val) {
        if (val > this._prop.limit_bottom && val < this._prop.value_top + this._prop.precision) {
            this.setBottom(val);
            return true;
        }
        else
            return false;
    };
    return RangeFilter;
}());
// default module properties
var VALID_PROP = {
    valid_type_template: {
        "tel": /^[0-9\+\-\(\)]{8,16}$/,
        "email": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "password": /^[a-zA-Z0-9]{6,}$/
    },
    type_blocked_template: {
        "number": /^[0-9]+$/,
        "tel": /^[0-9\+\-\(\)]+$/
    },
    hidden_class: "hidden",
    wrap_selector: ".input-parent",
    inv_require_class: "empty",
    inv_valid_class: "invalid",
    inv_custom_class: "invalid-server",
    start_validation: "change",
    valid_template_attr: "data-valid-template",
    blocked_template_attr: "data-blocked-template",
    start_validation_attr: "data-start-validation"
};
var SetInpProperties = /** @class */ (function () {
    function SetInpProperties(el, form_el, main_el, arg) {
        this.form_el = form_el;
        this.main_el = main_el;
        this.name = el.name;
        this.tag_name = el.tagName;
        if (this.main_el.prop.wrap_selector) {
            var wrap_el = el.closest(this.main_el.prop.wrap_selector);
            if (wrap_el) {
                this.wrap_element = wrap_el;
            }
        }
        this.type = el.type;
        if (arg && arg.callback)
            this.callback = arg.callback;
    }
    return SetInpProperties;
}());
var InputInstance = /** @class */ (function (_super) {
    __extends(InputInstance, _super);
    function InputInstance(inp_el, form_el, main_el, item_arg) {
        var _this = _super.call(this, inp_el, form_el, main_el, item_arg) || this;
        _this.element = inp_el;
        if (inp_el.value && inp_el.value !== " ") {
            if (_this.type == "number" && !isNaN(+inp_el.value)) {
                _this.start_value = +inp_el.value;
            }
            else {
                _this.start_value = inp_el.value;
            }
        }
        var start_required, start_disabled;
        var valid_template, blocked_template, start_validation;
        if (item_arg) {
            start_required = item_arg.required;
            start_disabled = item_arg.disabled;
            valid_template = item_arg.valid_template;
            blocked_template = item_arg.blocked_template;
            start_validation = item_arg.start_validation;
        }
        _this.start_required = start_required || inp_el.required || false;
        _this.start_disabled = start_disabled || inp_el.disabled || false;
        _this.required = _this.start_required;
        _this.disabled = _this.start_disabled;
        function templateParser(t, tp) {
            var template;
            var reg = new RegExp(t.substring(1, t.length - 1));
            if (tp == "number" && (typeof +t === "number"))
                template = +t;
            else if (t[0] == "/" && t[t.length - 1] == "/" && reg)
                template = reg;
            else
                template = t;
            return template;
        }
        ;
        if (_this.main_el.prop.valid_template_attr) {
            var temp = inp_el.getAttribute(_this.main_el.prop.valid_template_attr);
            if (temp)
                temp = templateParser(temp, _this.type);
            valid_template = valid_template || temp;
        }
        if (_this.main_el.prop.blocked_template_attr) {
            var temp = inp_el.getAttribute(_this.main_el.prop.blocked_template_attr);
            if (temp)
                temp = templateParser(temp, _this.type);
            blocked_template = blocked_template || temp;
        }
        if (_this.main_el.prop.start_validation_attr)
            start_validation = start_validation || inp_el.getAttribute(_this.main_el.prop.start_validation_attr);
        if (valid_template)
            _this.valid_template = valid_template;
        if (blocked_template)
            _this.blocked_template = blocked_template;
        if (start_validation)
            _this.start_validation = start_validation;
        return _this;
    }
    InputInstance.prototype.validate_input = function () {
        this.value = this.element.value;
        if (this.value === " ")
            this.value = "";
        if (!this.hidden) {
            var requir_b = true;
            var valid_b = true;
            if (this.required && !this.disabled && !this.value)
                requir_b = false;
            if (requir_b && this.valid_template && this.value) {
                if ((this.valid_template instanceof RegExp) && !this.valid_template.test(this.value))
                    valid_b = false;
                else if ((typeof this.valid_template == "number") && (+this.value !== this.valid_template))
                    valid_b = false;
                else if (((typeof this.valid_template == "string")) && (this.valid_template != this.value))
                    valid_b = false;
            }
            if (requir_b && valid_b && this.main_el.prop.valid_type_template && this.main_el.prop.valid_type_template[this.type] && this.value) {
                if (this.main_el.prop.valid_type_template[this.type] instanceof RegExp && !this.main_el.prop.valid_type_template[this.type].test(this.value))
                    valid_b = false;
                else if ((typeof this.main_el.prop.valid_type_template[this.type] == "number") && (this.main_el.prop.valid_type_template[this.type] !== +this.value))
                    valid_b = false;
                else if ((typeof this.main_el.prop.valid_type_template == "string") && this.main_el.prop.valid_type_template != this.value)
                    valid_b = false;
            }
            this.valid_state = (requir_b && valid_b) || false;
            if (this.type == "number" && !isNaN(+this.value))
                this.value = +this.value;
            var wrap_el = this.wrap_element || this.element;
            if (this.valid_state) {
                wrap_el.classList.remove(this.main_el.prop.inv_require_class);
                wrap_el.classList.remove(this.main_el.prop.inv_valid_class);
            }
            else if (!requir_b) {
                wrap_el.classList.add(this.main_el.prop.inv_require_class);
                wrap_el.classList.remove(this.main_el.prop.inv_valid_class);
            }
            else {
                wrap_el.classList.remove(this.main_el.prop.inv_require_class);
                wrap_el.classList.add(this.main_el.prop.inv_valid_class);
            }
            this.valid_custom_state = true;
            wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
        }
        else
            this.valid_state = true;
        if (this.valid_state && this.callback)
            this.callback();
    };
    InputInstance.prototype.performBlocked = function () {
        if (this.element.value === " ")
            this.element.value = "";
        var value = this.element.value;
        var valid = true;
        var main_template;
        if (this.main_el.prop.type_blocked_template && this.main_el.prop.type_blocked_template[this.type])
            main_template = this.main_el.prop.type_blocked_template[this.type];
        var template = this.blocked_template || main_template;
        if (value) {
            if ((template instanceof RegExp) && !template.test(value))
                valid = false;
            else if ((typeof template == "number") && template !== +value)
                valid = false;
            else if ((typeof template == "string") && template != value)
                valid = false;
        }
        if (valid) {
            if (this.type == "number" && !isNaN(+value))
                this.value = +value;
            else
                this.value = value;
        }
        else if (this.value !== undefined)
            this.element.value = this.value.toString();
        else
            this.element.value = "";
    };
    InputInstance.prototype.setFunctions = function () {
        var _this = this;
        var input_event = false;
        var change_event = false;
        var validation = false;
        var blocked = false;
        input_event = (this.start_validation == "input") || (this.form_el.start_validation == "input") || (this.main_el.prop.start_validation == "input");
        change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
        if (this.start_required || this.valid_template || (this.main_el.prop.valid_type_template && this.main_el.prop.valid_type_template[this.type]))
            validation = true;
        if (this.blocked_template || (this.main_el.prop.type_blocked_template && this.main_el.prop.type_blocked_template[this.type]))
            blocked = true;
        input_event = validation && input_event;
        change_event = validation && change_event;
        if (blocked && input_event) {
            this.element.addEventListener("input", function () {
                _this.performBlocked();
                _this.validate_input();
            });
        }
        else {
            if (blocked)
                this.element.addEventListener("input", function () {
                    _this.performBlocked();
                });
            if (input_event)
                this.element.addEventListener("input", function () {
                    _this.validate_input();
                });
        }
        if (change_event)
            this.element.addEventListener("change", function () {
                _this.validate_input();
            });
    };
    InputInstance.prototype.setInvalidCustom = function () {
        var wrap_el = this.wrap_element || this.element;
        this.valid_custom_state = false;
        wrap_el.classList.add(this.main_el.prop.inv_custom_class);
    };
    InputInstance.prototype.resetInput = function () {
        var wrap_el = this.wrap_element || this.element;
        wrap_el.classList.remove(this.main_el.prop.inv_require_class);
        wrap_el.classList.remove(this.main_el.prop.inv_valid_class);
        wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
        this.value = undefined;
        this.valid_state = undefined;
        this.valid_custom_state = undefined;
        if (this.start_value)
            this.element.value = this.start_value.toString();
        else
            this.element.value = "";
    };
    InputInstance.prototype.getValue = function () {
        if (this.value && !this.hidden)
            return this.value;
        else
            return false;
    };
    InputInstance.prototype.setHidden = function () {
        this.hidden = true;
        this.required = false;
        this.disabled = true;
        this.element.required = false;
        this.element.disabled = true;
    };
    InputInstance.prototype.delHidden = function () {
        this.hidden = false;
        this.required = this.start_required;
        this.disabled = this.start_disabled;
        this.element.required = this.start_required;
        this.element.disabled = this.start_disabled;
    };
    return InputInstance;
}(SetInpProperties));
var SelectInstance = /** @class */ (function (_super) {
    __extends(SelectInstance, _super);
    function SelectInstance(select_el, form_el, main_el, item_arg) {
        var _this = _super.call(this, select_el, form_el, main_el, item_arg) || this;
        _this.element = select_el;
        if (select_el.value)
            _this.start_value = select_el.value;
        var start_required, start_disabled;
        var start_validation;
        if (item_arg) {
            start_required = item_arg.required;
            start_disabled = item_arg.disabled;
            if (item_arg.start_validation && item_arg.start_validation == "change")
                start_validation = item_arg.start_validation;
        }
        _this.start_required = start_required || select_el.required || false;
        _this.start_disabled = start_disabled || select_el.disabled || false;
        _this.required = _this.start_required;
        _this.disabled = _this.start_disabled;
        if (_this.main_el.prop.start_validation_attr && select_el.getAttribute(_this.main_el.prop.start_validation_attr) == "change")
            start_validation = start_validation || "change";
        if (start_validation)
            _this.start_validation = start_validation;
        return _this;
    }
    SelectInstance.prototype.validate_input = function () {
        this.value = this.element.value;
        if (!this.hidden) {
            var requir_b = true;
            if (this.required && !this.element.disabled && !this.value)
                requir_b = false;
            this.valid_state = requir_b;
            var wrap_el = this.wrap_element || this.element;
            if (this.valid_state) {
                wrap_el.classList.remove(this.main_el.prop.inv_require_class);
            }
            else {
                wrap_el.classList.add(this.main_el.prop.inv_require_class);
            }
            this.valid_custom_state = true;
            wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
        }
        else
            this.valid_state = true;
        if (this.valid_state && this.callback)
            this.callback();
    };
    SelectInstance.prototype.setFunctions = function () {
        var _this = this;
        var change_event = false;
        var validation = false;
        change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
        if (this.start_required)
            validation = true;
        change_event = validation && change_event;
        if (change_event)
            this.element.addEventListener("change", function () {
                _this.validate_input();
            });
    };
    SelectInstance.prototype.setInvalidCustom = function () {
        var wrap_el = this.wrap_element || this.element;
        this.valid_custom_state = false;
        wrap_el.classList.add(this.main_el.prop.inv_custom_class);
    };
    SelectInstance.prototype.resetInput = function () {
        var wrap_el = this.wrap_element || this.element;
        wrap_el.classList.remove(this.main_el.prop.inv_require_class);
        wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
        this.value = undefined;
        this.valid_state = undefined;
        this.valid_custom_state = undefined;
        if (this.start_value)
            this.element.value = this.start_value;
        else
            this.element.value = "";
    };
    SelectInstance.prototype.getValue = function () {
        if (this.value && !this.hidden)
            return this.value;
        else
            return false;
    };
    SelectInstance.prototype.setHidden = function () {
        this.hidden = true;
        this.required = false;
        this.disabled = true;
        this.element.required = false;
        this.element.disabled = true;
    };
    SelectInstance.prototype.delHidden = function () {
        this.hidden = false;
        this.required = this.start_required;
        this.disabled = this.start_disabled;
        this.element.required = this.start_required;
        this.element.disabled = this.start_disabled;
    };
    return SelectInstance;
}(SetInpProperties));
var CheckInstance = /** @class */ (function (_super) {
    __extends(CheckInstance, _super);
    function CheckInstance(check_el, form_el, main_el, item_arg) {
        var _this = _super.call(this, check_el, form_el, main_el, item_arg) || this;
        _this.element = check_el;
        if (_this.element.value && _this.element.value != "on")
            _this.value = _this.element.value;
        else
            _this.value = "yes";
        var check = _this.element.checked;
        _this.start_checked = check;
        _this.checked = check;
        var start_required, start_disabled;
        var start_validation;
        if (item_arg) {
            start_required = item_arg.required;
            start_disabled = item_arg.disabled;
            if (item_arg.start_validation && item_arg.start_validation == "change")
                start_validation = item_arg.start_validation;
        }
        _this.start_required = start_required || check_el.required || false;
        _this.start_disabled = start_disabled || check_el.disabled || false;
        _this.required = _this.start_required;
        _this.disabled = _this.start_disabled;
        if (_this.main_el.prop.start_validation_attr && check_el.getAttribute(_this.main_el.prop.start_validation_attr) == "change")
            start_validation = start_validation || "change";
        if (start_validation)
            _this.start_validation = start_validation;
        return _this;
    }
    CheckInstance.prototype.validate_input = function () {
        this.checked = this.element.checked;
        if (!this.hidden) {
            var requir_b = true;
            if (this.required && !this.element.disabled && !this.checked)
                requir_b = false;
            this.valid_state = requir_b;
            if (this.checked) {
                if (this.element.value && this.element.value != "on")
                    this.value = this.element.value;
                else
                    this.value = "yes";
            }
            else
                this.value = "no";
            var wrap_el = this.wrap_element || this.element;
            if (this.valid_state) {
                wrap_el.classList.remove(this.main_el.prop.inv_require_class);
            }
            else {
                wrap_el.classList.add(this.main_el.prop.inv_require_class);
            }
            this.valid_custom_state = true;
            wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
        }
        else
            this.valid_state = true;
        if (this.valid_state && this.callback)
            this.callback();
    };
    CheckInstance.prototype.setFunctions = function () {
        var _this = this;
        var change_event = false;
        var validation = false;
        change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
        if (this.start_required)
            validation = true;
        change_event = validation && change_event;
        if (change_event)
            this.element.addEventListener("change", function () {
                _this.validate_input();
            });
    };
    CheckInstance.prototype.setInvalidCustom = function () {
        var wrap_el = this.wrap_element || this.element;
        this.valid_custom_state = false;
        wrap_el.classList.add(this.main_el.prop.inv_custom_class);
    };
    CheckInstance.prototype.resetInput = function () {
        var wrap_el = this.wrap_element || this.element;
        wrap_el.classList.remove(this.main_el.prop.inv_require_class);
        wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
        this.value = this.element.value || "no";
        this.checked = this.start_checked;
        this.element.checked = this.start_checked;
        this.valid_state = undefined;
        this.valid_custom_state = undefined;
    };
    CheckInstance.prototype.getValue = function () {
        if (!this.hidden)
            return this.value;
        else
            return false;
    };
    CheckInstance.prototype.setHidden = function () {
        this.hidden = true;
        this.required = false;
        this.disabled = true;
        this.element.required = false;
        this.element.disabled = true;
    };
    CheckInstance.prototype.delHidden = function () {
        this.hidden = false;
        this.required = this.start_required;
        this.disabled = this.start_disabled;
        this.element.required = this.start_required;
        this.element.disabled = this.start_disabled;
    };
    return CheckInstance;
}(SetInpProperties));
var RadioInstance = /** @class */ (function (_super) {
    __extends(RadioInstance, _super);
    function RadioInstance(radio_el, form_el, main_el, item_arg) {
        var _this = this;
        var element = radio_el[0];
        _this = _super.call(this, element, form_el, main_el, item_arg) || this;
        _this.element = radio_el;
        if (_this.element.value) {
            _this.start_value = _this.element.value;
            _this.value = _this.element.value;
        }
        var disabled = [], start_valid_attr, start_validation;
        ;
        if (_this.main_el.prop.start_validation_attr)
            start_valid_attr = _this.main_el.prop.start_validation_attr;
        for (var i = 0; i < radio_el.length; i++) {
            var el = radio_el[i];
            if (el.disabled)
                disabled[i] = i;
            if (el.getAttribute(_this.main_el.prop.start_validation_attr) == "change")
                start_validation = "change";
        }
        var start_required, start_disabled;
        if (item_arg) {
            start_required = item_arg.required;
            start_disabled = item_arg.disabled;
            if (item_arg.start_validation && item_arg.start_validation == "change")
                start_validation = "change";
        }
        _this.start_required = start_required || false;
        _this.disabled = [];
        if (start_disabled) {
            for (var j = 0; j < radio_el.length; j++) {
                _this.disabled[j] = j;
            }
            _this.start_disabled = _this.disabled;
        }
        else if (disabled.length) {
            _this.disabled = disabled;
            _this.start_disabled = disabled;
        }
        if (start_validation)
            _this.start_validation = start_validation;
        return _this;
    }
    RadioInstance.prototype.validate_input = function () {
        var _this = this;
        if (this.element.value)
            this.value = this.element.value;
        else
            this.value = null;
        if (!this.hidden) {
            var requir_b = true;
            var notdisabled = false;
            if (this.start_required) {
                for (var i = 0; i < this.element.length; i++) {
                    if (!this.element[i].disabled) {
                        notdisabled = true;
                        break;
                    }
                }
            }
            if (this.start_required && notdisabled && !this.value)
                requir_b = false;
            this.valid_state = requir_b;
            var wrap_el = [this.wrap_element] || this.element;
            if (this.valid_state) {
                wrap_el.forEach(function (el, i) {
                    el.classList.remove(_this.main_el.prop.inv_require_class);
                });
            }
            else {
                wrap_el.forEach(function (el, i) {
                    el.classList.add(_this.main_el.prop.inv_require_class);
                });
            }
            if (!this.valid_custom_state) {
                this.valid_custom_state = true;
                wrap_el.forEach(function (el, i) {
                    el.classList.remove(_this.main_el.prop.inv_custom_class);
                });
            }
        }
        else
            this.valid_state = true;
        if (this.valid_state && this.callback)
            this.callback();
    };
    RadioInstance.prototype.setFunctions = function () {
        var _this = this;
        var change_event = false;
        var validation = false;
        change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
        if (this.start_required)
            validation = true;
        change_event = validation && change_event;
        if (change_event) {
            for (var i = 0; i < this.element.length; i++) {
                var el = this.element[i];
                el.addEventListener("change", function () {
                    _this.validate_input();
                });
            }
        }
    };
    RadioInstance.prototype.setInvalidCustom = function () {
        var _this = this;
        var wrap_el = [this.wrap_element] || this.element;
        this.valid_custom_state = false;
        wrap_el.forEach(function (el, i) {
            el.classList.add(_this.main_el.prop.inv_custom_class);
        });
    };
    RadioInstance.prototype.resetInput = function () {
        var _this = this;
        var wrap_el = [this.wrap_element] || this.element;
        wrap_el.forEach(function (el, i) {
            el.classList.remove(_this.main_el.prop.inv_require_class);
            el.classList.remove(_this.main_el.prop.inv_custom_class);
        });
        if (this.start_value) {
            this.value = this.start_value;
            this.element.value = this.start_value;
        }
        else {
            this.value = undefined;
            this.element.value = "";
        }
        this.valid_state = undefined;
        this.valid_custom_state = undefined;
    };
    RadioInstance.prototype.getValue = function () {
        if (!this.hidden && this.value)
            return this.value;
        else
            return false;
    };
    RadioInstance.prototype.setHidden = function () {
        this.hidden = true;
        for (var i = 0; i < this.element.length; i++) {
            this.disabled[i] = i;
            this.element[i].disabled = true;
        }
    };
    RadioInstance.prototype.delHidden = function () {
        this.hidden = false;
        if (this.start_disabled) {
            this.disabled = this.start_disabled;
        }
        for (var i = 0; i < this.element.length; i++) {
            if (this.start_disabled[i])
                this.element[i].disabled = true;
            else
                this.element[i].disabled = false;
        }
    };
    return RadioInstance;
}(SetInpProperties));
var FormInstance = /** @class */ (function () {
    function FormInstance(form, main_el, call) {
        var _this = this;
        this.main_el = main_el;
        if (call)
            this.callback = call;
        if (typeof form.element == "string")
            this.element = document.querySelector("[name='" + form.element + "']");
        else
            this.element = form.element;
        this.name = this.element.name;
        if (form.start_validation)
            this.start_validation = form.start_validation;
        if (form.submit_el) {
            if (typeof form.submit_el == "string")
                this.submit_el = this.element.querySelector("[name='" + form.submit_el + "']");
            else
                this.submit_el = form.submit_el;
            this.submit_el.addEventListener("click", function (e) {
                e.preventDefault();
                _this.submitForm();
                return false;
            });
        }
        var items = {};
        var inps = this.element.elements;
        var temp_radio_names = [];
        for (var i = 0; i < inps.length; i++) {
            var inp_el = inps[i];
            var item_arg = void 0;
            if (form.items && form.items[inp_el.name])
                item_arg = form.items[inp_el.name];
            var tag_name = inp_el.tagName;
            if ((tag_name == "INPUT" && inp_el.type != "submit" && inp_el.type != "button" && inp_el.type != "checkbox" && inp_el.type != "radio") || tag_name == "TEXTAREA") {
                items[inp_el.name] = new InputInstance(inp_el, this, this.main_el, item_arg);
                items[inp_el.name].setFunctions();
            }
            else if (tag_name == "INPUT" && inp_el.type == "radio") {
                var tmp = void 0;
                for (var j = 0; j < temp_radio_names.length; j++) {
                    if (inp_el.name == temp_radio_names[i])
                        tmp = true;
                }
                if (!tmp) {
                    temp_radio_names.push(inp_el.name);
                    items[inp_el.name] = new RadioInstance(inps.namedItem(inp_el.name), this, this.main_el, item_arg);
                    items[inp_el.name].setFunctions();
                }
            }
            else if (tag_name == "INPUT" && inp_el.type == "checkbox") {
                items[inp_el.name] = new CheckInstance(inp_el, this, this.main_el, item_arg);
                items[inp_el.name].setFunctions();
            }
            else if (tag_name == "SELECT") {
                items[inp_el.name] = new SelectInstance(inp_el, this, this.main_el, item_arg);
                items[inp_el.name].setFunctions();
            }
        }
        this.items = items;
        this.checkHidden();
    }
    FormInstance.prototype.validateForm = function () {
        var valid = true;
        for (var key in this.items) {
            this.items[key].validate_input();
            if (!this.items[key].valid_state)
                valid = false;
        }
        this.valid_state = valid;
        return valid;
    };
    FormInstance.prototype.submitForm = function () {
        var _this = this;
        var valid = this.validateForm();
        var data = {};
        if (valid) {
            if (this.data)
                data.data = this.data;
            for (var key in this.items) {
                var value = this.items[key].getValue();
                if (value)
                    data[key] = value;
            }
            if (Object.keys(data).length) {
                if (this.callback) {
                    valid = true;
                    this.callback(this.element, data, function (server_resp) {
                        _this.afterSubmit(server_resp);
                    });
                }
                else
                    valid = false;
            }
            else
                valid = false;
        }
        return valid;
    };
    FormInstance.prototype.resetForm = function () {
        if (this.data)
            this.data = undefined;
        for (var key in this.items) {
            this.items[key].resetInput();
        }
    };
    FormInstance.prototype.afterSubmit = function (server_resp) {
        var valid;
        if (typeof server_resp === "boolean")
            valid = server_resp;
        else {
            valid = false;
            if (Array.isArray(server_resp)) {
                for (var i = 0; i < server_resp.length; i++) {
                    if (this.items[server_resp[i]]) {
                        this.items[server_resp[i]].setInvalidCustom();
                    }
                }
            }
        }
        if (valid) {
            this.resetForm();
        }
    };
    FormInstance.prototype.getData = function () {
        var data = {};
        if (this.data)
            data.data = this.data;
        for (var key in this.items) {
            var value = this.items[key].getValue();
            if (value)
                data[key] = value;
        }
        return data;
    };
    FormInstance.prototype.setHidden = function (el) {
        var inputs = el.querySelectorAll("input, textarea, select");
        for (var i = 0; i < inputs.length; i++) {
            var element = inputs[i];
            var tag_name = element.tagName;
            var inp_name = element.name;
            if ((tag_name == "INPUT" && element.type != "submit") || tag_name == "SELECT" || tag_name == "TEXTAREA") {
                if (this.items[inp_name]) {
                    this.items[inp_name].setHidden();
                }
            }
        }
    };
    FormInstance.prototype.delHidden = function (el) {
        var selector = "*:not(." + this.main_el.prop.hidden_class + ") input, *:not(." + this.main_el.prop.hidden_class + ") textarea, *:not(." + this.main_el.prop.hidden_class + ") select";
        var inputs = el.querySelectorAll(selector);
        for (var i = 0; i < inputs.length; i++) {
            var element = inputs[i];
            var tag_name = element.tagName;
            var inp_name = element.name;
            if ((tag_name == "INPUT" && element.type != "submit") || tag_name == "SELECT" || tag_name == "TEXTAREA") {
                if (this.items[inp_name]) {
                    this.items[inp_name].delHidden();
                }
            }
        }
    };
    FormInstance.prototype.checkHidden = function () {
        var hidden_elements = this.element.querySelectorAll("." + this.main_el.prop.hidden_class);
        for (var i = 0; i < hidden_elements.length; i++) {
            this.setHidden(hidden_elements[i]);
        }
    };
    return FormInstance;
}());
/* main validation class */
var Validation = /** @class */ (function () {
    function Validation(prop) {
        if (prop === void 0) { prop = VALID_PROP; }
        this.forms = {};
        this.prop = prop;
    }
    Validation.prototype.setForm = function (form, call) {
        var form_name;
        if (typeof form.element == "string")
            form_name = form.element;
        else
            form_name = form.element.name;
        this.forms[form_name] = new FormInstance(form, this, call);
    };
    Validation.prototype.setData = function (f_name, data) {
        var form = this.forms[f_name].data = data;
    };
    Validation.prototype.getData = function (form) {
        var form_name;
        if (typeof form == "string")
            form_name = form;
        else
            form_name = form.name;
        var data = this.forms[form_name].getData();
        return data;
    };
    Validation.prototype.changeHidden = function (form, el, hidden) {
        var form_name;
        if (typeof form == "string")
            form_name = form;
        else
            form_name = form.name;
        if (hidden)
            this.forms[form_name].setHidden(el);
        else
            this.forms[form_name].delHidden(el);
    };
    Validation.prototype.validateForm = function (form) {
        var form_name;
        if (typeof form == "string")
            form_name = form;
        else
            form_name = form.name;
        var res = this.forms[form_name].validateForm();
        return res;
    };
    Validation.prototype.submitForm = function (form) {
        var form_name;
        if (typeof form == "string")
            form_name = form;
        else
            form_name = form.name;
        var res = this.forms[form_name].submitForm();
        return res;
    };
    Validation.prototype.resetForm = function (form) {
        var form_name;
        if (typeof form == "string")
            form_name = form;
        else
            form_name = form.name;
        this.forms[form_name].resetForm();
    };
    return Validation;
}());
/* end Module Validation ---------------------------------------------------- */
// tslink:inject state-tasker.ts
// tslink:inject ajax.ts
/* end IMPORT MODULES ------------------------------------------------------- */
/* ========================================================================== */
/* copy contacts to buffer ------------- */
CopyTextToBuffer("contact_email_info", ".contact_text", "The email address was copied");
CopyTextToBuffer("contact_tel_info", ".contact_text", "The phone number was copied");
/* set range filter -------------------- */
var range_container = document.getElementById("selector_price_range");
if (range_container)
    new RangeFilter("selector_price_range").launchModule();
/* launch popup functionality ---------- */
var Popup = new PopupTrigger();
Popup.launchModule();
/* launch Slick sliders ---------------- */
$(function () {
    $("#home_slider").slick({
        arrows: false,
        appendDots: ".slider-indicator-block",
        dots: true,
        dotsClass: "slider-indicator-block-wrap",
        zIndex: 60
    });
    var gallery_slick = $("#product_gallery").slick({
        autoplay: true,
        arrows: false,
        dots: false,
        infinite: false,
        slidesToScroll: 1,
        zIndex: 30,
        asNavFor: "#product_gallery_nav",
        lazyLoad: "progressive"
    });
    var gallery_nav_slick = $("#product_gallery_nav").slick({
        autoplay: true,
        arrows: false,
        dots: false,
        infinite: false,
        asNavFor: "#product_gallery",
        slidesToShow: 3,
        slidesToScroll: 1,
        zIndex: 30,
        focusOnSelect: true
    });
    var distance;
    $("[data-product-gallery-item]").on("mousedown", function (e) {
        var slide = e.currentTarget;
        distance = e.clientX;
        $(slide).one("mouseup", function (e) {
            distance = e.clientX - distance;
            if (Math.abs(distance) < 10) {
                var popup_wrap = document.querySelector(".popup-custom");
                popup_wrap.innerHTML = "";
                var src = $(slide).find("img").attr("src");
                var img_el = document.createElement("img");
                img_el.src = src;
                img_el.classList.add("product-popup-image");
                popup_wrap.appendChild(img_el);
                $(gallery_slick).slick("slickPause");
                Popup.open("custom", function () {
                    $(gallery_slick).slick("slickPlay");
                });
            }
        });
    });
});
/* validation Properties ---------------------------------------------------- */
var validation = new Validation();
// subscribe form
var form_subscription = document.querySelector("form[name='subscription']");
if (form_subscription)
    validation.setForm({
        element: form_subscription,
        submit_el: "submit"
    }, function (form, data, call) {
        console.dir(data);
        call(true);
    });
// message form
var form_message = document.querySelector("form[name='message']");
if (form_message)
    validation.setForm({
        element: form_message,
        submit_el: "submit"
    }, function (form, data, call) {
        console.dir(data);
        call(true);
    });
// confirmation form
var label_form_confirmation = function () {
    var form_confirmation = document.querySelector("form[name='confirmation']");
    if (form_confirmation)
        validation.setForm({
            element: form_confirmation,
            items: {
                "shipping_method": {
                    callback: function () {
                        var value = this.value;
                        var new_post_block = $("#popup_confirm_newpost_block")[0];
                        var select_ukrpost = $("#popup_confirm_ukrpost_address")[0];
                        var select_ukrpost_value = $(select_ukrpost).find("select").val();
                        var ukrpost_block = $("#popup_confirm_ukrpost_newaddress")[0];
                        if (value == "New Post") {
                            $(select_ukrpost).addClass("hidden");
                            $(ukrpost_block).addClass("hidden");
                            $(new_post_block).removeClass("hidden");
                            validation.changeHidden(form_confirmation, select_ukrpost, true);
                            validation.changeHidden(form_confirmation, ukrpost_block, true);
                            validation.changeHidden(form_confirmation, new_post_block, false);
                        }
                        else if (value == "Ukrpost") {
                            $(new_post_block).addClass("hidden");
                            $(select_ukrpost).removeClass("hidden");
                            validation.changeHidden(form_confirmation, new_post_block, true);
                            validation.changeHidden(form_confirmation, select_ukrpost, false);
                            if (select_ukrpost_value == "add new address") {
                                $(ukrpost_block).removeClass("hidden");
                                validation.changeHidden(form_confirmation, ukrpost_block, false);
                            }
                            else {
                                $(ukrpost_block).addClass("hidden");
                                validation.changeHidden(form_confirmation, ukrpost_block, true);
                            }
                        }
                    }
                },
                "ukrpost_address": {
                    callback: function () {
                        var value = this.value;
                        var disabled = this.disabled;
                        var ukrpost_block = $("#popup_confirm_ukrpost_newaddress")[0];
                        if (!disabled) {
                            if (value == "add new address") {
                                $(ukrpost_block).removeClass("hidden");
                                validation.changeHidden(form_confirmation, ukrpost_block, false);
                            }
                            else {
                                $(ukrpost_block).addClass("hidden");
                                validation.changeHidden(form_confirmation, ukrpost_block, true);
                            }
                        }
                    }
                },
                "payment_method": {
                    callback: function () {
                        var value = this.value;
                        if (value == "Visa/MasterCard") {
                            $("#popup_confirm_paymentbtn").removeClass("hidden");
                            $("#popup_confirm_submit").addClass("hidden");
                        }
                        else if (value == "after receiving") {
                            $("#popup_confirm_paymentbtn").addClass("hidden");
                            $("#popup_confirm_submit").removeClass("hidden");
                        }
                    }
                }
            }
        });
    $("#popup_confirm_paymentbtn").click(function (e) {
        e.preventDefault();
        var bool = validation.validateForm(form_confirmation);
        if (bool) {
            var data = validation.getData(form_confirmation);
            console.dir(data);
            validation.resetForm(form_confirmation);
        }
    });
    $("#popup_confirm_submit").click(function (e) {
        e.preventDefault();
        var bool = validation.validateForm(form_confirmation);
        if (bool) {
            var data = validation.getData(form_confirmation);
            console.dir(data);
            validation.resetForm(form_confirmation);
        }
    });
    return true;
};
// Forgot password form
var label_form_forgot_password = function () {
    var form_forgot_password = document.querySelector("form[name='forgot_password']");
    if (form_forgot_password)
        validation.setForm({
            element: form_forgot_password,
            submit_el: "submit"
        }, function (form, data, call) {
            console.dir(data);
            call(true);
        });
    return true;
};
// login form
var form_login = document.querySelector("form[name='log_in']");
if (form_login)
    validation.setForm({
        element: form_login,
        submit_el: "submit"
    }, function (form, data, call) {
        console.dir(data);
        call(true);
    });
// new_password form
var label_form_new_password = function () {
    var form_new_password = document.querySelector("form[name='new_password']");
    if (form_new_password)
        validation.setForm({
            element: form_new_password,
            submit_el: "submit",
            items: {
                "rep_password": {
                    callback: function () {
                        var value = this.value;
                        var previous_pass = this.form_el.items["password"].value;
                        if (value != previous_pass) {
                            this.valid_state = false;
                            this.wrap_element.classList.add(this.main_el.prop.inv_valid_class);
                        }
                    }
                }
            }
        }, function (form, data, call) {
            console.dir(data);
            call(true);
        });
    return true;
};
// search_form form
var form_search_form = document.querySelector("form[name='search_form']");
if (form_search_form)
    validation.setForm({
        element: form_search_form
    });
// sign_in form
var form_sign_in = document.querySelector("form[name='sign_in']");
if (form_sign_in)
    validation.setForm({
        element: form_sign_in,
        submit_el: "submit",
        items: {
            "rep_password": {
                callback: function () {
                    var value = this.value;
                    var previous_pass = this.form_el.items["password"].value;
                    if (value != previous_pass) {
                        this.valid_state = false;
                        this.wrap_element.classList.add(this.main_el.prop.inv_valid_class);
                    }
                    console.dir(this.form_el);
                }
            }
        }
    }, function (form, data, call) {
        console.dir(data);
        call(true);
    });
$("#check_shipping_info").change(function (e) {
    var el = $("#signin_shipping_info")[0];
    if (e.currentTarget.checked) {
        $(el).removeClass("hidden");
        validation.changeHidden(form_sign_in, el, false);
    }
    else {
        $(el).addClass("hidden");
        validation.changeHidden(form_sign_in, el, true);
    }
});
/* end Validation Properties ------------------------------------------------ */
