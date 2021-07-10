import * as express from "express"
import * as cors from "cors"
import * as compression from "compression"

import * as settings from "./settings"
import * as router from "./router"

const app = express()
app.use(compression())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(settings.server.cors))

app.use(router.default)

app.listen(settings.server.port)