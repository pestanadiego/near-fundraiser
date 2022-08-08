// Simple implementation of Quick Sort in order to sort the elements by upvotes

function partition(arr, start = 0, end = arr.length - 1) {
  let pivot = arr[start][0];
  let swapIdx = start;

  for (let i = start + 1; i <= end; i++) {
    if (arr[i][0] < pivot) {
      swapIdx++;
      [arr[i], arr[swapIdx]] = [arr[swapIdx], arr[i]];
    }
  }
  [arr[swapIdx], arr[start]] = [arr[start], arr[swapIdx]];

  return swapIdx;
}

export function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    let pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }

  return arr;
}
