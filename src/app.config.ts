import { AppConfig } from "remax/wechat";

const config: AppConfig = {
  pages: [
    'pages/index/index',
    'pages/news/index',
    'pages/search/index',
    'pages/status/index',
    'pages/activity/index',
    'pages/about/index',
  ],
  window: {
    navigationBarTitleText: 'Remax SAU',
    navigationBarBackgroundColor: '#FF903F'
  }
};

export default config;
