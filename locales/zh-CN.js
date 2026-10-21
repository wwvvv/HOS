/* HOS 简体中文界面适配 v0.1：仅翻译宿主 UI，不修改应用数据或 SDK。 */
(() => {
  'use strict';
  const dict = {
    'Settings':'设置','Search':'搜索','Search apps':'搜索应用','Search apps…':'搜索应用…',
    'Apps':'应用','All apps':'全部应用','App Info':'应用信息','About':'关于',
    'Storage':'存储','Files':'文件','Notes':'笔记','Calendar':'日历','Calculator':'计算器',
    'Desktop':'桌面','Appearance':'外观','Theme':'主题','Themes':'主题',
    'General':'常规','Privacy':'隐私','Permissions':'权限','Security':'安全',
    'AI':'人工智能','AI Settings':'AI 设置','Help':'帮助','Close':'关闭',
    'Cancel':'取消','Save':'保存','Apply':'应用','Reset':'重置','Delete':'删除',
    'Remove':'移除','Add':'添加','Edit':'编辑','Done':'完成','Back':'返回',
    'Next':'下一步','Previous':'上一步','Continue':'继续','Skip':'跳过',
    'Finish':'完成','Open':'打开','Launch':'启动','Install':'安装',
    'Uninstall':'卸载','New':'新建','Create':'创建','Rename':'重命名',
    'Copy':'复制','Paste':'粘贴','Download':'下载','Upload':'上传',
    'Refresh':'刷新','Reload':'重新加载','Restore':'恢复','Minimize':'最小化',
    'Maximize':'最大化','Fullscreen':'全屏','Exit fullscreen':'退出全屏',
    'Basic':'基础模式','Immersive':'沉浸模式','Mode':'模式',
    'Browser storage':'浏览器存储','Folder':'文件夹','Cloud storage':'云存储',
    'Connected':'已连接','Disconnected':'未连接','Connect':'连接',
    'Unlock':'解锁','Lock':'锁定','Language':'语言','System':'系统',
    'Recent':'最近使用','Favorites':'收藏','Pinned':'已固定',
    'New game':'新游戏','Welcome to NakliOS':'欢迎使用 HOS',
    'Choose a theme':'选择主题','No results':'没有结果',
    'No apps found':'未找到应用','Open in new tab':'在新标签页打开',
    'Add app':'添加应用','Add App':'添加应用','Your apps':'我的应用',
    'Work & Build':'工作与开发','Create & Convert':'创作与转换','Play':'娱乐',
    'Essentials':'常用应用','Name':'名称','Description':'描述','URL':'网址',
    'Status':'状态','Version':'版本','Enabled':'已启用','Disabled':'已禁用'
  };
  const attrs=['title','aria-label','placeholder'];
  const translate = s => {
    if (!s || !s.trim()) return s;
    const trimmed=s.trim();
    const translated=dict[trimmed];
    return translated ? s.replace(trimmed,translated) : s;
  };
  function scan(root) {
    if (!root || root.nodeType!==1 || root.closest?.('[contenteditable="true"],textarea,pre,code,iframe')) return;
    for (const a of attrs) if (root.hasAttribute(a)) {
      const v=root.getAttribute(a),t=translate(v);
      if (v!==t) root.setAttribute(a,t);
    }
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(n) {
        if (!n.nodeValue?.trim() || n.parentElement?.closest('script,style,textarea,pre,code,[contenteditable="true"]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n;while((n=walker.nextNode())) {
      const t=translate(n.nodeValue);
      if(t!==n.nodeValue)n.nodeValue=t;
    }
  }
  function boot(){
    document.documentElement.lang='zh-CN';
    document.title='HOS — 在线应用桌面';
    scan(document.body);
    const pending=new Set();
    let queued=false;
    const flush=()=>{queued=false;for(const n of pending)if(n.isConnected)scan(n);pending.clear();};
    new MutationObserver(records=>{
      for(const r of records){
        if(r.type==='characterData'){if(r.target.parentElement)pending.add(r.target.parentElement);}
        else if(r.type==='childList')for(const n of r.addedNodes)if(n.nodeType===1)pending.add(n);
        else if(r.type==='attributes')pending.add(r.target);
      }
      if(!queued&&pending.size){queued=true;queueMicrotask(flush);}
    }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:attrs});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
