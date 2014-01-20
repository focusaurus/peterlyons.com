function leadZero(value) {
  if (value > 9) {
    return "" + value;
  } else {
    return "0" + value;
  }
}

module.exports = leadZero;
