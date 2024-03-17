/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from 'react';
// import FormModal from "../FormModal";
import SimpleTable from '../../ui-component/table/Table';
import PopUp from '../../ui-component/modal/PopUp';
import defultItemImage from '../../assets/images/default/default-profile-image.png';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useAlert } from 'context/AlertContext';
import { toast } from 'react-toastify';
import DoctorFrom from '../../component/form/DoctorFrom';
import 'react-toastify/dist/ReactToastify.css';
import { handleErrorResponse } from '../../ui-component/alert/Response';

function DoctorList() {
  const [doctor, setDoctor] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rowCount, setRowCount] = useState(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const fileInputRef = React.createRef();
  // const [selectedDate, setSelectedDate] = useState(null);



  // const openModal = (info) => {
  //   setIsModalOpen(true);
  //   setSelectedDate(info.dateStr);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const handleSubmit = async (formData) => {
  //   //console.log(formData)
  //   console.log(JSON.stringify(formData));
  //   try {
  //     // Call the postData function with the form data
  //     await addData(formData);
  //     // handleCloseModal();
  //   } catch (error) {
  //     // Handle errors
  //     console.log('Error posting data:', error);
  //     toast.error('Error adding data!');
  //   }
  // };



  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/doctor/all',
        {
          params: {
            page: pagination.pageIndex,
            pageSize: pagination.pageSize
          }
        });

      if (response.status === 200) {
        setDoctor(response.data.data);
        setRowCount(response.data.totalItems);
      }
    } catch (error) {
      handleErrorResponse(error);
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

  const updateData = async (_id, values) => {
    const data = {
      doctor_name: values.doctor_name,
      specialty: values.specialty,
      phonenumber: values.phonenumber,
      profileimage: values.profileimage
    };

    console.log(_id);
    try {
      //   setPending(true);

      const response = await axios.put('http://localhost:3006/api/doctor/' + _id, data);

      if (response.status === 200) {
        // setPending(false);
        toast.success('Doctor updated successfully!');
        fetchData();
      } else if (response.status === 401) {
        window.location.reload();
      } else {
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
      }
    } finally {
      //   setPending(false);
    }
  };


  const handleDeleteClick = async (id) => {
    try {
      setisLoading(true);
      const response = await axios.delete(process.env.REACT_APP_API_ENDPOINT + '/doctor/delete/' + id);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'doctor_name',
        header: 'Doctor Name',
        enableColumnActions: true
      },

      {
        accessorKey: 'specialty',
        header: 'Specialty',
        enableColumnActions: true
      },

      {
        accessorKey: 'phonenumber',
        header: 'Phone Number',
        enableColumnActions: true
      },

      {
        accessorKey: 'profileimage',
        header: 'Profile Image',
        enableColumnActions: true,
        Cell: ({ rowNumber, renderedCellValue, onCellValueChange, isEditing }) => (
          <div>
            <img
              src={renderedCellValue ? `${process.env.REACT_APP_API_ENDPOINT}/doctor/profileimage/${renderedCellValue}` : defultItemImage}
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

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <div className="tabled">
        <Grid container spacing={2}>
          <Grid item xs={24} sm={12}>
            <SimpleTable
              tableHeading="Doctor List"
              handleDeleteClick={handleDeleteClick}
              columns={columns}
              rowCount={rowCount}
              getData={doctor}
              deletedata={deletedata}
              handleSaveRow={handleSaveRow}
              isLoading={isLoading}
              pagination={pagination}
              setPagination={setPagination}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              addButtonHeading="Add Doctor"
              idName="doctorid"
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
        title="Add Doctor"
        content="Welcome"
        form={<DoctorFrom handleCloseModal={handleCloseModal} setisLoading={setisLoading} />}
      />
    </>
  );
}

export default DoctorList;
