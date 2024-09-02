import { Box } from '@mui/system';
import { useState } from 'react';

const FamiliezTree = () => {

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

export default FamiliezTree;