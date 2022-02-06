/* 友盟打点 */
const siteId = '1280829710';
let ready = false;
const actionCache = [];
const debug = !!window.uwebDebug;

export function init() {
  const script = document.createElement('script');
  script.src = `https://s9.cnzz.com/z_stat.php?id=${siteId}&web_id=${siteId}`;

  // callback when the script is loaded
  script.onload = () => {
    // if the global object is exist, resolve the promise, otherwise reject it
    if (window._czc) {
      // 关闭默认打点
      window._czc.push(['_setAutoPageview', false]);

      if (actionCache.length > 0) {
        actionCache.forEach((action) => {
          // @ts-ignore
          window._czc.push(action);
        });
      }

      ready = true;
    } else {
      console.error(
        'loading uweb statistics script failed, please check src and siteId'
      );
    }
  };

  document.body.appendChild(script);
}

// 去除基础路径最后的斜杠
const base = (window.basename || '/').replace(/\/$/, '');
/**
 * @param {string} content_url 自定义虚拟PV页面的URL地址 填写以斜杠‘/’开头的相对路径，系统会自动补全域名
 * @param {string} referer_url 自定义该受访页面的来源页 URL 地址。建议填写该异步加载页面的母页面。不填，则来路按母页面的来路计算。填为“空”，即""，则来路按“直接输入网址或书签”计算。
 * */
export function pv(content_url, referer_url) {
  const res = ['_trackPageview', `${base}${content_url}`];

  if (referer_url !== undefined) {
    res.push(referer_url);
  }

  debug && console.log('[uweb debug]', res);

  if (ready) {
    window._czc && window._czc.push(res);
  } else {
    actionCache.push(res);
  }
}

/**
 * @param category 表示事件发生在谁身上，如“视频”、“小说”、“轮显层”等等。
 * @param action 表示访客跟元素交互的行为动作，如"播放"、"收藏"、"翻层"等等。
 * @param label 用于更详细的描述事件，如具体是哪个视频，哪部小说。
 * @param value 用于填写打分型事件的分值，加载时间型事件的时长，订单型事件的价格。
 * @param nodeid 填写事件元素的div元素id。
 * */
export function event(category, action, label, value, nodeid) {
  const res = ['_trackEvent', category, action];

  if (label !== undefined) {
    res.push(label);
  }
  if (value !== undefined) {
    res.push(value);
  }
  if (nodeid !== undefined) {
    res.push(nodeid);
  }

  debug && console.log('[uweb debug]', res);

  if (ready) {
    window._czc && window._czc.push(res);
  } else {
    actionCache.push(res);
  }
}
