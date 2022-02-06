var promiseList = (imgData || []).map(function (item, index) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      img.onload = null;
      resolve(img);
    };
    img.src = item;
  });
});

Promise.all(promiseList);
