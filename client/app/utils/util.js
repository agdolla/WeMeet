/**
 * If shouldHide is true, returns a CSS class that hides the element.
 */
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
