var oo = require('../utils/oo');

var Helpers = {};

/******************************************************************************
 * INPUTS DEFs
 */

var SELECT_DEF          : { type: 'select', container: true }
  , LABEL_DEF           : { type: 'label', container: true }
  , TEXT_AREA_DEF       : { type: 'textaarea', container: true})
  , TEXT_FIELD_DEF      : { type: 'input', attributes: { type: 'text' } }
  , PASSWORD_FIELD_DEF  : { type: 'input', attributes: { type: 'password' } }
  , HIDDEN_FIELD_DEF    : { type: 'input', attributes: { type: 'hidden' } }
  , RADIO_BUTTON_DEF    : { type: 'input', attributes: { type: 'radio' } }
  , CHECK_BOX_DEF       : { type: 'input', attributes: { type: 'checkbox' } }
  , FILE_FIELD_DEF      : { type: 'input', attributes: { type: 'file'} }
  , SUBMIT_DEF          : { type: 'input', noName: true, attributes: { type: 'submit', name: 'commit' } }
  };

/******************************************************************************
 * TAG HELPERS
 */

function createTagHelper(options) {      
  return function(/*name, content | value , attributes*/) {
    var tag_type = options.type
      , tag = ''
      , all_attributes = {}
      , content = undefined
      , attributes = undefined
      ;
      
    //if the tag_type is 'label' put attributes.for = name 
    if(tag_type === 'label'){
      all_attributes['for'] = (options.model_name ? model_name + '_' + arguments[0] : arguments[0]);
      content = arguments[1];
      attributes =  argument[2] || {};
    }else{
    //else set attr.id = attr.name attr = name (in the attributes obj)
      if(!options.noName) {
              
        all_attributes.['name'] = (options.model_name ? model_name + '[' + arguments[0] + ']' : arguments[0]);
        
        if(!options.noId) {  
          all_attributes['id'] = (options.model_name ? model_name + '_' + arguments[0] : arguments[0]);
        }
        
        content = arguments[1];
        attributes =  argument[2] || {};
        
      }else{
        content = arguments[0];
        attributes =  argument[1] || {};
      }
    }
    
    if(options.attributes) {
      oo.__extends(all_attributes, options.attributes, {overwrite: true});
    }
    
    if(attributes) {
      oo.__extends(all_attributes, attributes, {overwrite: true});
    }
    
    if(!options.container) {
      all_attributes['value'] = content;
    }
        
    tag += '<' + tag_type;
    
    //add all attributes to the (opening) tag
    for(var attr in all_attributes) {
      tag += ' ' + attr . '="' + attributes[attr] + '"';
    }
    
    if(options.container) {
      //close opening tag
      tag += '>';
      
      //add content
      tag += content;
      
      //add closing tag
      tag += '</' + tag_type + '>';
      
    }else{    
      //close tag
      tag += ' />';
    }
    //return tag
    return tag;
  };
}

var formTags = {
    select_tag          : createTaghelper(SELECT_DEF)
  , label_tag           : createTagHelper(LABEL_DEF)
  , text_field_tag      : createTagHelper(TEXT_FIELD_DEF)
  , text_area_tag       : createTagHelper(TEXT_AREA_DEF)
  , password_field_tag  : createTagHelper(PASSWORD_FIELD_DEF)
  , hidden_field_tag    : createTagHelper(HIDDEN_FIELD_DEF)
  , radio_button_tag    : createTagHelper(RADIO_BUTTON_DEF)
  , check_box_tag       : createTagHelper(CHECK_BOX_DEF)
  , file_field_tag      : createTagHelper(FILE_FIELD_DEF)
  , submit_tag          : createTagHelper(SUBMIT_DEF)
  , options_for_select  : function options_for_select(options, selected_idx) {
      var html = '';
      for(var i = 0, len = options.length; i < len; i++) {
        
        text += '<option value="' + options[i][1] + '"';
        
        if(typeof selected_idx !== 'undefined' && selected_idx !== null) {
          text += ' selected="selected"';
        }
        
        text += '>' + options[i][0] + '</option>';
      }
      return html;
    }
  };
  
/******************************************************************************
 * Schema type to Tag map
 */
function addAttributes(tag_helper, new_attributes) {
  return function(name, content, options) {
    var options = options || {}
      , attributes = options.attributes || {}
      ;
    
    oo.__extends(attributes, new_attributes, {overwrite: true});
    return tag_helper(name, content, options);
  };
};
 
var schemaToForm = {
    Boolean:      {type: 'check_box'      , {attributes: {class: ['Boolean']}}
  , String:       {type: 'text_field'} 
  , Email:        {type: 'text_field'     , {attributes: {class: ['Email'], placeholder: 'Email Address'}}
  , Password:     {type: 'password_field' , {attributes: {class: ['Password'], placeholder: 'Password'}}
  , AlphaNumeric: {type: 'text_field'     , {attributes: {class: ['AlphaNumeric']}}
  , Number:       {type: 'text_field'     , {attributes: {class: ['Number']}}
  , Float:        {type: 'text_field'     , {attributes: {class: ['Number', 'Float']}}
  , Integer:      {type: 'text_field'     , {attributes: {class: ['Number', 'Integer']}}
  , Date:         {type: 'text_field'     , {attributes: {class: ['Date']}}
  , DateTime:     {type: 'text_field'     , {attributes: {class: ['Date','DateTime']}}
  , Time:         {type: 'text_field'     , {attributes: {class: ['Time']}}
  , Text:         {type: 'text_area'      , {attributes: {class: ['Text']}}
  , Url:          {type: 'text_field'     , {attributes: {class: ['Url']}}
  };
  
var createModelFormTags = function(model) {

  var modelFormTags = {  /* ALL functions except `input` are lazy wrapped for optimizations */
      select          : function(){ return (createTaghelper(oo.__extends( SELECT_DEF          , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , label           : function(){ return (createTagHelper(oo.__extends( LABEL_DEF           , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , text_field      : function(){ return (createTagHelper(oo.__extends( TEXT_FIELD_DEF      , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , text_area       : function(){ return (createTagHelper(oo.__extends( TEXT_AREA_DEF       , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , password_field  : function(){ return (createTagHelper(oo.__extends( PASSWORD_FIELD_DEF  , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , hidden_field    : function(){ return (createTagHelper(oo.__extends( HIDDEN_FIELD_DEF    , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , radio_button    : function(){ return (createTagHelper(oo.__extends( RADIO_BUTTON_DEF    , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , check_box       : function(){ return (createTagHelper(oo.__extends( CHECK_BOX_DEF       , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , file_field      : function(){ return (createTagHelper(oo.__extends( FILE_FIELD_DEF      , {model_name: model.name}  , {copyOnWrite: true}))).apply(this, arguments); }
    , input           : function input_form_for_helper(name, attributes) {
        var schema = model.schema
          , field_type = undefined
          ;
        
        if(typeof schema[name] !== 'undefined' && schema[name] !== null) {
          if(typeof schema[name] === 'string') {
            field_type = schema[name];
          }else if(typeof schema[name] === 'object' && typeof schema[name].validate === 'string') {
            field_type = schema[name].validate;
          }
        }else{
          throw 'Unable to find field `' + name + '` in model `' + model.name + '.schema`';
        }
        
        var field_def = schemaToForm[field_type] || {type: 'text_field', attributes: {class: 'unknownModelField'}};
        
        return modelFormTags[field_def.type](oo.__deepExtends(attributes, '', field_def.attributes, {copyOnWrite: true}));
      }
    };
  oo.__extends(modelFormTags, formTags);
  
};

/******************************************************************************
 * form_tag helper
 */

var __form_tag = createTagHelper({type: 'form', noName: true, container: true});
 
Helpers.form_tag = function form_tag(/* route, (attributes,) content_fun */) {
  
  var route = arguments[0]
    , attributes = (arguments.length === 3 ? arguments[1] : {}) /* OPTIONAL */
    , content_fun = (arguments.length === 3 ? arguments[2] : arguments[1])
    ;
  
  attributes.method = attributes.method || 'POST';
  attributes.action = (typeof route === 'string' ? route : link_to(route))
  
  var content = formTags.hidden_field_tag('_method', attributes.method);
  content += content_fun(formTags);
  
  return __form_tag(content, attributes);
};

/******************************************************************************
 * form_for helper
 */
Helpers.form_for = function form_for(/* model, route, (attributes,) content_fun */) {

  var model = arguments[0]
    , route = arguments[1]
    , attributes = (arguments.length === 4 ? arguments[2] : {}) /* OPTIONAL */
    , content_fun = (arguments.length === 4 ? arguments[3] : arguments[2])
    /***/
    , modelFormTags = createModelFormTags(model)
    , model_content_fun = function() { return content_fun(modelFormTags); }
    ;
  
  return form_tag(route, attributes, model_content_fun);
};

/******************************************************************************
 * link_for helper
 */
Helpers.link_for = function link_to() {};

//export Helpers;
module.exports = Helpers;