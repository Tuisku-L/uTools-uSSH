import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/Index' },
  ],
  fastRefresh: {},
  history: {
    type: "hash"
  }
});
