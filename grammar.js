/**
 * @file Pharo tonel grammar for tree-sitter
 * @author Cyril Ferlicot-Delbecque <cyril@ferlicot.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "pharo",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
