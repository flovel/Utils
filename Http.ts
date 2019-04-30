/**
 * 回调函数定义
 *
 * @interface ResponseTextCallback
 */
interface ResponseTextCallback {
  (message: string): void;
}

/**
 * Http的基础操作类
 *
 * @export
 * @class Http
 */
export class Http {

  /**
   * 基础的url
   *
   * @static
   * @type {string}
   * @memberof Http
   */
  static BASE_URL: string = '';

  /**
   * http get 方法
   *
   * @static
   * @memberof Http
   */
  static get = (route: string, param: object = {}, callback?: ResponseTextCallback) => {
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.timeout = 5000;
    let url: string = '';
    let paramStr = '';
    for (let key in param) {
      if (paramStr === '') {
        paramStr = '?';
      }
      if (paramStr !== '?') {
        paramStr += '&';
      }
      paramStr += key + '=' + param[key];
    }
    url = `${Http.BASE_URL}${route}${encodeURI(paramStr)}`;
    console.log('http get url:', url);
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (cc.sys.isNative) {
      xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
        try {
          if (callback) {
            callback(xhr.responseText);
          }
        } catch (e) {
          console.log('err:' + e);
        }
      }
    };
    xhr.send();
  };

  /**
   * http post 方法
   *
   * @static
   * @memberof Http
   */
  static post = (route: string, param: object = {}, callback?: ResponseTextCallback) => {
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.timeout = 5000;
    let url: string = '';
    let paramStr = '';
    for (let key in param) {
      if (paramStr !== '') {
        paramStr += '&';
      }
      paramStr += key + '=' + param[key];
    }
    url = `${Http.BASE_URL}${route}`;
    console.log('http post url:', url);
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (cc.sys.isNative) {
      // xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
      xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
        try {
          if (callback) {
            callback(xhr.responseText);
          }
        } catch (e) {
          console.log('err:' + e);
        }
      }
    };
    xhr.send(encodeURI(paramStr));
  };
}