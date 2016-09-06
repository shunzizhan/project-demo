
var dialog = {
 /**
  * 信息提示,sDuration毫秒后消失
  * @param  {[string]} type [分三种信息提示,"error":表示错误信息;"success":表示成功信息;"info":表示提示信息]
  * @param  {[string]} msg  [信息的内容]
  * @param  {[int]} sDuration  [信息提示框的展示时间(单位毫秒),默认2000毫秒]
  */
  showMsg: function(type, msg, callback, sDuration){
    if($('.dialog-warp').length>0){
      $('.dialog-warp').remove();
    }
    var iconClass;
    switch(type){
      case "error":
        iconClass = "ico-error";
        break;
      case "success":
        iconClass = "ico-success";
        break;
      case "info":
        iconClass = "ico-info";
        break;
      default:
        return;
    }      
    var sDuration = sDuration || 2000;
    var d = $('<div class="dialog-warp"><div class="dialog-body"><i class="info-ico ' + iconClass + '"></i><p class="info-msg">' + msg + '</p></div></div>').appendTo('body');
    setTimeout(function () {
      d.remove();
      if(callback){
        callback();
      }
    }, sDuration);
  },
  /**
   * 模态确认提示框
   * @param  {[string]}   msg      [确认提示信息]
   * @param  {Function} callback [确认后的回调方法]
   */
  confirm: function(msg, callback){
    var confirm_html = '<div class="confirm-warp">';
        confirm_html +='<div class="confirm-mask"></div>';
        confirm_html +='<div class="confirm-body">';
        confirm_html +='<div class="confirm-head">';
        confirm_html +='<span class="confirm-headtx">确认提示</span>';
        confirm_html +='<i class="confirm-cancel">×</i>';
        confirm_html +='</div>';
        confirm_html +='<div class="confirm-content">'+msg+'</div>';
        confirm_html +='<div class="confirm-footer">';
        confirm_html +='<button class="confirm-btn confirm-ok">确认</button>';
        confirm_html +='<button class="confirm-btn confirm-cancel">取消</button>';
        confirm_html +='</div>';
        confirm_html +='</div>';
        confirm_html +='</div>';
    var d = $(confirm_html).appendTo('body');
    $('.confirm-cancel').click(function(event) {
      /* Act on the event */
      d.remove();
    });
    $('.confirm-ok').click(function(event) {
      /* Act on the event */
      d.remove();
      if(callback){
        callback();
      }else{
        console.log('您没有提供回调函数');
      }
    });
  },
  loading:{
    /**
     * 模拟加载中
     * @param  {[string]}   etag      [需要添加加载中的元素，为空就是body]
     * @param  {int} sDuration [提示时长，默认5s后自动消失]
     */
    show:function(etag,sDuration){
      var _top,_style;
      if(etag && etag.selector != 'body'){
        _top = $(etag).height()/2-21;
        _style ={
          "padding-top":_top+"px",
          "height": _top+42+"px"
        }
      }else{
        etag = 'body';
        _top = document.documentElement.clientHeight/2-21;
        _style ={
          "padding-top":_top+"px",
          "position": "fixed",
          "width": "100%",
          "height": "100%",
          "left": "0",
          "top": "0"
        }
      }
      var d = $('<div class="loading-warp"><span class="loading-content"></span>加载中…</div>');
      d.css(_style).appendTo(etag);
      setTimeout(function () {
        d.remove();
      }, sDuration || 5000);
    },
    /**
     * 模拟关闭加载中
     * @param  {[string]}   etag      [需要移除加载中的元素，为空就是body]
     */
    close:function(etag){
      etag = etag || 'body';
      $(etag).find('.loading-warp').remove();
    }
  }
}