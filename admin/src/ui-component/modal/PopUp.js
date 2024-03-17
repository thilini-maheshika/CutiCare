import { Box, Modal, Typography } from "@mui/material";

function PopUp(props){
    return (
        <>
            <Modal
                open={props.isModalOpen}
                onClose={() => props.setIsModalOpen(false)}
                aria-labelledby="add-user-modal-title"
                aria-describedby="add-user-modal-description"
            >
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
                    <Typography variant="h3" align="center" marginBottom={5}>
                        {props.title}
                    </Typography>
                    {props.form}
                </Box>
            </Modal>
        </>
    );
}

export default PopUp;