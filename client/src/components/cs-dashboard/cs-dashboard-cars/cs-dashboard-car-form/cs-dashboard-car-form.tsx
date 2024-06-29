import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
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
import { Car, CarDto, FieldErrorsState, LocalFile } from '@/types';

import DefaultImage from '../../../../../public/car-upload.png';

type Props = {
  onFormSubmit: (car: CarDto) => Promise<{ car?: Car; errors?: FieldErrorsState<CarDto> }>;
};

export const CSDashboardCarForm: FC<Props> = observer(({ onFormSubmit }) => {
  const location = useLocation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrorsState<CarDto>>();
  const [existingImagesIds, setExistingImagesIds] = useState<string[]>(location.state?.car?.pictures.map((item: LocalFile) => item.id))
  const [carDefaultValues, setCarDefaultValues] = useState<Car>(location.state?.car)

  const handleCloseModal = (): void => setModalVisible(false);

  const onRemove = (removeId: string): void => {
    setExistingImagesIds(ids => [...ids.filter(id => id !== removeId)])
  }

  useEffect(() => {
    setExistingImagesIds(carDefaultValues?.pictures.map((item: LocalFile) => item.id))
  }, [carDefaultValues])

  const onSubmit = async (carDto: CarDto): Promise<void> => {
    const dto = location.state?.car ? { ...carDto, id: location.state?.car.id, existingImagesIds } : carDto;
    const { car, errors } = await onFormSubmit(dto);
    if (car) {
      setModalVisible(true);
      if (location.state?.car) {
        setCarDefaultValues(car)
      }
    }
    setErrors(errors);
  };

  return (
    <FormContainer>
      <ContentContainer>
        <CSCommonForm<CarDto>
          validationSchema={createCarSchema(existingImagesIds)}
          onSubmit={onSubmit}
          defaultValues={{ ...carDefaultValues, pictures: [] }}
        >
          <CarHeaderWrapper>
            <CSCommonForm.InputFile
              label="Upload Car Image"
              defaultImage={DefaultImage}
              existingImageIds={existingImagesIds}
              onRemove={onRemove}
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
            message={`Your car was successfully ${location.state?.car ? 'updated' : 'added'}.`}
            onClose={handleCloseModal}
            onOk={handleCloseModal}
          />
        )
      }
    </FormContainer >
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
