const { Survivor, Inventory, Report } = require('../models')

class Controller {

  static readSurvivors = async (req, res, next) => {
    try {
      const survivors = await Survivor.findAll()
      res.status(200).json(survivors)
    } catch (error) {
      next(error)
      
    }
  }

  static addSurvivor = async (req, res, next) => {
    try {
      const { name, age, gender, latitude, longitude, status, water,  food,  medication,  ammunition } = req.body
      console.log(req.body);
      const survivor = await Survivor.create({
        name, age: +age, gender, latitude, longitude, status
      })

      let SurvivorId = survivor.id
      let arr = []
      if (water)  arr.push({ SurvivorId, item: "water", amount: +water, point: 4 })
      if (food)  arr.push({ SurvivorId, item: "food", amount: +food, point: 3 })
      if (medication)  arr.push({ SurvivorId, item: "medication", amount: +medication, point: 2 })
      if (ammunition)  arr.push({ SurvivorId, item: "ammunition", amount: +ammunition, point: 1 })
      
      const inventories = await Inventory.bulkCreate(arr)
      res.status(201).json({survivor: survivor, inventories: inventories})
    } catch (error) {
      next(error)
    }
  }

  static updateLocation = async (req, res, next) => { 
    try {
      const {id} = req.params
      const { latitude, longitude } = req.body
      const find = await Survivor.findByPk(+id)
      if (find) {
        const survivor = await Survivor.update({
          latitude, longitude }, 
          {
          where : { 
            id: +id
          },
          returning: true
        })
        res.status(200).json(survivor[1][0])
      } else {
        throw {
          code: 404,
          name: 'notFound',
          message: 'Survivor not found'
        }
      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  static reportSurvivor = async (req, res, next) => {
    try {
      const {id} = req.params
      const { name, age, gender } = req.body
      const target = await Survivor.findOne({
        where : {
          name,
          age,
          gender
        }
      })

      if (!target) {
        throw {
          code: 404,
          name: 'notFound',
          message: 'Survivor not found'
        }
      }

      const TargetId = target.id

      const find = await Report.findAll({
        where : {
          userReportId: id,
          TargetId : TargetId
        }
      })

      if (find.length > 0) {
        throw {
          code: 400,
          name: 'reportTwice',
          message: "You can't report the same survivor twice."
        }
      }

      const report = await Report.create({
        userReportId : id,
        TargetId
      })

      const infected = await Report.findAll({
        where : {
          TargetId
        }
      })

      if(infected.length === 3) {
        const survivorInfected = await Survivor.update({
          status : 'infected'},
          {where : { 
            id: TargetId
          }
        })
      }

      res.status(200).json({message : "Report has been created"})
    } catch (error) {
      console.log(error);
      next(error)
      
    }
  }

  static percentageSurvivorsInfected = async (req, res, next) => {
    try {
      const survivors = await Survivor.findAll()
      const survivorInfected = await Survivor.findAll({
        where: {
          status : 'infected'
        }
      })
      const percentage = (survivorInfected.length / survivors.length) * 100
      res.status(200).json({infected: `${percentage}%`})
    } catch (error) {
      next(error)
    }
  }

  static percentageSurvivorsSafe = async (req, res, next) => {
    try {
      const survivors = await Survivor.findAll()
      const survivorInfected = await Survivor.findAll({
        where: {
          status : 'infected'
        }
      })
      const percentage = 100 - ((survivorInfected.length / survivors.length) * 100)
      res.status(200).json({infected: `${percentage}%`})
    } catch (error) {
      next(error)
    }
  }


}

module.exports = Controller