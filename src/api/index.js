// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

// 获取城市adcode
export const getAdcode = async (key) => {
  try {
    const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
    
    // 检查HTTP响应状态
    if (!res.ok) {
      throw new Error(`HTTP错误：${res.status}`);
    }
    
    const data = await res.json();
    
    // 检查API返回状态
    if (data.status !== '1') {
      throw new Error(`API错误：${data.info || '未知错误'}`);
    }
    
    return data;
  } catch (error) {
    console.error('获取adcode失败：', error);
    throw error; // 抛出错误供调用方处理
  }
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  try {
    // 必须指定extensions参数（base:实时天气 all:预报+实时）
    const res = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${encodeURIComponent(city)}&extensions=base`
    );
    
    if (!res.ok) {
      throw new Error(`HTTP错误：${res.status}`);
    }
    
    const data = await res.json();
    
    if (data.status !== '1') {
      throw new Error(`API错误：${data.info || '未知错误'}`);
    }
    
    return data;
  } catch (error) {
    console.error('获取天气失败：', error);
    throw error;
  }
};


// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getNanjingWeather = async () => {
  try {
    // 固定查询南京的天气，城市参数设为"南京"
    const city = "南京";
    
    // 构建请求URL并添加城市参数
    const url = new URL("https://api.oioweb.cn/api/weather/GetWeather");
    url.searchParams.append('city', encodeURIComponent(city));
    // 如果该API需要密钥，请在这里添加，例如：
    // url.searchParams.append('key', '你的API密钥');
    
    const res = await fetch(url.toString());
    
    // 检查HTTP响应状态
    if (!res.ok) {
      throw new Error(`请求失败: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // 验证API返回数据（根据实际API响应结构调整）
    // 不同API的成功标识可能不同，这里仅为示例
    if (data.code !== 200 && data.code !== 0) {
      throw new Error(`API错误: ${data.msg || '获取南京天气失败'}`);
    }
    
    return data;
  } catch (error) {
    console.error('获取南京天气信息失败:', error);
    throw error; // 抛出错误供调用方处理
  }
};
