import { observer } from 'mobx-react-lite';
import { FC, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonForm, CSCommonModal } from '@/components/cs-common';
import {
  CarFuelTypeSelect,
  CarStatusSelect,
  CarSteeringTypeSelect,
  CarTypeSelect,
  createCarSchema,
  getFileFromUrl,
} from '@/helpers';
import { Car, CarDto, FieldErrorsState, LocalFile } from '@/types';

import DefaultImage from '../../../../../public/car-upload.png';
import { Env } from '@/core';

type Props = {
  onFormSubmit: (
    car: CarDto,
  ) => Promise<{ car?: Car; errors?: FieldErrorsState<CarDto> }>;
};

export const CSDashboardCarForm: FC<Props> = observer(({ onFormSubmit }) => {
  const location = useLocation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrorsState<CarDto>>();

  const handleCloseModal = (): void => setModalVisible(false);

  const updateCarImages = location.state?.car
    ? location.state?.car.pictures.map((item: LocalFile) => `${Env.API_BASE_URL}/local-files/${item.id}`)
    : undefined;

  const fetchDefaultValues = useCallback(async (): Promise<CarDto | void> => {
    if (!location.state?.car) return
    const pictures = await Promise.all(
      location.state.car.pictures.map((file: LocalFile) => getFileFromUrl(`${Env.API_BASE_URL}/local-files/${file.id}`))
    );
    return { ...location.state.car, pictures };
  }, [location.state?.car]);

  const onSubmit = async (carDto: CarDto): Promise<void> => {
    const dto = location.state?.car ? { ...carDto, id: location.state?.car.id } : carDto;
    const { car, errors } = await onFormSubmit(dto);
    if (car) setModalVisible(true);
    setErrors(errors);
  };

  return (
    <FormContainer>
      <ContentContainer>
        <CSCommonForm<CarDto>
          validationSchema={createCarSchema}
          onSubmit={onSubmit}
          defaultValues={fetchDefaultValues}
        >
          <CarHeaderWrapper>
            <CSCommonForm.InputFile
              label="Upload Car Image"
              defaultImage={DefaultImage}
              actualImages={updateCarImages}
              name="pictures"
              multiple
              error={errors?.pictures}
            />
            <CSCommonForm.SubmitButton content="Save" />
          </CarHeaderWrapper>

          <Title>General Information</Title>
          <Section>
            <CSCommonForm.Input label="Model Name" name="model" error={errors?.model} />
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
          message={`Your car was successfully ${location.state?.car ? 'updated' : 'added'}.`}
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
