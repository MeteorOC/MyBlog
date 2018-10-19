## 单元测试—Jest 简单实践

### 前言：

单元测试主要是测函数给定输入时是否会输出与预期相符的产物，同时也能帮我们检测一些文件引入、调用的错误。

对于 Vue 模块来说，其作用可能并不是那么大，不过对于自定义的公共函数来说，意义还是明显，建议各位多少使用一点。

### Start：

#### 1.可以使用`yarn`或者`npm`安装，按个人喜好，本人喜欢用`yarn`

```bash
yarn add -D jest
//Or
npm install --save-dev jest
```

安装完成，目录下多了个 jest.config.js 文件，里面是`Jest`的 config。

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/'
}
```

`Jest`单元测试默认是测试你的 Project `src/test/unit`目录下经过你个人编写的测试文件，文件名字格式如：`xx.spec.js|jsx|ts|tsx`

可以通过`testMatch`一项来配置自定义的路径，其它的配置也可以在这里修改，如果`Jest`测试过程中有什么不可预知的错误，其提示的 config，一般指的就是`jest.config.js`文件。

#### 2.将下面的配置部分添加到 package.json 中：

```javascript
"scripts": {
    "test": "jest"
}
```

这时使用`yarn test`即可启动`Jest`进行测试。

> 使用了 Eslint 的朋友，请在`.eslintrc.js`中`env`对象中配`jest: true`，使得 Eslint 在对`Jest`测试文件的检测中不报错。

#### 3.开始编写你的测试脚本

举个例子：**tests/unit/test.sepc.js**

```javascript
import { buildErrorMessage } from '@/Utils/Axios/utils'
test('测试buildErrorMessage函数输出是否与预期相符', () => {
  process.env.NODE_ENV = 'production'
  expect(buildErrorMessage('you', 200)).toBe('糟糕！服务器被怪兽吃掉啦QAQ')
  expect(buildErrorMessage('你', 200)).toBe('你')
  process.env.NODE_ENV = 'development'
  expect(buildErrorMessage('you', 200)).toBe('糟糕！服务器被怪兽吃掉啦QAQ(200)')
  expect(buildErrorMessage('你', 200)).toBe('你(200)')
})
```

**src/Utils/Axios/utils**

```javascript
/**
 * 判断是否要给错误消息加上错误码，只在该模块内部使用
 * @param {string} message -错误消息
 * @param {string} code -错误码
 */
export function buildErrorMessage(msg, code) {
  if (msg) {
    // 判断一下是不是英文的，是英文的给默认提示，这个正则写的不一定完备
    let isEnglish = REG_EXP_ENGLISH.test(msg)
    let processedMessage = isEnglish ? TIPS_ERROR.DEFAULT_ERROR : msg
    return process.env.NODE_ENV !== 'production' ? `${processedMessage}(${code})` : processedMessage
  } else {
    return TIPS_ERROR.DEFAULT_ERROR //TIPS_ERROR.DEFAULT_ERROR为'糟糕！服务器被怪兽吃掉啦QAQ'
  }
}
```

- 测试通过的情况下

```bash
$ jest
 PASS  src/tests/unit/test.spec.js
  ✓ 测试buildErrorMessage函数输出是否与预期相符 (4ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.325s
Ran all test suites.
✨  Done in 2.30s.
```

- 测试没有通过会有提示

```bash
$ jest
 FAIL  src/tests/unit/test.spec.js
  ✕ 测试buildErrorMessage函数输出是否与预期相符 (11ms)

  ● 测试buildErrorMessage函数输出是否与预期相符

    expect(received).toBe(expected) // Object.is equality

    Expected: "你"
    Received: "你(200)"

       6 |   process.env.NODE_ENV = 'development'
       7 |   expect(buildErrorMessage('you', 200)).toBe('糟糕！服务器被怪兽吃掉啦QAQ(200)')
    >  8 |   expect(buildErrorMessage('你', 200)).toBe('你')
         |                                       ^
       9 | })
      10 |

      at Object.toBe (src/tests/unit/test.spec.js:8:39)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.315s
Ran all test suites.
error Command failed with exit code 1.
```

完成~

**更加复杂的用法，请看[Jest-单元测试](https://jestjs.io/img/jest.svg)**
