import React from 'react';
import styled from 'styled-components/native';
import Divider from './Divider';

export interface InfoRowData {
    label: string;
    value: string;
    isHighlighted?: boolean;
}

interface InfoCardProps {
    title: string;
    rows: InfoRowData[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, rows }) => {
    return (
        <CardContainer>
            <TitleText>{title}</TitleText>
            <Divider />
            {rows.map((row, index) => (
                <RowView key={index}>
                    <LabelText>{row.label}</LabelText>
                    <ValueText isHighlighted={row.isHighlighted}>
                        {row.value}
                    </ValueText>
                </RowView>
            ))}
        </CardContainer>
    );
};

export default InfoCard;

const CardContainer = styled.View`
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    margin-vertical: 8px;
    elevation: 1;
    shadow-color: #000;
    shadow-offset: 0px 1px;
    shadow-opacity: 0.1;
    shadow-radius: 1px;
`;

const TitleText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
`;

const RowView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
`;

const LabelText = styled.Text`
    font-size: 14px;
    color: #555;
`;

const ValueText = styled.Text<{ isHighlighted?: boolean }>`
    font-size: 16px;
    font-weight: ${props => props.isHighlighted ? '500' : '600'};
    color: ${props => props.isHighlighted ? '#27B5F4' : 'black'};
`;