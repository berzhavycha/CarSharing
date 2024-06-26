import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';
import {
    CarFuelTypeSelect,
    CarStatusSelect,
    CarSteeringTypeSelect,
    CarTypeSelect,
    createCarSchema,
} from '@/helpers';
import { CarDto } from '@/types';

import DefaultImage from '../../../../../public/car-upload.png';

export const CSDashboardCarForm: FC = observer(() => {
    const onSubmit = (car: CarDto): void => {
        console.log(car);
    };

    return (
        <FormContainer>
            <ContentContainer>
                <CSCommonForm<CarDto> validationSchema={createCarSchema} onSubmit={onSubmit}>
                    <CarHeaderWrapper>
                        <CSCommonForm.InputFile
                            label="Upload Car Image"
                            defaultImage={DefaultImage}
                            name="pictures"
                            multiple
                        />
                        <CSCommonForm.SubmitButton content="Save" />
                    </CarHeaderWrapper>

                    <Title>General Information</Title>
                    <Section>
                        <CSCommonForm.Input
                            label="Model Name"
                            placeholder="Enter car`s model name"
                            name="model"
                        />
                        <CSCommonForm.Input label="Year" name="year" type="number" />

                        <CSCommonForm.Input label="Price / Hour" name="pricePerHour" type="number" />
                        <CSCommonForm.Select label="Status" name="status" options={CarStatusSelect} />
                    </Section>

                    <CSCommonForm.TextArea label="Description" name="description" />

                    <Title>Characteristics</Title>
                    <Section>
                        <CSCommonForm.Select label="Type" name="type" options={CarTypeSelect} />
                        <CSCommonForm.Input label="Capacity" name="capacity" type="number" />
                        <CSCommonForm.Select label="Fuel Type" name="fuelType" options={CarFuelTypeSelect} />
                        <CSCommonForm.Input label="Fuel Capacity" name="fuelCapacity" type="number" />
                        <CSCommonForm.Select label="Steering" name="steering" options={CarSteeringTypeSelect} />
                    </Section>
                </CSCommonForm>
            </ContentContainer>
        </FormContainer>
    );
});

const FormContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;
  margin-right: 10px;
`;

const CarHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
`;
