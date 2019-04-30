export class UUID {
  /**
   * 4随机的子轮
   * @private
   * @returns
   * @memberof UUID
   */
  private static _s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  /**
   * 返回第四版本的uuid
   * @static
   * @returns
   * @memberof UUID
   */
  static v4() {
    return (UUID._s4() + UUID._s4() + '-' + UUID._s4() + '-' + UUID._s4() + '-' + UUID._s4() + '-' + UUID._s4() +
        UUID._s4() + UUID._s4());
  }

}