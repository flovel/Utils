import {EventEmitter} from './EventEmitter';

/**
 * colyseus的工具类
 *
 * @export
 * @class ColyseusEngine
 * @extends {EventEmitter}
 */
export class ColyseusEngine extends EventEmitter {
  // 单例
  public static readonly INS: ColyseusEngine = new ColyseusEngine();

  // 当前的客户端连接
  private _client: Colyseus.Client = null;

  // 当前的房间连接
  private _room: Colyseus.Room = null;

  // 是否连接成功
  private _isConnected: boolean = false;

  // 是否在房间内
  private _isInRoom: boolean = false;

  /**
   * 当前的内容事件
   *
   * @static
   * @memberof ColyseusEngine
   */
  public static EventType = {
    CLIENT_OPEN: 'client_open',
    CLIENT_ERROR: 'client_error',
    CLIENT_CLOSE: 'client_close',
    ROOM_JOIN: 'room_join',
    ROOM_ERROR: 'room_error',
    ROOM_LEAVE: 'room_leave',
    ROOM_MESSAGE: 'room_message',
    ROOM_STATE: 'room_state',
  };

  // 无法实例化
  private constructor() {
    super();
  };

  /**
   * 监听客户端连接成功
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onClientOpen() {
    this._isConnected = true;
    this.emit(ColyseusEngine.EventType.CLIENT_OPEN);
    console.log('_onClientOpen');
  }

  /**
   * 监听客户端关闭
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onClientClose(closeEvent: CloseEvent) {
    this._isConnected = false;
    this._isInRoom = false;
    this.emit(ColyseusEngine.EventType.CLIENT_CLOSE, closeEvent);
    console.log('_onClientClose', closeEvent);
  }

  /**
   * 监听客户端错误
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onClientError(evt: Event) {
    this._isConnected = false;
    this._isInRoom = false;
    this.emit(ColyseusEngine.EventType.CLIENT_ERROR, evt);
    console.log('_onClientError', evt);
  }

  /**
   * 加入房间成功
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onRoomJoin() {
    this._isInRoom = true;
    console.log('_onRoomJoin');
    this.emit(ColyseusEngine.EventType.ROOM_JOIN);
  }

  /**
   * 加入房间错误
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onRoomError(evt: Event) {
    this._isInRoom = false;
    console.log('_onRoomError', event);
    this.emit(ColyseusEngine.EventType.ROOM_ERROR, evt);
  }

  /**
   * 离开房间
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onRoomLeave(closeEvent: CloseEvent) {
    this._isInRoom = false;
    console.log('_onRoomLeave', closeEvent);
    this.emit(ColyseusEngine.EventType.ROOM_LEAVE, closeEvent);
  }

  /**
   * 接收房间的消息
   *
   * @private
   * @memberof ColyseusEngine
   */
  private _onRoomMessage(data: any) {
    console.log('_onRoomMessage', data);
    this.emit(ColyseusEngine.EventType.ROOM_MESSAGE, data);
  }

  /**
   * 接收房间的状态同步
   *
   * @private
   * @param {*} state
   * @memberof ColyseusEngine
   */
  private _onRoomStateChange(state: any) {
    console.log('_onRoomStateChange', state);
    this.emit(ColyseusEngine.EventType.ROOM_STATE, state);
  }

  /**
   * 连接到服务器
   *
   * @param {string} url
   * @returns {ColyseusEngine}
   * @memberof ColyseusEngine
   */
  public connect(url: string): ColyseusEngine {
    if (!this._client) {
      this._client = new Colyseus.Client(url);
      this._client.onOpen.add(this._onClientOpen.bind(this));
      this._client.onError.add(this._onClientError.bind(this));
      this._client.onClose.add(this._onClientClose.bind(this));
    }
    return this;
  }

  /**
   * 获取当前你的房间
   *
   * @returns {Colyseus.Room}
   * @memberof ColyseusEngine
   */
  public getCurrentRoom(): Colyseus.Room {
    if (this._isInRoom) {
      return this._room;
    }
    return null;
  }

  /**
   * 加入房间的方法
   *
   * @param {string} roomId
   * @param {{}} options
   * @memberof ColyseusEngine
   */
  public joinRoom(roomId: string, options: {}) {
    if (this._client && this._isConnected && !this._isInRoom) {
      this._room = this._client.join(roomId, options);
      this._room.onJoin.add(this._onRoomJoin.bind(this));
      this._room.onError.add(this._onRoomError.bind(this));
      this._room.onLeave.add(this._onRoomLeave.bind(this));
      this._room.onMessage.add(this._onRoomMessage.bind(this));
      this._room.onStateChange.add(this._onRoomStateChange.bind(this));
    }

  }

  /**
   * 获取当前可用的房间
   *
   * @memberof ColyseusEngine
   */
  public getAvailableRooms(roomName: string) {
    return new Promise<Colyseus.RoomAvailable[]>((resolve, reject) => {
      if (this._client && this._isConnected) {
        this._client.getAvailableRooms(roomName, (rooms: Colyseus.RoomAvailable[], err: string) => {
          if (err) {
            resolve([]);
          }
          resolve(rooms);
        });
      } else {
        resolve([]);
      }
    });
  }

  /**
   * 发送数据
   *
   * @param {*} data
   * @memberof ColyseusEngine
   */
  public send(data: any) {
    if (this._room && this._isInRoom) {
      this._room.send(data);
    }
  }

  /**
   * 离开当前的房间
   *
   * @memberof ColyseusEngine
   */
  public leaveRoom() {
    if (this._room && this._isInRoom) {
      this._room.leave();
    }
  }

  /**
   * 关闭客户端连接的方法
   *
   * @memberof ColyseusEngine
   */
  public close() {
    if (this._client && this._isConnected) {
      this._client.close('');
    }
  }

}