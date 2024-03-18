/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from 'react';
// import FormModal from "../FormModal";
import SimpleTable from '../../ui-component/table/Table';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HospitalFrom from '../../component/form/HospitalFrom';
import { handleErrorResponse } from '../../ui-component/alert/Response';
import PopUp from '../../ui-component/modal/PopUp';

function HospitalList() {
  const [hospital, setHospital] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [hospitalTemp, setHospitalTemp] = useState(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const fileInputRef = React.createRef();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setHospitalTemp(0);
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/hospital/all',
        {
          params: {
            page: pagination.pageIndex,
            pageSize: pagination.pageSize
          }
        });

      if (response.status === 200) {
        setHospital(response.data.data);
        setRowCount(response.data.totalItems);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setisLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    //console.log(formData)
    console.log(JSON.stringify(formData));
    try {
      // Call the postData function with the form data
      await addData(formData);
      handleCloseModal();
    } catch (error) {
      // Handle errors
      console.log('Error posting data:', error);
      toast.error('Error adding data!');
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      setisLoading(true);
      const response = await axios.delete(process.env.REACT_APP_API_ENDPOINT + '/hospital/delete/' + id);

      if (response.status === 200) {
        toast.success('Doctor updated successfully!');
        fetchData();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setisLoading(false);
    }
  };

  const loadImageUpload = () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };

  const onFinish = (hospital) => {
    hospital.preventDefault();
    const formData = new FormData(hospital.target);
    const formDataObject = Object.fromEntries(formData);
    handleSubmit(formDataObject);
  };

  const addData = async (values) => {
    try {
      const dataToSend = {
        hospital_name: values.hospital_name,
        Location: values.Location,
        phonenumber: values.phonenumber,
        email: values.email
      };

      const response = await axios.post('http://localhost:3006/api/hospital/add', dataToSend);

      if (response && response.status === 200) {
        fetchData();
        toast.success('Data successfully added!');
      } else if (response && response.status === 401) {
        logout();
      } else {
        fetchData();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.location.reload();
        logout();
      } else if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        console.log(error);
        toast.error('An error occurred while adding the hospital');
      }
    } finally {
      setisLoading(false);
    }
  };

  const deletedata = async (dataArray) => {
    if (dataArray.length > 0) {
      console.log(dataArray);

      // Create a new array with only the 'id' values
      const idArray = dataArray.map((data) => data.id);

      console.log(idArray);

      try {
        // setPending(true);

        const response = await axios.delete(`http://localhost:3006/api/doctor/delete/${idArray}`);

        if (response.status === 200) {
          //   setPending(false);
          fetchData();
          toast.success('Doctor Deleted successfully!');
        } else {
          fetchData();
        }
      } catch (error) {
        if (error.response.status === 401) {
          window.location.reload();
        }
      } finally {
        // setPending(false);
      }
    } else {
      // Handle case when dataArray is empty
    }
  };


  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    await updateData(row.id, values);
    exitEditingMode();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'hospital_name',
        header: 'Hospital Name',
        enableColumnActions: true
      },

      {
        accessorKey: 'location',
        header: 'Location',
        enableColumnActions: true
      },

      {
        accessorKey: 'phonenumber',
        header: 'Phone Number',
        enableColumnActions: true
      },

      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnActions: true
      },
      {
        accessorKey: 'profileimage',
        header: 'Profile Image',
        enableColumnActions: true,
        Cell: ({ rowNumber, renderedCellValue, onCellValueChange, isEditing }) => (
          <div>
            <img
              src={renderedCellValue ? `${process.env.REACT_APP_API_ENDPOINT}/hospital/profileimage/${renderedCellValue}` : defultItemImage}
              alt="Profile"
              role="button"
              tabIndex="0"
              onClick={() => {
                if (renderedCellValue) {
                  const fileInput = fileInputRef.current;
                  if (fileInput) {
                    fileInput.click();
                  }
                } else {
                  loadImageUpload(rowNumber);
                }
              }}
              onKeyDown={(e) => {
                // Handle keyboard events
                if (e.key === 'Enter' || e.key === ' ') {
                  // Trigger the same action as click when Enter or Space is pressed
                  if (isEditing) {
                    const fileInput = fileInputRef.current;
                    if (fileInput) {
                      fileInput.click();
                    }
                  } else {
                    loadImageUpload(rowNumber);
                  }
                }
              }}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                backgroundColor: '#ffff',
                cursor: 'pointer'
              }}
            />
            {isEditing && (
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(event) => onCellValueChange('item_image', event.target.files[0])}
              />
            )}
          </div>
        )
      }
    ],
    []
  );

  const handleEditClick = (id) => {
    setHospitalTemp(id);
    openModal();
    console.log(hospitalTemp);
  }


  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <div className="tabled">
        <Grid container spacing={2}>
          <Grid item xs={24} sm={12}>
            <SimpleTable
              tableHeading="Hospital List"
              columns={columns}
              getData={hospital}
              rowCount={rowCount}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick}
              deletedata={deletedata}
              setHospitalTemp={setHospitalTemp}
              handleSaveRow={handleSaveRow}
              isLoading={isLoading}
              pagination={pagination}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              addButtonHeading="Add Hospital"
              idName="hospitalid"
              enableClickToCopy
              enableRowNumbers={false}
              enableRowVirtualization={false}
            />
          </Grid>
        </Grid>
      </div>

      <PopUp
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchData={fetchData}
        title={hospitalTemp > 0 ? 'Edit Hospital' : 'Add Hospital'}
        form={<HospitalFrom hospitalTemp={hospitalTemp} handleCloseModal={handleCloseModal} fetchData={fetchData} setisLoading={setisLoading} />}
      />
    </>
  );
}

export default HospitalList;
