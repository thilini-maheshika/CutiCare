/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable no-unused-vars */

import { Box, Button, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { handleErrorResponse, handleSuccessResponse } from '../../ui-component/alert/Response';
import { useAlert } from '../../context/AlertContext';
import { useEffect } from "react";
import { useState } from "react";

function HospitalFrom(props) {
    const { hospitalTemp } = props;
    const { showAlert } = useAlert();
    const [hospitalTmp, setHospitalTmp] = useState([]);


    const onFinish = (doctor) => {
        doctor.preventDefault();
        const formData = new FormData(doctor.target);
        const formDataObject = Object.fromEntries(formData);
        addData(formData)
    };

    const addData = async (formData) => {
        try {
            const response = await axios.post(
                process.env.REACT_APP_API_ENDPOINT + '/hospital/add',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Ensure response status is within the success range (2xx)
            if (response && response.status >= 200 && response.status < 300) {
                props.handleCloseModal();
                handleSuccessResponse(response.data.message);
                showAlert(response.data.message, 'success');
                props.fetchData();
            }
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            // Regardless of success or failure, ensure isLoading is set to false
            props.setisLoading(false);
            props.fetchData();
        }
    };

    useEffect(() => {
        fetchEditData();
    }, [hospitalTemp])

    const fetchEditData = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/hospital/get/' + hospitalTemp);

            if (response.status === 200) {
                setHospitalTmp(response.data[0]);

            }
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            props.setisLoading(false);
        }
    };

    return (
        <>
            <form name="basic" onSubmit={onFinish} autoComplete="off">
                <TextField
                    label="Hospital Name"
                    name="hospital_name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }} // Add margin-bottom
                />

                <TextField
                    label="Location"
                    name="location"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }} // Add margin-bottom
                />

                <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }} // Add margin-bottom
                />

                <TextField
                    label="Phone Number"
                    name="phonenumber"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }} // Add margin-bottom
                />

                <TextField
                    label=""
                    name="profileimage"
                    variant="outlined"
                    type="file"
                    fullWidth
                    required
                    sx={{ mb: 2 }} // Add margin-bottom
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" type="submit" sx={{ marginRight: '10px' }}>
                        {hospitalTemp > 0 ? 'Save' : 'Submit'}
                    </Button>
                    <Button variant="contained" onClick={props.handleCloseModal} type="button" sx={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </>
    );
}

export default HospitalFrom;