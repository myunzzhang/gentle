window.addEventListener("load", windowLoadHandler, false);
var sphereRad = 300;
var radius_sp=1;

function windowLoadHandler() {
  canvasApp();
}

function canvasSupport() {
  return Modernizr.canvas;
}

function canvasApp() {
  if (!canvasSupport()) {
    return;
  }
  
  var theCanvas = document.getElementById("particle_3d");
  var context = theCanvas.getContext("2d");
  
  var displayWidth;
  var displayHeight;
  var timer;
  var wait;
  var count;
  var numToAddEachFrame;
  var particleList;
  var recycleBin;
  var particleAlpha;
  var r,g,b;
  var fLen;
  var m;
  var projCenterX;
  var projCenterY;
  var zMax;
  var turnAngle;
  var turnSpeed;
  var sphereCenterX, sphereCenterY, sphereCenterZ;
  var particleRad;
  var zeroAlphaDepth;
  var randAccelX, randAccelY, randAccelZ;
  var gravity;
  var rgbString;
  //we are defining a lot of variables used in the screen update functions globally so that they don't have to be redefined every frame.
  var p;
  var outsideTest;
  var nextParticle;
  var sinAngle;
  var cosAngle;
  var rotX, rotZ;
  var depthAlphaFactor;
  var i;
  var theta, phi;
  var x0, y0, z0;
    
  init();
  
  function init() {
    wait = 1;
    count = wait - 1;
    numToAddEachFrame = 8;
    
    //particle color
    r = 255;
    g = 255;
    b = 255;
    
    rgbString = "rgba("+r+","+g+","+b+","; //partial string for color which will be completed by appending alpha value.
    particleAlpha = 1; //maximum alpha
    
    displayWidth = theCanvas.width;
    displayHeight = theCanvas.height;
    
    fLen = 320; //represents the distance from the viewer to z=0 depth.
    
    //projection center coordinates sets location of origin
    projCenterX = displayWidth/2;
    projCenterY = displayHeight/2;
    
    //we will not draw coordinates if they have too large of a z-coordinate (which means they are very close to the observer).
    zMax = fLen-2;
    
    particleList = {};
    recycleBin = {};
    
    //random acceleration factors - causes some random motion
    randAccelX = 0.1;
    randAccelY = 0.1;
    randAccelZ = 0.1;
    
    gravity = -0; //try changing to a positive number (not too large, for example 0.3), or negative for floating upwards.
    
    particleRad = 2.5;
    
    sphereCenterX = 0;
    sphereCenterY = 0;
    sphereCenterZ = -3 - sphereRad;
    
    //alpha values will lessen as particles move further back, causing depth-based darkening:
    zeroAlphaDepth = -750; 
    
    turnSpeed = 2*Math.PI/1200; //the sphere will rotate at this speed (one complete rotation every 1600 frames).
    turnAngle = 0; //initial angle
    
    timer = setInterval(onTimer, 10/24);
  }
  
  function onTimer() {
    //if enough time has elapsed, we will add new particles.    
    count++;
      if (count >= wait) {
            
      count = 0;
      for (i = 0; i < numToAddEachFrame; i++) {
        theta = Math.random()*2*Math.PI;
        phi = Math.acos(Math.random()*2-1);
        x0 = sphereRad*Math.sin(phi)*Math.cos(theta);
        y0 = sphereRad*Math.sin(phi)*Math.sin(theta);
        z0 = sphereRad*Math.cos(phi);
        
        //We use the addParticle function to add a new particle. The parameters set the position and velocity components.
        //Note that the velocity parameters will cause the particle to initially fly outwards away from the sphere center (after
        //it becomes unstuck).
        var p = addParticle(x0, sphereCenterY + y0, sphereCenterZ + z0, 0.002*x0, 0.002*y0, 0.002*z0);
        
        //we set some "envelope" parameters which will control the evolving alpha of the particles.
        p.attack = 50;
        p.hold = 50;
        p.decay = 100;
        p.initValue = 0;
        p.holdValue = particleAlpha;
        p.lastValue = 0;
        
        //the particle will be stuck in one place until this time has elapsed:
        p.stuckTime = 90 + Math.random()*20;
        
        p.accelX = 0;
        p.accelY = gravity;
        p.accelZ = 0;
      }
    }
    
    //update viewing angle
    turnAngle = (turnAngle + turnSpeed) % (2*Math.PI);
    sinAngle = Math.sin(turnAngle);
    cosAngle = Math.cos(turnAngle);

    //background fill
    context.fillStyle = "#000";
    context.fillRect(0,0,displayWidth,displayHeight);
    
    //update and draw particles
    p = particleList.first;
    while (p != null) {
      //before list is altered record next particle
      nextParticle = p.next;
      
      //update age
      p.age++;
      
      //if the particle is past its "stuck" time, it will begin to move.
      if (p.age > p.stuckTime) {  
        p.velX += p.accelX + randAccelX*(Math.random()*2 - 1);
        p.velY += p.accelY + randAccelY*(Math.random()*2 - 1);
        p.velZ += p.accelZ + randAccelZ*(Math.random()*2 - 1);
        
        p.x += p.velX;
        p.y += p.velY;
        p.z += p.velZ;
      }
      
      /*
      We are doing two things here to calculate display coordinates.
      The whole display is being rotated around a vertical axis, so we first calculate rotated coordinates for
      x and z (but the y coordinate will not change).
      Then, we take the new coordinates (rotX, y, rotZ), and project these onto the 2D view plane.
      */
      rotX =  cosAngle*p.x + sinAngle*(p.z - sphereCenterZ);
      rotZ =  -sinAngle*p.x + cosAngle*(p.z - sphereCenterZ) + sphereCenterZ;
      m =radius_sp* fLen/(fLen - rotZ);
      p.projX = rotX*m + projCenterX;
      p.projY = p.y*m + projCenterY;
        
      //update alpha according to envelope parameters.
      if (p.age < p.attack+p.hold+p.decay) {
        if (p.age < p.attack) {
          p.alpha = (p.holdValue - p.initValue)/p.attack*p.age + p.initValue;
        }
        else if (p.age < p.attack+p.hold) {
          p.alpha = p.holdValue;
        }
        else if (p.age < p.attack+p.hold+p.decay) {
          p.alpha = (p.lastValue - p.holdValue)/p.decay*(p.age-p.attack-p.hold) + p.holdValue;
        }
      }
      else {
        p.dead = true;
      }
      
      //see if the particle is still within the viewable range.
      if ((p.projX > displayWidth)||(p.projX<0)||(p.projY<0)||(p.projY>displayHeight)||(rotZ>zMax)) {
        outsideTest = true;
      }
      else {
        outsideTest = false;
      }
      
      if (outsideTest||p.dead) {
        recycle(p);
      }
      
      else {
        //depth-dependent darkening
        depthAlphaFactor = (1-rotZ/zeroAlphaDepth);
        depthAlphaFactor = (depthAlphaFactor > 1) ? 1 : ((depthAlphaFactor<0) ? 0 : depthAlphaFactor);
        context.fillStyle = rgbString + depthAlphaFactor*p.alpha + ")";
        
        //draw
        context.beginPath();
        context.arc(p.projX, p.projY, m*particleRad, 0, 2*Math.PI, false);
        context.closePath();
        context.fill();
      }
      
      p = nextParticle;
    }
  }
    
  function addParticle(x0,y0,z0,vx0,vy0,vz0) {
    var newParticle;
    var color;
    
    //check recycle bin for available drop:
    if (recycleBin.first != null) {
      newParticle = recycleBin.first;
      //remove from bin
      if (newParticle.next != null) {
        recycleBin.first = newParticle.next;
        newParticle.next.prev = null;
      }
      else {
        recycleBin.first = null;
      }
    }
    //if the recycle bin is empty, create a new particle (a new ampty object):
    else {
      newParticle = {};
    }
    
    //add to beginning of particle list
    if (particleList.first == null) {
      particleList.first = newParticle;
      newParticle.prev = null;
      newParticle.next = null;
    }
    else {
      newParticle.next = particleList.first;
      particleList.first.prev = newParticle;
      particleList.first = newParticle;
      newParticle.prev = null;
    }
    
    //initialize
    newParticle.x = x0;
    newParticle.y = y0;
    newParticle.z = z0;
    newParticle.velX = vx0;
    newParticle.velY = vy0;
    newParticle.velZ = vz0;
    newParticle.age = 0;
    newParticle.dead = false;
    if (Math.random() < 0.5) {
      newParticle.right = true;
    }
    else {
      newParticle.right = false;
    }
    return newParticle;   
  }
  
  function recycle(p) {
    //remove from particleList
    if (particleList.first == p) {
      if (p.next != null) {
        p.next.prev = null;
        particleList.first = p.next;
      }
      else {
        particleList.first = null;
      }
    }
    else {
      if (p.next == null) {
        p.prev.next = null;
      }
      else {
        p.prev.next = p.next;
        p.next.prev = p.prev;
      }
    }
    //add to recycle bin
    if (recycleBin.first == null) {
      recycleBin.first = p;
      p.prev = null;
      p.next = null;
    }
    else {
      p.next = recycleBin.first;
      recycleBin.first.prev = p;
      recycleBin.first = p;
      p.prev = null;
    }
  } 
}







function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx, cy, cw, ch, ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

(function() {
  'use strict';

  let MY_REQ;

  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image(),
    currentFrame = 0,
    totalFrame = 20,
    offset = 0,
    width,
    height,
    imgData,
    data,

    pr = window.devicePixelRatio || 1,
    w = window.innerWidth,
    h = window.innerHeight,

    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  img.crossOrigin = "Anonymous";
  img.src = '../img/text_img_wrap.jpg';
  img.onload = function() {
    init();
    glitchAnimation();
  };

  var init = function() {
    var desiredWidth = 1900;
    var desiredHeight = 200;
  
    canvas.width = width = desiredWidth * pr;
    canvas.height = height = desiredHeight * pr;
  
    offset = width * offset;
  };
  
  var glitchAnimation = function() {

    if (!(currentFrame % totalFrame) || currentFrame > totalFrame) {

      clearCanvas();

      drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height)

      imgData = ctx.getImageData(0, 0, width, height);

      // imgData = pixelProcessor(imgData, 4, pixelCooler);

      ctx.putImageData(imgData, 0, 0);

      currentFrame = 0;
    }

    if (currentFrame === randInt(0, totalFrame)) {

      imgData = pixelProcessor(imgData, 1, pixelFlick);

      ctx.putImageData(imgData, 0, 0);

      drawGlitch(width, height, randInt(3, 10), glitchBlock);

      drawGlitch(width, height, randInt(3, 30), glitchLine);
    }

    currentFrame++;

    MY_REQ = window.requestAnimationFrame(glitchAnimation);

  };

  var pixelFlick = function(i, d) {
    d[i] = d[i + 16];
  };

  var pixelCooler = function(i, d) {
    d[i] = 5;
    d[i + 1] += randInt(1, 7);
    d[i + 2] *= randInt(6, 8) + 1;
  };

  var glitchBlock = function(i, x, y) {
    if (i > 3) {
      var spliceHeight = 1 + randInt(0, 50);

      ctx.drawImage(canvas,
        x,
        y,
        x,
        spliceHeight,
        randInt(0, x),
        y,
        randInt(x, width),
        spliceHeight);
    }
  };

  var glitchLine = function(i, x, y) {
    var spliceHeight = 1 + randInt(1, 50);

    ctx.drawImage(canvas,
      offset,
      y,
      width - offset * 2,
      spliceHeight,
      1 + randInt(0, offset * 2), //-offset / 3 + randInt(0, offset / 1.5),
      y + randInt(0, 10),
      width - offset,
      spliceHeight);
  };

  var pixelProcessor = function(imageData, step, callback) {
    var data = imageData.data || [],
      step = step * 4 || 4;

    if (data.length) {
      var rgb = [];

      for (var i = 0; i < data.length; i += step) {
        callback && callback(i, data);
      }

      return imageData;
    } else {
      return imageData;
    }
  };

  var drawGlitch = function(width, height, amount, callback) {
    for (var i = 0; i < (amount || 10); i++) {
      var x = Math.random() * width + 1,
        y = Math.random() * height + 1;

      callback(i, x, y);
    }
  };

  var randInt = function(a, b) {
    return ~~(Math.random() * (b - a) + a);
  };

  var clearCanvas = function() {
    ctx.clearRect(0, 0, width, height);
  };

  // setTimeout(() => {
  //   cancelAnimationFrame(MY_REQ)
  //   return document.querySelector('canvas').style.display = 'none'
  // }, 2000)
})();


//section4

const sliderContainer = document.querySelector('.slider-container');
const slideRight = document.querySelector('.right-slide');
const slideLeft = document.querySelector('.left-slide');
const upButton = document.querySelector('.up-button');
const downButton = document.querySelector('.down-button');
const slidesLength = slideRight.querySelectorAll('.slide').length;

let activeSlideIndex = 0;

slideRight.style.top = `-${activeSlideIndex * 90}vh`;
slideLeft.style.top = `-${activeSlideIndex * 90}vh`;

upButton.addEventListener('click', () => changeSlide('up'));
downButton.addEventListener('click', () => changeSlide('down'));

const changeSlide = (direction) => {
    const sliderHeight = sliderContainer.clientHeight;
    if (direction === 'up') {
        activeSlideIndex++;
        if (activeSlideIndex > slidesLength - 1) {
            activeSlideIndex = 0;
        }
    } else if (direction === 'down') {
        activeSlideIndex--;
        if (activeSlideIndex < 0) {
            activeSlideIndex = slidesLength - 1;
        }
    }
    slideRight.style.transform = `translateY(-${activeSlideIndex * sliderHeight}px)`;
};


//3d

const imagenes = [
  "../img/3d/3d_0100.jpg",
  "../img/3d/3d_0101.jpg",
  "../img/3d/3d_0102.jpg",
  "../img/3d/3d_0103.jpg",
  "../img/3d/3d_0104.jpg",
  "../img/3d/3d_0105.jpg",
  "../img/3d/3d_0106.jpg",
  "../img/3d/3d_0107.jpg",
  "../img/3d/3d_0108.jpg",
  "../img/3d/3d_0109.jpg",
  "../img/3d/3d_0110.jpg",
  "../img/3d/3d_0111.jpg",
  "../img/3d/3d_0112.jpg",
  "../img/3d/3d_0113.jpg",
  "../img/3d/3d_0114.jpg",
  "../img/3d/3d_0115.jpg",
  "../img/3d/3d_0116.jpg",
  "../img/3d/3d_0117.jpg",
  "../img/3d/3d_0118.jpg",
  "../img/3d/3d_0119.jpg",
  "../img/3d/3d_0120.jpg",
  "../img/3d/3d_0121.jpg",
  "../img/3d/3d_0122.jpg",
  "../img/3d/3d_0123.jpg",
  "../img/3d/3d_0124.jpg",
  "../img/3d/3d_0125.jpg",
  "../img/3d/3d_0126.jpg",
  "../img/3d/3d_0127.jpg",
  "../img/3d/3d_0128.jpg",
  "../img/3d/3d_0129.jpg",
  "../img/3d/3d_0130.jpg",
  "../img/3d/3d_0130.jpg",
  "../img/3d/3d_0131.jpg",
  "../img/3d/3d_0132.jpg",
  "../img/3d/3d_0133.jpg",
  "../img/3d/3d_0134.jpg",
  "../img/3d/3d_0135.jpg",
  "../img/3d/3d_0136.jpg",
  "../img/3d/3d_0137.jpg",
  "../img/3d/3d_0138.jpg",
  "../img/3d/3d_0139.jpg",
  "../img/3d/3d_0142.jpg",
];
const imagenWrapper = document.querySelector('.imagenWrapper');
const imagenPreview = document.getElementById('imagenPreview');
const range = document.getElementById('imgRange');
const imagenTags = [];

imagenWrapper.classList.add('cargando'); // 초기에 로더를 추가합니다.

window.addEventListener('load', () => {
  let imgLoaded = 0; // 이미지가 로드된 횟수를 추적하는 변수입니다.

  imagenes.forEach((imgSrc, index) => {
    if (index === 0) imagenPreview.setAttribute('src', imgSrc); // 첫 번째 이미지를 렌더링합니다.

    const imagen = new Image(); // 이미지 엘리먼트를 생성합니다.
    imagen.setAttribute('src', imgSrc);

    imagen.addEventListener('load', () => {
      imgLoaded++; // 각 이미지가 로드될 때마다 카운트를 증가시킵니다.
      imagenTags[index] = imagen;

      if (imgLoaded === imagenes.length) {
        imagenWrapper.classList.remove('cargando'); // 모든 이미지가 로드되면 로더를 제거합니다.
      }
    });
  });

  range.addEventListener('input', () => {
    let val = range.value;
    imagenPreview.setAttribute(
      'src',
      imagenTags[val - 1].getAttribute('src') // 이전에 생성한 태그의 src를 가져와서 미리보기에 설정합니다.
    );
  });
});



