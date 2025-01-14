import express from "express";

const router = express.Router();

const facturasRouter = (pool, transporter) => {

    //============================================== G E T S ==================================================================
    //Get all facturas
    router.get("/", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const sqlSelect = "SELECT * FROM facturas ORDER BY idCita DESC"
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();
            console.log("Get all facturas Successfull");
            res.json(rows);
        } catch (err) {
            console.log("Get all facturas Failed. Error: " + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    //get name and email from user in factura
    router.get("/idCitaFactura/:id", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const sqlSelect = `select e.nombre,c.correouser  from expedientes e join citas c on  e.idpaciente = c.idpaciente where c.idcita ="${req.params.id}"`;
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();
            console.log(`Get One name and email ${req.params.id} Successfull`)
            res.json(rows)
        } catch (err) {
            console.log(`Get One name and email ${req.params.id} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    //Get a factura by idCita
    router.get("/cita/:idCita", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const sqlSelect = `SELECT * FROM facturas WHERE idCita = "${req.params.idCita}"`;
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();
            console.log(`Get facturas by idCita ${req.params.id} Successfull`)
            res.json(rows)
        } catch (err) {
            console.log(`Get facturas by idCita ${req.params.id} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    //Get a factura by idCita formatted by Adrian
    router.get("/facturas-with-cita/:id", async (req, res) => {
        try {

            const connection = await pool.getConnection();
            const sqlSelect =
                "SELECT f.idFactura, f.nombre_paciente, f.idCita, f.isPagada, f.total, DATE_FORMAT(c.fecha, '%d/%m/%Y') as fecha, DATE_FORMAT(c.hora, '%l:%i %p') AS hora, "
                + "f.metodoPago, f.rtn, f.correo "
                + " FROM facturas f INNER JOIN citas c ON f.idCita = c.idcita WHERE f.idFactura = " + req.params.id;
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();

            res.json(rows[0]);
        } catch (err) {
            console.log(`Get One factura ${req.params.id} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });


    //Get a factura by id
    router.get("/:id", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const sqlSelect = `SELECT * FROM facturas WHERE idfactura = "${req.params.id}"`;
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();
            console.log(`Get factura with id: ${req.params.id} Successful`);
            res.json(rows[0]);
        } catch (err) {
            console.log(`Get factura with id: ${req.params.id} Failed. Error: ${err}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });



    //============================================== P O S T S ==================================================================
    //Add a new factura
    let facturaId = 0;
    router.post("/", async (req, res) => {
        try {
            const connection = await pool.getConnection();

            await connection.query("SET time_zone = 'America/Guatemala'");
            const q =
                "INSERT INTO `facturas` (`nombre_paciente`, `idCita`, `isPagada`, `total`, `metodoPago`, `rtn`, `correo`)  VALUES (?)";
            console.log("Post factura values:")
            console.log(req.body)
            const values = [
                req.body.nombre_paciente,
                req.body.idCita,
                req.body.isPagada,
                req.body.total,
                req.body.metodoPago,
                req.body.rtn,
                req.body.correo
            ];
            const [result, _] = await connection.query(q, [values]);
            // Get the ID of the newly inserted factura
            facturaId = result.insertId;
            // Construct the URL


            connection.release();
            console.log("Post factura Successfull");
            res.json(facturaId);
        } catch (err) {
            console.log("Post factura Failed. Error: " + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/sendEmail", async (req, res) => {
        const checkoutURL = `/checkout/${facturaId}`;

        try {
            const { pdfData, factura } = req.body;
            console.log('pdfData:', pdfData);
            console.log('factura:', factura);

              const mailOptions = {
                  from: '"Clinica Dr Victor Cruz" <ClinicaVictorCruz@gmail.com>',
                  to: factura.correo,
                  subject: "Factura de Cita Clinica Dr Victor Cruz",
                  text: `Estimado/a ${factura.nombre_paciente}, Le recordamos el pago a hacerse para la cita: ${factura.idCita}\n` +
                      `Con un total de: LPS. ${factura.total}\n` +
                      `Puede realizar el pago siguiendo este enlace: https://clinica-victorcruz.netlify.app${checkoutURL} \n` +
                      `Si tiene alguna duda no dude en contactarnos.\n` +
                      `¡Que tenga un buen día!\n\n` +
                      `Atentamente,\n` +
                      `El equipo de la Clínica Dr. Victor Cruz`,
                  attachments:[
                      {
                          filename: 'factura.pdf',
                          content: pdfData,
                      }
                  ]
  
              };
              if (req.body.correo !== null) {
                  await transporter.sendMail(mailOptions);
              }

            res.status(200).send('Email sent successfully');
        } catch (err) {
            console.log("Send factura Failed. Error: " + err);
            res.status(500).json({ error: "Internal Server Error" });
        }


    });




    //============================================== P U T S ==================================================================
    //Update a factura by idCita
    router.put("/cita/:idCita", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const { idCita } = req.params;
            const {
                nombre_paciente,
                isPagada,
                total,
                metodoPago,
                rtn,
                correo
            } = req.body;

            const q =
                "UPDATE facturas SET nombre_paciente = ? , isPagada = ? , total = ? , metodoPago = ? , rtn = ? , correo = ? WHERE idCita = ?";
            const values = [
                nombre_paciente,
                isPagada,
                total,
                metodoPago,
                rtn,
                correo,
                idCita
            ];

            await connection.query(q, values);
            connection.release();
            console.log(`Update factura by idCita ${req.params.idfactura} Successfull`)
            res.json("Factura actualizada exitosamente!");
        } catch (err) {
            console.log(`Update factura by idCita ${req.params.idfactura} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    //Update a factura by id
    router.put("/:id", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const { id } = req.params;
            const {
                nombre_paciente,
                idCita,
                isPagada,
                total,
                metodoPago,
                rtn,
                correo
            } = req.body;

            const q =
                "UPDATE facturas SET nombre_paciente = ? , idCita = ? , isPagada = ? , total = ? , metodoPago = ? , rtn = ? , correo = ? WHERE idFactura = ?";
            const values = [
                nombre_paciente,
                idCita,
                isPagada,
                total,
                metodoPago,
                rtn,
                correo,
                id
            ];

            await connection.query(q, values);
            connection.release();
            console.log(`Update factura ${req.params.idfactura} Successfull`)
            res.json("Factura actualizada exitosamente!");
        } catch (err) {
            console.log(`Update factura ${req.params.idfactura} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });


    //============================================== D E L E T E S ==================================================================
    //Delete a factura by idCita
    router.delete("/cita/:idCita", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const sqlSelect = `delete FROM facturas where idCita = + "${req.params.idCita}"`;
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();
            console.log(`Delete factura ${req.params.idCita} Successfull`)
            res.json(rows);
        } catch (err) {
            console.log(`Delete factura ${req.params.idCita} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });


    //Delete a factura by id
    router.delete("/:id", async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const sqlSelect = `delete FROM facturas where idFactura = + "${req.params.id}"`;
            const [rows, fields] = await connection.query(sqlSelect);
            connection.release();
            console.log(`Delete factura ${req.params.id} Successfull`)
            res.json(rows);
        } catch (err) {
            console.log(`Delete factura ${req.params.id} Failed. Error: ` + err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    return router;
};



export default facturasRouter;