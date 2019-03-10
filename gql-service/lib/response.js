module.exports = (() => {
  const OK = data => {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
      isBase64Encoded: false
    }
  };
  return { OK };
})()
