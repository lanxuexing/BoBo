/**
 * Created by Administrator on 2016/11/8.
 */

import queryString from 'query-string';
import Mock from 'mockjs';

let token = 'boboclient';

/**
 * GET请求
 * @param url 请求的url
 * @param data 请求的参数
 */
export function get(url, data = {}) {
    // Object.keys(data).forEach((param)=> {
    //     const k = `:${param}`;
    //     const v = encodeURIComponent(data[param]);
    //     url = url.replace(k, v)
    // });
    let newUrl = url + '?' + queryString.stringify(data);
    return fetch(newUrl, {
        headers: {
            "Authorization": token
        }
    }).then(ret=>ret.json()).then((response) => Mock.mock(response));
}


/**
 * 用户发送验证码GET请求
 * @param url 请求的url
 * @param data 请求的参数
 */
export function getLogin(url, data = {}) {
    let newUrl = url + '?' + queryString.stringify(data);
    return fetch(newUrl).then(ret=>ret.json()).then((response) => Mock.mock(response));
}

/**
 * POST请求
 * @param url 请求的url
 * @param data 请求的参数
 */
export function post(url, data = {}) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": token
        },
        body: JSON.stringify(data)
    }).then(ret=>ret.json()).then((response) => Mock.mock(response));
}

/**
 * 用户登录POST请求
 * @param url 请求的url
 * @param data 请求的参数
 */
export function postLogin(url, data = {}) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(ret => ret.json()).then((response) => Mock.mock(response));
}