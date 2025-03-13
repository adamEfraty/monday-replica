import configDev from './dev.js'
import configProd from './prod.js'

export var config

config = process.env.NODE_ENV === 'production' ? configProd : configDev
