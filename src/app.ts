import express from 'express'
import routes from './routes/Routes'
import cors from 'cors'
import paymentGatewayController from './controllers/paymentGatewayController'

const app = express()

app.use(cors({origin: '*',  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] }))

app.post('/stripe-webhook',express.raw({type: 'application/json'}), paymentGatewayController.stripeWebHook)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', routes)


export default app

