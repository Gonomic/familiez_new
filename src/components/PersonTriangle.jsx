import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * PersonTriangle Component
 * Renders a person as a draggable triangle (two points up, one point down)
 * Shows name, first name, and birth date
 */
const PersonTriangle = ({ 
    person, 
    x, 
    y, 
    width = 120, 
    height = 100,
    onDragStart,
    onDrag,
    onDragEnd,
    onClick,
    partners = [],
    isPartnerDragging = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const triangleRef = useRef(null);

    // Calculate triangle points (two points up, one down)
    const points = `${x},${y + height} ${x - width/2},${y} ${x + width/2},${y}`;

    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Only left click
        e.stopPropagation();
        
        const svg = triangleRef.current.ownerSVGElement;
        const CTM = svg.getScreenCTM();
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const svgPoint = point.matrixTransform(CTM.inverse());
        
        setDragOffset({
            x: svgPoint.x - x,
            y: svgPoint.y - y
        });
        setIsDragging(true);
        
        if (onDragStart) {
            onDragStart(person.PersonID);
        }
    };

    useEffect(() => {
        if (!isDragging && !isPartnerDragging) return;

        const handleMouseMove = (e) => {
            if (!triangleRef.current) return;
            
            const svg = triangleRef.current.ownerSVGElement;
            const CTM = svg.getScreenCTM();
            const point = svg.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;
            const svgPoint = point.matrixTransform(CTM.inverse());

            const newX = svgPoint.x - dragOffset.x;
            const newY = svgPoint.y - dragOffset.y;

            if (onDrag) {
                onDrag(person.PersonID, newX, newY);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (onDragEnd) {
                onDragEnd(person.PersonID);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isPartnerDragging, dragOffset, x, y, person.PersonID, onDrag, onDragEnd]);

    const handleClick = (e) => {
        if (isDragging) return;
        e.stopPropagation();
        if (onClick) {
            onClick(person, e.clientX, e.clientY);
        }
    };

    // Format the text to fit in triangle
    const formatText = (text, maxLength = 15) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const fullName = `${person.PersonGivvenName || ''} ${person.PersonFamilyName || ''}`.trim();
    const birthDate = person.PersonDateOfBirth || '';

    return (
        <g ref={triangleRef}>
            {/* Triangle shape */}
            <polygon
                points={points}
                fill="white"
                stroke="#1976d2"
                strokeWidth="2"
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    filter: isDragging ? 'drop-shadow(0 0 5px rgba(0,0,0,0.3))' : 'none'
                }}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            />
            
            {/* Person's name */}
            <text
                x={x}
                y={y + height * 0.4}
                textAnchor="middle"
                fill="#1976d2"
                fontSize="12"
                fontFamily="Verdana, sans-serif"
                fontWeight="bold"
                pointerEvents="none"
            >
                {formatText(fullName, 12)}
            </text>
            
            {/* Birth date */}
            <text
                x={x}
                y={y + height * 0.55}
                textAnchor="middle"
                fill="#666"
                fontSize="10"
                fontFamily="Verdana, sans-serif"
                pointerEvents="none"
            >
                {formatText(birthDate, 12)}
            </text>
        </g>
    );
};

PersonTriangle.propTypes = {
    person: PropTypes.shape({
        PersonID: PropTypes.number.isRequired,
        PersonGivvenName: PropTypes.string,
        PersonFamilyName: PropTypes.string,
        PersonDateOfBirth: PropTypes.string,
    }).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onClick: PropTypes.func,
    partners: PropTypes.array,
    isPartnerDragging: PropTypes.bool,
};

export default PersonTriangle;
