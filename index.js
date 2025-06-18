const express = require('express')
const cors = require('cors')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
require('./db/db_connection')
const { wServer, server } = require('./lib/socket');


wServer.use(express.json())
wServer.use(cors({
    origin: [
        "http://localhost:5173",
        "https://wizzle-frontend.vercel.app"],

    credentials: true,

}))

wServer.use(userRoutes)
wServer.use(adminRoutes)
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`wServer started running at port ${PORT}`);


})

wServer.get('/', (req, res) => {
    console.log(`wServer started running at port ${PORT} and waiting for client request`);

})