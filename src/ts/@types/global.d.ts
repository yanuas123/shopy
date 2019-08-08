
// global popup
import {PopupTrigger} from "../plug-modules/popup";
export declare let Popup: PopupTrigger;

// global validation
import {TemplateTypes, SubmitEl, InpArg, FormArg, formData, validationServerCall, formCallFunc, validationCallFunc, ValidationProp, Validation} from "../plug-modules/validation";
export declare let validation: Validation;
// form validation labels
export declare let label_form_confirmation: boolean | Function;

// confirmation
import {setConfirmation, conf_user_data_arg, conf_product_data, confirm_prop} from "../confirmation";
export declare let Confirm: setConfirmation;
export type conf_user_data_arg = conf_user_data_arg;
export type conf_product_data = conf_product_data;

// Local popup
import {LocPopup} from "../plug-modules/local-popup";
export declare let LocalPopup: LocPopup;

// logged user
export declare let logged_user: any;

// categories
export declare let categories: categories_;

// cart
import {Cart_, cart_product, elements_attr_name, cart_prop} from "../cart";
export declare let Cart: Cart_;
export type cart_product = cart_product;

// product slider
export declare function productSlider(): void;

// product category selector
import {Categories_, ctgr_arg_prop_names, ctgr_getter_fc, ctgr_arg_prop} from "../categories";
export declare let Product_selecotr: Categories_;