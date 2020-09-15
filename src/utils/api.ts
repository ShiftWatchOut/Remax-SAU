import Request from "./request";

const request = new Request();

export default class API {
    // 获取社团列表
    static getClub(param: any) {
        return request.post('/search', param);
    }
    // 获取活动列表
    static getActivities(param: any) {
        return request.get('/prelist', param);
    }
    // 获取新闻列表
    static getNewsList(param: any) {
        return request.get('/newsList', param);
    }
    // 获取新闻详情
    static getNewsDetail(param: any) {
        return request.get('/newsContent', param);
    }
    // 获取申请状态
    static getStatus(param: any) {
        return request.post('/searchStatue', param);
    }
    // 获取社团申请详情
    static getClubDetail(param: any) {
        return request.get('/clubDetail', param);
    }
}