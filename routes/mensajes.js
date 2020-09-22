const express = require("express")
const router = express.Router()
const Mensaje = require("../public/javascripts/Mensaje")
const { route } = require("./users")
const joi = require("joi")

function validar(msg) {
    const schema = joi.object({
        message: joi.string().min(5).required(),
        author: joi.string(new RegExp('/^[a-zA-Z]+\s[a-zA-Z]+$/'))
    })
    const {error, valid} = schema.valid(msg)
    return error == undefined ? "válido" : error.toString()
}

router.get("/api/messages", (req, res) => {
    Mensaje.findAll().then((msgs) => {
        return res.send(msgs)
    })
})

router.get("/api/messages/:ts", (req, res) => {
    let pTs = req.params.ts
    Mensaje.findOne({
        where: {
            ts: pTs
        }
    })
    .then((msg) => msg != null ? res.send(msg) : res.send("404"))
})

router.post("api/messages", (req, res) => {
    if (validar(req.body) == "válido") {
        Mensaje.create({
            message: req.body.message,
            author: req.body.author,
            ts: req.body.ts
        })
        .then((msg) => res.send(msg))
    } else
        res.send("Inválido")
})

router.put("api/messages", (req, res) => {
    if (validar(req.body) == "válido") {
        Mensaje.findOne({
            where: {
                author: req.body.author,
                ts: req.body.ts
            }
        })
        .then((msg) => {
            if (msg != null) {
                msg.update(req.body).then((msgf) => 
                    res.send(msgf)
                )
            } else
                res.send("404")
        })
    } else
        res.send("Inválido")
})

router.delete("/api/messages/:ts", (req, res) => {
    let pTs = req.params.ts
    Mensaje.findOne({
        where: {
            ts: pTs
        }
    })
    .then((msg) => {
        if (msg != null) {
            msg.destroy()
            return res.send("Eliminado")
        } else
            return res.send("404")
    })
})

module.exports = router