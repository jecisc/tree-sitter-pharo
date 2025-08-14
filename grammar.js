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
  ],

  word: $ => $.identifier,

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => choice($.class_definition, $.extensions_definition, $.package_definition),

    // Should not be identifier
    class_definition: $ => seq(optional($.comment), 'Class', $.identifier),

    // Should not be identifier
    extensions_definition: $ => seq('Extension', $.identifier),

    //Should not be identifier
    package_definition: $ => seq('Package', $.identifier),

    identifier: $ => /[a-z_]+/,

    comment: _ => token(seq(
        '"',
        /(""|[^"])*/,
        '"',
    )),
  }
});
