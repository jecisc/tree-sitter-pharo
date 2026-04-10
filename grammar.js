/**
 * @file Pharo tonel grammar for tree-sitter
 * @author Cyril Ferlicot-Delbecque <cyril@ferlicot.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "pharo",

  extras: $ => [
    $.comment,
    /[\s\u00A0\uFEFF\u3000]+/,
    $.line_continuation,
  ],

  word: $ => $.identifier,

  rules: {
    
    file: $ => choice($.extensions_definition, $.class_definition, $.package_definition, $.method_definition),

    //class_definition: $ => seq(optional($.comment), 'Class', $._class_specification, repeat($.method_definition)),
    class_definition: $ => seq(optional(field( 'class_comment', $.comment)), 'Class', $._class_specification , field('methods', optional(repeat($.method_definition)))),

    // Should not be identifier
    extensions_definition: $ => seq('Extension', field('class_name', $._simple_name_definition), repeat($.method_definition)),

    package_definition: $ => seq('Package', seq('{', $._simple_name_definition , '}')),


  
    // Class definition 
    _class_specification: $ => seq('{', repeat(seq( optional(','), $._class_field)), '}'),

    _class_field: $ => choice(
                          $._simple_name_definition,
                          $._superclass,
                          $._instance_slots,
                          $._class_slots,
                          $._class_variables,
                          $._package,
                          $._tag,
                          $._category
                        ),

    _simple_name_definition: $ => field('name', seq('#name', ':', '\'', $.identifier, '\'')), // Separating name and : to trim spaces

    _superclass: $ => field('superclass', seq('#superclass', ':', '\'' , $.identifier, '\'')),

    _package: $ => field('package', seq('#package', ':', '\'' , $.dashed_name, '\'')),   //Introduced in v3 of Tonel format

    _tag: $ => field('tag', seq('#tag', ':', '\'' , $.dashed_name, '\'')),  // Introduced in v3 of Tonel format

    _category: $ => field('category', seq('#category', ':', '\'' , $.dashed_name, '\'')),  // Categories are optional in the v3 of the Tonel format

    _instance_slots: $ => field('slots', seq('#instVars' , ':', $._slots)),

    _class_slots: $ => field('class_slots', seq('#classInstVars' , ':', $._slots)),

    _slots: $ => seq('[' , repeat(seq(optional(','), $.slot_definition)) , ']'),

    slot_definition: $ => seq("'", field('name', seq(optional('#'), $.identifier)), optional(seq('=>', field('definition', $.identifier))), "'"),

    _class_variables: $ => field('class_variables', seq('#classVars' , ':', seq('[' , repeat(seq(optional(','), "'", $.identifier, "'")) , ']'))),

    // Method definitions
    method_definition: $ => choice($._tonel_method_definition, $._raw_method_definition),

    _raw_method_definition: $ => seq(field('signature', $.identifier), optional($._method_defintion_body)),

    _tonel_method_definition: $ => seq(field('protocol', $.protocol), field('owner' , $.class_name) , '>>' , field('signature', $.identifier), '[' , optional($._method_defintion_body) , ']'), 

    protocol : $ => seq('{', '#category', ':', "'", token(/[^']+/) , "'", "}"),

    class_name :  $ => token(/[^>]*/),

    _method_defintion_body : $ => field('body', $._statement), //WIP

    _statement : $ => choice($._expression), //WIP

    _expression : ($) => choice($._literal), //WIP

    _literal : $  => choice(
                        $.self,
                      $.super,
                      $.true,
                      $.false,
                      $.nil,
                      $.thisContext,
                      $.thisProcess),


    // Literals
    string: $ => token(seq("'", /([^']|'')*/, "'")), //To test


    line_continuation: _ => token(seq('\\', choice(seq(optional('\r'), '\n'), '\0'))),

    self: $ => 'self',

    super: $ => 'super',

    true: $ => 'true',

    false: $ => 'false',

    thisContext: $ => 'thisContext',

    thisProcess: $ => 'thisProcess',

    nil: $ => 'nil',

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

    dashed_name: $ => /[A-Za-z_][A-Za-z0-9_-]*/, //It acts as an identifier but also accept `-`. It is used for package, tag or category name.

    comment: _ => token(seq(
      '"',
      /(""|[^"])*/,
      '"',
    )),
  }
});
