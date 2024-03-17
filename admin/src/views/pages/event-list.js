import React, { useState, useEffect, useMemo } from 'react';
// import FormModal from "../FormModal";
import SimpleTable from '../../ui-component/table/Table';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';

function EventList() {
  const [event, setEvent] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  //   const openModal = (info) => {
  //     setIsModalOpen(true);
  //     setSelectedDate(info.dateStr);
  //   };

  //   const closeModal = () => {
  //     setIsModalOpen(false);
  //   };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const onFinish = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData);
    handleSubmit(formDataObject);
  };

  const addData = async (values) => {
    try {
      const dataToSend = {
        event_name: values.event_name,
        event_date: values.event_date,
        event_time: values.event_time,
        event_venue: values.event_venue
      };

      const response = await axios.post('http://localhost:3004/events/create', dataToSend);

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
        toast.error('An error occurred while adding the user');
      }
    } finally {
      setisLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/events/getAllEvents');

      if (response.status === 200) {
        setEvent(response.data.existingEvents);
      } else {
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
      } else {
        console.error(error);
        setError({ message: error.message, has: true });
        toast.error('An error occurred while fetching data.');
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

        const response = await axios.delete(`http://localhost:3004/events/delete/${idArray}`);

        if (response.status === 200) {
          //   setPending(false);
          fetchData();
          toast.success('Event Deleted successfully!');
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
      event_name: values.event_name,
      event_date: values.event_date,
      event_time: values.event_time,
      event_venue: values.event_venue
    };

    console.log(_id);
    try {
      //   setPending(true);

      const response = await axios.put('http://localhost:3004/events/update/' + _id, data);

      if (response.status === 200) {
        // setPending(false);
        toast.success('Event updated successfully!');
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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'event_name',
        header: 'Event Name',
        enableColumnActions: true
      },

      {
        accessorKey: 'event_date',
        header: 'Event Date',
        enableColumnActions: true
      },

      {
        accessorKey: 'event_time',
        header: 'Event Time',
        enableColumnActions: true
      },

      {
        accessorKey: 'event_venue',
        header: 'Event Location',
        enableColumnActions: true
      }
    ],
    []
  );

  return (
    <>
      <div className="tabled">
        <Grid container spacing={2}>
          <Grid item xs={24} sm={12}>
            <SimpleTable
              tableHeading="Event List"
              columns={columns}
              getData={event}
              deletedata={deletedata}
              handleSaveRow={handleSaveRow}
              isLoading={isLoading}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              addButtonHeading="Add Event"
              idName="_id"
              enableClickToCopy
              enableRowNumbers={false}
              enableRowVirtualization={false}
            />
          </Grid>
        </Grid>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-user-modal-title"
        aria-describedby="add-user-modal-description"
      >
        {
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: '#E8E9EB',
              boxShadow: 24,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <form name="basic" onSubmit={onFinish} autoComplete="off">
              <Typography variant="h5" align="center" marginBottom={5}>
                Add Events
              </Typography>

              <TextField
                label="Event Name"
                name="event_name"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }} // Add margin-bottom
              />

              <TextField
                label=""
                name="event_date"
                variant="outlined"
                type="date"
                fullWidth
                required
                sx={{ mb: 2 }} // Add margin-bottom
              />

              <TextField
                label=""
                name="event_time"
                variant="outlined"
                type="time"
                fullWidth
                required
                sx={{ mb: 2 }} // Add margin-bottom
              />

              <TextField
                label="Event Venue"
                name="event_venue"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }} // Add margin-bottom
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" type="submit" sx={{ marginRight: '10px' }}>
                  Submit
                </Button>
                <Button variant="contained" onClick={handleCloseModal} type="button" sx={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        }
      </Modal>
    </>
  );
}

export default EventList;
