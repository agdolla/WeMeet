/**
 * If shouldHide is true, returns a CSS class that hides the element.
*/
// let debug = require('react-debug');


export function hideElement(shouldHide) {
  if (shouldHide) {
    return 'hidden';
  } else {
    return '';
  }
}

export function disabledElement(shouldHide) {
  if (shouldHide) {
    return 'disabled';
  } else {
    return '';
  }
}

export function didUserLike(likeCounter, userId) {
  return likeCounter.filter(counter => counter._id === userId).length > 0;
}

//check if an element is scrolled to bottom
export function isBottom(el) {
  return el.getBoundingClientRect().bottom <= window.innerHeight;
}

export function uploadImg(e, tooManyFiles, sizeToLarge, typeWrong, success) {
  e.preventDefault();
  var files = e.target.files;
  if (files.length > 3) {
    return tooManyFiles();
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if (file.size > 1500000) {
      return sizeToLarge();
    }
    if (!file.type.match('image.*')) {
      return typeWrong();
    }
    var reader = new FileReader();

    reader.onload = (() => {
      return (e) => {
        success(e);
      };
    })(file);

    reader.readAsDataURL(file);
  }
}