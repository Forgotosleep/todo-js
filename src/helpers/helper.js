function responseMaker(status, data = {}, message = status, showEmptyData = false) {
  let rawResponse = {
    status,
    message
  }
  if (!(Object.keys(data).length === 0)) { rawResponse["data"] = data[0] }  // data[0] because other indexes reveal unwanted data such as buffer
  else if (showEmptyData && Object.keys(data).length === 0) { rawResponse["data"] = {} }
  // console.log('Object keys length: ', Object.keys(data).length === 0);
  // console.log(rawResponse);
  return rawResponse
}

module.exports = { responseMaker }