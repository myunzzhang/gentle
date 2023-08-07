//menubox popup
// 메뉴를 펼치는 함수
const searchmenu = document.getElementById('search');
searchmenu.addEventListener('click', showMenu);

function showMenu() {
  const menu = document.querySelector('.menubox');
  menu.style.display = 'block';
}

const nomenu = document.querySelector('.menu_click_btn');
nomenu.addEventListener('click', hideMenu);

// 메뉴를 숨기는 함수
function hideMenu() {
  const menu = document.querySelector('.menubox');
  menu.style.display = 'none';
}

// popup1

document.getElementById("popup").addEventListener("click", function (event) {
  event.preventDefault();
  document.getElementById("popup_wrap").style.display = "block";
});

document.querySelector(".text_click_btn").addEventListener("click", function () {
  document.getElementById("popup_wrap").style.display = "none";
});



//textscroll

let pTag1 = document.querySelector(".first-parallel");
let textArr1 = 'boldcollection 2023collection DHEYGERE Maison Margiel boldcollection 2023collection DHEYGERE Maison Margiel boldcollection 2023collection DHEYGERE Maison Margiel boldcollection 2023collection DHEYGERE Maison Margiel boldcollection 2023collection DHEYGERE Maison Margiel'.split(' ')
let count1 = 0;

initTexts(pTag1, textArr1);

function initTexts(element, textArry) {
  textArry.push(...textArry) // 배열에 동일한 배열을 복사해서 넣음
  // console.log(textArry)
  for (let i = 0; i < textArry.length; i++) {
    element.innerHTML += `${textArry[i]}\u00A0\u00A0\u00A0`; //\u00A0 자바스크립트에서 공백을 나타냄
  }
}

function ani() {
  count1++;
  // console.log(count1)

  count1 = marqueeText(count1, pTag1, -1)

  window.requestAnimationFrame(ani) //setInterval의 업그레이드 버전 \\ani함수를 다시 실행
}
// function marqueeText(count, element, direction)
function marqueeText(count, element, direction) {
  //scrollWidth --> 보이지 않는 공간일지라도 스크롤해서 확인할 수 있는 공간까지의 넓이, 전체넓이 
  // console.log(element.scrollWidth)
  if (count > element.scrollWidth / 2) {
    count = 0;
    element.style.transform = `translate(0,0)`;
  }

  element.style.transform = `translate(${count * direction}px,0)`
  return count;
}

ani();

function scrollHandler() {
  count1 += 25;
}

window.addEventListener("scroll", scrollHandler)


//suglass

let allText = document.querySelectorAll('.sunglass');
let section3 = document.querySelectorAll('#section3');
let delay = 0;

allText.forEach((el, idx) => {
  el.style.animationDelay = `${delay}s`;
  el.style.zIndex = allText.length - idx;
  el.classList.add('base-anim');

  delay += 0.15;
});


// store

function openCity(cityName, elem) {
  let tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  document.getElementById(cityName).style.display = "block";
}

document.getElementById('defaultOpen').click();

function decodeText() {
  var text = document.getElementsByClassName('decode-text')[0];
  // debug with
  // console.log(text, text.children.length);

  // assign the placeholder array its places
  var state = [];
  for (var i = 0, j = text.children.length; i < j; i++) {
    text.children[i].classList.remove('state-1', 'state-2', 'state-3');
    state[i] = i;
  }

  // shuffle the array to get new sequences each time
  var shuffled = shuffle(state);

  for (var i = 0, j = shuffled.length; i < j; i++) {
    var child = text.children[shuffled[i]];
    classes = child.classList;

    // fire the first one at random times
    var state1Time = Math.round(Math.random() * (2000 - 300)) + 50;
    if (classes.contains('text-animation')) {
      setTimeout(firstStages.bind(null, child), state1Time);
    }
  }
}

// send the node for later .state changes
function firstStages(child) {
  if (child.classList.contains('state-2')) {
    child.classList.add('state-3');
  } else if (child.classList.contains('state-1')) {
    child.classList.add('state-2')
  } else if (!child.classList.contains('state-1')) {
    child.classList.add('state-1');
    setTimeout(secondStages.bind(null, child), 100);
  }
}

function secondStages(child) {
  if (child.classList.contains('state-1')) {
    child.classList.add('state-2')
    setTimeout(thirdStages.bind(null, child), 100);
  } else if (!child.classList.contains('state-1')) {
    child.classList.add('state-1')
  }
}

function thirdStages(child) {
  if (child.classList.contains('state-2')) {
    child.classList.add('state-3')
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


// Demo only stuff
decodeText();

// beware: refresh button can overlap this timer and cause state mixups
setInterval(function () {
  decodeText();
}, 10000);


let scrollBody = document.querySelector('.fix_motion'),
  scrollHeight,
  sectionOffsetTop,
  sectionScrollTop,
  winScrollTop,
  scrollPercent,
  percent;

let isMobile;

function scrollFuc() {
  setProperty();
  if (isMobile) {
    contentInMobile();
  } else {
    contentIn();
  }
}


function setProperty() {
  isMobile = window.innerWidth <= 1024 ? true : false;
  console.log(isMobile)
  scrollHeight = scrollBody.offsetHeight; //.fix-motion�� �믪씠媛�
  sectionOffsetTop = scrollBody.offsetTop; //臾몄꽌�먯꽌 .fix-motion �꾧퉴吏��� �믪씠媛�
  scrollRealHeight = scrollHeight - window.innerHeight;
  winScrollTop = pageYOffset;
  sectionScrollTop = winScrollTop - sectionOffsetTop;
  scrollPercent = sectionScrollTop / scrollRealHeight;
  percent = scrollPercent * 100;
  console.log(percent)



}

function contentIn() {
  let deviceImg = document.querySelectorAll('.slide figure');
  let imgWidth = deviceImg[0].offsetWidth;

  if (percent >= 8 && percent < 88) {
    document.querySelector('.text_box p.text01').classList.add('active')
    imageChange(imgWidth * 0)
  }
  if (percent >= 88 && percent < 160) {
    document.querySelector('.text_box p.text02').classList.add('active')
    imageChange(imgWidth * 1)
  }

  if (percent >= 161 && percent < 188) {
    document.querySelector('.text_box p.text03').classList.add('active')
    imageChange(imgWidth * 2)
  }

  if (percent < 7) {
    document.querySelector('.text_box p.text01').classList.remove('active')
    document.querySelector('.text_box p.text02').classList.remove('active')
    document.querySelector('.text_box p.text03').classList.remove('active')
  }

}

function imageChange(moveX) {
  let img = document.querySelector('.slide_wrap .slide');
  img.style.transform = `translateX(${-moveX}px)`;
}


window.addEventListener('scroll', function () {
  scrollFuc()
})
window.addEventListener('resize', function () {
  scrollFuc()
})

scrollFuc()
