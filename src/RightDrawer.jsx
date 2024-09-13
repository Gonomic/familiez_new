import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Autocomplete, InputLabel, TextField, Typography, Button } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { EditNotifications } from '@mui/icons-material';

function RightDrawer({ open, onClose }) {
    const [personTree, setPersonTree] = useState(null);
    const [person, setPerson] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [persons, setPersons] = useState([]); // State to store fetched persons
    const isSelectingRef = useRef(false); // Flag to differentiate between input and selection

    // Handle atomic change of Autocomplete field.  
    const handleInputChange = (event, newInputValue) => {
        console.log("===> In handleInputChange.");
        console.log("===> isSelectingRef.current= ", isSelectingRef.current);
        setInputValue(newInputValue);
        if (!isSelectingRef.current) { // Only call debouncedGetNames if not selecting a person
            debouncedGetNames(newInputValue);
        }
        isSelectingRef.current = false; // Reset the flag after handling input change
    };

    // Process each keystroke of Autocomplete field until pause of 1,5 second and then 
    // start to get data data from server based on string of input chars
    const debouncedGetNames = useRef(
        debounce((value) => {
            console.log("===> In debouncedGetNames.");
            if (!isSelectingRef.current) {
                getNamesFromMiddlewareServer(value);
            }
        }, 1500)
    ).current;

    // Get array of names like the string of chars that were typed in in the Autocomplete field.  
    const getNamesFromMiddlewareServer = async (person) => {
        if (!person) return; // Prevent API call if input is empty
        console.log("===> In getNamesFromMiddlewareServer.")
        try {
            const url = `http://127.0.0.1:8000/GetPersonsLike?stringToSearchFor=${person}`;
            const responseDB = await fetch(url);
            const data = await responseDB.json();
            if (data[0].numberOfRecords >= 1) {
                setPersons(data.slice(1));
            }
        } catch (error) {
            console.error('Error getting data from API:', error);
        }
    };

    // Handle event where value of complete field is changed 
    // (not just an character added or removed, thats for InputChange 
    const handlePersonChange = (event, newValue) => {
        console.log("===> In handlePersonChange.");
        setPerson(newValue);
        isSelectingRef.current = true; // Set the flag to true when a person is selected
        console.log("===> isSelectingRef.current set to= ", isSelectingRef.current);
        handlePersonSelected(newValue); // Call the new function when a person is selected
    };


    // Handle a person being selected from the array with alike persons
    const handlePersonSelected = (selectedPerson) => {
        console.log("===> In handlePersonSelected.");
        console.log("===>Selected id of person:", selectedPerson.PersonID);
        getFamilyTreeOfPerson(selectedPerson)// Add your custom logic here
    };

    // Get family of the person that was selected from the array of alike persons
    const getFamilyTreeOfPerson = async (person) => {
        console.log("===> In getFamilyTreeOfPerson. PersonID= ", person.PersonID);
        try {
            const url = `http://127.0.0.1:8000/GetPersonFamilyTree?personToSearchFor=${person.PersonID}`;
            const responseDB = await fetch(url);
            const data = await responseDB.json();
            if (data[0].numberOfRecords >= 1) {
                setPersonTree(data.slice(1));
            }
        } catch (error) {
            console.error('Error getting data from API:', error);
        }
    };

    // Cleanup the debounced function on component unmount
    useEffect(() => {
        return () => {
            console.log("===> In useEffect, about to cancel debouncedGetNames");
            debouncedGetNames.cancel();
        };
    }, [debouncedGetNames]);

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
                    {/* <Typography variant="h5" border={10} borderColor="transparent">
                        Persoon zoeken
                    </Typography> */}
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