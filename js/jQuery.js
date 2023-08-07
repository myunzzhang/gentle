//slick
$('.best-1').slick({
    autoplay: true,
    arrows: false,
    vertical: true, 
    verticalSwiping: true, 
});

//slick
$('.best-2').slick({
    autoplay: true,
    arrows: false,
    vertical: true, 
    verticalSwiping: true, 
});

//slick
$('.best-3').slick({
    autoplay: true,
    arrows: false,
    vertical: true, 
    verticalSwiping: true, 
});

$('.command_slider').slick({
    autoplay: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 1000,
    infinite:true,
});

//cusor

$('.p-1').hover(function () {
    $('.cursor').css({
        backgroundImage: "url(../img/shopimg02.jpg)"
    })
})
$('.p-2').hover(function () {
    $('.cursor').css({
        backgroundImage: "url(../img/shopimg03.jpg)"
    })
})
$('.p-3').hover(function () {
    $('.cursor').css({
        backgroundImage: "url(../img/shopimg01.jpg)"
    })
})

let cursor = $('.cursor');
let overlay = $('.project-overlay');

overlay.mousemove(function () {
    gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.5
    })
    gsap.to(cursor, {
        left: 200,
        top: 200,
        delay: 0.03
    })

    cursor.css("cursor", "none");
})

$(".collabo_wrapper").mouseleave(function () {
    gsap.to(cursor, {
      opacity: 0,
      scale: 0.1,
    });
  });
//bgc변경

/* $(window).scroll(function(){
    //this는 window
    let scrollTop=$(this).scrollTop();
    let offset=$('.section5').offset().top-300;
    if(scrollTop>offset){
        $('body').addClass('on')
    }else{
        $('body').removeClass('on')
    }
}); */


// ripple

let ripple6 = new RippleEffect({
    parent: document.querySelector('.div5'),
    texture: '../img/bg_05.jpg',
    intensity: 1.0,
    strength: .2,
    waveSpeed: 0.008,
    hover: false
  });
  document.querySelector('.start').addEventListener('click', ripple6.start);
  document.querySelector('.start').click();
  
  let ripple7 = new RippleEffect({
    parent: document.querySelector('.div6'),
    texture: '../img/bg_05.jpg',
    intensity: 1.0,
    strength: .2,
    waveSpeed: 0.008,
    hover: false
  });
  document.querySelector('.start').addEventListener('click', ripple7.start);
  document.querySelector('.start').click();

