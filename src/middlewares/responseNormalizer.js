function responseNormalizer (req, res, next) {
  console.log('normalizer')
  // const status = res.statusCode < 400 ? true : false;
  // res.body = { status, data: res.body };
  next()
}

module.exports = responseNormalizer
