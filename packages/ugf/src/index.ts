import { vec2 } from './math';
import { computed, reactive } from './utility/reactivity';

export * from './core';
export * from './types';
export * from './functions';
export * from './components';
export * from './utility';
export * from './math';

// const a = reactive(vec2(10, 10));
// const b = reactive(vec2(4, 4));

// const c = computed(() => a.multiply(b));

// console.log(c.value.toString());

// a.x = 5;

// console.log(c.value.toString());

// b.y = 8

// console.log(c.value.toString());

