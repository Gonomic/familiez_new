import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Autocomplete, InputLabel, TextField, Typography, Button } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { EditNotifications } from '@mui/icons-material';

function RightDrawer({ open, onClose }) {
    const [person, setPerson] = useState(null);                 // State to handle the choosen person in the list of the Autocomlete control
    const [persons, setPersons] = useState([]);                 // State to store fetched persons that have a name that sounds like what was typed in in the Autocomplete control
    // const [anchorPersons, setAnchorPersons] = useState(null);   // "anchor persons" (core persons for each generation arround which the family tree is build, they make out the trunk of the family tree 
    const anchorPerson = useRef(null);                          // State to hold the active "core" (or trunk) person arround which the familytree is build in the active step of the proces
    const anchorPersons = useRef([]);                          // State to hold the active "core" (or trunk) person arround which the familytree is build in the active step of the proces
    const [familyTree, setFamilyTree] = useState(null);         // State to hold the family tree of persons
    const [inputValue, setInputValue] = useState("");           // State to handle character on character input (in this case for the Autocomplete control)
    const isSelectingRef = useRef(false);                       // Flag to differentiate between input in the Autocomplete control and selection from the list in Autocomplete control

    const [nbrOfParentGenerations, setNbrOfParentGenerations] = useState(0);    // Used to control the lower and upper bounds when looping through generations
    const [nbrOfChildGenerations, setNbrOfChildGenerations] = useState(0);      // Used to control the lower and upper bounds when looping through generations


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
            const url = `http://localhost:8000/GetPersonsLike?stringToSearchFor=${person}`;
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
    // (not just an character added or removed, that's for InputChange 
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
        console.log("===> Selected id of person:", selectedPerson.PersonID);
        console.log("===> Starting the control procedure to build the family tree.");
        buildFamilyTree(selectedPerson); // Build the complete family tree
    };

    //Building the familytree on basis of which rendering of the tree will (eventually) take place
    const buildFamilyTree = async (person) => {
        console.log("===> In buildingFamilyTree.");
        console.log("===> Person= ", JSON.stringify(person));
        console.log("===> PersonID for call to getFather= ", person.PersonID);
        anchorPersons.push(person.PersonID);
        // ======> Hier verder gaan. Gedoe oplossen m.b.t. initit van de loop en gebruik van het vinden van de vader in de voorgaande loop c.q. het toevoegen van een vader in de volgende loop
        for (let generationRunningIndex = 0; generationRunningIndex <= nbrOfParentGenerations; generationRunningIndex++) {
            let Father = await getFather(person.PersonID);
            if (!Father) {
                console.log("---> Build the familyTree. FamilyTree= ", JSON.stringify(familyTree.value));
                break;
            }
            console.log("===> Father= ", JSON.stringify(Father));
            anchorPersons.current.push(Father);
            console.log("===> anchorPersons in getFather= ", JSON.stringify(anchorPersons));
            console.log("===> About to get siblings.")
            const siblings = await getSiblings(Father);
            console.log("===> Got siblings, siblings= ", JSON.stringify(siblings));
            setFamilyTree((prevTree) => ({
                ...prevTree,
                [Father.PersonID]: siblings
            }));
            console.log("===> In buildFamilytree, familyTree= ", JSON.stringify(familyTree.value));
        }
    };

    // Get the father of the anchor person, which by the way will be the next anchor person travelling up the family tree. 
    const getFather = async (childIdIn) => {
        console.log("===> In getFather, childIdIn= ", childIdIn);
        try {
            const url = `http://localhost:8000/GetFather?childID=${childIdIn}`;
            const responseDB = await fetch(url);
            const data = await responseDB.json();
            if (data[0].numberOfRecords >= 1) {
                console.log("Found father. Data to return= ", JSON.stringify(data[1].FatherID));
                return (data[1].FatherID);
            }
        } catch (error) {
            console.error('Error getting data from API:', error);
        }
        console.log("Found no father. Data to return= 0");
        return 0;
    };

    // Get all siblings based on who is the father
    const getSiblings = async (fatherID) => {
        console.log("===> In getSiblings. FatherId= ", fatherID);
        try {
            const url = `http://localhost:8000/GetSiblings?parentID=${fatherID}`;
            const responseDB = await fetch(url);
            const data = await responseDB.json();
            if (data[0].numberOfRecords >= 1) {
                return data.slice(1);
            }
        } catch (error) {
            console.error('Error getting data from API:', error);
        }
        return [];
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
                        defaultValue={1}
                        onChange={(e) => setNbrOfParentGenerations(e.target.value)}
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", marginTop: 5, marginLeft: 5, marginRight: 5, width: 400, height: 40 }}>
                    <TextField
                        id="nbrOfChildGenerations"
                        type="number"
                        label="Hoeveel generaties (achter klein)kinderen"
                        defaultValue={0}
                        onChange={(e) => setNbrOfChildGenerations(e.target.value)}
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