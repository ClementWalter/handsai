function argMax(array) {
  // from https://gist.github.com/engelen/fbce4476c9e68c52ff7e5c2da5c24a28
  return [].reduce.call(array, (m, c, i, arr) => (c > arr[m] ? i : m), 0);
}

export default { argMax };
