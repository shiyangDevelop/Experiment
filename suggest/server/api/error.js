module.exports = {
  errorFn: function (res, msg) {
    res.json({
      success: false,
      message: msg
    })
  }
}