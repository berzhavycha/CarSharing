/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express-serve-static-core';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

type HashResult = { hash: string; salt: string };
type Picture = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  stream: any;
  destination: any;
  filename: any;
  path: string;
};

export const makeHash = (hashDetails?: Partial<HashResult>): HashResult => {
  return {
    hash: 'mock-hash',
    salt: 'mock-salt',
    ...hashDetails,
  };
};

export const makeEntityManager = (
  details?: Partial<EntityManager>,
): EntityManager => {
  return {
    create: jest.fn(),
    save: jest.fn(),
    transaction: jest.fn(),
    ...details,
  } as EntityManager;
};

export const makePicture = (details?: Partial<Picture>): Picture => {
  return {
    fieldname: 'picture',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1000,
    buffer: Buffer.from('test file content'),
    stream: null,
    destination: null,
    filename: null,
    path: 'some/path',
    ...details,
  };
};

export const makeQueryBuilder = <T>(
  details?: Partial<SelectQueryBuilder<T>>,
): SelectQueryBuilder<T> => {
  return {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockReturnThis(),
    ...details,
  } as unknown as SelectQueryBuilder<T>;
};

export const makeRepository = <T>(
  details?: Partial<Repository<T>>,
): Repository<T> => {
  return {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    manager: {
      save: jest.fn(),
      transaction: jest.fn(),
    },
    ...details,
  } as Repository<T>;
};

export const makeResponse = (details?: Partial<Response>): Response => {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    ...details,
  } as unknown as Response;
};

export const makeTokens = (
  details?: Partial<{ refreshToken: string; accessToken: string }>,
): { refreshToken: string; accessToken: string } => {
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    ...details,
  };
};
