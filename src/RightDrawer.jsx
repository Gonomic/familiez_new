import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Autocomplete, InputLabel, TextField, Typography, Button } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { EditNotifications } from '@mui/icons-material';

function RightDrawer({ open, onClose }) {
    const [person, setPerson] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [persons, setPersons] = useState([]); // State to store fetched persons

    const getNamesFromMiddlewareServer = async (person) => {
        if (!person) return; // Prevent API call if input is empty
        try {
            const url = `http://127.0.0.1:8000/GetPersonsLike?stringToSearchFor=${person}`;
            const responseDB = await fetch(url);
            const data = await responseDB.json();
            if (data[0].numberOfRecords >= 1) {
                setPersons(data.slice(1));
            }
            EditNotifications
        } catch (error) {
            console.error('Error getting data from API:', error);
        }
    };

    // Use useRef to store the debounced function
    const debouncedGetNames = useRef(
        debounce((value) => {
            getNamesFromMiddlewareServer(value);
        }, 1000) // Adjust the delay as needed (1000ms in this example)
    ).current;

    const handlePersonChange = (event, newValue) => {
        setPerson(newValue);
        console.log("Hier!!!");
    };

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        debouncedGetNames(newInputValue);
    };

    // Cleanup the debounced function on component unmount
    useEffect(() => {
        return () => {
            debouncedGetNames.cancel();
        };
    }, [debouncedGetNames, persons]);

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
                    <Typography variant="h5" border={10} borderColor="transparent">
                        Persoon zoeken
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", marginTop: 5, marginLeft: 5, marginRight: 5, width: 400 }}>
                    <Autocomplete
                        value={person}
                        onChange={handlePersonChange}
                        inputValue={inputValue}
                        onInputChange={handleInputChange}
                        options={persons}
                        getOptionLabel={(option) => `${option.PersonGivvenName} ${option.PersonFamilyName} (${option.PersonDateOfBirth})`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Persoon"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: null,
                                }}
                            />
                        )}
                    />
                    <Box sx={{ marginTop: 1 }}>
                        <Typography variant="caption">Kies een persoon</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", marginTop: 5, marginLeft: 5, marginRight: 5, width: 400, height: 40 }}>
                    <TextField
                        id="nbrOfParentGenerations"
                        type="number"
                        label="Hoeveel generaties (over groot)ouders"
                        defaultValue={0}
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", marginTop: 5, marginLeft: 5, marginRight: 5, width: 400, height: 40 }}>
                    <TextField
                        id="nbrOfChildGenerations"
                        type="number"
                        label="Hoeveel generaties (achter klein)kinderen"
                        defaultValue={0}
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                </Box>


            </Drawer>
        </div>
    );
}

RightDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RightDrawer;