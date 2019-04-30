// 加密密钥
const SECRET_KEY: string = 'abcdefgh';
/**
 * 加密工具类
 *
 * @export
 * @class EncryptUtil
 */
declare let CryptoJS: any;

export class EncryptUtil {

  /**
   * AES256位简单加密
   * @param dataString 需要加密的文本
   */
  static AESEncode(dataString: string): string {
    const retStr = CryptoJS.AES.encrypt(dataString, SECRET_KEY, 256);
    return retStr.toString();
  }

  /**
   * AES256位简单解密
   * @param cipherText 解密后的文本
   */
  static AESDecode(cipherText: string): string {
    const retStr = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, 256);
    return retStr.toString(CryptoJS.enc.Utf8);
  }

}