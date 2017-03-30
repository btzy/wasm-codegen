# wasm-codegen

This library generates WebAssembly bytecode from JavaScript function calls.

To preview this library, open `index.html` in a browser that supports WebAssembly.  `wasm32-test.js` contains some sample API calls which output to console.

To include this library in a project, just copy and use `wasm32codegen.max.js`.

This library currently only supports `TYPE`, `IMPORT`, `FUNCTION`, `MEMORY`, `EXPORT` and `CODE` sections in the module.  `TABLE`, `GLOBAL`, `START`, `ELEMENT` and `DATA` sections are not supported.

This library is meant to be a simple code generator for me to play with dynamically compiling code in the browser.  Its main use is for the [Jelly Esoteric Language Compiler](https://github.com/btzy/jelly).
