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
function getAttrVal(el, attr_name) {
    return el.querySelector("[" + attr_name + "]").getAttribute(attr_name);
}
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
        top: el_coord.top + (window.pageYOffset || document.documentElement.scrollTop),
        left: el_coord.left,
        width: el_coord.right - el_coord.left
    };
    var tt_dimens = {
        top: el_dimens.top + el_coord.height,
        left: el_dimens.left + (el_dimens.width / 2)
    };
    tooltip.style.display = "block";
    tooltip.classList.remove(hidden_class);
    tooltip.innerHTML = text;
    tooltip.style.top = tt_dimens.top + "px";
    tooltip.style.left = tt_dimens.left + "px";
    var tt_coord = tooltip.getBoundingClientRect();
    tt_dimens.width = tt_coord.right - tt_coord.left;
    if (tt_dimens.width > +(win_width / 100 * 95).toFixed(0)) {
        tt_dimens.width = +(win_width / 100 * 95).toFixed(0);
    }
    if (tt_dimens.width + tt_dimens.left > win_width) {
        if (tt_dimens.left - tt_dimens.width < 0) {
            tooltip.style.left = "0px";
            tooltip.style.right = "auto";
        }
        else {
            tooltip.style.left = "auto";
            tooltip.style.right = (win_width - tt_dimens.left) + "px";
        }
    }
    setTimeout(function () {
        tooltip.classList.add(hidden_class);
    }, time);
}
function CopyTextToBuffer(trigger_id, text_el_selector, tooltip_msg) {
    if (tooltip_msg === void 0) { tooltip_msg = "The text was copied"; }
    var trigger_el = document.querySelectorAll(trigger_id);
    if (trigger_el && trigger_el.length) {
        var _loop_1 = function (i) {
            var text_el = trigger_el[i].querySelector(text_el_selector);
            trigger_el[i].onclick = function (e) {
                e.preventDefault();
                if (document.createRange) {
                    var range = document.createRange();
                    range.selectNodeContents(text_el);
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand("copy", false, null);
                    selection.removeAllRanges();
                    performTooltip(text_el, tooltip_msg);
                }
            };
        };
        for (var i = 0; i < trigger_el.length; i++) {
            _loop_1(i);
        }
    }
}
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
var PopupTrigger = (function () {
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
var RangeFilter = (function () {
    function RangeFilter(block_id, properties, callback, err_msg, DOM_selectors) {
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
        if (callback)
            this.callback_func = callback;
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
                    this.callback_func();
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
                    this.callback_func();
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
            this.callback_func();
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
            this.callback_func();
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
var SetInpProperties = (function () {
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
var InputInstance = (function (_super) {
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
var SelectInstance = (function (_super) {
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
var CheckInstance = (function (_super) {
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
var RadioInstance = (function (_super) {
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
var FormInstance = (function () {
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
var Validation = (function () {
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
        this.forms[f_name].data = data;
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
var DEF_PROP = {
    content_type: {
        name: "Content-Type",
        value: {
            text: "text/plain",
            object: "application/json"
        }
    },
    status_desc: {
        succ: {
            200: "200 OK",
            201: "201 Created",
            204: "204 No Content",
            205: "205 Reset Content",
            304: "304 Not Modified"
        },
        error: {
            400: "400 Bad Request",
            401: "401 Unauthorized",
            403: "403 Forbidden",
            404: "404 Not Found",
            405: "405 Method Not Allowed",
            406: "406 Not Acceptable",
            415: "415 Unsupported Media Type",
            500: "500 Internal Server Error",
            502: "502 Bad Gateway",
            503: "503 Service Unavailable"
        }
    },
    callbacks: {
        error: function (error_desc, status) {
            var el = document.getElementById("info_popup_text");
            var div = document.createElement("div");
            div.classList.add("text_important");
            div.innerText = error_desc;
            el.innerHTML = "";
            el.appendChild(div);
            Popup.open("information");
        }
    }
};
var HttpRequest = (function () {
    function HttpRequest() {
        this.prop = DEF_PROP;
    }
    HttpRequest.prototype.req_fabric = function (prop) {
        var xhr = new XMLHttpRequest();
        var req_class = this;
        if (prop.param) {
            var param = "";
            var first = true;
            for (var key in prop.param) {
                if (first)
                    param += "?";
                else
                    param += "&";
                param += (key + "=" + prop.param[key]);
                first = false;
            }
            prop.action += param;
        }
        if (prop.data) {
            if (typeof prop.data != "string") {
                prop.data = JSON.stringify(prop.data);
                prop.type = "application/json";
            }
            else
                prop.type = "text/plain";
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (!req_class.prop.status_desc.succ[xhr.status]) {
                    console.error(xhr.status + ":" + (xhr.statusText || req_class.prop.status_desc.error[xhr.status]));
                    prop.callbacks.error("Server error: " + (xhr.statusText || req_class.prop.status_desc.error[xhr.status]), xhr.status);
                }
                else {
                    var data = void 0;
                    if (prop.responsType && prop.responsType == "json" && xhr.responseText) {
                        if (JSON.parse(xhr.responseText))
                            data = JSON.parse(xhr.responseText);
                    }
                    else
                        data = xhr.responseText;
                    if (prop.callbacks.code_succ && prop.callbacks.code_succ[xhr.status])
                        prop.callbacks.code_succ[xhr.status](data, xhr.status);
                    if (prop.callbacks.success)
                        prop.callbacks.success(data, xhr.status);
                }
            }
        };
        xhr.open(prop.method, prop.action, true);
        xhr.setRequestHeader(prop.contect_type || this.prop.content_type.name, prop.content_type_val || prop.type);
        if (prop.data)
            xhr.send(prop.data);
        else
            xhr.send();
    };
    HttpRequest.prototype._get = function (prop) {
        var callbacks;
        if (prop.callbacks) {
            callbacks = {
                error: prop.callbacks.error || undefined,
                success: prop.callbacks.success || undefined,
                code_succ: prop.callbacks.code_succ || undefined
            };
        }
        if (!callbacks) {
            callbacks = {
                error: this.prop.callbacks.error
            };
        }
        var new_prop = {
            method: "GET",
            action: prop.action,
            param: prop.parameters || undefined,
            responsType: prop.responsType,
            contect_type: prop.contect_type || undefined,
            content_type_val: prop.content_type_val || undefined,
            callbacks: {
                error: callbacks.error || this.prop.callbacks.error,
                success: callbacks.success,
                code_succ: callbacks.code_succ
            }
        };
        this.req_fabric(new_prop);
    };
    HttpRequest.prototype._post = function (prop) {
        var callbacks;
        if (prop.callbacks) {
            callbacks = {
                error: prop.callbacks.error || undefined,
                success: prop.callbacks.success || undefined,
                code_succ: prop.callbacks.code_succ || undefined
            };
        }
        if (!callbacks) {
            callbacks = {
                error: this.prop.callbacks.error
            };
        }
        var new_prop = {
            method: "POST",
            action: prop.action,
            data: prop.data,
            responsType: prop.responsType,
            contect_type: prop.contect_type || undefined,
            content_type_val: prop.content_type_val || undefined,
            callbacks: {
                error: callbacks.error || this.prop.callbacks.error,
                success: callbacks.success,
                code_succ: callbacks.code_succ
            }
        };
        this.req_fabric(new_prop);
    };
    HttpRequest.prototype._put = function (prop) {
        var callbacks;
        if (prop.callbacks) {
            callbacks = {
                error: prop.callbacks.error || undefined,
                success: prop.callbacks.success || undefined,
                code_succ: prop.callbacks.code_succ || undefined
            };
        }
        if (!callbacks) {
            callbacks = {
                error: this.prop.callbacks.error
            };
        }
        var new_prop = {
            method: "PUT",
            action: prop.action,
            data: prop.data,
            responsType: prop.responsType,
            contect_type: prop.contect_type || undefined,
            content_type_val: prop.content_type_val || undefined,
            callbacks: {
                error: callbacks.error || this.prop.callbacks.error,
                success: callbacks.success,
                code_succ: callbacks.code_succ
            }
        };
        this.req_fabric(new_prop);
    };
    HttpRequest.prototype._delete = function (prop) {
        var callbacks;
        if (prop.callbacks) {
            callbacks = {
                error: prop.callbacks.error || undefined,
                success: prop.callbacks.success || undefined,
                code_succ: prop.callbacks.code_succ || undefined
            };
        }
        if (!callbacks) {
            callbacks = {
                error: this.prop.callbacks.error
            };
        }
        var new_prop = {
            method: "DELETE",
            action: prop.action,
            data: prop.data,
            responsType: prop.responsType,
            contect_type: prop.contect_type || undefined,
            content_type_val: prop.content_type_val || undefined,
            callbacks: {
                error: callbacks.error || this.prop.callbacks.error,
                success: callbacks.success,
                code_succ: callbacks.code_succ
            }
        };
        this.req_fabric(new_prop);
    };
    return HttpRequest;
}());
var Request_ = new HttpRequest();
var LocPopup = (function () {
    function LocPopup(parent_id, style) {
        var _this = this;
        this.parent_el = document.getElementById(parent_id);
        this.style = style || "hidden";
        this.items = {};
        this.open_state = false;
        window.addEventListener("click", function (e) {
            if (e.target.closest(parent_id) || _this.open_state) {
                _this.open_state = false;
                return;
            }
            for (var key in _this.items) {
                _this.close(key);
            }
        });
    }
    LocPopup.prototype.setPopup = function (id) {
        var el = document.getElementById(id);
        this.items[id] = el;
    };
    LocPopup.prototype.openWithMouse = function (id, e) {
        var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var click_x = e.clientX;
        var click_y = e.clientY;
        var position_side = "left";
        var position_noside = "right";
        this.items[id].style.top = click_y + "px";
        this.items[id].classList.remove(this.style);
        var el_width = this.items[id].getBoundingClientRect().width;
        if (click_x + el_width > window_width) {
            position_side = "right";
            position_noside = "left";
            click_x = window_width - click_x;
        }
        this.items[id].style[position_side] = click_x + "px";
        this.items[id].style[position_noside] = "auto";
        this.open_state = true;
    };
    LocPopup.prototype.open = function (id, top, left) {
        var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var position = left;
        var position_side = "left";
        var position_noside = "right";
        this.items[id].style.top = top + "px";
        this.items[id].classList.remove(this.style);
        var el_width = this.items[id].getBoundingClientRect().width;
        if (left + el_width > window_width) {
            position_side = "right";
            position_noside = "left";
            position = window_width - position;
        }
        this.items[id].style[position_side] = position + "px";
        this.items[id].style[position_noside] = "auto";
        this.open_state = true;
    };
    LocPopup.prototype.close = function (id) {
        this.items[id].classList.add(this.style);
    };
    return LocPopup;
}());
function addSelectCountries(prop) {
    var countries = null;
    var selects = [];
    for (var i = 0; i < prop.length; i++) {
        var form = document.querySelector("form[name='" + prop[i].form_name + "']");
        var select = form.querySelector("select[name='" + prop[i].select_name + "']");
        selects[selects.length] = select;
    }
    var callback = function (data) {
        var options = "";
        for (var i = 0; i < data.length; i++) {
            var option = "<option value=\"" + data[i].name + "\">" + data[i].name + "</option>";
            options += option;
        }
        for (var j = 0; j < selects.length; j++) {
            var option_content = selects[j].innerHTML;
            selects[j].innerHTML = option_content + options;
        }
    };
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        }
    };
    xhr.open("GET", "https://restcountries.eu/rest/v2/all", true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send();
}
function compileMainMenu(menu_block, data, page_name) {
    var menu_obj = data;
    menu_block.innerHTML = "";
    for (var i = 0; i < menu_obj.length; i++) {
        var a = document.createElement("a");
        a.setAttribute("href", menu_obj[i].link);
        a.innerHTML = menu_obj[i].title;
        if (page_name == menu_obj[i].title.toLowerCase())
            a.classList.add("active");
        var li = document.createElement("li");
        li.appendChild(a);
        menu_block.appendChild(li);
    }
}
function compileFooterMenu(menu_block, data) {
    var menu_obj = data;
    menu_block.innerHTML = "";
    for (var i = 0; i < menu_obj.length; i++) {
        var a = document.createElement("a");
        a.setAttribute("href", menu_obj[i].link);
        a.innerHTML = menu_obj[i].title;
        var li = document.createElement("li");
        li.classList.add("footer_menu_item");
        li.appendChild(a);
        menu_block.appendChild(li);
    }
}
var CONFIRM_DEF_PROP = {
    popup_selector: "confirm_registered",
    form_name: "confirmation",
    payment_id: "confirm_payment_btn",
    submit_id: "confirm_confirm_btn",
    phone_blobk_id: "popup_confirm_phone_block",
    price_id: "popup_confirm_price"
};
var setConfirmation = (function () {
    function setConfirmation(prop) {
        if (prop === void 0) { prop = CONFIRM_DEF_PROP; }
        this.form_data = {
            popup_selector: prop.popup_selector,
            form_name: prop.form_name,
            payment_el: document.getElementById(prop.payment_id),
            submit_el: document.getElementById(prop.submit_id),
            phone_block: document.getElementById(prop.phone_blobk_id),
            price_el: document.getElementById(prop.price_id)
        };
    }
    setConfirmation.prototype.open = function (products, callback, user) {
        var _this = this;
        var total_qty = 0;
        var total_price = 0;
        for (var i = 0; i < products.length; i++) {
            total_qty++;
            total_price += products[i].total_price;
        }
        this.product_data = {
            total_price: total_price,
            total_qty: total_qty,
            items: products
        };
        this.form_data.price_el.innerHTML = total_price.toString();
        this.callback = callback;
        if (label_form_confirmation !== true && label_form_confirmation instanceof Function)
            label_form_confirmation();
        Popup.open(this.form_data.popup_selector);
        if (user) {
            this.user_data = {
                related_user: user._id,
                phone: user.phone,
                first_name: user.first_name,
                last_name: user.last_name,
                new_post_inf: user.new_post_inf,
                address: user.address
            };
        }
        else
            this.user_data = {
                phone: undefined,
                first_name: undefined,
                last_name: undefined
            };
        this.setUserData();
        this.form_data.submit_el.addEventListener("click", function (e) {
            e.preventDefault();
            _this.submit();
        });
        this.form_data.payment_el.addEventListener("click", function (e) {
            e.preventDefault();
            _this.payment();
        });
    };
    setConfirmation.prototype.submit = function () {
        var _this = this;
        var valid = validation.validateForm(this.form_data.form_name);
        var data = null;
        if (valid) {
            data = validation.getData(this.form_data.form_name);
            this.getUserData(data);
            this.shipping_method = data.shipping_method;
            this.payment_method = data.payment_method;
            var data_obj = {
                total_price: this.product_data.total_price,
                total_qty: this.product_data.total_qty,
                product_data: this.product_data.items,
                shipping_method: this.shipping_method,
                user_data: {
                    related_user: this.user_data.related_user,
                    phone: this.user_data.phone,
                    first_name: this.user_data.first_name,
                    last_name: this.user_data.last_name,
                    new_post_inf: this.user_data.new_post_inf,
                    address: this.user_data.address
                },
                payment_method: this.payment_method
            };
            var callback = function (data) {
                var info_block = document.getElementById("info_popup_text");
                info_block.innerHTML = "Thank You for Your order!";
                Popup.open("information");
                validation.resetForm(_this.form_data.form_name);
                _this.callback();
            };
            var prop = {
                action: "/orders",
                data: data_obj,
                callbacks: {
                    success: callback
                }
            };
            Request_._put(prop);
        }
    };
    setConfirmation.prototype.payment = function () {
        var valid = validation.validateForm(this.form_data.form_name);
        if (valid) {
            if (true)
                this.submit();
        }
    };
    setConfirmation.prototype.getUserData = function (data) {
        if (!this.user_data.phone)
            this.user_data.phone = data.empty_phone;
        if (data.shipping_method == "New Post") {
            this.user_data.first_name = data.newpost_first_name;
            this.user_data.last_name = data.newpost_last_name;
            this.user_data.new_post_inf = {
                newpost_city: data.newpost_city,
                newpost_department: data.newpost_department
            };
            this.user_data.address = undefined;
        }
        else if (data.shipping_method == "Ukrpost") {
            if (data.ukrpost_address == "add_new_address") {
                this.user_data.first_name = data.first_name;
                this.user_data.last_name = data.last_name;
                this.user_data.address = {
                    country_name: data.country_name,
                    city: data.city,
                    post_code: data.post_code,
                    street: data.street,
                    house_number: data.house_number
                };
            }
            else {
                this.user_data.new_post_inf = undefined;
            }
        }
    };
    setConfirmation.prototype.setUserData = function () {
        if (this.user_data) {
            if (this.user_data.phone) {
                this.form_data.phone_block.classList.add("hidden");
                validation.changeHidden(this.form_data.form_name, this.form_data.phone_block, true);
            }
            else {
                this.form_data.phone_block.classList.remove("hidden");
                validation.changeHidden(this.form_data.form_name, this.form_data.phone_block, false);
            }
            if (this.user_data.new_post_inf) {
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_city']").val(this.user_data.new_post_inf.newpost_city);
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_department']").val(this.user_data.new_post_inf.newpost_department);
            }
            else {
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_city']").val("");
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_department']").val("");
            }
            if (this.user_data.first_name)
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_first_name']").val(this.user_data.first_name);
            else
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_first_name']").val("");
            if (this.user_data.last_name)
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_last_name']").val(this.user_data.last_name);
            else
                $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_last_name']").val("");
            if (this.user_data.address) {
                $("<option>").val("old_address").text("old address").prop("selected", true).prependTo("form[name='" + this.form_data.form_name + "'] select[name='ukrpost_address']");
            }
            else {
                $("form[name='" + this.form_data.form_name + "'] select[name='ukrpost_address']").find("option[value='old_address']").remove();
                $("form[name='" + this.form_data.form_name + "'] select[name='ukrpost_address']").find("option[value='add_new_address']").prop("selected", true);
            }
        }
        else {
            $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_city']").val("");
            $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_department']").val("");
            $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_first_name']").val("");
            $("form[name='" + this.form_data.form_name + "']").find("[name='newpost_last_name']").val("");
            $("form[name='" + this.form_data.form_name + "'] select[name='ukrpost_address']").find("option[value='old_address']").remove();
            $("form[name='" + this.form_data.form_name + "'] select[name='ukrpost_address']").find("option[value='add_new_address']").prop("selected", true);
        }
    };
    return setConfirmation;
}());
var CART_PROP = {
    modal: "cart",
    submit_id: "popup_cart_confirm",
    cart_icon_wrap_id: "cart_icon_wrap",
    cart_count_id: "cart_qty",
    cart_icon_style_active: "active",
    item_data_attr: "data-cart-id",
    elements_data_attr: "data-in",
    count_attr: "data-count-qty",
    elements_attr_name: {
        item: "cartitem",
        main_photo: "cartitem_image",
        name: "cartitem_name",
        category_name: "cartitem_category",
        describe: "cartitem_description",
        size: "cartitem_size",
        total_price: "cartitem_price",
        del_btn: "cartitem_delete",
        target_qty: "product_target_qty",
        incr_qty: "product_plus_qty",
        decr_qty: "product_minus_qty"
    }
};
var Cart_ = (function () {
    function Cart_(prop) {
        var _this = this;
        if (prop === void 0) { prop = CART_PROP; }
        if (!prop.elements_attr_name)
            prop.elements_attr_name = CART_PROP.elements_attr_name;
        var items_container = $("[" + prop.elements_data_attr + "='" + prop.elements_attr_name.item + "']").parent()[0];
        this.items = [];
        this.prop = {
            modal: prop.modal,
            submit: document.getElementById(prop.submit_id),
            items_container: items_container,
            cart_icon_wrap: document.getElementById(prop.cart_icon_wrap_id),
            cart_count: document.getElementById(prop.cart_count_id),
            cart_icon_style_active: prop.cart_icon_style_active,
            item_element: items_container.innerHTML,
            item_data_attr: prop.item_data_attr,
            elements_data_attr: prop.elements_data_attr,
            count_attr: prop.count_attr,
            elements_attr_name: prop.elements_attr_name
        };
        items_container.innerHTML = "";
        this.prop.submit.addEventListener("click", function (e) {
            e.preventDefault();
            _this.submit();
        });
        this.manageCoockie(false);
        this.prop.cart_icon_wrap.addEventListener("click", function (e) {
            if (_this.items && _this.items.length)
                Popup.open(_this.prop.modal);
            else
                performTooltip(_this.prop.cart_icon_wrap, "Cart is empty");
        });
    }
    Cart_.prototype.addToCart = function (prod) {
        var contains = false;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == prod.id && this.items[i].color == prod.color && this.items[i].size == prod.size)
                contains = true;
        }
        if (contains)
            return false;
        else {
            this.items[this.items.length] = prod;
            this.itemCompilation(this.items[this.items.length - 1]);
            this.manageCoockie(true);
            this.manageCartIcon();
            return true;
        }
    };
    Cart_.prototype.itemCompilation = function (prod) {
        var _this = this;
        $(this.prop.items_container).append(this.prop.item_element);
        var element = $(this.prop.items_container).children("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.item + "']").last();
        $(element).attr(this.prop.item_data_attr, prod.id);
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.main_photo + "']").attr("src", prod.main_photo);
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.name + "']").text(prod.name);
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.category_name + "']").text(prod.category_name);
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.describe + "']").text(prod.describe);
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.size + "']").text(prod.size);
        $(element).find("[" + this.prop.count_attr + "='" + this.prop.elements_attr_name.target_qty + "']").text(prod.qty);
        $(element).find("[" + this.prop.count_attr + "='" + this.prop.elements_attr_name.incr_qty + "']").click(function (e) {
            e.preventDefault();
            _this.count_qty(prod.id, e.target, true);
        });
        $(element).find("[" + this.prop.count_attr + "='" + this.prop.elements_attr_name.decr_qty + "']").click(function (e) {
            e.preventDefault();
            _this.count_qty(prod.id, e.target, false);
        });
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.total_price + "']").text(prod.total_price);
        $(element).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.del_btn + "']").click(function (e) {
            e.preventDefault();
            var item_id = prod.id;
            for (var i = 0; i < _this.items.length; i++) {
                if (_this.items[i].id == item_id)
                    _this.items.splice(i, 1);
            }
            $(e.target).closest("[" + _this.prop.item_data_attr + "='" + item_id + "']").remove();
            _this.manageCoockie(true);
            if (!_this.items.length)
                Popup.close();
            _this.manageCartIcon();
        });
        prod.cart_el = element;
    };
    Cart_.prototype.checkExistItem = function (id, color, size) {
        var exist = false;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id && this.items[i].color == color && this.items[i].size == size) {
                exist = true;
                break;
            }
        }
        return exist;
    };
    Cart_.prototype.manageCoockie = function (set) {
        var TIME = 60 * 60 * 24 * 2;
        if (set) {
            docCookies.setItem("orders", JSON.stringify(this.items), TIME);
        }
        else {
            var coockie = docCookies.getItem("orders");
            if (coockie) {
                var coockie_arr = JSON.parse(coockie);
                if (coockie_arr instanceof Array && coockie_arr.length) {
                    this.items = [];
                    for (var i = 0; i < coockie_arr.length; i++) {
                        var order_item = coockie_arr[i];
                        this.items[i] = order_item;
                        this.itemCompilation(this.items[i]);
                    }
                    this.manageCartIcon();
                }
            }
        }
    };
    Cart_.prototype.manageCartIcon = function () {
        if (this.items && this.items.length) {
            var count = this.items.length;
            this.prop.cart_count.innerHTML = count.toString();
            this.prop.cart_icon_wrap.classList.add(this.prop.cart_icon_style_active);
        }
        else {
            this.prop.cart_count.innerHTML = "";
            this.prop.cart_icon_wrap.classList.remove(this.prop.cart_icon_style_active);
        }
    };
    Cart_.prototype.count_qty = function (id, target, up) {
        var item_id = id;
        var element = null;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == item_id)
                element = this.items[i];
        }
        var qty;
        if (up) {
            if (element.qty === element.max_qty) {
                performTooltip(target, "No more quantity in the shop");
                return;
            }
            else
                qty = ++element.qty;
        }
        else {
            if (element.qty === 1) {
                performTooltip(target, "It is minimum quantity");
                return;
            }
            else
                qty = --element.qty;
        }
        element.total_price = qty * element.price;
        $(element.cart_el).find("[" + this.prop.count_attr + "='" + this.prop.elements_attr_name.target_qty + "']").text(qty);
        $(element.cart_el).find("[" + this.prop.elements_data_attr + "='" + this.prop.elements_attr_name.total_price + "']").text(element.total_price);
        this.manageCoockie(true);
    };
    Cart_.prototype.submit = function () {
        var _this = this;
        if (this.items && this.items.length) {
            var product_data = [];
            for (var i = 0; i < this.items.length; i++) {
                var product = {
                    product_id: this.items[i]._id,
                    name: this.items[i].name,
                    prod_type: this.items[i].types,
                    price: this.items[i].price,
                    size: this.items[i].size,
                    color: this.items[i].color,
                    qty: this.items[i].qty,
                    total_price: this.items[i].total_price
                };
                product_data.push(product);
            }
            var user_data = logged_user || undefined;
            var callback = function () {
                _this.items = [];
                _this.manageCoockie(true);
                _this.manageCartIcon();
            };
            Confirm.open(product_data, callback, user_data);
        }
        else {
            performTooltip(this.prop.submit, "Cart is empty!");
            setTimeout(function () {
                Popup.close(_this.prop.modal);
            }, 3000);
        }
    };
    return Cart_;
}());
var MODULE_PROP = {
    form_name: "search_form",
    submit_id: "popup_search_submit",
    no_result_id: "popup_search_notfound",
    result_container_id: "popup_search_resultlist",
    loader_id: "popup_search_load",
    request_action: "/searchproducts",
    prod_directory_url: "/products?url=",
    ctgr_select: "search_categories",
    brand_select: "search_brand",
    selection_start: "<span class='text-highlighted'>",
    selection_end: "</span>",
    hidden_class: "hidden",
    res_data_attr: "data-in",
    res_data_attr_names: {
        item: "searchitem",
        image: "searchitem_image",
        name: "searchitem_name",
        category: "searchitem_category",
        description: "searchitem_description"
    }
};
var Search_ = (function () {
    function Search_(prop) {
        var _this = this;
        if (prop === void 0) { prop = MODULE_PROP; }
        if (prop.res_data_attr_names)
            this.res_data_attr_names = prop.res_data_attr_names;
        else
            this.res_data_attr_names = MODULE_PROP.res_data_attr_names;
        this.form_name = prop.form_name;
        this.submit_el = document.getElementById(prop.submit_id);
        this.no_result_el = document.getElementById(prop.no_result_id);
        this.result_container_el = document.getElementById(prop.result_container_id);
        this.loader_el = document.getElementById(prop.loader_id);
        this.request_action = prop.request_action;
        this.prod_directory_url = prop.prod_directory_url;
        this.hidden_class = prop.hidden_class;
        this.res_data_attr = prop.res_data_attr;
        this.ctgr_select = $("[" + this.res_data_attr + "='" + prop.ctgr_select + "']")[0];
        this.brand_select = $("[" + this.res_data_attr + "='" + prop.brand_select + "']")[0];
        this.item_html = this.result_container_el.innerHTML;
        this.result_container_el.innerHTML = "";
        this.selection_start = prop.selection_start;
        this.selection_end = prop.selection_end;
        this.submit_el.addEventListener("click", function (e) {
            e.preventDefault();
            _this.submit();
        });
        var categories_obj;
        var brands_obj;
        var interval_id;
        interval_id = window.setInterval(function () {
            if (categories) {
                if (categories.categories) {
                    categories_obj = categories.categories;
                    var old_content_ctgr = $(_this.ctgr_select).html();
                    for (var i = 0; i < categories_obj.items.length; i++) {
                        var category = "<option value=\"" + categories_obj.items[i].name + "\">" + categories_obj.items[i].title + "</option>";
                        old_content_ctgr += category;
                    }
                    $(_this.ctgr_select).html(old_content_ctgr);
                }
                if (categories.brands) {
                    brands_obj = categories.brands;
                    var old_content_brand = $(_this.brand_select).html();
                    for (var i = 0; i < brands_obj.items.length; i++) {
                        var brand = "<option value=\"" + brands_obj.items[i].name + "\">" + brands_obj.items[i].title + "</option>";
                        old_content_brand += brand;
                    }
                    $(_this.brand_select).html(old_content_brand);
                }
                window.clearInterval(interval_id);
            }
        }, 2000);
    }
    Search_.prototype.compileRes = function (data) {
        $(this.result_container_el).append(this.item_html);
        var el = $(this.result_container_el).find("[" + this.res_data_attr + "='" + this.res_data_attr_names.item + "']").last();
        $(el).attr("href", this.prod_directory_url + data.url);
        $(el).find("[" + this.res_data_attr + "='" + this.res_data_attr_names.image + "']").attr("src", data.main_photo);
        var item_name = data.name.replace(new RegExp(this.search_str, "ig"), (this.selection_start + "$&" + this.selection_end));
        $(el).find("[" + this.res_data_attr + "='" + this.res_data_attr_names.name + "']").html(item_name);
        var ctgr;
        if (data.category_title)
            ctgr = data.category_title;
        else
            ctgr = data.category_name;
        $(el).find("[" + this.res_data_attr + "='" + this.res_data_attr_names.category + "']").text(ctgr);
        if (data.describe) {
            var item_descr = data.describe.replace(new RegExp(this.search_str, "ig"), (this.selection_start + "$&" + this.selection_end));
            $(el).find("[" + this.res_data_attr + "='" + this.res_data_attr_names.description + "']").html(item_descr);
        }
    };
    Search_.prototype.submit = function () {
        var valid = validation.validateForm(this.form_name);
        if (valid) {
            var data = validation.getData(this.form_name);
            var req_data = {
                name: data.search
            };
            this.search_str = data.search;
            if (data.category && data.category != "all_categories")
                req_data.category = data.category;
            if (data.brand && data.brand != "all_brands")
                req_data.brand = data.brand;
            if (data.check_description && data.check_description != "no")
                req_data.check_description = true;
            this.request(req_data);
        }
    };
    Search_.prototype.request = function (req_data) {
        var _this = this;
        var req_str = "?";
        req_str += "name=" + req_data.name;
        if (req_data.category)
            req_str += "&category=" + req_data.category;
        if (req_data.brand)
            req_str += "&brand=" + req_data.brand;
        if (req_data.check_description)
            req_str += "&check_description=" + req_data.check_description;
        var callback = function (data) {
            _this.result_container_el.innerHTML = "";
            if (data instanceof Array && data.length) {
                _this.no_result_el.classList.add(_this.hidden_class);
                for (var i = 0; i < data.length; i++) {
                    _this.compileRes(data[i]);
                }
            }
            else {
                _this.no_result_el.classList.remove(_this.hidden_class);
            }
        };
        var prop = {
            action: this.request_action + req_str,
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._get(prop);
    };
    return Search_;
}());
var DEF_ARG_PROP = {
    getter_fc: null,
    data_attr: "data-in",
    data_attr_names: {
        block_selector: ".selector_block-item",
        item_list_selector: ".selector_item_list",
        category_title: "selector_category_title",
        item_list_type: "list_type",
        check_type: "selector_checkbox-item",
        like_radio_type: "selector_string-item",
        check_item_type_attr: "data-input-prop",
        range_block_id: "selector_price_range",
        range_block_type: "range_filter"
    }
};
var Categories_ = (function () {
    function Categories_(form_id, prop) {
        var _this = this;
        var all_prop = DEF_ARG_PROP;
        if (prop && (prop instanceof Function || prop instanceof Array))
            this.getter_fc = prop;
        else if (prop)
            all_prop = prop;
        this.form_el = document.getElementById(form_id);
        if (all_prop.getter_fc)
            this.getter_fc = all_prop.getter_fc;
        this.data_attr = all_prop.data_attr;
        this.data_attr_names = {
            block_selector: all_prop.data_attr_names.block_selector,
            item_list_selector: all_prop.data_attr_names.item_list_selector,
            item_list_type: all_prop.data_attr_names.item_list_type,
            category_title: all_prop.data_attr_names.category_title,
            check_item_type_attr: all_prop.data_attr_names.check_item_type_attr,
            range_block_id: all_prop.data_attr_names.range_block_id,
            range_block_type: all_prop.data_attr_names.range_block_type,
            check_type: all_prop.data_attr_names.check_type,
            like_radio_type: all_prop.data_attr_names.like_radio_type
        };
        this.check_item_html = $("[" + this.data_attr + "='" + this.data_attr_names.item_list_type + "']").clone();
        $("[" + this.data_attr + "='" + this.data_attr_names.item_list_type + "']").remove();
        var interval_id;
        interval_id = window.setInterval(function () {
            if (categories) {
                _this.categories = categories;
                if (categories.price_filter)
                    _this.compileRangeFilter();
                for (var key in categories) {
                    if (key == "price_filter")
                        continue;
                    _this.compileCheckItems(key);
                }
                window.clearInterval(interval_id);
            }
        }, 2000);
    }
    Categories_.prototype.compileCheckItems = function (key) {
        var _this = this;
        var element = this.categories[key];
        var block_new = $(this.check_item_html).clone();
        block_new.find("[" + this.data_attr + "='" + this.data_attr_names.category_title + "']").text(element.title);
        var list_block = $(block_new).find(this.data_attr_names.item_list_selector);
        var item_input = $(list_block).find("input").clone();
        var item_label = $(list_block).find("label").clone();
        $(list_block).empty();
        for (var i = 0; i < element.items.length; i++) {
            var item = element.items[i];
            var id = "check_" + key + "_" + item.name;
            var item_input_new = $(item_input).clone();
            item_input_new.attr("name", item.name);
            item_input_new.attr("id", id);
            item_input_new.attr("value", item.name);
            item_input_new.attr(this.data_attr_names.check_item_type_attr, element.data_input_prop);
            item_input_new.on("change", function (e) {
                var name = e.target.name;
                var value = e.target.checked;
                _this.changeCtgr(element, name, value);
                _this.performGetter();
            });
            var item_label_new = $(item_label).clone();
            item_label_new.addClass(element.data_input_prop).attr("for", id).text(item.title);
            list_block.append(item_input_new);
            list_block.append(item_label_new);
        }
        if (element.first)
            $(this.form_el).prepend(block_new);
        else
            $(this.form_el).append(block_new);
    };
    Categories_.prototype.compileRangeFilter = function () {
        var _this = this;
        $("[" + this.data_attr + "='" + this.data_attr_names.range_block_type + "']").find("[" + this.data_attr + "='" + this.data_attr_names.category_title + "']").text(this.categories.price_filter.title);
        var rangeFilter;
        var prop = {
            limit_top: this.categories.price_filter.top_point,
            limit_bottom: this.categories.price_filter.bottom_point,
            value_top: this.categories.price_filter.top_val,
            value_bottom: this.categories.price_filter.bottom_val,
            precision: 10
        };
        var callback = function () {
            var val = rangeFilter.getValues;
            _this.categories.price_filter.top_val = val.top;
            _this.categories.price_filter.bottom_val = val.bottom;
            _this.performGetter();
        };
        rangeFilter = new RangeFilter(this.data_attr_names.range_block_id, prop, callback);
        rangeFilter.launchModule();
    };
    Categories_.prototype.performGetter = function () {
        if (this.getter_fc) {
            var categories_1 = this.getData();
            if (this.getter_fc instanceof Function)
                this.getter_fc(categories_1);
            else if (this.getter_fc instanceof Array) {
                for (var i = 0; i < this.getter_fc.length; i++)
                    this.getter_fc[i](categories_1);
            }
        }
    };
    Categories_.prototype.setGetterFc = function (func) {
        this.getter_fc = func;
    };
    Categories_.prototype.getData = function () {
        var categories = {};
        for (var key in this.categories) {
            if (key == "price_filter") {
                categories[key] = this.categories[key];
                continue;
            }
            var el = this.categories[key];
            var el_new = {
                name: el.name,
                title: el.title,
                data_input_prop: el.data_input_prop
            };
            var items = el.items;
            var items_new = [];
            var not_null = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i].title === null) {
                    not_null = false;
                    items_new[items_new.length] = items[i];
                }
            }
            el_new.items = items_new;
            if (!not_null)
                categories[key] = el_new;
        }
        return categories;
    };
    Categories_.prototype.changeCtgr = function (el, name, value) {
        var tp = el.data_input_prop;
        for (var i = 0; i < el.items.length; i++) {
            if (el.items[i].name == name) {
                if (value)
                    el.items[i].title = null;
                else
                    el.items[i].title = "str";
            }
            else {
                if (tp == this.data_attr_names.like_radio_type) {
                    el.items[i].title = "str";
                    var id = "check_" + el.name + "_" + el.items[i].name;
                    document.getElementById(id).checked = false;
                }
            }
        }
    };
    return Categories_;
}());
var bigItem = (function () {
    function bigItem(prod, parent) {
        var _this = this;
        this.item = prod;
        this.parent = parent;
        this.attr_names = parent.data_attr_names;
        this.main_el = $(this.parent.html_el).clone();
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_url + "']").attr("href", this.attr_names.prod_directory_url + this.item.url);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.main_image + "']").attr("src", this.item.main_photo);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_name + "']").text(this.item.name);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_price + "']").text(this.item.price);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.soc_networks + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.openSocNetwork(el);
        });
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.add_cart + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.addToCart(el);
        });
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.like_btn + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.performLike(el);
        });
        if (this.item.liked)
            this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.like_btn + "']").addClass(this.parent.prop.active_class);
        var noempty_sizes = {
            s: false,
            m: false,
            l: false,
            xl: false
        };
        this.size_el = {};
        var color_html = $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_color + "'] button").clone();
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_color + "'] button").remove();
        for (var i = 0; i < this.item.qty.length; i++) {
            if (this.item.qty[i].name == "any") {
                this.any_color = true;
                this.color = "any";
                if (this.item.qty[i].sizes.any) {
                    this.any_size = true;
                    this.size = "any";
                    this.size_el = null;
                    break;
                }
                else {
                    for (var key in this.item.qty[i].sizes) {
                        if (Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value && Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value > 0)
                            Object.defineProperty(noempty_sizes, key, { value: true });
                    }
                }
                break;
            }
            else {
                var color = this.item.qty[i];
                var contain_size = false;
                if (this.item.qty[i].sizes.any) {
                    this.any_size = true;
                    this.size = "any";
                    this.size_el = null;
                }
                else {
                    for (var key in color.sizes) {
                        if (Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value && Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value > 0) {
                            Object.defineProperty(noempty_sizes, key, { value: true });
                            contain_size = true;
                        }
                    }
                }
                if (contain_size) {
                    color.el = $(color_html).clone();
                    color.el.attr(this.parent.prop.data_attr + "-color", color.name);
                    if (color.class_name)
                        color.el.addClass(color.class_name);
                    if (color.hash)
                        color.el.css("background-color", color.hash);
                    color.el.on("click", function (e) {
                        e.preventDefault();
                        var el = e.target;
                        _this.chooseColor(el);
                    });
                    $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.color_container + "']").append(color.el);
                }
            }
        }
        if (this.any_color)
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_color + "']").remove();
        if (this.any_size)
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_sizing + "']").remove();
        else {
            for (var key in noempty_sizes) {
                if (Object.getOwnPropertyDescriptor(noempty_sizes, key).value) {
                    var el = $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value + "'] button");
                    el.on("click", function (e) {
                        e.preventDefault();
                        var el = e.target;
                        _this.chooseSize(el);
                    });
                    Object.defineProperty(this.size_el, key, {
                        value: el,
                        configurable: true,
                        enumerable: true,
                        writable: true
                    });
                }
                else {
                    $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value + "']").remove();
                }
            }
        }
        this.qty = 1;
        $(this.parent.prop.container_el).append(this.main_el);
    }
    bigItem.prototype.performLike = function (el) {
        var _this = this;
        if (!el.classList.contains(this.attr_names.like_disabled_class)) {
            if (this.item.liked) {
                this.item.liked = false;
                el.classList.add(this.attr_names.like_active_class);
            }
            else {
                this.item.liked = true;
                el.classList.remove(this.attr_names.like_active_class);
            }
            var action = null;
            if (this.item.liked)
                action = this.attr_names.add_like_action;
            else
                action = this.attr_names.del_like_action;
            Request_._post({
                action: action,
                data: {
                    id: this.item._id,
                    types: this.item.types
                },
                callbacks: {
                    success: function () {
                        if (_this.item.liked)
                            $(_this.main_el).find("[" + _this.parent.prop.data_attr + "='" + _this.attr_names.like_btn + "']").addClass(_this.parent.prop.active_class);
                        else
                            $(_this.main_el).find("[" + _this.parent.prop.data_attr + "='" + _this.attr_names.like_btn + "']").removeClass(_this.parent.prop.active_class);
                    }
                }
            });
        }
        else {
            performTooltip(el, "Login for like!");
        }
    };
    bigItem.prototype.openSocNetwork = function (el) {
        if (this.item.soc_networks && this.item.soc_networks.length) {
            var soc_buttons = $("[" + this.attr_names.share_popup_attr + "='" + this.attr_names.share_popup_name + "']").find("a[" + this.parent.prop.data_attr + "]");
            for (var i = 0; i < soc_buttons.length; i++) {
                $(soc_buttons).addClass(this.parent.prop.hidden_class);
            }
            for (var i = 0; i < this.item.soc_networks.length; i++) {
                var attr_nm = Object.getOwnPropertyDescriptor(this.attr_names, "attr_name_" + this.item.soc_networks[i].title);
                var attr_name = null;
                if (attr_nm)
                    attr_name = attr_nm.value;
                var soc_el = $("[" + this.attr_names.share_popup_attr + "='" + this.attr_names.share_popup_name + "']").find("[" + this.parent.prop.data_attr + "='" + attr_name + "']");
                if (soc_el) {
                    soc_el[0].classList.remove(this.parent.prop.hidden_class);
                    if (this.item.soc_networks[i].class_name)
                        soc_el[0].classList.add(this.item.soc_networks[i].class_name);
                    $(soc_el).attr("href", this.item.soc_networks[i].link);
                }
            }
            Popup.open(this.attr_names.share_popup_name);
        }
        else
            performTooltip(el, "There are no socnetworks");
    };
    bigItem.prototype.addToCart = function (el) {
        if (!this.color) {
            color_loop: for (var i = 0; i < this.item.qty.length; i++) {
                if (!this.size) {
                    for (var key in this.item.qty[i].sizes) {
                        var descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key);
                        if (descriptor && descriptor.value > 0) {
                            this.color = this.item.qty[i].name;
                            this.size = key;
                            this.max_qty = descriptor.value;
                            break color_loop;
                        }
                    }
                }
                else {
                    var descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, this.size);
                    if (descriptor && descriptor.value > 0) {
                        this.color = this.item.qty[i].name;
                        this.max_qty = descriptor.value;
                        break;
                    }
                }
            }
        }
        if (!this.size) {
            color_loop: for (var i = 0; i < this.item.qty.length; i++) {
                if (this.item.qty[i].name == this.color) {
                    for (var key in this.item.qty[i].sizes) {
                        var descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key);
                        if (descriptor && descriptor.value > 0) {
                            this.size = key;
                            this.max_qty = descriptor.value;
                            break color_loop;
                        }
                    }
                }
            }
        }
        if (!this.max_qty) {
            for (var i = 0; i < this.item.qty.length; i++) {
                if (this.item.qty[i].name == this.color)
                    this.max_qty = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, this.size).value;
            }
        }
        var prod = {
            _id: this.item._id,
            id: this.item.id,
            name: this.item.name,
            describe: this.item.describe,
            main_photo: this.item.main_photo,
            price: this.item.price,
            category_name: this.item.category_name,
            types: this.item.types,
            color: this.color,
            size: this.size,
            qty: this.qty,
            max_qty: this.max_qty,
            total_price: this.item.price * this.qty
        };
        if (Cart.addToCart(prod)) {
            el.classList.add(this.attr_names.cart_animation_class);
            this.restoreInitEl();
        }
        else
            performTooltip(el, "Already in the cart");
    };
    bigItem.prototype.chooseSize = function (el) {
        var size = el.innerText;
        this.size = size;
        el.classList.add(this.parent.prop.active_class);
        var clearup_size = false;
        if (!this.any_color) {
            for (var i = 0; i < this.item.qty.length; i++) {
                var descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, size);
                if (descriptor && descriptor.value > 0) {
                    $(this.item.qty[i].el).removeClass(this.attr_names.empty_qty_class);
                }
                else {
                    if (this.item.qty[i].el) {
                        $(this.item.qty[i].el).addClass(this.attr_names.empty_qty_class);
                        if (this.item.qty[i].name == this.color) {
                            this.color = null;
                            $(this.item.qty[i].el).removeClass(this.parent.prop.active_class);
                            clearup_size = true;
                        }
                    }
                }
            }
        }
        for (var key in this.size_el) {
            var element = Object.getOwnPropertyDescriptor(this.size_el, key).value;
            if (key != size)
                $(element).removeClass(this.parent.prop.active_class);
            if (clearup_size)
                $(element).removeClass(this.attr_names.empty_qty_class);
        }
    };
    bigItem.prototype.chooseColor = function (el) {
        var color = $(el).attr(this.parent.prop.data_attr + "-color");
        this.color = color;
        el.classList.add(this.parent.prop.active_class);
        var clearup_color = false;
        var element = null;
        for (var i = 0; i < this.item.qty.length; i++) {
            if (this.item.qty[i].name != color)
                $(this.item.qty[i].el).removeClass(this.parent.prop.active_class);
            else
                element = this.item.qty[i];
        }
        if (!this.any_size) {
            for (var key in this.size_el) {
                var descriptor_size_qty = Object.getOwnPropertyDescriptor(element.sizes, key);
                var size_el = Object.getOwnPropertyDescriptor(this.size_el, key).value;
                if (descriptor_size_qty && descriptor_size_qty.value > 0) {
                    $(size_el).removeClass(this.attr_names.empty_qty_class);
                }
                else {
                    $(size_el).addClass(this.attr_names.empty_qty_class);
                    if (key == this.size) {
                        this.size = null;
                        $(size_el).removeClass(this.parent.prop.active_class);
                        clearup_color = true;
                    }
                }
            }
        }
        if (clearup_color) {
            for (var i = 0; i < this.item.qty.length; i++) {
                $(this.item.qty[i].el).removeClass(this.attr_names.empty_qty_class);
            }
        }
    };
    bigItem.prototype.restoreInitEl = function () {
        this.max_qty = null;
        this.total_price = null;
        if (!this.any_color)
            this.color = null;
        if (!this.any_size)
            this.size = null;
        if (Object.keys(this.size_el).length) {
            for (var key in this.size_el) {
                $(Object.getOwnPropertyDescriptor(this.size_el, key).value).removeClass(this.parent.prop.active_class + " " + this.attr_names.empty_qty_class);
            }
        }
        for (var i = 0; i < this.item.qty.length; i++) {
            if (this.item.qty[i].el)
                $(this.item.qty[i].el).removeClass(this.parent.prop.active_class + " " + this.attr_names.empty_qty_class);
        }
    };
    return bigItem;
}());
var ATTR_names_big_item = {
    product_url: "product_url",
    prod_directory_url: "/products?url=",
    main_image: "product_image",
    product_name: "product_name",
    product_price: "product_price",
    product_sizing: "product_sizing",
    product_sizes: {
        s: "product_size_s",
        m: "product_size_m",
        l: "product_size_l",
        xl: "product_size_xl"
    },
    product_color: "product_color",
    color_container: "color_choose",
    empty_qty_class: "empty",
    soc_networks: "product_network",
    add_cart: "product_tocart",
    cart_animation_class: "add-cart-animation",
    like_btn: "product_like",
    like_active_class: "active",
    like_disabled_class: "disabled",
    add_like_action: "/addlike",
    del_like_action: "/dellike",
    share_popup_name: "share_product",
    share_popup_attr: "data-popup-targ",
    attr_name_Facebook: "social_facebook",
    attr_name_Twitter: "social_twitter",
    attr_name_Google: "social_google",
    attr_name_Instagram: "social_instagram"
};
var littleItem = (function () {
    function littleItem(prod, parent) {
        var _this = this;
        this.item = prod;
        this.parent = parent;
        this.attr_names = parent.data_attr_names;
        this.main_el = $(this.parent.html_el).clone();
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_url + "']").attr("href", this.attr_names.prod_directory_url + this.item.url);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.main_image + "']").attr("src", this.item.main_photo);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_name + "']").text(this.item.name);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_price + "']").text(this.item.price);
        this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.add_cart + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.addToCart(el);
        });
        if (this.item.rating) {
            $(this.main_el.find("[" + this.parent.prop.data_attr + "='" + this.attr_names.rating_block + "']").addClass(this.attr_names.rating_class).find("*")[this.item.rating - 1]).addClass(this.attr_names.rating_class);
        }
        color_loop: for (var i = 0; i < this.item.qty.length; i++) {
            var color = this.item.qty[i];
            for (var key in color.sizes) {
                var qty = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value;
                if (qty && qty > 0) {
                    this.size = key;
                    this.color = this.item.qty[i].name;
                    this.max_qty = qty;
                    break color_loop;
                }
            }
        }
        this.qty = 1;
        $(this.parent.prop.container_el).append(this.main_el);
    }
    littleItem.prototype.addToCart = function (el) {
        var prod = {
            _id: this.item._id,
            id: this.item.id,
            name: this.item.name,
            describe: this.item.describe,
            main_photo: this.item.main_photo,
            price: this.item.price,
            category_name: this.item.category_name,
            types: this.item.types,
            color: this.color,
            size: this.size,
            qty: this.qty,
            max_qty: this.max_qty,
            total_price: this.item.price * this.qty
        };
        if (Cart.addToCart(prod)) {
            el.classList.add(this.attr_names.cart_animation_class);
        }
        else {
            performTooltip(el, "Already in the cart");
        }
    };
    return littleItem;
}());
var ATTR_names_little_item = {
    product_url: "product_url",
    prod_directory_url: "/products?url=",
    main_image: "product_image",
    product_name: "product_name",
    product_price: "product_price",
    add_cart: "product_tocart",
    cart_animation_class: "add-cart-animation",
    rating_block: "rating_stars",
    rating_class: "active"
};
var singleItem = (function () {
    function singleItem(prod, parent) {
        var _this = this;
        this.item = prod;
        this.parent = parent;
        this.attr_names = parent.data_attr_names;
        this.main_el = this.parent.prop.block_el;
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_name + "']").text(this.item.name);
        if (this.item.subtitle)
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_subtitle + "']").text(this.item.subtitle);
        else
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_subtitle + "']").remove();
        if (this.item.describe)
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_describe + "']").text(this.item.describe);
        else
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_describe + "']").remove();
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_price + "']").text(this.item.price);
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.order_cart + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.addToCart(el);
        });
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.soc_networks + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.openSocNetwork(el);
        });
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.add_cart + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.addToCart(el);
        });
        $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.like_btn + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.performLike(el);
        });
        if (this.item.liked)
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.like_btn + "']").addClass(this.parent.prop.active_class);
        var noempty_sizes = {
            s: false,
            m: false,
            l: false,
            xl: false
        };
        this.size_el = {};
        for (var i = 0; i < this.item.qty.length; i++) {
            if (this.item.qty[i].name == "any") {
                this.any_color = true;
                this.color = "any";
                if (this.item.qty[i].sizes.any) {
                    this.any_size = true;
                    this.size = "any";
                    this.size_el = null;
                    this.max_qty = this.item.qty[i].sizes.any;
                    break;
                }
                else {
                    for (var key in this.item.qty[i].sizes) {
                        var size = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value;
                        if (size && size > 0) {
                            Object.defineProperty(noempty_sizes, key, { value: true });
                            if (!this.size) {
                                this.size = key;
                                this.max_qty = size;
                            }
                        }
                    }
                }
                break;
            }
            else {
                var color = this.item.qty[i];
                var contain_size = false;
                if (this.item.qty[i].sizes.any) {
                    this.any_size = true;
                    this.size = "any";
                    this.size_el = null;
                    if (!this.max_qty)
                        this.max_qty = this.item.qty[i].sizes.any;
                }
                else {
                    for (var key in color.sizes) {
                        var size = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value;
                        if (size && size > 0) {
                            Object.defineProperty(noempty_sizes, key, { value: true });
                            contain_size = true;
                            if (!this.size) {
                                this.size = key;
                                this.max_qty = size;
                            }
                        }
                    }
                }
                if (contain_size) {
                    color.el = null;
                    if (!this.color)
                        this.color = color.name;
                }
            }
        }
        if (this.any_size)
            $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.product_sizing + "']").remove();
        else {
            for (var key in noempty_sizes) {
                if (Object.getOwnPropertyDescriptor(noempty_sizes, key).value) {
                    var el = $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value + "'] button");
                    el.on("click", function (e) {
                        e.preventDefault();
                        var el = e.target;
                        _this.chooseSize(el);
                    });
                    Object.defineProperty(this.size_el, key, {
                        value: el,
                        configurable: true,
                        enumerable: true,
                        writable: true
                    });
                }
                else {
                    $(this.main_el).find("[" + this.parent.prop.data_attr + "='" + Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value + "']").remove();
                }
            }
        }
        $(this.main_el).find("[" + this.attr_names.counter_data_attr + "='" + this.attr_names.counter_plus + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.changeQty(el, true);
        });
        $(this.main_el).find("[" + this.attr_names.counter_data_attr + "='" + this.attr_names.counter_minus + "']").on("click", function (e) {
            e.preventDefault();
            var el = e.target;
            _this.changeQty(el, false);
        });
        $(this.main_el).find("[" + this.attr_names.counter_data_attr + "='" + this.attr_names.counter_res + "']").text("1");
        if (this.item.photos && this.item.photos.length) {
            var slide_html = $("#" + this.attr_names.gallery_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_item + "']").clone();
            var nav_html = $("#" + this.attr_names.gallery_nav_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_nav + "']").clone();
            $("#" + this.attr_names.gallery_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_item_img + "']").attr("src", this.item.main_photo);
            $("#" + this.attr_names.gallery_nav_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_nav_img + "']").attr("src", this.item.main_photo);
            for (var i = 0; i < this.item.photos.length; i++) {
                var src = this.item.photos[i];
                var new_slide_item = $(slide_html).clone();
                var new_nav_item = $(nav_html).clone();
                $(new_slide_item).appendTo("#" + this.attr_names.gallery_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_item_img + "']").attr("src", src);
                $(new_nav_item).appendTo("#" + this.attr_names.gallery_nav_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_nav_img + "']").attr("src", src);
            }
            productSlider();
        }
        else {
            $("#" + this.attr_names.gallery_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_item_img + "']").attr("src", this.item.main_photo);
            $("#" + this.attr_names.gallery_nav_id).find("[" + this.parent.prop.data_attr + "='" + this.attr_names.gallery_nav + "']").remove();
        }
        this.qty = 1;
    }
    singleItem.prototype.performLike = function (el) {
        var _this = this;
        if (!el.classList.contains(this.attr_names.like_disabled_class)) {
            if (this.item.liked) {
                this.item.liked = false;
                el.classList.add(this.attr_names.like_active_class);
            }
            else {
                this.item.liked = true;
                el.classList.remove(this.attr_names.like_active_class);
            }
            var action = null;
            if (this.item.liked)
                action = this.attr_names.add_like_action;
            else
                action = this.attr_names.del_like_action;
            Request_._post({
                action: action,
                data: {
                    id: this.item._id,
                    types: this.item.types
                },
                callbacks: {
                    success: function () {
                        if (_this.item.liked)
                            $(_this.main_el).find("[" + _this.parent.prop.data_attr + "='" + _this.attr_names.like_btn + "']").addClass(_this.parent.prop.active_class);
                        else
                            $(_this.main_el).find("[" + _this.parent.prop.data_attr + "='" + _this.attr_names.like_btn + "']").removeClass(_this.parent.prop.active_class);
                    }
                }
            });
        }
        else {
            performTooltip(el, "Login for like!");
        }
    };
    singleItem.prototype.openSocNetwork = function (el) {
        if (this.item.soc_networks && this.item.soc_networks.length) {
            var soc_buttons = $("[" + this.attr_names.share_popup_attr + "='" + this.attr_names.share_popup_name + "']").find("a[" + this.parent.prop.data_attr + "]");
            for (var i = 0; i < soc_buttons.length; i++) {
                $(soc_buttons).addClass(this.parent.prop.hidden_class);
            }
            for (var i = 0; i < this.item.soc_networks.length; i++) {
                var attr_nm = Object.getOwnPropertyDescriptor(this.attr_names, "attr_name_" + this.item.soc_networks[i].title);
                var attr_name = null;
                if (attr_nm)
                    attr_name = attr_nm.value;
                var soc_el = $("[" + this.attr_names.share_popup_attr + "='" + this.attr_names.share_popup_name + "']").find("[" + this.parent.prop.data_attr + "='" + attr_name + "']");
                if (soc_el) {
                    soc_el[0].classList.remove(this.parent.prop.hidden_class);
                    if (this.item.soc_networks[i].class_name)
                        soc_el[0].classList.add(this.item.soc_networks[i].class_name);
                    $(soc_el).attr("href", this.item.soc_networks[i].link);
                }
            }
            Popup.open(this.attr_names.share_popup_name);
        }
        else
            performTooltip(el, "There are no socnetworks");
    };
    singleItem.prototype.addToCart = function (el) {
        var prod = {
            _id: this.item._id,
            id: this.item.id,
            name: this.item.name,
            describe: this.item.describe,
            main_photo: this.item.main_photo,
            price: this.item.price,
            category_name: this.item.category_name,
            types: this.item.types,
            color: this.color,
            size: this.size,
            qty: this.qty,
            max_qty: this.max_qty,
            total_price: this.item.price * this.qty
        };
        if (Cart.addToCart(prod)) {
            if (el.getAttribute(this.parent.prop.data_attr) == this.attr_names.add_cart)
                el.classList.add(this.attr_names.cart_animation_class);
            this.restoreInitEl();
        }
        else
            performTooltip(el, "Already in the cart");
    };
    singleItem.prototype.chooseSize = function (el) {
        var size = el.innerText.toLowerCase();
        this.size = size;
        el.classList.add(this.parent.prop.active_class);
        for (var i = 0; i < this.item.qty.length; i++) {
            if (this.any_color) {
                if (this.item.qty[i].name == "any") {
                    this.max_qty = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, size).value;
                }
            }
            else {
                var descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, size);
                if (descriptor && descriptor.value > 0) {
                    this.color = this.item.qty[i].name;
                    this.max_qty = descriptor.value;
                }
            }
        }
        if (this.qty > this.max_qty) {
            this.qty = this.max_qty;
            $(this.main_el).find("[" + this.attr_names.counter_data_attr + "='" + this.attr_names.counter_res + "']").text(this.qty);
        }
        for (var key in this.size_el) {
            var element = Object.getOwnPropertyDescriptor(this.size_el, key).value;
            if (key != size)
                $(element).removeClass(this.parent.prop.active_class);
        }
    };
    singleItem.prototype.changeQty = function (target, up) {
        var qty;
        if (up) {
            if (this.qty === this.max_qty) {
                performTooltip(target, "No more quantity in the shop");
                return;
            }
            else
                qty = ++this.qty;
        }
        else {
            if (this.qty === 1) {
                performTooltip(target, "It is minimum quantity");
                return;
            }
            else
                qty = --this.qty;
        }
        $(this.main_el).find("[" + this.attr_names.counter_data_attr + "='" + this.attr_names.counter_res + "']").text(qty);
    };
    singleItem.prototype.restoreInitEl = function () {
        this.qty = 1;
        $(this.main_el).find("[" + this.attr_names.counter_data_attr + "='" + this.attr_names.counter_res + "']").text(this.qty);
        if (this.size_el && Object.keys(this.size_el).length) {
            for (var key in this.size_el) {
                var element = Object.getOwnPropertyDescriptor(this.size_el, key).value;
                $(element).removeClass(this.parent.prop.active_class);
            }
        }
    };
    return singleItem;
}());
var ATTR_names_single_item = {
    product_name: "product_name",
    product_subtitle: "product_subtitle",
    product_describe: "product_describe",
    product_price: "product_price",
    product_sizing: "product_sizing",
    product_sizes: {
        s: "product_size_s",
        m: "product_size_m",
        l: "product_size_l",
        xl: "product_size_xl"
    },
    empty_qty_class: "empty",
    order_cart: "product_ordercart",
    soc_networks: "product_network",
    add_cart: "product_tocart",
    cart_animation_class: "add-cart-animation",
    like_btn: "product_like",
    like_active_class: "active",
    like_disabled_class: "disabled",
    add_like_action: "/addlike",
    del_like_action: "/dellike",
    share_popup_name: "share_product",
    share_popup_attr: "data-popup-targ",
    attr_name_Facebook: "social_facebook",
    attr_name_Twitter: "social_twitter",
    attr_name_Google: "social_google",
    attr_name_Instagram: "social_instagram",
    counter: "counter",
    counter_data_attr: "data-count-qty",
    counter_plus: "product_plus_qty",
    counter_minus: "product_minus_qty",
    counter_res: "product_target_qty",
    gallery_id: "product_gallery",
    gallery_nav_id: "product_gallery_nav",
    gallery_item: "prod_gallery_item",
    gallery_item_img: "prod_gallery_item_img",
    gallery_nav: "prod_gallery_nav",
    gallery_nav_img: "prod_gallery_nav_img"
};
var Products_ = (function () {
    function Products_(prop, related, attr_names, prod) {
        var _this = this;
        this.products = [];
        this.prop = {
            data_attr: prop.data_attr || "data-in",
            block_el: $(prop.block_selector)[0],
            block_type: prop.block_type,
            hidden_class: prop.hidden_class || "hidden",
            active_class: prop.active_class || "active"
        };
        if (prop.request_action)
            this.prop.request_action = prop.request_action;
        if (prop.block_type != "single item")
            this.prop.container_el = $(prop.block_selector).find("[" + (prop.data_attr || "data-in") + "='" + prop.container_attr_name + "']")[0];
        if (related)
            this.related_prop = related;
        if (prop.max_item)
            this.prop.max_item = prop.max_item;
        if (prop.loadmore_btn_id) {
            this.prop.loadmore_btn = document.getElementById(prop.loadmore_btn_id);
            prop.loadmore_block_attr_name = prop.loadmore_block_attr_name || "load_more_block";
            this.prop.loadmore_block = $(this.prop.block_el).find("[" + this.prop.data_attr + "='" + prop.loadmore_block_attr_name + "']")[0];
            this.prop.loadmore_btn.addEventListener("click", function (e) {
                e.preventDefault();
                _this.loadMoreElements();
            });
            this.prop.page_step = prop.page_step || 1;
        }
        if (attr_names)
            this.data_attr_names = attr_names;
        else {
            var attr_names_1;
            if (this.prop.block_type == "big item")
                attr_names_1 = ATTR_names_big_item;
            if (this.prop.block_type == "little item")
                attr_names_1 = ATTR_names_little_item;
            if (this.prop.block_type == "single item")
                attr_names_1 = ATTR_names_single_item;
            this.data_attr_names = attr_names_1;
        }
        if (this.prop.block_type != "single item") {
            this.html_el = $(this.prop.container_el).children().first().clone();
            $(this.prop.container_el).empty();
        }
        if (!prod)
            this.downloadElements();
        else
            this.downloadElements(null, prod);
        if (prop.categories)
            this.addCategory();
    }
    Products_.prototype.compileElement = function (elements) {
        if (elements.length) {
            var child_costructor = null;
            if (this.prop.block_type == "big item")
                child_costructor = bigItem;
            else if (this.prop.block_type == "little item")
                child_costructor = littleItem;
            else if (this.prop.block_type == "single item")
                child_costructor = singleItem;
            for (var i = 0; i < elements.length; i++) {
                this.products[this.products.length] = new child_costructor(elements[i], this);
            }
        }
    };
    Products_.prototype.downloadElements = function (more, prod) {
        var _this = this;
        var action = this.prop.request_action;
        var req_arguments = "";
        if (this.prop.loadmore_btn) {
            this.page = this.page || 1;
            req_arguments += "page=" + this.page + "&";
        }
        if (this.prop.categories)
            req_arguments += this.prop.categories;
        if (req_arguments)
            action += ("?" + req_arguments);
        var callback = function (data) {
            if (data) {
                if (data instanceof Array) {
                    if (!more) {
                        _this.products = [];
                        $(_this.prop.container_el).empty();
                    }
                    if (_this.prop.loadmore_btn && data.length && data.length >= _this.prop.page_step)
                        $(_this.prop.loadmore_block).removeClass(_this.prop.hidden_class);
                    else if (_this.prop.loadmore_btn)
                        $(_this.prop.loadmore_block).addClass(_this.prop.hidden_class);
                    if (_this.prop.max_item) {
                        data.splice(_this.prop.max_item);
                    }
                    if (logged_user && logged_user.liked_prod && logged_user.liked_prod.length) {
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < logged_user.liked_prod; j++) {
                                if (data[i]._id == logged_user.liked_prod[j]._id)
                                    data[i].liked = true;
                                else
                                    data[i].liked = false;
                            }
                        }
                    }
                    if (_this.related_prop && data[0].related_prod && data[0].related_prod.length)
                        new Products_(_this.related_prop, null, null, data[0].related_prod);
                    else if (_this.related_prop) {
                        $(_this.related_prop.block_selector).remove();
                    }
                }
                _this.compileElement(data);
            }
        };
        if (prod)
            callback(prod);
        var prop = {
            action: action,
            responsType: "json",
            callbacks: {
                success: callback
            }
        };
        if (!prod)
            Request_._get(prop);
    };
    Products_.prototype.loadMoreElements = function () {
        this.page++;
        this.downloadElements(true);
    };
    Products_.prototype.addCategory = function () {
        var _this = this;
        var interval_id;
        interval_id = window.setInterval(function () {
            if (categories) {
                Product_selecotr.setGetterFc(function (ctgr) {
                    _this.changeCategory(ctgr);
                });
                window.clearInterval(interval_id);
            }
        }, 2000);
    };
    Products_.prototype.changeCategory = function (ctgr) {
        var request = "ctgr=true&";
        for (var key in ctgr) {
            if (key == "price_filter") {
                request += "top_val=" + ctgr[key].top_val + "&";
                request += "bottom_val=" + ctgr[key].bottom_val + "&";
            }
            else {
                for (var i = 0; i < ctgr[key].items.length; i++) {
                    request += key + "=" + ctgr[key].items[i].name + "&";
                }
            }
        }
        this.prop.categories = request;
        this.page = 1;
        this.downloadElements();
    };
    return Products_;
}());
var validation = new Validation();
var Popup = new PopupTrigger();
Popup.launchModule();
var categories = {};
var ctgr_callback = function (data) {
    for (var i = 0; i < data.length; i++) {
        categories[data[i].name] = data[i];
    }
};
Request_._get({
    action: "/categories",
    callbacks: {
        success: ctgr_callback
    },
    responsType: "json"
});
var LocalPopup = new LocPopup("local_popup_parent");
LocalPopup.setPopup("logout_popup");
var Confirm = new setConfirmation();
var Cart = new Cart_();
var ctgr_selector_el = document.getElementById("product_selector");
var Product_selecotr;
if (ctgr_selector_el)
    Product_selecotr = new Categories_("product_selector");
addSelectCountries([{
        form_name: "sign_in",
        select_name: "country"
    }, {
        form_name: "confirmation",
        select_name: "country_name"
    }]);
CopyTextToBuffer("[data-in='contact_email_info']", ".contact_text", "The email address was copied");
CopyTextToBuffer("[data-in='contact_tel_info']", ".contact_text", "The phone number was copied");
function homeSlider() {
    $("#home_slider").slick({
        arrows: false,
        appendDots: ".slider-indicator-block",
        dots: true,
        dotsClass: "slider-indicator-block-wrap",
        zIndex: 60
    });
}
homeSlider();
function productSlider() {
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
}
;
var form_subscription = document.querySelector("form[name='subscription']");
if (form_subscription)
    validation.setForm({
        element: form_subscription,
        submit_el: "submit"
    }, function (form, data, call) {
        var callback = function (data) {
            var info_block = document.getElementById("info_popup_text");
            info_block.innerHTML = "Thank you for subscription!";
            Popup.open("information");
            call(true);
        };
        var prop = {
            action: "/mailing",
            data: data,
            callbacks: {
                success: callback
            }
        };
        Request_._put(prop);
    });
var form_message = document.querySelector("form[name='message']");
if (form_message)
    validation.setForm({
        element: form_message,
        submit_el: "submit"
    }, function (form, data, call) {
        var info_block = document.getElementById("info_popup_text");
        info_block.innerHTML = "Thank you for message!";
        Popup.open("information");
        call(true);
    });
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
                            if (select_ukrpost_value == "add_new_address") {
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
                            if (value == "add_new_address") {
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
    return true;
};
var form_forgot_password = document.querySelector("form[name='forgot_password']");
if (form_forgot_password)
    validation.setForm({
        element: form_forgot_password,
        submit_el: "submit"
    }, function (form, data, call) {
        var callback = function (data) {
            if (data && data instanceof Array) {
                var info_block = document.getElementById("info_popup_text");
                info_block.innerHTML = "Message has been sent to your email. Please follow the link in this message to change your password.";
                Popup.open("information");
            }
            else if (data instanceof Array) {
                call(data);
            }
        };
        var prop = {
            action: "/mailing",
            data: data,
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._put(prop);
    });
var form_login = document.querySelector("form[name='log_in']");
if (form_login)
    validation.setForm({
        element: form_login,
        submit_el: "submit"
    }, function (form, data, call) {
        var valid = validation.validateForm(form_login);
        if (valid) {
            var callback = function (data) {
                location.reload();
                call(true);
            };
            var prop = {
                action: "/login",
                data: data,
                callbacks: {
                    success: callback,
                    error: function (data) {
                        call(["password"]);
                    }
                }
            };
            Request_._post(prop);
        }
    });
$("#login_submit").click(function (e) {
    var valid = validation.validateForm(form_login);
    if (valid)
        return true;
    else
        return false;
});
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
var form_search_form = document.querySelector("form[name='search_form']");
if (form_search_form)
    validation.setForm({
        element: form_search_form
    });
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
        var callback = function (data) {
            var info_block = document.getElementById("info_popup_text");
            info_block.innerHTML = "Thank you for registration!<br>Message has been sent to your email. Please follow the link in this message to confirm email address.";
            Popup.open("information");
        };
        var user_data = {
            email: data.email
        };
        if (data.tel)
            user_data.phone = data.tel;
        if (data.shipping_info == "yes") {
            user_data.first_name = data.first_name;
            user_data.last_name = data.last_name;
            user_data.address = {
                country_name: data.country,
                city: data.city,
                post_code: data.post_code,
                street: data.street,
                house_number: data.house_number
            };
        }
        var prop = {
            action: "/user",
            data: user_data,
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._put(prop);
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
function setPage() {
    var page_name = null;
    if (document.getElementById("home_page"))
        page_name = "home";
    else if (document.getElementById("contact_page"))
        page_name = "contact";
    else if (document.getElementById("products_page"))
        page_name = "products";
    return page_name;
}
var PAGE_NAME = setPage();
setTimeout(function () {
    $("a[href='#']").on("click", function (e) {
        e.preventDefault();
    });
}, 3000);
function startCommonData() {
    var main_menu_block = document.getElementById("main_menu_list");
    if (main_menu_block) {
        var callback = function (data) {
            compileMainMenu(main_menu_block, data, PAGE_NAME);
        };
        var prop = {
            action: "/mainmenu",
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._get(prop);
    }
    var footer_menu_block = document.getElementById("footer_menu");
    if (footer_menu_block) {
        var callback = function (data) {
            compileFooterMenu(footer_menu_block, data);
        };
        var prop = {
            action: "/footermenu",
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._get(prop);
    }
    var email_info = $("[data-in='contact_email_info']");
    var tel_info = $("[data-in='contact_tel_info']");
    if (email_info || tel_info) {
        var callback = function (data) {
            if (email_info)
                $(email_info).find(".contact_text").text(data.email);
            if (tel_info)
                $(tel_info).find(".contact_text").text(data.phone);
        };
        var prop = {
            action: "/contacts",
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._get(prop);
    }
    var ATTR_NAME = "data-in";
    var facebook = $("[" + ATTR_NAME + "='social_facebook']");
    var twitter = $("[" + ATTR_NAME + "='social_twitter']");
    var google = $("[" + ATTR_NAME + "='social_google']");
    var instagram = $("[" + ATTR_NAME + "='social_instagram']");
    if (facebook.length || twitter.length || google.length || instagram.length) {
        var callback = function (data) {
            if (facebook.length) {
                var exist_fb = false;
                var exist_tw = false;
                var exist_gl = false;
                var exist_in = false;
                var _loop_2 = function (i) {
                    var target = null;
                    if (data[i].name.toLowerCase() == "facebook") {
                        target = facebook;
                        exist_fb = true;
                    }
                    if (data[i].name.toLowerCase() == "twitter") {
                        target = twitter;
                        exist_tw = true;
                    }
                    if (data[i].name.toLowerCase() == "google") {
                        target = google;
                        exist_gl = true;
                    }
                    if (data[i].name.toLowerCase() == "instagram") {
                        target = instagram;
                        exist_in = true;
                    }
                    $(target).attr("href", data[i].link).on("click", function (e) {
                        e.preventDefault();
                        window.open(data[i].link, "", "toolbar=0,status=0,scrollbars=1,width=626,height=436");
                    });
                    if (data[i].class_name)
                        $(target).addClass(data[i].class_name);
                };
                for (var i = 0; i < data.length; i++) {
                    _loop_2(i);
                }
                if (!exist_fb)
                    $(facebook).addClass("hidden");
                if (!exist_tw)
                    $(twitter).addClass("hidden");
                if (!exist_gl)
                    $(google).addClass("hidden");
                if (!exist_in)
                    $(instagram).addClass("hidden");
            }
        };
        var prop = {
            action: "/socnetworks",
            callbacks: {
                success: callback
            },
            responsType: "json"
        };
        Request_._get(prop);
    }
}
startCommonData();
var logged_user = null;
var user_icon = document.getElementById("user_auth_mark");
function authGetUser() {
    var callback = function (data, status) {
        if (status == 200) {
            logged_user = data;
            user_icon.classList.add("active");
            $("[data-in='product_like']").removeClass("disabled");
            user_icon.addEventListener("click", function (e) {
                LocalPopup.openWithMouse("logout_popup", e);
            });
        }
        else {
            $("[data-in='product_like']").addClass("disabled");
            user_icon.addEventListener("click", function (e) {
                Popup.open("login");
            });
        }
    };
    var prop = {
        action: "/getuser",
        callbacks: {
            success: callback,
            error: function () {
                $("[data-in='product_like']").addClass("disabled");
                user_icon.addEventListener("click", function (e) {
                    Popup.open("login");
                });
            }
        },
        responsType: "json"
    };
    Request_._get(prop);
}
authGetUser();
function logoutUser() {
    var callback = function (data, status) {
        location.reload();
    };
    var prop = {
        action: "/logout",
        callbacks: {
            success: callback
        }
    };
    Request_._get(prop);
}
var logout = document.getElementById("logout_btn");
if (logout) {
    logout.addEventListener("click", function () {
        logoutUser();
    });
}
var contacts = document.getElementById("contact_info_address");
if (contacts) {
    var callback = function (data, status) {
        var contact_str = "";
        if (data.country_name)
            contact_str += data.country_name + ", ";
        if (data.city)
            contact_str += data.city + ", ";
        if (data.street)
            contact_str += data.street + " ";
        if (data.house_number)
            contact_str += data.house_number;
        $(contacts).text(contact_str);
    };
    var prop = {
        action: "/contacts",
        callbacks: {
            success: callback
        },
        responsType: "json"
    };
    Request_._get(prop);
}
var search_form = $("form[name='search_form']")[0];
if (search_form)
    new Search_();
var new_arrivals_prop = {
    block_selector: "[data-in='section_newarrivals']",
    container_attr_name: "prod_items_block",
    block_type: "big item",
    loadmore_btn_id: "load_new_arrivals",
    loadmore_block_attr_name: "load_more_block",
    page_step: 4,
    request_action: "/newarrivals"
};
if ($("[data-in='section_newarrivals']").length)
    new Products_(new_arrivals_prop);
var best_sales_prop = {
    block_selector: "[data-in='section_bestsales']",
    container_attr_name: "prod_items_block",
    block_type: "little item",
    request_action: "/bestsales",
    max_item: 3
};
if ($("[data-in='section_bestsales']").length)
    new Products_(best_sales_prop);
var prod_url = window.location.search.replace("?url=", "");
var related_prod_prop = {
    block_selector: "[data-in='section_relatedproducts']",
    container_attr_name: "prod_items_block",
    block_type: "big item",
    max_item: 4
};
var prod_page_prop = {
    block_selector: "[data-in='section_productdescribe']",
    block_type: "single item",
    request_action: "/products?link=" + prod_url
};
if ($("[data-in='section_productdescribe']").length && prod_url)
    new Products_(prod_page_prop, related_prod_prop);
var products_page_prop = {
    block_selector: "[data-in='section_productlist']",
    container_attr_name: "prod_items_block",
    block_type: "big item",
    loadmore_btn_id: "load_products_page",
    loadmore_block_attr_name: "load_more_block",
    page_step: 9,
    request_action: "/products",
    categories: true
};
if ($("[data-in='section_productlist']").length)
    new Products_(products_page_prop);
