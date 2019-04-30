/**
 * 事件触发器
 *
 * @export
 * @class EventEmitter
 */
export class EventEmitter {
  // 事件的集合
  private _events: any = {};
  // 当前事件的编号
  private _count = 0;

  /**
   * 绑定当前的事件
   *
   * @private
   * @param {string} eventName
   * @param {*} callback
   * @param {number} is_one
   * @param {*} content
   * @returns
   * @memberof EventManager
   */
  private _bind(eventName: string, callback: any, is_one: number, context: any) {
    if (typeof (eventName) !== 'string' || typeof (callback) !== 'function') {
      throw new Error('_bind args is not safe!');
    }
    if (!Object.prototype.hasOwnProperty.call(this._events, eventName)) {
      this._events[eventName] = {};
    }
    this._events[eventName][++this._count] = [callback, is_one, context];
    return [eventName, this._count];
  }

  /**
   * 遍历事件的事件的绑定
   *
   * @private
   * @param {[]} obj
   * @param {*} callback
   * @memberof EventEmitter
   */
  private _each(obj: [], callback: any) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        callback(key, obj[key]);
      }
    }
  }

  /**
   * 触发事件的方法
   *
   * @private
   * @param {string} eventName
   * @param {*} args
   * @memberof EventEmitter
   */
  private _emitFunc(eventName: string, args: any) {
    if (Object.prototype.hasOwnProperty.call(this._events, eventName)) {
      this._each(this._events[eventName], (key: number, item: any) => {
        item[0].apply(item[2], args);
        if (item[1]) delete this._events[eventName][key];
      });
    }
  }

  /**
   * 绑定事件
   *
   * @param {string} eventName
   * @param {*} callback
   * @param {*} context
   * @returns
   * @memberof EventEmitter
   */
  on(eventName: string, callback: any, context?: any) {
    context = context || this;
    return this._bind(eventName, callback, 0, context);
  }

  /**
   * 绑定触发一次的事件
   *
   * @param {string} eventName
   * @param {*} callback
   * @param {*} context
   * @returns
   * @memberof EventEmitter
   */
  once(eventName: string, callback: any, context?: any) {
    context = context || this;
    return this._bind(eventName, callback, 1, context);
  }

  /**
   * 取消事件绑定
   *
   * @param {(string | [string, number])} event
   * @returns
   * @memberof EventEmitter
   */
  off(event: string | [string, number]) {
    if (typeof (event) === 'string') {
      if (Object.prototype.hasOwnProperty.call(this._events, event)) {
        delete this._events[event];
        return true;
      }
      return false;
    } else if (typeof (event) === 'object') {
      let eventName = event[0];
      let key = event[1];
      if (Object.prototype.hasOwnProperty.call(this._events, eventName) &&
          Object.prototype.hasOwnProperty.call(this._events[eventName], key)) {
        delete this._events[eventName][key];
        return true;
      }
      return false;
    }
  }

  /**
   * 触发绑定的事件
   *
   * @param {string} eventName
   * @param {...Array<any>} array
   * @memberof EventEmitter
   */
  emit(eventName: string, ...array: Array<any>) {
    setTimeout(() => {
      this._emitFunc(eventName, array);
    });
  }

  /**
   * 清除所有的绑定
   */
  clearAll() {
    this._events = {};
  }
}