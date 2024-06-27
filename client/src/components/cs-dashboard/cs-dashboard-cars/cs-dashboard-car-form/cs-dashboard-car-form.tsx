import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonForm, CSCommonModal } from '@/components/cs-common';
import {
  CarFuelTypeSelect,
  CarStatusSelect,
  CarSteeringTypeSelect,
  CarTypeSelect,
  createCarSchema,
} from '@/helpers';
import { Car, CarDto, FieldErrorsState } from '@/types';

import DefaultImage from '../../../../../public/car-upload.png';

type Props = {
  onFormSubmit: (
    car: CarDto,
  ) => Promise<{ car: Car | null; errors: FieldErrorsState<CarDto> | null }>;
};

export const CSDashboardCarForm: FC<Props> = observer(({ onFormSubmit }) => {
  const location = useLocation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrorsState<CarDto> | null>(null)

  const onSubmit = async (carDto: CarDto): Promise<void> => {
    const { car, errors } = await onFormSubmit(carDto);
    if (car) {
      setModalVisible(true);
    }
    setErrors(errors)
  };

  const handleCloseModal = (): void => setModalVisible(false);

  return (
    <FormContainer>
      <ContentContainer>
        <CSCommonForm<CarDto>
          validationSchema={createCarSchema}
          onSubmit={onSubmit}
          defaultValues={location.state?.car}
        >
          <CarHeaderWrapper>
            <CSCommonForm.InputFile
              label="Upload Car Image"
              defaultImage={DefaultImage}
              name="pictures"
              multiple
              error={errors?.pictures}
            />
            <CSCommonForm.SubmitButton content="Save" />
          </CarHeaderWrapper>

          <Title>General Information</Title>
          <Section>
            <CSCommonForm.Input
              label="Model Name"
              name="model"
              error={errors?.model}
            />
            <CSCommonForm.Input label="Year" name="year" type="number" error={errors?.year} />
            <CSCommonForm.Input label="Price / Hour" name="pricePerHour" type="text" error={errors?.pricePerHour} />
            <CSCommonForm.Select label="Status" name="status" options={CarStatusSelect} />
          </Section>

          <CSCommonForm.TextArea label="Description" name="description" error={errors?.description} />

          <Title>Characteristics</Title>
          <Section>
            <CSCommonForm.Select label="Type" name="type" options={CarTypeSelect} error={errors?.type} />
            <CSCommonForm.Input label="Capacity" name="capacity" type="number" error={errors?.capacity} />
            <CSCommonForm.Select label="Fuel Type" name="fuelType" options={CarFuelTypeSelect} error={errors?.fuelType} />
            <CSCommonForm.Input label="Fuel Capacity" name="fuelCapacity" type="number" error={errors?.fuelCapacity} />
            <CSCommonForm.Select label="Steering" name="steering" options={CarSteeringTypeSelect} error={errors?.steering} />
          </Section>
        </CSCommonForm>
      </ContentContainer>

      {isModalVisible && (
        <CSCommonModal
          type="confirm"
          title="Success"
          message="Your car was successfully added."
          onClose={handleCloseModal}
          onOk={handleCloseModal}
        />
      )}
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
