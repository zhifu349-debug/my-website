// jest.setup.js
require('@testing-library/jest-dom');

// 模拟全局对象
global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// 模拟Next.js路由
global.window = {
  location: {
    pathname: '/',
    search: '',
    hash: '',
  },
  history: {
    push: jest.fn(),
    replace: jest.fn(),
  },
};
