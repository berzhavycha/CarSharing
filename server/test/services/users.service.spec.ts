import { Test } from '@nestjs/testing'
import { RolesService, TransactionsService, UsersService } from '@/services';
import { User } from '@/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TransactionType, usersErrorMessages } from '@/helpers';
import { NotFoundException } from '@nestjs/common';
import { repositoryMock, mockRole, mockUser, createUserDtoMock, userDetails, secureUserData, mockRental } from '../mocks';
import { UpdateUserBalanceDto } from '@/dtos';

const mockTransanctionService = {
    createTransaction: jest.fn()
}

const mockRoleService = {
    createRole: jest.fn(),
    findByName: jest.fn()
}

describe('UsersService', () => {
    let usersService: UsersService;
    let transactionsService: TransactionsService;
    let rolesService: RolesService;
    let usersRepository: Repository<User>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: repositoryMock,
                },
                {
                    provide: TransactionsService,
                    useValue: mockTransanctionService,
                },
                {
                    provide: RolesService,
                    useValue: mockRoleService,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        transactionsService = module.get<TransactionsService>(TransactionsService);
        rolesService = module.get<RolesService>(RolesService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            jest.spyOn(rolesService, 'findByName').mockResolvedValue(mockRole);

            jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser);
            jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

            const result = await usersService.createUser(createUserDtoMock);

            expect(result).toBe(mockUser);
            expect(usersRepository.create).toHaveBeenCalledWith({ ...userDetails, ...secureUserData, balance: 0, role: mockRole });
            expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('findByEmail', () => {
        it('should return a user when found', async () => {
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

            const result = await usersService.findByEmail(mockUser.email);

            expect(result).toEqual(mockUser);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { email: mockUser.email },
                relations: ['role'],
            });
        });

        it('should return null when user is not found', async () => {
            const nonExistingEmail = 'non-existing-email@gmail.com'

            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

            const result = await usersService.findByEmail(nonExistingEmail);

            expect(result).toBe(null);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { email: nonExistingEmail },
                relations: ['role'],
            });
        });
    });


    describe('findById', () => {
        it('should return a user when found', async () => {
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

            const result = await usersService.findById(mockUser.id);

            expect(result).toEqual(mockUser);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                relations: ['role'],
            });
        });

        it('should throw NotFoundException when user is not found', async () => {
            const nonExistingId = 'non-existing-id'

            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

            await expect(usersService.findById(nonExistingId)).rejects.toThrow(NotFoundException);

            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { id: nonExistingId },
                relations: ['role'],
            });
        });
    });

    describe('updateUser', () => {
        const updateUserDtoMock = {
            firstName: "new first name"
        };

        it('should update a user', async () => {

            const updatedUser = {
                ...mockUser,
                ...updateUserDtoMock
            } as User;

            jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

            const result = await usersService.updateUser(mockUser.id, updateUserDtoMock);

            expect(result).toEqual(updatedUser);
            expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
            expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
        });

        it('should throw NotFoundException if user with given id is not found', async () => {
            const nonExistingId = 'non-existing-id'

            jest.spyOn(usersService, 'findById').mockImplementationOnce(() => Promise.reject(new NotFoundException(usersErrorMessages.USER_NOT_FOUND)));

            await expect(usersService.updateUser(nonExistingId, updateUserDtoMock))
                .rejects.toThrow(NotFoundException);

            expect(usersService.findById).toHaveBeenCalledWith(nonExistingId);
            expect(usersRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('updateUserBalance', () => {
        const balanceDto: UpdateUserBalanceDto = { amount: 20 };
        const options = {
            id: mockUser.id,
            balanceDto,
            transactionType: TransactionType.REFUND,
            rental: mockRental,
        };

        const mockUserBalance = mockUser.balance

        it('should update user balance within a transaction if manager is provided', async () => {
            const mockManager = {
                save: jest.fn().mockResolvedValue(mockUser),
            } as unknown as EntityManager;


            jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser);
            const result = await usersService.updateUserBalance(options, mockManager);

            expect(result).toEqual(mockUser);
            expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
            expect(transactionsService.createTransaction).toHaveBeenCalledWith(
                {
                    amount: balanceDto.amount,
                    description: `${options.transactionType} for ${options.id} user account`,
                    type: options.transactionType,
                    user: { ...mockUser },
                    rental: options.rental,
                },
                mockManager
            );


            expect(mockManager.save).toHaveBeenCalledWith({
                ...mockUser,
                balance: mockUserBalance + balanceDto.amount,
            });
        });

        it('should update user balance and create a transaction', async () => {
            jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(usersRepository.manager, 'transaction').mockResolvedValue(mockUser);

            const result = await usersService.updateUserBalance(options);

            expect(result).toEqual(mockUser);
            expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
            expect(usersRepository.manager.transaction).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(usersService, 'findById').mockImplementationOnce(() => {
                throw new NotFoundException(usersErrorMessages.USER_NOT_FOUND);
            });

            await expect(usersService.updateUserBalance(options)).rejects.toThrow(NotFoundException);

            expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
            expect(transactionsService.createTransaction).not.toHaveBeenCalled();
            expect(usersRepository.manager.transaction).not.toHaveBeenCalled();
        });
    });
})