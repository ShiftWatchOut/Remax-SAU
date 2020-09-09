import config from "./config";
import { request } from "remax/wechat";

interface Option {
    method: 'GET' | 'POST';
    url: string;
    path: string;
    data: Object | null;
}

export default class Request {
    count: number;
    taskList: string[];
    task: Object;
    constructor() {
        this.count = 0;
        this.task = {};
        this.taskList = [];
    }
    post(path: string, data: any) {
        this.checkTaskList(path);
        this.count++;
        return this.promiseRequest({
            method: 'POST',
            url: config.baseUrl + path,
            path: path,
            data: data
        })
    }
    get(path: string, data: any) { }
    private promiseRequest(requestOption: Option) {
        const { method, url, path, data } = requestOption;
        return new Promise((resolve, reject) => {
            this.task[path] = request({
                url: url,
                method: method,
                data: data,
                timeout: 5000,
                success: (res) => {
                    this.count--;
                    return resolve(res);
                },
                fail: (res) => {
                    this.count--;
                    reject(res);
                },
                complete: () => {
                    this.taskList = this.taskList.filter((p) => {
                        return p !== path;
                    });
                    this.task[path] = null;
                }
            })
        })
    }
    private checkTaskList(path: string) {
        let isRequesting = false;
        let repeatedIndex = 0;
        this.taskList.forEach((p, i) => {
            if (p === path) {
                isRequesting = true;
                repeatedIndex = i;
            }
        })
        if (isRequesting) {
            this.task[path].abort();
            this.task[path] = null;
            this.taskList.splice(repeatedIndex, 1);
        }
        this.taskList.push(path);
    }
}