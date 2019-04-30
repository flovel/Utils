/**
 * 国际化工具类
 *
 * @export
 * @class I18n
 */
declare let Polyglot: any;
const polyglot = new Polyglot();

export class I18n {

  /**
   * 初始化的方法
   *
   * @static
   * @param {object} [obj={}]
   * @memberof I18n
   */
  static init(obj: object = {}) {
    polyglot.extend(obj);
  }

  /**
   * 获取配置字符串的方法
   *
   * @static
   * @param {object} [obj={}]
   * @memberof I18n
   */
  static t(key: string, param?: object): string {
    if (param) {
      return polyglot.t(key, param);
    } else {
      return polyglot.t(key);
    }
  }
}