import {EventEmitter} from './EventEmitter';

/**
 * WebSocket的工具类
 *
 * @export
 * @class WS
 * @extends {EventEmitter}
 */
export class WS extends EventEmitter {
  // 单例
  public static readonly INS: WS = new WS();
  // socket实例
  private _sock: WebSocket = null;
  // 是否连接成功
  private _isConnected: boolean = false;

  /**
   * 连接状态类型
   *
   * @static
   * @memberof WS
   */
  public static EventType = {
    OPEN: 'open',
    ERROR: 'error',
    CLOSE: 'close',
    MESSAGE: 'message',
  };

  private constructor() {
    super();
  }

  /**
   * 连接的方法
   *
   * @param {string} url
   * @memberof WS
   */
  connect(url: string): WS {
    if (!this._sock || this._sock.readyState !== 1) {
      this._sock = new WebSocket(url);
      this._sock.binaryType = 'arraybuffer';
      this._sock.onopen = this._onOpen.bind(this);
      this._sock.onclose = this._onClose.bind(this);
      this._sock.onerror = this._onError.bind(this);
      this._sock.onmessage = this._onMessage.bind(this);
    }
    return this;
  }

  /**
   * 开始连接的方法
   *
   * @private
   * @memberof WS
   */
  private _onOpen(event: MessageEvent) {
    this._isConnected = true;
    this.emit(WS.EventType.OPEN, event);
  }

  /**
   * 错误的方法
   *
   * @private
   * @memberof WS
   */
  private _onError(event: MessageEvent) {
    this._isConnected = false;
    this.emit(WS.EventType.ERROR, event);
  }

  /**
   * 关闭的方法
   *
   * @private
   * @memberof WS
   */
  private _onClose(event: MessageEvent) {
    this._isConnected = false;
    this.emit(WS.EventType.CLOSE, event);
  }

  /**
   * 信息的方法
   *
   * @private
   * @param {MessageEvent} event
   * @memberof WS
   */
  private _onMessage(event: MessageEvent) {
    this.emit(WS.EventType.MESSAGE, event);
  }

  /**
   * 发送数据
   *
   * @param {(string | object)} message
   * @memberof WS
   */
  send(message: string | object) {
    if (!this._isConnected) {
      return;
    }
    if (typeof message == 'string') {
      this._sock.send(message);
    } else if (typeof message === 'object') {
      let jsonStr = JSON.stringify(message);
      this._sock.send(jsonStr);
    }
  }

  /**
   * 发送二进制数据
   * @param message
   */
  sendBinary(message: any) {
    if (!this._isConnected) {
      return;
    }
    if (typeof message != 'string') {
      this._sock.send(message);
    }
  }

  /**
   * 关闭连接
   *
   * @memberof WS
   */
  close() {
    this._sock.close();
    this._sock = null;
    this._isConnected = false;
  }

}