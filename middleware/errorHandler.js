const errorHandler = (err, req, res, next) => {
  
  switch (err.name) {
    case 'notFound':
      res.status(err.code).json(err.message)
      break;
    case 'reportTwice':
      res.status(err.code).json(err.message)
      break;
    default:
      res.status(500).json({mesage: 'Internal server error'})
      break;
  }
}

module.exports = errorHandler


