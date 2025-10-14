export abstract class SagaStep<T, R> {
  name: string;
  abstract invoke(params: T): Promise<R>;
  abstract withCompensation(params: T): Promise<R>;
}
