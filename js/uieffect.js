$(function(){
  const _html = $('html');
  const _body = $('body');
  const _window = $(window);

  var ww = _window.width();
  var wwNew = ww;

  const wwSlim = 400;
  const wwMedium = 700;
  const wwNormal = 1000;
  const wwMaximum = 1400;

  const _siteHeader = $('.siteHeader');
  const _menu = _siteHeader.find('.menu'); // 主選單
  const _sidebar = $('.sidebar');
  const _sidebarCtrl = $('.sidebarCtrl');

  const _siteFooter = $('.siteFooter');
  const _goTop = $('.goTop');

  // 製作側欄選單遮罩
  _body.append('<div class="sidebarMask"></div>');
  const _sidebarMask = $('.sidebarMask');

  // 選單有子選單的加上 aria 屬性
  _menu.find('li').has('ul').addClass('hasChild')
    .children('a').attr('role', 'button').attr('aria-expanded', false);

  // 複製主選單到側欄
  _menu.clone().appendTo(_sidebar);
  const _sidebarMenu = _sidebar.find('.menu');
  const _sbHasChildA = _sidebarMenu.find('.hasChild > a');

  // 子選單開合
  _sbHasChildA.on('click', function(e) {
    e.preventDefault();
    const _this = $(this);
    const _subMenu = _this.next('ul');

    if (_subMenu.is(':hidden')) {
      _this.attr('aria-expanded', true);
      _this.parent().addClass('closeIt').siblings().removeClass('closeIt').find('ul:visible').slideUp().find('.closeIt').removeClass('closeIt');
      _subMenu.stop(true, false).slideDown();
    } else {
      _this.attr('aria-expanded', false).parent().removeClass('closeIt');
      _subMenu.find('.closeIt').removeClass('closeIt');
      _subMenu.stop(true, false).slideUp().find('ul:visible').stop(true, false).slideUp();
    }
  });

  // 顯示/隱藏側欄
  _sidebarCtrl.attr('aria-haspopup', true).attr('aria-expanded', false);
  _sidebarCtrl.click(function() {
    if (_sidebar.is(':visible')) {
      hideSidebar();
    } else {
      _sidebar.css('top', _siteHeader.innerHeight()).show(10, function() {
        _sidebar.addClass('reveal');
        // _sidebar.find('a, button, input').filter(':visible').first().trigger('focus'); // ⬅ 打開後自動聚焦
      });
      _sidebarCtrl.addClass('closeIt').attr('aria-expanded', true);
      _sidebarMask.fadeIn(400);
      _body.addClass('noScroll');
    }
  });

  // 點擊遮罩關閉側欄
  _sidebarMask.on('click', hideSidebar);

  // ESC 鍵全域關閉
  _window.on('keydown', function(e) {
    if (e.key === 'Escape' && _sidebar.is(':visible')) {
      hideSidebar();
      _sidebarCtrl.trigger('focus');
    }
  });

  // 改善 Tab 鎖定焦點循環
  _sidebar.on('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusable = _sidebar.find('a, button, input').filter(':visible');
      const first = focusable.first()[0];
      const last = focusable.last()[0];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        _sidebarCtrl.trigger('focus');
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        _sidebarCtrl.trigger('focus');
      }
    }
  });

  // 隱藏側欄 function
  function hideSidebar() {
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt').attr('aria-expanded', false);
    _sidebarMenu.find('.closeIt').removeClass('closeIt').find('ul:visible').hide();
    _sidebarMask.fadeOut(300, function() {
      _sidebar.removeAttr('style');
      _body.removeClass('noScroll');
    });
  }


  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //




  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //



  // 寬版「主選單」
  // --------------------------------------------------------------- //
  var _topItem = _menu.children('ul').children('li'); // 第一層選單項
  var _hasChild = _menu.find('.hasChild');
  var _hasChildA = _hasChild.children('a');
  var liA = _menu.find('li>a');
  var _menuLastA = _topItem.last().find('a').last();
  var _menuFirstA = _topItem.first().children('a');

  // 滑鼠移入有次選單的 a
  _hasChildA.on('mouseenter focusin', function(){
    let _this = $(this);
    let _thisParentLi = _this.parent('li');
    let _thisSubMenu = _this.next('ul');

    _this.attr('aria-expanded', true);
    _thisParentLi.addClass('here'); // 為已展開的次選單上層li加樣式
    _thisSubMenu.stop(true, false).slideDown(300);

    // 判斷展開的次選單是否超過視窗右邊界
    if ( _thisSubMenu.offset().left + _thisSubMenu.outerWidth() > _window.width()) {
      if ( _thisParentLi.is(_topItem) ) {
        _thisSubMenu.css({ right:0, left: 'auto'});
      } else {
        _thisSubMenu.css({ right: _this.outerWidth(), left: 'auto'});
        _thisParentLi.addClass('turn'); // 讓箭頭轉向
      }
    }
  })

  // 滑鼠移出 li
  _hasChild.on( 'mouseleave blur', function(){
    $(this).removeClass('here turn').removeAttr('style').find('a').attr('aria-expanded', false).end().find('ul').removeAttr('style').find('li').removeClass('here turn');
  })

  // 滑鼠移入任何 a，包括沒有次選單的項目
  liA.on( 'mouseenter focusin', function() {
    $(this).parent('li').siblings().removeClass('here turn').find('a').attr('aria-expanded', false).end().find('ul').removeAttr('style').find('li').removeClass('here turn');
  })

  // 離開 _menu 隱藏所有次選單
  // $('*').on( 'focus', function(){
  //   if( $(this).parents('.menu').length == 0 ){
  //     _hasChild.removeClass('here turn').find('ul').removeAttr('style');
  //   }
  // })

  // 從最後一個 a 離開
  _menuLastA.on('keydown', function(e){
    if( e.code == 'Tab' && !e.shiftKey ) {
      hideAllSubMenu();
    }
  })
  // 從第一個 a 離開 _menuFirstA
  _menuFirstA.on('keydown', function(e){
    if( e.code == 'Tab' && e.shiftKey ) {
      hideAllSubMenu();
    }
  })

  function hideAllSubMenu() {
    _hasChild.removeClass('here turn').find('ul').removeAttr('style');
    _hasChildA.attr('aria-expanded', false);
  }

  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //



  // 固定版頭
  // --------------------------------------------------------------- //
  var fixHeadThreshold;
  var hh = _siteHeader.innerHeight();

  if ( ww >= wwNormal) {
    fixHeadThreshold =  hh ;
  } else {
    fixHeadThreshold = 1;
  }

  _window.scroll(function(){

    if (_window.scrollTop() >= fixHeadThreshold ) {
      // console.log(hh);
      _body.offset({top: hh});
      _siteHeader.addClass('fixed');
    } else {
      _siteHeader.removeClass('fixed');
      _body.removeAttr('style');
    }

    // goTop button 顯示、隱藏
    // ----------------------------------------------- //
    if (_window.scrollTop() > 200) {
      _goTop.addClass('show');
    } else {
      _goTop.removeClass('show');
    }
  })
  _window.trigger('scroll');
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //


  // --------------------------------------------------------------- //
  // ----------------- 外掛套件 slick 參數設定 --------------------- //
  // --------------------------------------------------------------- //

  // 首頁大圖輪播
  // --------------------------------------------------------------- //
  $('.bigBanner').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 6000,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: true,
    infinite: true,
    zIndex:8
  });

  // --------------------------------------------------------------- //
  // --------------- 外掛套件 slick 參數設定 END ------------------- //
  // --------------------------------------------------------------- //



  // 點擊展開的複合功能圖示
  // --------------------------------------------------------------- //
  // 分享圖示
  var _compIcon = $('.compound'); //li
  _compIcon.each(function(){
    let _this = $(this);
    let _controler = _this.children('button');
    let _optList = _this.children('ul');
    let _optItem = _optList.children('li');
    let _optButton = _optItem.children('button');
    let _optLink = _optItem.children('a');
    let count = _optItem.length;
    const speed = 250;

    // 改變 li 的 z-index 值，第一個 li 要在最上面
    for (let i = 0; i < count; i++) {
      _optItem.eq(i).css('z-index', count - i)
    }

    // 收合 function
    function glideUp() {
      for (let i = 0; i < count; i++) {
        _optItem.eq(i).stop(true, false).delay( speed * i * .2).animate({ 'top': 0 }, speed*(i+.5), function(){
          if ( i == count-1) {
            _optList.hide();
            _controler.attr('aria-expandex', false);
          }
        });
      }
    }

    // 展開 function
    function glideDown() {
      _optList.show();
      _controler.attr('aria-expandex', true);
      let ddd = _optItem.outerHeight(true);
      for (let i = 0; i < count; i++) {
        _optItem.eq(i).stop(true, false).delay(speed * i * .2).animate({ 'top': ddd*(i+1) }, speed*(i+.5));
      }
    }
    _controler.on( 'click', function(){
      if (_optList.is(':hidden')) {
        glideDown();
      } else {
        glideUp();
      }
    })

    _optButton.add(_optLink).on( 'click', glideUp);
    _this.siblings().on( 'click', glideUp);
    _this.siblings().children('a, button').focus(glideUp);
    _optItem.last().children('button').on('keydown', function(e){
      if( e.which == 9 && !e.shiftKey ) {
        glideUp();
      }
    });
  })
  // 複合功能圖示 end ---------------------------------------------- //
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //




  // fatfooter 開合
  // --------------------------------------------------------------- //
  var _fatFootCtrl = $('.fatFootCtrl');
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');

  if ( _footSiteTree.is(':hidden')) {
    _fatFootCtrl.addClass('closed').attr('aria-expanded' , false);
  } else {
    _fatFootCtrl.removeClass('closed').attr('aria-expanded' , true);
  }

  _fatFootCtrl.on( 'click', function(){
    if ( _footSiteTree.is(':hidden')) {
      _footSiteTree.slideDown();
      $(this).removeClass('closed').attr('aria-expanded' , true);
    } else {
      _footSiteTree.slideUp();
      $(this).addClass('closed').attr('aria-expanded' , false);
    }
  })
  // --------------------------------------------------------------- //






  // 回到頁面頂端 Go Top
  // --------------------------------------------------------------- //
  _goTop.on( 'click', function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      $('.goCenter').trigger('focus');
    });
  });
  // --------------------------------------------------------------- //



  // 燈箱
  // --------------------------------------------------------------- //
  const _lightbox = $('.lightbox');
  _lightbox.before('<div class="coverAll"></div>');
  _lightbox.append('<button type="button" class="skip">焦點移到 "關閉此燈箱"</button>');

  const _hideLightbox = _lightbox.find('.closeThis');
  const _coverAll = _lightbox.prev('.coverAll');
  const _skipToClose = _lightbox.find('.skip');
  const speed = 400;

  _skipToClose.on('focus', function () {
    _hideLightbox.trigger('focus');
  })

  // 關燈箱
  _hideLightbox.add(_coverAll).on('click', function(){
    _lightbox.stop(true, false).fadeOut( speed,
      function(){
        if ( _lightbox.hasClass('bigPhotos') ) {
          _lightbox.find('.flowList>li').hide().find('img').removeAttr('style');
          _keptFlowItem.trigger('focus');
        }
      }
    );
    _coverAll.fadeOut(speed);
    _body.removeClass('noScroll');
  })


  // 按 [esc 鍵] 關燈箱
  _lightbox.on('keydown', function(e){
    if ( e.keyCode == 27) {
      _hideLightbox.trigger('click');
    }
  })
  // _lightbox.each(function(){
  // })
  // --------------------------------------------------------------- //


  // .photoflow：cp頁的相關圖片（Related Photos）
  // 點擊圖片要開燈箱並顯示大圖
  // --------------------------------------------------------------- //
  var _photoflow = $('.photoflow');
  var _cpBigPhoto = $('.lightbox.bigPhotos');
  var photoIndex;
  var _keptFlowItem;

  _photoflow.find('.flowList').wrap('<div class="flowShow"></div>');

  // 點擊左右箭頭圖片左右流動
  // ----------------------------------------------------------
  _photoflow.each( function(){
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    const slideCount = _flowItem.length;
    const _btnRight = _this.find('.arrowBtn.next');
    const _btnLeft = _this.find('.arrowBtn.prev');
    const speed = 400;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 把向右箭頭移到 flow 之後以符合 tab 順序
    _btnLeft.prependTo(_floxBox);

    // 產生 indicator 和自訂屬性 data-index
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 1; n <= slideCount; n++) {
      _dots = _dots + '<li>'+ n +'</li>';
      _flowItem.eq(n-1).attr('data-index', n-1);
    }
    _indicator.append(_dots);

    let _indicatItem = _indicator.find('li');

    indicatReady();

    // 依據可視的 slide 項目，決定 indicator 樣式
    // --------------------------------------------------
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      _flowItem.children('a').attr('tabindex', -1);
      _flowItem.eq(i).children('a').attr('tabindex', 0);

      if (ww < wwSlim) {
        if (slideCount > 1) {
          flownavShow();
        } else {
          flownavHide();
        }
      }

      if (ww >= wwSlim) {
        if (slideCount <= 2) {
          flownavHide();
          _flowItem.eq((i + 1) % slideCount).children('a').attr('tabindex', 0);
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _flowItem.eq((i + 1) % slideCount).children('a').attr('tabindex', 0);
        }
      }

      if (ww >= wwMedium) {
        if (slideCount <= 3) {
          flownavHide();
          _flowItem.eq((i + 2) % slideCount).children('a').attr('tabindex', 0);
        } else {
          flownavShow();
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
          _flowItem.eq((i + 2) % slideCount).children('a').attr('tabindex', 0);
        }
      }

      if (ww >= wwNormal) {
        if (slideCount <= 4) {
          flownavHide();
          _flowItem.eq((i + 3) % slideCount).children('a').attr('tabindex', 0);
        } else {
          flownavShow();
          _indicatItem.eq((i + 3) % slideCount).addClass(actClassName);
          _flowItem.eq((i + 3) % slideCount).children('a').attr('tabindex', 0);
        }
      }
    }

    // 顯示點點和左右箭頭
    // --------------------------------------------------
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    // --------------------------------------------------

    // 隱藏點點和左右箭頭
    // --------------------------------------------------
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }
    // --------------------------------------------------

    // 向前滑動
    // --------------------------------------------------
    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _flowItem.eq(i).children('a').attr('tabindex', -1);
        _flowItem.eq(j).children('a').attr('tabindex', 0);

        _flowList.css('margin-left', 0);
        if (ww >= wwSlim) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
          _flowItem.eq((j + 1) % slideCount).children('a').attr('tabindex', 0);
        }
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
          _flowItem.eq((j + 2) % slideCount).children('a').attr('tabindex', 0);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 3) % slideCount).addClass(actClassName);
          _flowItem.eq((j + 3) % slideCount).children('a').attr('tabindex', 0);
        }
        i = j;
      });
    }
    // --------------------------------------------------

    // 向後滑動
    // --------------------------------------------------
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          _flowItem.eq(j).children('a').attr('tabindex', 0);

          if (ww >= wwNormal) {
            _indicatItem.eq((i + 3) % slideCount).removeClass(actClassName);
            _flowItem.eq((i + 3) % slideCount).children('a').attr('tabindex', -1);
          } else if (ww >= wwMedium) {
            _indicatItem.eq((i + 2) % slideCount).removeClass(actClassName);
            _flowItem.eq((i + 2) % slideCount).children('a').attr('tabindex', -1);
          } else if (ww >= wwSlim) {
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
            _flowItem.eq((i + 1) % slideCount).children('a').attr('tabindex', -1);
          } else {
            _indicatItem.eq(i).removeClass(actClassName);
            _flowItem.eq(i).children('a').attr('tabindex', -1);
          }
          i = j;
        });
    }
    // --------------------------------------------------

    // 點擊向右箭頭
    _btnRight.click(function () {
      slideForward();
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      slideBackward();
    });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // 鍵盤操作，點擊 向左、向右箭頭
    _body.on('keydown', function(e){
      if ( e.keyCode == 37) {
        _btnLeft.trigger('click');
      }
      if ( e.keyCode == 39) {
        _btnRight.trigger('click');
      }
    })



    let winResizeTimer1;
    _window.resize(function () {
      clearTimeout(winResizeTimer1);
      winResizeTimer1 = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });

  });
  // --------------------------------------------------------------- //


  // 複製「相關圖片」到大圖燈箱中 *** //
  _photoflow.find('.flowBox').clone().insertBefore(_skipToClose);


  // 點擊.photoflow的圖片，開燈箱顯示大圖
  // --------------------------------------------------------------- //
  var _showBigPhoto = _photoflow.find('.flowList>li');

  _showBigPhoto.children('a').on('click', function(){
    _keptFlowItem = $(this);
    photoIndex = _keptFlowItem.parent().attr('data-index');

    _cpBigPhoto.stop(true, false).fadeIn().find('.flowList').find('li').filter( function(){
      return $(this).attr('data-index') == photoIndex;
    }).show();

    _hideLightbox.focus();
    _coverAll.stop(true, false).fadeIn();
    _body.addClass('noScroll');

  })
  // --------------------------------------------------------------- //


  // cp 頁大圖燈箱
  // --------------------------------------------------------------- //
  _cpBigPhoto.each(function(){
    let _this = $(this);
    let _photoList = _this.find('.flowList');
    let _photoItem = _photoList.children('li');
    const photoCount = _photoItem.length;
    const _btnRight = _this.find('.arrowBtn.next');
    const _btnLeft = _this.find('.arrowBtn.prev');

    const speed = 400;
    let i, j;

    _photoItem.find('img').unwrap('a');

    if(photoCount>1) {
      _btnRight.add(_btnLeft).show();
    }

    // 點擊向右箭頭
    _btnRight.on('click', function(){
      i = Number( _photoItem.filter(':visible').attr('data-index') );
      j = (i+1) % photoCount;

      _photoItem.filter(function () {
        return $(this).attr('data-index') == i;
        }).stop(true, false).fadeOut(speed, function () {
          $(this).hide().find('img').removeAttr('style');
      })

      let _photoNow = _photoItem.filter( function(){
        return $(this).attr('data-index') == j;
      })

      _photoNow.stop(true, false).fadeIn(speed).find('img').height( _photoNow.height() - _photoNow.find('p').outerHeight(true) );

    })

    // 點擊向左箭頭
    _btnLeft.on('click' , function(){
      i = Number(_photoItem.filter(':visible').attr('data-index'));
      j = (i-1+photoCount) % photoCount;

      _photoItem.filter(function(){
        return $(this).attr('data-index') == i;
      }).stop(true, false).fadeOut(speed, function(){
        $(this).hide().find('img').removeAttr('style');
      });

      let photoNow = _photoItem.filter( function(){
        return $(this).attr('data-index') == j;
      });
      photoNow.stop(true, false).fadeIn(speed).find('img').height( photoNow.height() - photoNow.find('p').outerHeight(true));
    })
  })
  // --------------------------------------------------------------- //



  // 問答列表 展開／收合
  // --------------------------------------------------------------- //
  var _qaItem = $('.qa').children('ul').children('li');
  _qaItem.each( function () {
    let _this = $(this);
    let _ctrlBtn = _this.find('.ctrlBtn');
    let _question = _this.find('.q');
    let _answer = _this.find('.a');
    const speed = 400;

    if ( _answer.is(':visible') ){
      _ctrlBtn.addClass('closeIt').attr('aria-expanded', true);
    } else {
      _ctrlBtn.removeClass('closeIt').attr('aria-expanded', false);
    }

    _ctrlBtn.click( function() {
      if ( _answer.is(':visible') ) {
        _answer.slideUp(speed);
        _ctrlBtn.removeClass('closeIt').attr('aria-expanded', false);
      } else {
        _answer.slideDown(speed);
        _ctrlBtn.addClass('closeIt').attr('aria-expanded', true);
        _this.siblings().find('.ctrlBtn').removeClass('closeIt').attr('aria-expanded', false).end().find('.a').slideUp(speed);
      }
    });
  });
  // --------------------------------------------------------------- //



  // .principles 人工智慧發展的七大原則（ＳＰ）
  // --------------------------------------------------------------- //
  var _prTabBtn = $('.principles').find('.tabItem');
  var prSpeed = 500;

  _prTabBtn.filter('.active').next().show();

  _prTabBtn.on('click', function(){
    let _thisBtn = $(this);
    let _thisContent = _thisBtn.next('.tabContent');

    ww < wwNormal ? prSpeed = 500 : prSpeed = 0;

    if ( _thisContent.is(':hidden') ) {
      _prTabBtn.removeClass('active').next().slideUp(prSpeed);
      _thisBtn.addClass('active');
      _thisContent.slideDown(prSpeed);
    }

  })
  // --------------------------------------------------------------- //


  // .aiCenters [三大 AI 中心] 專用程式
  // --------------------------------------------------------------- //
  var _aiContent = $('.aiCenters').find('.content');
  var _aiTray = _aiContent.find('.tabContent');
  var _drawerTriggerBtn = _aiContent.find('.tabButton');
  var drawerSpeed = 400;

  _drawerTriggerBtn.filter('.active').next('.tabContent').show();

  // 行動版 slideDown/slideUp 效果，寬版類似頁籤切換
  _drawerTriggerBtn.on('click', function(){

    let _thisBtn = $(this);
    let _thisTray = _thisBtn.next('.tabContent');
    let _otherTray = _aiTray.not(_thisTray);

    ww < wwNormal ? drawerSpeed = 400 : drawerSpeed = 0;

	_drawerTriggerBtn.attr('aria-selected',false);

    if (_thisTray.is(':hidden')) {
      _thisBtn.addClass('active');
	  _thisBtn.attr('aria-selected',true);
      _thisTray.slideDown(drawerSpeed);
      _otherTray.slideUp(drawerSpeed, function(){
        _otherTray.find('.infoCard').removeAttr('style')
        _otherTray.find('.medList').removeAttr('style').find('button').removeAttr('style');
        _otherTray.find('.triggler.show').removeClass('show').end().find('.dim').removeClass('dim');
      });
      _drawerTriggerBtn.not(_thisBtn).removeClass('active');
    } else {
      if (ww < wwNormal) {
        _thisBtn.removeClass('active');
        _thisTray.find('.triggler.show').trigger('click');
        // _thisTray.slideUp(drawerSpeed).find('.infoCard').filter(':visible').find('.closeThis').trigger('click');
        _thisTray.slideUp(drawerSpeed);
      }
    }

  })

  // 北中南下拉選單 // .dropMenuGroup
  var _dropMenuGroup = $('.dropMenuGroup');
  _dropMenuGroup.each(function(){
    let _this = $(this);
    let _dropMenu = _this.find('.dropMenu');
    let _btnShowHide = _dropMenu.find('button.triggler');
    let _medList = _dropMenu.find('.medList');
    let _medListBtn = _medList.children('li').children('button');
    let _mobileMaps = _this.next('.mapHere').find('.mobileMaps');
    let _mapAreaImgs = _mobileMaps.find('img');
    let _tempInfocard;

    _btnShowHide.attr('aria-expanded', false);
    _btnShowHide.on('click', function(){
      let _thisBtn = $(this);
      let _thisList = _thisBtn.next('.medList');

      if ( _thisList.is(':hidden') ) {
        _btnShowHide.removeClass('show').attr('aria-expanded', false);
        _thisBtn.addClass('show').attr('aria-expanded', true);
        _medList.not(_thisList).slideUp(200, function(){
          $(this).removeAttr('style');
        });
        _thisList.slideDown(250);
      } else {
        _thisList.slideUp(200, function(){
          $(this).removeAttr('style');
        });
        _thisBtn.removeClass('show').attr('aria-expanded', false);
      }
    })

    _medListBtn.on('click', function(){

      if ( ww < wwNormal) {
        let _thisBtn = $(this);
        let whichArea = _thisBtn.attr('data-maparea');
        let _mapArea0 = _mapAreaImgs.eq(0);

        // 顯示所在縣市地圖
        _mapAreaImgs.hide().filter( function(){
          return $(this).attr('data-maparea') == whichArea;
        }).show();

        // 顯示相對應資料卡
        _thisBtn.parents('.medList').prev().trigger('click');
        _mobileMaps.find('.infoCard').remove();
        _thisBtn.next().clone().prependTo( _mobileMaps ).hide().fadeIn(360);

        _tempInfocard = _mobileMaps.find('.infoCard');

        _tempInfocard.find('.closeThis').on('click', function(){
          $(this).parent().remove();
          _mapAreaImgs.hide()
          _mapArea0.fadeIn(360);
        })
      }

    })


  })

  // AI 中心相關資料卡 顯示/隱藏 // .infoCard
  _aiContent.each( function(){
    let _thisAIContent = $(this);
    let _infoCard = _thisAIContent.find('.infoCard');
    let _hideInfoCard = _infoCard.find('.closeThis');
    let _pins = _thisAIContent.find('.pins').find('li');
    const speed = 300;
    let _kept;

    // ARIA
    _infoCard.attr('role', 'dialog');

    // 顯示資料卡
    let _showInfoCard = _thisAIContent.find('.medList>li').children('button');
    _showInfoCard.on('click', function(){
      let _thisBtn = $(this);
      let hName = _thisBtn.text();
      _kept = _thisBtn;
      if( ww >= wwNormal ) {
        _infoCard.filter(':visible').slideUp(speed);
        _showInfoCard.filter(':hidden').show();
        _thisBtn.hide().next().slideDown(speed, function(){
          $(this).find('.closeThis').trigger('focus');
        });
        _pins.removeClass('dim').filter( function(){
          return $(this).attr('data-name') === hName;
        }).siblings().addClass('dim');
      }
    })

    // 隱藏資料卡
    _hideInfoCard.on('click', function(){
      let _this = $(this);
      if (ww >= wwNormal) {
        _pins.removeClass('dim');
        _this.parent().slideUp(speed, function(){
          _kept.show().trigger('focus');
        });
      }
    })

    // Tab 鍵操作
    _infoCard.find('a').last().on('keydown', function(e){
      if (e.code == 'Tab' && !e.shiftKey) {
       e.preventDefault();
        _hideInfoCard.trigger('focus');
      }
    })
  })


  // --------------------------------------------------------------- //









  // 改變瀏覽器寬度 window resize
  // --------------------------------------------------------------- //
  var winResizeTimer;
  _window.resize(function () {
    clearTimeout(winResizeTimer);
    winResizeTimer = setTimeout( function () {

      wwNew = _window.width();

      // 由小螢幕到寬螢幕
      if( ww < wwNormal && wwNew >= wwNormal ) {
        if (_sidebar.hasClass('reveal')) {
          hideSidebar(); // 隱藏側欄
        }

        // 重設 fixed header
        _siteHeader.removeClass('fixed');
        _body.removeAttr('style');
        hh = _siteHeader.innerHeight();
        fixHeadThreshold =  hh;
        _window.trigger('scroll');

        // [三大 AI 中心]
        if ( _drawerTriggerBtn.filter('.active').length == 0 ) {
          _aiTray.eq(0).show().prev().addClass('active');
        } else {
          _drawerTriggerBtn.filter('.active').next('.tabContent').show();
        }
        _dropMenuGroup.find('.dropMenu').removeClass('show');
        _dropMenuGroup.find('.medList').removeAttr('style');
        _aiContent.find('.infoCard').removeAttr('style');
      }

      // 由寬螢幕到小螢幕
      if( ww >= wwNormal && wwNew < wwNormal ){

        // 重設 fixed header
        _siteHeader.removeClass('fixed');
        _body.removeAttr('style');
        fixHeadThreshold = 0;
        hh = _siteHeader.innerHeight();
        _window.trigger('scroll');

        // [三大 AI 中心]
        _drawerTriggerBtn.filter('.active').next('.tabContent').show();
        _dropMenuGroup.find('.medList>li').removeAttr('style').children('button').removeAttr('style');
        _aiContent.find('.infoCard').removeAttr('style').end().find('.dim').removeClass('dim');
      }
      ww = wwNew;
    }, 200);
  });
  // window resize  end -------------------------------------------- //







	// rwd Table
  // --------------------------------------------------------------- //
	// 把 th 的內容複製到對應的td的 data-th 屬性值
	var _rwdTable = $('.rwdTable');
	_rwdTable.each(function () {
		let _this = $(this);
		let _th = _this.find('thead>tr>th');
		let count = _th.length;
		let _tr = _this.find('tbody').children('tr');

		_tr.each(function () {
			let _td = $(this).children('td');
			for (let i = 0; i < count; i++) {
				_td.eq(i).attr('data-th', _th.eq(i).text());
			}
		})
	})
})