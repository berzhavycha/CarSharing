import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { CSCommonForm, CSCommonModal } from '@/components/cs-common';
import {
  CarFuelTypeSelect,
  CarStatusSelect,
  CarSteeringTypeSelect,
  CarTypeSelect,
  createCarSchema,
} from '@/helpers';
import { Car, CarDto, FieldErrorsState, LocalFile } from '@/types';

import DefaultImage from '../../../../../public/car-upload.png';

type Props = {
  onFormSubmit: (car: CarDto) => Promise<{ car?: Car; errors?: FieldErrorsState<CarDto> }>;
  carDefaultValues?: Car;
};

export const CSDashboardCarForm: FC<Props> = ({ carDefaultValues, onFormSubmit }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrorsState<CarDto>>();
  const [currentCar, setCurrentCar] = useState<Car | undefined>(carDefaultValues)
  const [existingImagesIds, setExistingImagesIds] = useState<string[]>(() => {
    return carDefaultValues ? carDefaultValues.pictures.map((item: LocalFile) => item.id) : []
  })

  const onImageRemove = (removeId: string): void => {
    setExistingImagesIds(ids => [...ids.filter(id => id !== removeId)])
  }

  useEffect(() => {
    setExistingImagesIds(() => {
      return currentCar ? currentCar.pictures.map((item: LocalFile) => item.id) : []
    })
  }, [currentCar])

  const handleCloseModal = (): void => setModalVisible(false);

  const onSubmit = async (carDto: CarDto): Promise<void> => {
    const dto = currentCar ? { ...carDto, id: currentCar.id, existingImagesIds } : carDto;
    const { car, errors } = await onFormSubmit(dto);
    if (car) {
      setModalVisible(true);
      if (carDefaultValues) {
        setExistingImagesIds(car.pictures.map((item: LocalFile) => item.id))
        setCurrentCar(car)
      }
    } else if (errors) {
      setErrors(errors);
    }
  };

  return (
    <FormContainer>
      <ContentContainer>
        <CSCommonForm<CarDto>
          validationSchema={createCarSchema(existingImagesIds)}
          onSubmit={onSubmit}
          defaultValues={{ ...currentCar, pictures: [] }}
        >
          <CarHeaderWrapper>
            <CSCommonForm.InputFile
              label="Upload Car Image"
              defaultImage={DefaultImage}
              existingImageIds={existingImagesIds}
              onRemove={onImageRemove}
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
            <CSCommonForm.Input
              label="Price / Hour"
              name="pricePerHour"
              type="text"
              error={errors?.pricePerHour}
            />
            <CSCommonForm.Select label="Status" name="status" options={CarStatusSelect} />
          </Section>

          <CSCommonForm.TextArea
            label="Description"
            name="description"
            error={errors?.description}
          />

          <Title>Characteristics</Title>
          <Section>
            <CSCommonForm.Select
              label="Type"
              name="type"
              options={CarTypeSelect}
              error={errors?.type}
            />
            <CSCommonForm.Input
              label="Capacity"
              name="capacity"
              type="number"
              error={errors?.capacity}
            />
            <CSCommonForm.Select
              label="Fuel Type"
              name="fuelType"
              options={CarFuelTypeSelect}
              error={errors?.fuelType}
            />
            <CSCommonForm.Input
              label="Fuel Capacity"
              name="fuelCapacity"
              type="number"
              error={errors?.fuelCapacity}
            />
            <CSCommonForm.Select
              label="Steering"
              name="steering"
              options={CarSteeringTypeSelect}
              error={errors?.steering}
            />
          </Section>
        </CSCommonForm>
      </ContentContainer>

      {
        isModalVisible && (
          <CSCommonModal
            type="confirm"
            title="Success"
            message={`Your car was successfully ${carDefaultValues ? 'updated' : 'added'}.`}
            onClose={handleCloseModal}
            onOk={handleCloseModal}
          />
        )
      }
    </FormContainer >
  );
};

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
