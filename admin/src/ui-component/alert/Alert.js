import { Alert as MuiAlert, AlertTitle } from '@mui/material';
import { useAlert } from '../../context/AlertContext';

const Alert = (props) => {
    const { hideAlert } = useAlert();

    return (
        <>
            <MuiAlert severity={props.severity} onClose={hideAlert}>
                <AlertTitle>{props.severity}</AlertTitle>
                {props.message}
            </MuiAlert>
        </>
    );
};

export default Alert;
