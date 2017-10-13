'use strict';

require('dotenv').config();
const md5 = require('md5');
const request = require('request');

const BAIDU_API_APP_ID = process.env.BAIDU_API_APP_ID;
const BAIDU_API_APP_KEY = process.env.BAIDU_API_APP_KEY;

class BaseTranslator {

}

class BaiduTranslator extends BaseTranslator {

  constructor(apiId, apiKey) {
    super();

    if (!apiId)
      throw new Error('Please specify api ID for the Baidu translator');
    if (!apiKey)
      throw new Error('Please specify api key for the Baidu translator');

    this.apiId = apiId;
    this.apiKey = apiKey;
    this.URL = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
  }

  translate(text, from, to) {
    if (!text) 
      throw new Error('text cannot be empty');  
    if (!from) 
      throw new Error('from cannot be empty');  
    if (!to) 
      throw new Error('to cannot be empty');  

    const salt = Math.random();
    const sign = md5(this.apiId + text + salt + this.apiKey);

    let reqUri = `${this.URL}?q=${text}&from=${from}&to=${to}`;
    reqUri += `&appid=${this.apiId}&salt=${salt}&sign=${sign}`;

    console.log(reqUri)

    request(reqUri, (err, res, body) => {
      let result = JSON.parse(body);
      result.trans_result.forEach((val) => {
        console.log('原文     ' + val.src);
        console.log('翻译结果 ' + val.dst);
      })
    });
  }
}

const baiduTrans = new BaiduTranslator(BAIDU_API_APP_ID, BAIDU_API_APP_KEY);
baiduTrans.translate('hello!', 'en', 'zh');
baiduTrans.translate('I am a teacher from AskiNow', 'en', 'zh');
baiduTrans.translate('Please join my classes someday :)', 'en', 'zh');
baiduTrans.translate('My courses are not free', 'en', 'zh');
baiduTrans.translate('Please pay me well!', 'en', 'zh');