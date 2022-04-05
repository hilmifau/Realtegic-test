const express = require('express')
const app = express()
const port = 3000
const Controller = require('./Controllers/controller')
const errorHandler = require('./middleware/errorHandler')

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.get('/survivors', Controller.readSurvivors)
app.post('/survivors', Controller.addSurvivor)
app.patch('/survivors/:id', Controller.updateLocation)
app.get('/reports/infected', Controller.percentageSurvivorsInfected)
app.get('/reports/non-infected', Controller.percentageSurvivorsSafe)
app.post('/reports/:id', Controller.reportSurvivor)


app.use(errorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})