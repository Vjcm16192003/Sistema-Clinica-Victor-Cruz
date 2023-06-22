import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
//import { storage } from "./firebase";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


//GRID
import { Box, Button } from '@mui/material'
import { DataGrid, esES } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { PersonAdd, Delete, Edit, Medication } from '@mui/icons-material'
import { IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import swal from 'sweetalert';

//ADD MEDICAMENTOS MODAL
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import UploadIcon from '@mui/icons-material/Upload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

//STYLES
import CitasService from '../../Services/CitasService';
import '../HojaDeEstilos/CrudStyles.css';
import NavBar from '../NavBar';


const Citas = () => {
    //========================================================================================================================================================================================================================
    //LOGIN VALIDATION
    const isLoggedIn = localStorage.getItem("400");
    let cont = 0;
    //========================================================================================================================================================================================================================
    //MEDICAMENTOS GRID DATA
    const navigate = useNavigate();
    const [citas, setCitas] = useState([]);
    //esto es para el popup
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCitaId, setSelectedCitaId] = useState(null);

    const [isModalOpen1, setIsModalOpen1] = useState(false);


    const handleSelectedCitasClick = (id) => {
        setSelectedCitaId(id);
        setOpenPopup(true);
    }

    const handleDeleteCitasClick = (row, id) => {
        swal({
            title: "¿Estás seguro?",
            text: "Una vez borrado, no podrás recuperar esta información.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const url = row.urlfoto
                        console.log("DELETE THIS URL: " + url);
                        await CitasService.deleteCitas(id);
                        swal("Cita eliminado exitosamente!", {
                            icon: "success",
                        });
                        window.location.reload();
                    } catch (error) {
                        swal("Error al eliminar el cita. Por favor, inténtalo de nuevo más tarde.", {
                            icon: "error",
                        });
                    }
                } else {
                    swal("¡Tu información no se ha borrado!");
                }
            });
    };

    const theme = createTheme(
        {
            palette: {
                primary: { main: '#1976d2' },
            },
        },
        esES,
    );

    //Grid Column Visibility
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
        idcita: false,
        nombre_persona: true,
        estado: true,
        idpaciente: true,
        correouser: true,
        hora_inicio: true,
        hora_final: true,
    });

    const CustomToolbar = () => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

        return (
            <GridToolbarContainer
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    marginTop: '15px',
                    marginBottom: '10px',
                    gap: '10px',
                }}
            >
                <div>
                    {isMobile ? (
                        <>
                            <GridToolbarColumnsButton />
                            <GridToolbarFilterButton />
                            <GridToolbarDensitySelector />
                        </>
                    ) : (
                        <>
                            <GridToolbarColumnsButton />
                            <GridToolbarFilterButton />
                            <GridToolbarDensitySelector />
                            <GridToolbarExport />
                        </>
                    )}
                </div>

                <div>
                    <Button
                        onClick={toggleModal}
                        startIcon={<Medication />}
                        style={{
                            backgroundColor: 'rgb(27, 96, 241)',
                            color: 'white',
                            borderRadius: '10px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                        }}
                    >
                        Agregar Cita
                    </Button>
                </div>

            </GridToolbarContainer>
        );
    };
    //==================================================================================================================================================================================

    //ADD MEDICAMENTOS MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cita, setCita] = useState({
        idcita: '',
        nombre_persona: '',
        estado: '',
        idpaciente: '',
        correouser: '',
        hora_inicio: '',
        hora_final: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitting2, setIsSubmitting2] = useState(false);

    console.log(isSubmitting2)
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsSubmitting(false);
        cleanCita();
    };
    const [id, setID] = useState(null);
    const toggleModal2 = async (id) => {
        setID(id)
        console.log(id)
        try {
            const citaData = await CitasService.getOneCita(id);
            console.log(citaData)
            setCitass([citaData]);
            setCita(citaData);
            console.log(citaData)
        } catch (error) {
            console.log(error);
        }

        setIsModalOpen1(!isModalOpen1);
        setIsSubmitting2(false);
    };

    const handleModalFieldChange = (e) => {
        setCita((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))

    }

    const handleStartTimeChange = (dateTime) => {

        console.log(dateTime)
        setHora_inicio(dateTime);
        // const formattedDate = dateTime ? dateTime.toISOString().slice(0, 10) : '';
        // console.log(formattedDate)
        setCita((prevState) => ({ ...prevState, hora_inicio: dateTime }))
        // console.log(fecha_nacimiento)
        // const age = formattedDate ? calculateAge(formattedDate) : '';
        // console.log(age)
        // setExpediente((prevState) => ({ ...prevState, edad: age }))

    };
    //----------FichaCitas Modal-------------------------------------------------------


    let [selectedRow, setSelectedRow] = useState(null);
    const [nombre_persona, setNombre_persona] = useState(false);
    const [estado, setEstado] = useState(false);
    const [idpaciente, setIdpaciente] = useState(false);
    const [correouser, setCorreouser] = useState(false);
    const [hora_inicio, setHora_inicio] = useState(false);
    const [hora_final, setHora_final] = useState(false);

    // const handleSelectedFicha = (row) => {
    //     setOpenFicha(true);
    //     setNombre_persona(row.nombre_persona);
    //     setEstado(row.estado);
    //     setIdpaciente(row.idpaciente);
    //     setCorreouser(row.correouser);
    //     setHora_inicio(row.hora_inicio);
    //     setHora_final(row.hora_final);
    //     setSelectedRow(true);
    // }

    const cleanCita = () => {
        cita.nombre_persona = null;
        cita.estado = null;
        cita.idpaciente = null;
        cita.correouser = null;
        cita.hora_inicio = null;
        cita.hora_final = null;
    };


    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("test");
            submitCita();
        } catch (error) {
            // Handle error if any
            console.log('Error submitting cita:', error);
        }
    };

    useEffect(() => {
        if (isSubmitting) {
            console.log("test");
            submitCita();
        }
    }, [isSubmitting]);

    const submitCita = async () => {
        if (validations()) {
            console.log("Entra a agregar despues de validaciones");
            try {
                await CitasService.postCitas(cita);
                alert('Cita Agregado');
                toggleModal();
                window.location.reload();
            } catch (error) {
                // Handle error if any
                console.log('Error submitting cita:', error);
            }
        }
    };

    const EditHandler = async (e) => {
        console.log("Entra a editar");
        e.preventDefault();
        try {
            submitEditCita();
        } catch (error) {
            // Handle error if any
            console.log('Error submitting cita:', error);
        }
    };

    useEffect(() => {
        if (isSubmitting2) {
            submitEditCita();
        }
    }, [isSubmitting2]);

    const submitEditCita = async () => {
        try {
            console.log("Before validations");
            if (validations()) {
                console.log("Entra a edit despues de validaciones");


                await CitasService.editCitas(id, cita);
                console.log(cita);
                console.log('SIUUU');

                toggleModal22();
                window.location.reload();
                cleanCita();
            }
        } catch (error) {
            console.log('Error submitting cita:', error);
        }
    };

    const toggleModal22 = () => {
        setIsModalOpen1(!isModalOpen1);
        setIsSubmitting2(false);
        //window.location.reload();
        cleanCita();
    };

    const validations = () => {
        // const { nombre, categoria, stock, precio_unitario, via, dosis } = cita
        // //Nombre validations
        // if (nombre === null || nombre === '') {
        //     alert('Debe agregarle un nombre al cita')
        //     return false
        // } else if (!nombre.replace(/\s/g, '').length) {
        //     alert('El nombre no puede contener solo espacios.');
        //     return false
        // } else if (nombre.charAt(0) === ' ') {
        //     alert('El nombre no puede iniciar con un espacio.');
        //     return false
        // } else if (nombre.charAt(nombre.length - 1) === ' ') {
        //     alert('El nombre no puede terminar con un espacio.');
        //     return false
        // }
        // //Categoria validations
        // if (categoria === null || categoria === '') {
        //     alert('Debe agregar una categoria valida.');
        //     return false;
        // }
        // //Stock validations
        // if (stock === null || stock === '') {
        //     alert('Debe agregarle la cantidad de unidades al cita');
        //     return false;
        // } else if (!(/^\d+$/.test(stock))) {
        //     alert("Las unidades deben ser un numero entero.");
        //     return false;
        // }
        // //Precio validations
        // if (precio_unitario === null || precio_unitario === '') {
        //     alert('Debe agregarle un precio unitario al cita');
        //     return false;
        // } else if (!(/^[0-9,.]*$/.test(parseFloat(precio_unitario)))) {
        //     alert("Ingrese un precio valido");
        //     return false;
        // }
        // //Via validations
        // if (via === null || via === '') {
        //     alert('Ingrese una via para el cita');
        //     return false;
        // }
        // //Dosis validations
        // if (dosis === null || dosis === '') {
        //     alert('Debe agregarle una dosis al cita')
        //     return false;
        // } else if (!dosis.replace(/\s/g, '').length) {
        //     alert('La dosis no puede contener solo espacios.');
        //     return false
        // } else if (dosis.charAt(0) === ' ') {
        //     alert('La dosis no puede iniciar con un espacio.');
        //     return false
        // } else if (dosis.charAt(nombre.length - 1) === ' ') {
        //     alert('La dosis no puede terminar con un espacio.');
        //     return false
        // }
        // console.log("END DE VALIDACINES");
        return true;
    }


    const [citaData, setCitass] = useState([]);

    let buscaError = 0;
    useEffect(() => {
        // Validación login
        console.log("Este es el error en Med: " + (buscaError++));
        if (!isLoggedIn) {
            // Redirigir si no se cumple la verificación
            if (cont == 0) {
                alert("No Cuenta con el permiso de entrar a este apartado")
                navigate("/expedientes"); // Redirige a la página de inicio de sesión
                cont++;
            }



        }

        const fetchAllCitas = async () => {
            try {
                const citasData = await CitasService.getAllCitas();
                const citasWithId = citasData.map((cita) => ({
                    ...cita,
                    medId: cita.idmed,
                }));
                setCitas(citasWithId);
            } catch (error) {
                // Handle error if any
                console.log("Error fetching citas:", error);
            }
        };

        // Update tabla
        fetchAllCitas();
        if (isSubmitting) {
            fetchAllCitas();
        }

        const handleResize = () => {
            const isMobile = window.innerWidth < 600; // Define the screen width threshold for mobile devices

            // Update the column visibility based on the screen width
            setColumnVisibilityModel((prevVisibility) => ({
                ...prevVisibility,
                idcita: false,
                nombre_persona: true,
                estado: isMobile ? false : true,
                idpaciente: isMobile ? false : true,
                correouser: isMobile ? false : true,
                hora_inicio: isMobile ? false : true,
                hora_final: isMobile ? false : true,

            }));
        };

        // Call the handleResize function initially and on window resize
        handleResize();
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isLoggedIn, navigate, isSubmitting]);



    return (

        <div className='crudGrid'>
            <NavBar />
            <div style={{ height: '100vh' }}>
                <div className='headerDiv'>
                    <h1>Citas</h1>
                </div>
                <div className='dataGridBox'>
                    <ThemeProvider theme={theme}>
                        <DataGrid
                            rows={citas}
                            getRowId={(row) => row.idcita}
                            columns={[
                                { field: 'nombre_persona', headerName: 'Nombre Cita', flex: 3, headerClassName: 'column-header' },
                                { field: 'estado', headerName: 'Estado', flex: 2, headerClassName: 'column-header' },
                                { field: 'idpaciente', headerName: 'Expediente num', flex: 1, headerClassName: 'column-header' },
                                { field: 'correouser', headerName: 'Correo Cuenta', flex: 1, headerClassName: 'column-header' },
                                { field: 'hora_inicio', headerName: 'Hora Inicio', flex: 1, headerClassName: 'column-header' },
                                { field: 'hora_final', headerName: 'Hora Final', flex: 1, headerClassName: 'column-header' },
                                {
                                    field: 'actions',
                                    headerName: '',
                                    flex: 2,
                                    renderCell: (params) => (

                                        <div>

                                            <IconButton onClick={() => toggleModal2(params.id)} >
                                                <Edit />
                                            </IconButton>


                                            <IconButton onClick={() => handleDeleteCitasClick(params.row, params.id)}>
                                                <Delete />
                                            </IconButton>

                                        </div>
                                    ),
                                },

                            ]}
                            components={{
                                Toolbar: CustomToolbar,
                            }}

                            columnVisibilityModel={columnVisibilityModel}
                            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                        />
                    </ThemeProvider>

                    {/* <Modal open={isModalOpen} onClose={toggleModal} closeAfterTransition BackdropProps={{ onClick: () => { } }} >

                        <div className='modalContainer modalCitas'>

                            <h2 className="modalHeader">AGREGAR MEDICAMENTO</h2>
                            <button className="cancelButton" onClick={toggleModal}>
                                <FontAwesomeIcon icon={faTimes} size="2x" />
                            </button>
                            <Box
                                component="form"//edit modal
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    width: '100%', // Added width property
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField id="nombre" label="Nombre" variant="outlined" onChange={handleModalFieldChange} name='nombre' required />
                                <Autocomplete
                                    disablePortal
                                    id="categoria"
                                    required
                                    options={listaCategoriaCitas}
                                    onChange={(event, newValue) =>
                                        setCita({
                                            ...cita,
                                            categoria: newValue
                                        })

                                    }
                                    renderInput={(params) => <TextField {...params} label="Categoria" required />}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField id="stock" label="Unidades" variant="outlined" onChange={handleModalFieldChange} name='stock' required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField id="precio_unitario" label="Precio Unitario" variant="outlined" onChange={handleModalFieldChange} name='precio_unitario' required />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            disablePortal
                                            id="via"
                                            required
                                            options={listaVias}
                                            onChange={(event, newValue) =>
                                                setCita({
                                                    ...cita,
                                                    via: newValue
                                                })

                                            }
                                            renderInput={(params) => <TextField {...params} label="Via" required />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField id="dosis" label="Dosis" variant="outlined" onChange={handleModalFieldChange} name='dosis' required />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} >
                                    <Grid item xs={3} sm={1} >
                                        <input
                                            type="file"
                                            onChange={(event) => {
                                                setImageUpload(event.target.files[0]);
                                                console.log(imageUpload);
                                            }}
                                            name='urlfoto'
                                            id="urlfoto"
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    onClick={handleModalSubmit}
                                    variant="contained"
                                    className="modalButton"
                                    type="submit"
                                    id='crudButton'>
                                    Agregar Cita
                                </Button>
                            </Box>
                        </div>


                    </Modal> */}

                    <Modal open={isModalOpen1} onClose={toggleModal22} closeAfterTransition BackdropProps={{ onClick: () => { } }}>

                        <div className='modalContainer modalCitas'>
                            {citaData.map((cita) => (
                                <div className='innerCard' key={cita.idmed}>

                                    <h2 className="modalHeader">EDITAR CITA</h2>
                                    <button className="cancelButton" onClick={toggleModal22}>
                                        <FontAwesomeIcon icon={faTimes} size="2x" />
                                    </button>
                                    <Box
                                        component="form"//edit modal
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            width: '100%', // Added width property
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField id="nombre_persona" label="Nombre de la Cita" defaultValue={cita.nombre_persona} variant="outlined" onChange={handleModalFieldChange} name='nombre_persona' required />
                                        <TextField id="estado" label="Estado" defaultValue={cita.estado} variant="outlined" onChange={handleModalFieldChange} name='estado' required />
                                        <TextField id="idpaciente" label="Expediente ID" defaultValue={cita.idpaciente} variant="outlined" onChange={handleModalFieldChange} name='idpaciente' required />
                                        <TextField id="correouser" label="User Correo" defaultValue={cita.correouser} variant="outlined" onChange={handleModalFieldChange} name='correouser' required />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <MobileDateTimePicker
                                                        id="hora_inicio"
                                                        label="Hora Inicio"
                                                        defaultValue={dayjs(citas.hora_inicio)}
                                                        onChange={(date) => {
                                                            console.log(date); // Log the selected value
                                                            setCita({ ...cita, hora_inicio: date }); // Update the state
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                        name='hora_inicio'
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <MobileDateTimePicker
                                                        id="hora_final"
                                                        label="Hora Final"
                                                        defaultValue={dayjs(citas.hora_inicio)}
                                                        onChange={(date) => {
                                                            console.log(date); // Log the selected value
                                                            setCitas({ ...citas, hora_final: date }); // Update the state
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                        name='hora_final'
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>



                                        <Button onClick={EditHandler} variant="contained" style={{
                                            backgroundColor: 'rgb(27,96,241)', color: 'white', borderRadius: '10px',
                                            paddingLeft: '10px', paddingRight: '10px', width: '270px', fontSize: '18px', alignSelf: 'center'
                                        }}>
                                            Editar Cita
                                        </Button>
                                    </Box>
                                </div>
                            ))}
                        </div>
                    </Modal>


                </div>

            </div>
            {/* {selectedRow && (
                <FichaCitas
                    open={openFicha}
                    setOpenPopup={setOpenFicha}
                    setNombreF={nombre}
                    setCategoriaF={categoria}
                    setPrecioUnitarioF={precioUnitario}
                    setStockF={stock}
                    setImagenF={imagen}
                    setViaF={via}
                />
            )} */}
        </div>
    );



}

export default Citas 