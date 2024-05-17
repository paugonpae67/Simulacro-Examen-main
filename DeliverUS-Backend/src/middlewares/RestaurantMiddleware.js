import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkRestaurantPromoted = async (req, res, next) => {
  try {
    if (req.body.promoted) {
      const restaurantPromoted = await Restaurant.findOne({
        where: {
          promoted: true,
          userId: req.user.id
        }
      })
      if (restaurantPromoted === null) {
        return next()
      }
      return res.status(422).send('Exist a restaurant promoted.')
    } else {
      return next()
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, checkRestaurantPromoted }
