import { FC } from 'react';
import styled from 'styled-components';

import {
  BtnSpinner,
  CSCommonErrorMessage,
  CSCommonForm,
  CSCommonModal,
} from '@/components/cs-common';
import {
  CarFuelTypeSelect,
  carSchema,
  CarStatusSelect,
  CarSteeringTypeSelect,
  CarTypeSelect,
} from '@/helpers';
import { useNonNegativeInput } from '@/hooks';
import { device } from '@/styles';
import { Car, CarDto, FieldErrorsState } from '@/types';

import DefaultImage from '../../../../../public/car-upload.png';

import { useCarForm } from './hooks';

export type onCarSubmit = (
  car: CarDto,
) => Promise<{ car?: Car; errors?: FieldErrorsState<CarDto> }>;

type Props = {
  onFormSubmit: onCarSubmit;
  carDefaultValues?: Car;
};

export const CSDashboardCarForm: FC<Props> = ({ carDefaultValues, onFormSubmit }) => {
  const {
    currentCar,
    isLoading,
    existingImages,
    setIsSuccess,
    isSuccess,
    onPreviewRemove,
    onSubmit,
    errors,
  } = useCarForm(onFormSubmit, carDefaultValues);
  const { preventNegativeInput } = useNonNegativeInput();

  const handleCloseModal = (): void => setIsSuccess(false);
  const saveBtnContent = isLoading ? <BtnSpinner /> : 'Save';

  return (
    <FormContainer>
      <ContentContainer>
        <CSCommonForm<CarDto>
          validationSchema={carSchema(existingImages)}
          onSubmit={onSubmit}
          defaultValues={currentCar ? { ...currentCar, pictures: [] } : undefined}
        >
          <CarHeaderWrapper>
            <CSCommonForm.InputFile
              label="Upload Car Image"
              defaultImage={DefaultImage}
              existingImages={existingImages}
              onRemove={onPreviewRemove}
              isPending={isLoading}
              name="pictures"
              multiple
              error={errors?.pictures}
            />
            <CSCommonForm.SubmitButton buttonContent={saveBtnContent} />
          </CarHeaderWrapper>

          <ErrorContainer>
            <CSCommonErrorMessage>{errors?.unexpectedError}</CSCommonErrorMessage>
          </ErrorContainer>

          <Title>General Information</Title>
          <Section>
            <CSCommonForm.Input label="Model Name" name="model" error={errors?.model} />
            <CSCommonForm.Input
              label="Year"
              name="year"
              type="number"
              error={errors?.year}
              onKeyDown={preventNegativeInput}
            />
            <CSCommonForm.Input
              label="Price / Hour"
              name="pricePerHour"
              error={errors?.pricePerHour}
              onKeyDown={preventNegativeInput}
              min={0}
            />
            <CSCommonForm.Select
              label="Status"
              name="status"
              options={CarStatusSelect}
              error={errors?.status}
            />
          </Section>

          <DescriptionSection>
            <CSCommonForm.TextArea
              label="Description"
              name="description"
              error={errors?.description}
            />
          </DescriptionSection>

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
              min={0}
              error={errors?.capacity}
              onKeyDown={preventNegativeInput}
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
              min={0}
              error={errors?.fuelCapacity}
              onKeyDown={preventNegativeInput}
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

      {isSuccess && (
        <CSCommonModal
          type="confirm"
          title="Success"
          message={`Your car was successfully ${carDefaultValues ? 'updated' : 'added'}.`}
          onClose={handleCloseModal}
          onOk={handleCloseModal}
        />
      )}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const ErrorContainer = styled.div`
  margin: 15px 0;
`

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

  @media ${device.md} {
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;
  margin-right: 10px;

  @media ${device.sm} {
    display: flex;
    flex-direction: column;
  }
`;

const DescriptionSection = styled.section`
  margin-right: 10px;
`;

const CarHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
