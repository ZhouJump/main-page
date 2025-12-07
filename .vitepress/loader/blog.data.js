import fetch from 'node-fetch';
import { parseString } from 'xml2js';
import { promisify } from 'util'; // 导入 Node.js 内置的 promisify

// 将 parseString 转换为 Promise 版本
const parseXml = promisify(parseString);

export default {
    async load() {
        const xmlUrl = 'https://blog.zhoujump.club/index.xml';
        
        try {
            // 1. 获取 XML 文本
            const response = await fetch(xmlUrl);
            if (!response.ok) {
                // 如果 HTTP 状态码不是 200-299，抛出错误
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const xmlText = await response.text();

            // 2. 使用 await 等待 Promise 版本的 parseXml 完成解析
            const result = await parseXml(xmlText, {
                // 可选的 xml2js 配置，用于美化输出结构
                explicitArray: false,
            });

            // 3. load 函数返回最终的 JSON 对象
            console.log('XML 解析成功并返回数据。');
            return result; 

        } catch (error) {
            // 捕获网络请求或 XML 解析中的任何错误
            console.error('Failed to load/parse XML:', error.message);
            // 构建失败时必须返回一个值，建议返回一个空对象或 null
            return { error: error.message }; 
        }
    }
}