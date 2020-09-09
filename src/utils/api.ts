import Request from "./request";

const request = new Request();

export default class API {
    static getClub(param: any) {
        return request.post('/search', param);
    }
}