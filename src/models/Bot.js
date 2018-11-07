import Sequelize from 'sequelize'

import sequelize from './sequelize'

const Bot = sequelize.define('bot', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

export default Bot