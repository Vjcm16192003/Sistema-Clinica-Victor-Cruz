import axios from 'axios';


// const API_URL = 'http://localhost:8000';
const API_URL = 'https://clinicavictorcruzserver.azurewebsites.net';

export const getAllExamenes = async () => {
    try {
        const res = await axios.get(`${API_URL}/examenes`);
        console.log("SUCCESS FETCHING MEDICAMENTOS");
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch examenes');
    }
};

export const getOneExamen = async (id) => {
    console.log(id);
    try {
        const res = await axios.get(`${API_URL}/examenes/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch examen');
    }
};

export const postExamenes = async (examen) => {
    try {
        const res = await axios.post(`${API_URL}/examenes`, examen);
        return res.data;
    } catch (error) {
        console.log('Error posting examen:', error);
        throw error; // Rethrow the original error instead of throwing a new one
    }
};

export const editExamenes = async (id, examen) => {
    try {
        await axios.put(`${API_URL}/examenes/${id}`, examen);

    } catch (error) {
        console.log(error);
        throw new Error('Failed to edit examen');
    }
};

export const deleteExamenes = async (id) => {
    try {
        await axios.delete(`${API_URL}/examenes/${id}`);

    } catch (error) {
        console.log(error);
        throw new Error('Failed to delete examen');
    }
};

const Services = {
    getAllExamenes,
    postExamenes,
    getOneExamen,
    deleteExamenes,
    editExamenes
    // Other functions
};

export default Services;