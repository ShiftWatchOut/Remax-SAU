import config from "./config";

interface Option {
    method: 'GET' | 'POST';
    url: string;
    path: string;
    data: Object | null;
}

interface Task {
    [path: string]: any;
}

interface MyObject {
    [key: string]: string;
}

const qs = (data: MyObject) => {
    let search = '?';
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            search += (search.includes('=') ? '&' : '') + key + '=' + data[key];
        }
    }
    return search;
};

export default class Request {
    private count: number;
    private taskList: string[];
    private task: Task;
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
    get(path: string, data: any) {
        this.checkTaskList(path);
        this.count++;
        return this.promiseRequest({
            method: 'GET',
            url: config.baseUrl + path + qs(data),
            path: path,
            data: null,
        })
    }
    private promiseRequest(requestOption: Option) {
        const { method, url, path, data } = requestOption;
        return new Promise((resolve, reject) => {
            this.task[path] = wx.request({
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