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
    source_file: $ => $.class_definition,

    // Should not be identifier
    class_definition: $ => seq(optional($.comment), 'Class', $.identifier),

    identifier: $ => /[a-z_]+/,

    comment: _ => token(seq(
        '"',
        /(""|[^"])*/,
        '"',
    )),
  }
});
