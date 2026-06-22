function buyComparator(a, b) {
  if (a.price === b.price) {
    return a.timestamp < b.timestamp;
  }
  return a.price > b.price;
}

function sellComparator(a, b) {
  if (a.price === b.price) {
    return a.timestamp < b.timestamp;
  }
  return a.price < b.price;
}

module.exports = { buyComparator, sellComparator };