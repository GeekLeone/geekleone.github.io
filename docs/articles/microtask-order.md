---
title: 两个 then 之间，为什么插进了另一个微任务？
description: 用七行输出跟踪一次 Promise 链，分清注册回调和进入微任务队列的时刻。
date: '2026-11-20'
topic: JavaScript
trace:
  - phase: 同步代码
    output: [A, G]
  - phase: 微任务
    output: [C, F, D, E]
  - phase: 定时器
    output: [B]
---
# 两个 then 之间，为什么插进了另一个微任务？

下面这段代码里，两个 `.then()` 紧挨在一起。猜一下：第二个回调 `E` 会紧跟着第一个回调 `C` 输出吗？

## 先跑一个最小例子

把代码粘到浏览器控制台，或者保存为 `order.mjs` 后执行 `node order.mjs`。

```js
console.log('A')
setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => {
    console.log('C')
    queueMicrotask(() => console.log('D'))
  })
  .then(() => console.log('E'))

queueMicrotask(() => console.log('F'))
console.log('G')
```

输出顺序是 **A → G → C → F → D → E → B**。理解这个顺序，只要盯住一件事：每个回调究竟在什么时候入队？

## 沿着队列走一遍

下表只列出等待执行的微任务，最左边的字母最先执行。

<div class="queue-table">

| 等待队列 | 刚刚发生了什么 |
| :--- | :--- |
| `C F` | 同步代码输出 A、G。第一个 then 的源 Promise 已兑现，C 先入队，F 随后入队。 |
| `F D` | C 开始执行，输出 C，并将 D 放到队尾。 |
| `F D E` | C 的回调返回，中间的 Promise 以 undefined 兑现，E 这时才入队。 |
| 空 | F、D、E 依次执行完毕。 |

</div>

定时器的延时参数为零，也要等当前同步代码和这轮微任务执行完才有机会运行，所以 B 最后输出。

## 为什么 E 入队这么晚？

链式写法隐藏了一个中间对象。可以把表达式拆成 `const next = ready.then(first)` 和 `next.then(second)`。注册 `second` 的时候，`next` 还在等 `first` 的执行结果。等到 `first` 返回，D 已经排在队列中了。

如果把两次调用都挂到同一个已经兑现的 Promise 上，情况就不同了。保留原例其余代码，把 Promise 链替换成下面这段：

```js
const ready = Promise.resolve()
ready.then(() => {
  console.log('C')
  queueMicrotask(() => console.log('D'))
})
ready.then(() => console.log('E'))
```

这次结果是 **A → G → C → E → F → D → B**。同步脚本还没结束时，C、E、F 就已经按顺序入队。D 只能等 C 开始执行后才排到队尾。

## 用在实际代码里

如果第二步必须读取第一步的结果，就把第二步接在第一步返回的 Promise 上，并让第一步返回它启动的异步操作。若第一步只是启动请求后立即返回，链上的下一步就可能在请求完成前执行。

这两个例子只涉及普通 Promise、微任务和一个定时器。比较网络请求、多个定时器或 Node.js 的其他调度机制时，还要分别考虑它们的触发条件。

延伸阅读：[MDN 微任务指南](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)
