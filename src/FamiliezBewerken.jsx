import { Box } from '@mui/system';
import { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const FamiliezTree = ({ selectedPerson }) => {

    let SvgDrawGuide = {
        "RectDefWidth": 120,
        "RectDefHeigth": 60,
        "RectDefFill": "white",
        "RectDefHorizontalGapNoPartner": 240,
        "RectDefHorizontalGapPartner": 0,
        "RectDefVerticalGap": 120,
        "RectTextDefX": 5,
        "RectTextDefY": 20,
        "RectTextDefHeigth": 10,
        "RectTextDefWidth": 50,
        "RectTextDefFontFamily": "Verdana",
        "RectTextDefFill": "blue",
        "RunningUpperX": 0,
        "RunningUpperY": 0,
        "RunningUpperGen": 0,
        "RunningUpperNbrOfPersons": 0,
        "RunningLowerX": 0,
        "RunningLowerY": 0,
        "RunningLowerGen": 0,
        "RunningLowerNbrOfPersons": 0,
        "DrawingGenerations": "both",
    };


    const [persons, setPersons] = useState([]);

    const addPerson = () => {
        const newPersonElement = (
            <rect
                key={Math.random()} // Add a unique key
                x={100}
                y={100}
                width={120}
                height={60}
                fill="white"
            />
        );
        setPersons([...persons, newPersonElement]);
    };

    return (
        // <button onClick={addPerson}>Persoon toevoegen</button> 
        <Box sx={{ position: 'absolute', top: '64px', bottom: '72px', height: 'calc(100% - 136px)', width: '100%', overflow: 'auto' }}>
            {selectedPerson && (
                <Paper elevation={3} sx={{ p: 3, m: 3, maxWidth: 600 }}>
                    <Typography variant="h5" gutterBottom color="primary">
                        Geselecteerde Persoon
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Naam:</strong> {selectedPerson.PersonGivvenName} {selectedPerson.PersonFamilyName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Geboortedatum:</strong> {selectedPerson.PersonDateOfBirth}
                    </Typography>
                    {selectedPerson.PersonDateOfDeath && (
                        <Typography variant="body1">
                            <strong>Overlijdensdatum:</strong> {selectedPerson.PersonDateOfDeath}
                        </Typography>
                    )}
                    <Typography variant="body1">
                        <strong>ID:</strong> {selectedPerson.PersonID}
                    </Typography>
                </Paper>
            )}
            <svg style={{ width: '200%', height: '200%', overflow: 'visible' }}>


                <g>
                    <rect
                        key={Math.random()} // Add a unique key
                        x={10}
                        y={10}
                        width={SvgDrawGuide.RectDefWidth}
                        height={SvgDrawGuide.RectDefHeigth}
                        fill={SvgDrawGuide.RectDefFill}
                    />
                    <text
                        x={10 + SvgDrawGuide.RectTextDefX}
                        y={10 + SvgDrawGuide.RectTextDefY}
                        width={SvgDrawGuide.RectTextDefWidth}
                        height={SvgDrawGuide.RectTextDefHeigth}
                        fill={SvgDrawGuide.RectTextDefFill}
                        fontFamily={SvgDrawGuide.RectTextDefFontFamily}>
                        Hello blok 1
                    </text>
                </g>


                {/*                 <g>
                            <rect>
                                {persons.map((person) => (
                                    <Person key={person.id} person={person} />
                                ))}
                            </rect>
                            <text fontFamily="Verdana" fill="blue">Hello</text>
                        </g> */}
            </svg>

        </Box>

    );
};

{/* const Person = () => {
    // Implement rendering logic for each person (SVG control)
    // Use person.name, person.parentID, etc.
    return (
        <g>
            <rect x={Math.random() * 100} y={Math.random() * 101} width={120} height={60} fill="white" />
        </g>
    );
}; */}

FamiliezTree.propTypes = {
    selectedPerson: PropTypes.object,
};

export default FamiliezTree;