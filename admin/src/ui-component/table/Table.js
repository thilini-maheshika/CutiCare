/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable no-unused-vars */

import React, { useRef } from "react";
import { MaterialReactTable } from "material-react-table";

import {
  Box,
  ThemeProvider,
  Typography,
  Button,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Delete, Edit } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext";
import { IconUser } from "@tabler/icons";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SimpleTable(props) {
  // const [selectedRows, setSelectedRows] = useState([]);
  const tableInstanceRef = useRef(null);
  const {
    columns,
    getData,
    rowCount,
    isLoading,
    enableRowNumbers,
    enableRowVirtualization,
    setHospitalTemp,
    setPagination,
    pagination,
    tableHeading,
    handleDeleteClick,
    handleEditClick,
    idName,
    setIsModalOpen,
    addButtonHeading,

  } = props;

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const { showAlert } = useAlert();
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  //   const handleOpenModal = () => {
  //     setIsModalOpen(true);
  //   };

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#fff",
      },
      background: {
        default: "#fff",
      },
      secondary: {
        main: "#fff",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#1890ff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1890ff",
              },
            },
          },
        },
      },

    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable
        columns={columns}
        data={getData}
        getRowId={(row) => row[idName]}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: 'flex', gap: '2rem', p: '0.5rem', flexWrap: 'wrap' }}>
            <Typography variant="h4" style={{ fontSize: '1.5rem' }}>
              {tableHeading}
            </Typography>
            <Button
              color="primary"
              onClick={() => setIsModalOpen(true)} // Open the modal
              startIcon={<AddIcon />}
              variant="contained"
            >
              {addButtonHeading}
            </Button>

            {/* <Button color="primary" onClick={() => { console.log(tableInstanceRef.current?.getSelectedRowModel().rows) }} startIcon={<DeleteIcon />} variant="contained">

              Delete
            </Button> */}
          </Box>
        )}
        rowCount={rowCount}
        enableEditing
        enablePagination={true}
        editingMode="row"
        positionPagination="bottom"
        enableRowSelection={true}
        enableColumnOrdering
        state={{
          isLoading: isLoading,
          showProgressBars: isLoading,
          pagination
        }}
        initialState={{
          density: 'compact'
        }}
        paginationDisplayMode="pages"
        manualPagination={true}
        onPaginationChange={setPagination}
        onEditingRowSave={props.handleSaveRow}
        enableColumnActions={false}
        enableRowNumbers={enableRowNumbers}
        enableRowVirtualization={enableRowVirtualization}

        enableRowActions
        displayColumnDefOptions={{
          'mrt-row-actions': {
            Cell: ({ row }) => (
              <>
                <IconButton onClick={() => handleEditClick(row.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleViewUserClick(row)}>
                  <IconUser />
                </IconButton>
                <IconButton onClick={() => {
                  setOpen(true);
                  setId(row.id);
                }}>
                  <Delete />
                </IconButton>
              </>
            ),
            size: 80
          }
        }}
        tableInstanceRef={tableInstanceRef}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: 'Black' }}>{'Delete Records?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            When you select &ldquo;Yes,&rdquo; selected records will be deleted. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ color: 'Black' }} variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <div>
            <Button
              color="primary"
              onClick={async () => {
                handleDeleteClick(id);
                handleClose();
                setId(0);
              }}
              startIcon={<DeleteIcon />}
              variant="contained"
            >
              Delete
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default SimpleTable;
