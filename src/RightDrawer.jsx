import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Autocomplete, TextField, Typography, Button, Divider } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import PersonEditForm from './components/PersonEditForm';
import { getPersonsLike } from './services/familyDataService';

function RightDrawer({ open, onClose, onPersonSelected, personToEdit, onPersonUpdated }) {
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [persons, setPersons] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const isSelectingRef = useRef(false);
    const [mode, setMode] = useState('select'); // 'select' or 'edit'

    const [nbrOfParentGenerations, setNbrOfParentGenerations] = useState(1);
    const [nbrOfChildGenerations, setNbrOfChildGenerations] = useState(1);

    // Update mode when personToEdit changes
    useEffect(() => {
        if (personToEdit) {
            setMode('edit');
        } else {
            setMode('select');
        }
    }, [personToEdit]);

    // Handle atomic change of Autocomplete field
    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        if (!isSelectingRef.current) {
            debouncedGetNames(newInputValue);
        }
        isSelectingRef.current = false;
    };

    // Debounced function to get names from server
    const debouncedGetNames = useRef(
        debounce(async (value) => {
            if (!isSelectingRef.current) {
                const data = await getPersonsLike(value);
                setPersons(data);
            }
        }, 1500)
    ).current;

    // Handle person selection from autocomplete
    const handlePersonChange = (event, newValue) => {
        setPerson(newValue);
        isSelectingRef.current = true;
    };

    // Handle person selected to build tree
    const handleBuildTree = () => {
        if (person && onPersonSelected) {
            onPersonSelected(person, nbrOfParentGenerations, nbrOfChildGenerations);
            navigate('/familiez-bewerken');
            onClose();
        }
    };

    // Handle saving edited person
    const handleSavePerson = (updatedPerson) => {
        if (onPersonUpdated) {
            onPersonUpdated(updatedPerson);
        }
        setMode('select');
    };

    // Handle canceling edit
    const handleCancelEdit = () => {
        setMode('select');
        if (onPersonUpdated) {
            onPersonUpdated(null); // Signal that edit was cancelled
        }
    };

    // Cleanup debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedGetNames.cancel();
        };
    }, [debouncedGetNames]);

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ width: 400, padding: 2 }}>
                    {mode === 'select' ? (
                        <>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                Stamboom Opbouwen
                            </Typography>

                            <Autocomplete
                                value={person}
                                onChange={handlePersonChange}
                                inputValue={inputValue}
                                onInputChange={handleInputChange}
                                options={persons}
                                getOptionLabel={(option) => 
                                    `${option.PersonGivvenName} ${option.PersonFamilyName} (${option.PersonDateOfBirth})`
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Persoon"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="caption" sx={{ display: 'block', mb: 3 }}>
                                Kies een persoon
                            </Typography>

                            <TextField
                                type="number"
                                label="Hoeveel generaties (over groot)ouders"
                                value={nbrOfParentGenerations}
                                onChange={(e) => setNbrOfParentGenerations(parseInt(e.target.value) || 0)}
                                InputProps={{ inputProps: { min: 0, step: 1 } }}
                                fullWidth
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                type="number"
                                label="Hoeveel generaties (achter klein)kinderen"
                                value={nbrOfChildGenerations}
                                onChange={(e) => setNbrOfChildGenerations(parseInt(e.target.value) || 0)}
                                InputProps={{ inputProps: { min: 0, step: 1 } }}
                                fullWidth
                                sx={{ mb: 3 }}
                            />

                            <Button 
                                variant="contained" 
                                color="primary"
                                disabled={!person}
                                onClick={handleBuildTree}
                                fullWidth
                            >
                                Toon Stamboom
                            </Button>
                        </>
                    ) : (
                        <>
                            <PersonEditForm
                                person={personToEdit}
                                onSave={handleSavePerson}
                                onCancel={handleCancelEdit}
                            />
                        </>
                    )}
                </Box>
            </Drawer>
        </div>
    );
}

RightDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPersonSelected: PropTypes.func.isRequired,
    personToEdit: PropTypes.object,
    onPersonUpdated: PropTypes.func,
};

export default RightDrawer;