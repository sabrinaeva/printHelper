/**
 * Created by wx on 17-6-9.
 */
(function () {

  var ffPrintImpl = {

    print: function (options) {
      if (typeof jsPrintSetup == "undefined") {
        bootbox.confirm({
          message: '为了提高打印效果,请火狐用户安装打印插件,点击确定开始下载',
          callback: function (result) {
            if (result) {
              window.open('https://addons.mozilla.org/firefox/downloads/latest/8966/addon-8966-latest.xpi?src=dp-btn-primary');
            }
          }
        });
      } else {
        printSettings = function () {
          jsPrintSetup.setOption('headerStrLeft', options.headerStrLeft);
          jsPrintSetup.setOption('headerStrCenter', options.headerStrCenter);
          jsPrintSetup.setOption('headerStrRight', options.headerStrRight);
          jsPrintSetup.setOption('footerStrLeft', options.footerStrLeft);
          jsPrintSetup.setOption('footerStrCenter', options.footerStrCenter);
          jsPrintSetup.setOption('footerStrRight', options.footerStrRight);
        };

        setTopMargin = function (margin) {
          jsPrintSetup.setOption('marginTop', margin);
        };
        setLeftMargin = function (margin) {
          jsPrintSetup.setOption('marginLeft', margin);
        };
        setRightMargin = function (margin) {
          jsPrintSetup.setOption('marginRight', margin);
        };
        setBottomMargin = function (margin) {
          jsPrintSetup.setOption('marginBottom', margin);
        };
        setPortrait = function (flag) {
          if (flag) {
            jsPrintSetup.setOption('orientation', jsPrintSetup.kPortraitOrientation);
          }
          else {
            jsPrintSetup.setOption('orientation', jsPrintSetup.kLandscapeOrientation);
          }
        };

        printSettings(options);
        setTopMargin(options.marginTop);
        setLeftMargin(options.marginLeft);
        setRightMargin(options.marginRight);
        setBottomMargin(options.marginBottom);
        setPortrait(options.orientation);
        jsPrintSetup.printWindow(window);
      }
    },
    matchUa: function (ua) {
      if (ua.indexOf('Firefox') > 0) {
        return true
      }
    }
  };
  var ggPrintImpl = {
    print: function () {
      $('head').append('<style type="text/css" media="print">' +
          '@page{size: auto; margin: 10px;}' +
          'body {background-color:#FFFFFF;;margin: 0px;}</style>');
      window.print();

    },
    matchUa: function (ua) {
      if (ua.indexOf('Chrome') > 0 || ua.indexOf('Opera') > 0) {
        return true
      }
    }
  };
  var iePrintImpl = {

    print: function (options) {

      var url = window.CONTEXT_PATH + './meadco/meadco-scriptx-1.1.0.min.js';
      var codebase = window.CONTEXT_PATH + './meadco/smsx.cab#Version=7,7,0,20';

      $('body').append('<object id="factory" style="display:none" classid="clsid:1663ed61-23eb-11d2-b92f-008048fdd814" ' +
          'codebase="' + codebase + '"></object> ' +
          '<script type="text/javascript" src="' + url + '"></script>');

      function init() {
        if (MeadCo.ScriptX.Init()) {
          MeadCo.ScriptX.Printing.header = "";
          MeadCo.ScriptX.Printing.footer = "";
//      MeadCo.ScriptX.Printing.orientation = "landscape";
        }
      };
      init();

      SetPrintSettings = function () {
        try {
          if (typeof factory.printing != 'undefined') {
            factory.printing.header = "";
            factory.printing.footer = "";
          }
        } catch (e) {
        }
      };

      setTopMargin = function (margin) {
        factory.printing.topMargin = margin;
      };
      setLeftMargin = function (margin) {
        factory.printing.leftMargin = margin;
      };
      setRightMargin = function (margin) {
        factory.printing.rightMargin = margin;
      };
      setBottomMargin = function (margin) {
        factory.printing.bottomMargin = margin;
      };
      setPortrait = function (flag) {
        factory.printing.portrait = flag;
      };

      SetPrintSettings();
      setTopMargin(options.marginTop);
      setLeftMargin(options.marginLeft);
      setRightMargin(options.marginRight);
      setBottomMargin(options.marginBottom);
      setPortrait(options.orientation);

      MeadCo.ScriptX.PrintPage(false);

    },
    matchUa: function (ua) {

      if (ua.indexOf('MSIE') > 0 || ua.indexOf('Trident') > 0 || ua.indexOf('rv:11') > 0 || ua.indexOf('Windows') > 0) {
        return true;
      }

    }

  };

  var printImplList = [];
  printImplList.push(ffPrintImpl);
  printImplList.push(ggPrintImpl);
  printImplList.push(iePrintImpl);

  function getPrintImpl(ua) {
    for (var i = 0; i < printImplList.length; i++) {
      var printImpl = printImplList[i];
      if (printImpl.matchUa(ua)) {
        return printImpl;
      }
    }
  }

  window.PrintHelper = {

    print: function (options) {
      /**
       * @param headerStrLeft headerStrRight headerStrCenter 页眉 左右中内容的设置
       * @param  footerStrLeft footerStrRight footerStrCenter页眉 左右中内容的设置
       * @param  marginTop marginBottom marginLeft  marginRight 上下左右的margin的设置,
       * @param orientation  默认为：false 横向打印
       * @type {{headerStrLeft: string, headerStrCenter: string, headerStrRight: string, footerStrLeft: string, footerStrCenter: string, footerStrRight: string, marginTop: number, marginBottom: number, marginLeft: number, marginRight: number, orientation: boolean}}
       */
      var defaults = {
        headerStrLeft: '',
        headerStrCenter: '',
        headerStrRight: '',
        footerStrLeft: '',
        footerStrCenter: '',
        footerStrRight: '',
        marginTop: 5,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        orientation: false,
        tableFontSize:12,
        semesterFontSize:15,
        schoolFontSize:22,
        remarkFontSize:12,
      };
      var useragent = navigator.userAgent;

      var option = $.extend({}, defaults, options);

      $('.courseTable').css('font-size', option.tableFontSize  +'px');
      $('.tableTopName').css('font-size', option.schoolFontSize +'px');
      $('.semester-container').css('font-size', option.semesterFontSize  +'px');
      $('.course-table-remark').css('font-size', option.remarkFontSize  +'px');

      var printImpl = getPrintImpl(useragent);

      /**
       * 匹配不到的时候,使用默认window的打印
       */
      if (!printImpl) {
        window.print();
      } else {
        printImpl.print(option);
      }

    }
  }
})();
