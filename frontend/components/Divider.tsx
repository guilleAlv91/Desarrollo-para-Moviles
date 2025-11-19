import styled from 'styled-components/native';
import React from 'react';

interface DividerProps {
    color?: string;
}

const StyledDivider = styled.View<DividerProps>`
  height: 1px;
  background-color: ${(props) => props.color || '#E0E0E0'}; 
  margin-horizontal: 10px;
  margin-bottom: 5px;
`;

const Divider: React.FC<DividerProps> = ({ color }) => {
    return <StyledDivider color={color} />;
};

export default Divider;