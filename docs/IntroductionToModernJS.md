# Introduction to Modern Javascript

Javascript is an interpreted, curly-bracketed, imperative/functional hybrid, dynamic typed language.
It's designed to be single threaded and event-driven.
It can be run in every browser or using an interpreter like Node.JS.

## Control and operators

Javascript syntax is very similar to C/C++:

```js
let a = 2;
let b = 3;

a = b + 10; // 13
a++;        // 14

if (a == 10) {
    console.log(a);
    return false;
} else {
    return true;
}

while (a != 0 && b > 0) {
    a -= 1;
}

for (let i = 0; i < 100; i++) {
    b = b * 2;
}
```

## Types

Types in Javascript can be _primitives_ or _complex_. The main difference is that when accessing a primitive you work directly on his value (immutable), when accessing a complex type you work on the reference (like a pointer).

Primitive types:
- `string`
- `number`, floating point
- `boolean`, `true` or `false`
- `null`
- `undefined`
- `symbol`

Complex types:
- Objects:
    - `object`, key-value dictionary
    - `array`, index-value dictionary
    - `function`, an executable object

### Variable declaration

There are several keywords to define variables in Javascript: `var`, `let` and `const`.

```js
var isValid = false;    // Deprecated, avoid usage
let name = "Giulio";    // Like var but block scoped
const pi = 3.14;        // Forbids reassignation
```

**Use const whenever possible** expecially for objects. _Warning: this means we can still edit the values of the objects still the variable is only a reference to it._ 

Every variable that hasn't been assigned it's `undefined`.

```js
console.log(test); // undefined

let test;
console.log(test); // undefined

test = 10;
console.log(test); // 10
```

Variables doesn't have types: they are just _pointers_. This means that you can reassign a variable with anoter value type:

```js
let test = 10;
console.log(test); // 10

test = "hello";
console.log(test); // "hello"
```

### Objects

Objects are **key-value pair dictionaries**.

Objects structure is _dynamic_: it's possible to add and remove elements during runtime.

In Javascript everything _must_ belong to an object: even top-level global variables are added to a global object. This object is called `global` in _Node_ and `window` in the browser.

```js
let person = {};    // an empty object

// Since object structure is dynamic, we can add new keys
person.name = "Giulio";
person.surname = "Zausa";

console.log(person.name);    // "Giulio"
console.log(person.age);     // undefined

// Shorthand definition
let contactInfo = {
    email: "test@me.com",
    telephone: "043572485"
};

// We can nest objects
person.contactInfo = contactInfo;

// WATCH OUT! Object are references
contactInfo.email = "test";
console.log(contactInfo.email);         // "test"
console.log(person.contactInfo.email);  // "test" <- this has changed too!
```
