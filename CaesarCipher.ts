const _encrypt_password:string = "abcdef";
export class CaesarCipher{
  static encode(str:string):string{
    let temp = Base64.encode(str);
    let codeStr = '';
    for(let i=0;i<temp.length;i++){
      codeStr += String.fromCharCode(temp.charCodeAt(i)-_encrypt_password.charCodeAt(i%_encrypt_password.length));
    }
    return codeStr;
  }

  static decode(str:string):string{
    let decodeStr = '';
    for(let i=0;i<str.length;i++){
      decodeStr += String.fromCharCode(str.charCodeAt(i)+_encrypt_password.charCodeAt(i%_encrypt_password.length));
    }
    decodeStr = Base64.decode(decodeStr);
    return decodeStr;
  }
}