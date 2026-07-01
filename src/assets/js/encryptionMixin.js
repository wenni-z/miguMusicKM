import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'

const APP_ID = '6WcW3cc28LFKH67dvB';
const APP_SECRET = 'wzjmlyrzOcUgc7td3pLspLu7LApJbIfL';
const PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxHv54t9xHJ3wXlsyjN52yuWrkygiJEFVml5NyzQ3AFH/dXRf+LeoqZ3VRJE8Crqa50PNCop51kCJEIcSrHI/+Uq+xFYrnJNydxDcQqGSo4VoWswYaT6l8C3TuaSiCGmVByvbodwBXJFnD73NxkAPdUbGoDV1tn4/hZi6NYdix42zww0/Q/cjJkzRnxDAhH2SzbxuxEnFssNs938bn+T+d4jTa9yOItdNGjTuz2MMNIfbo5wHPQEqlMqu6C6yuPWLdztfheH5DyepAcJlZKjifc2dhVVXJi98f1R6R3R8nkdvyGaNy7vOg+CjeIPFueApVVtgrlqv5MJHMcQn70oCiQIDAQAB';

export default {
    methods: {
        // 获取指定长度随机数
        getRandomString(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            return result;
        },
        // 校验手机号
        validatePhone(phone) {
            const regex = /^1[3456789]\d{9}$/;
            return regex.test(phone);
        },
        getReqData(obj) {
            // 生成aes密钥字符
            let key = this.getRandomString(16);
            let iv = this.getRandomString(16);
            let aesKeyObj = {
                key: key,
                iv: iv
            }
        
            // 使用rsa加密aes密钥
            let jsEncrypt = new JSEncrypt();
            jsEncrypt.setPublicKey(PUBLIC_KEY);
            let encrypt = jsEncrypt.encrypt(JSON.stringify(aesKeyObj));
        
            // 生成其他参数
            let nonce = CryptoJS.lib.WordArray.random(8).toString();
            let date = new Date();
            let timestamp = date.getTime();
        
            // 生成签名
            let signObj = {
                appId: APP_ID,
                appSecret: APP_SECRET,
                nonce: nonce,
                timestamp: timestamp
            }
            let signObjStr = Object.entries(signObj)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
            let sign = CryptoJS.SHA256(signObjStr).toString();
        
            // 数据加密
            let objStr;
            // if (typeof value === 'string') {
            if (typeof obj === 'string') {
                objStr = obj;
            } else {
                objStr = JSON.stringify(obj);
            }
            let data = CryptoJS.AES.encrypt(objStr, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();
        
            let params = {
                data: data,
                encrypt: encrypt,
                appId: APP_ID,
                sign: sign,
                nonce: nonce,
                timestamp: timestamp
            }
            // return JSON.stringify(params);
            return params;
        },
    }
}
