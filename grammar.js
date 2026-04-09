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
    
    file: $ => choice($.extensions_definition, $.class_definition, $.package_definition),

    //class_definition: $ => seq(optional($.comment), 'Class', $._class_specification, repeat($.method_definition)),
    class_definition: $ => seq(optional($.comment), 'Class', $._class_specification),

    // Should not be identifier
    _class_specification: $ => seq('{', choice($._simple_name_definition), '}'),

    method_definition: $ => seq($.identifier, '['),

    // Should not be identifier
    extensions_definition: $ => seq('Extension', field('class_name', $._simple_name_definition), repeat($.method_definition)),

    package_definition: $ => seq('Package', seq('{', $._simple_name_definition , '}')),

    _simple_name_definition: $ => field('name', seq('#name', ':', '\'', $.identifier, '\'')),

    line_continuation: _ => token(seq('\\', choice(seq(optional('\r'), '\n'), '\0'))),

    self: $ => 'self',

    super: $ => 'super',

    true: $ => 'true',

    false: $ => 'false',

    thisContext: $ => 'thisContext',

    nil: $ => 'nil',

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

    comment: _ => token(seq(
      '"',
      /(""|[^"])*/,
      '"',
    )),
  }
});
