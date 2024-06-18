import { Test } from '@nestjs/testing'
import { RolesService } from '@/services';
import { Role } from '@/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockRole, repositoryMock } from '../mocks';

describe('RolesService', () => {
    let rolesService: RolesService;
    let rolesRepository: Repository<Role>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesService,
                {
                    provide: getRepositoryToken(Role),
                    useValue: repositoryMock,
                },
            ],
        }).compile();

        rolesService = module.get<RolesService>(RolesService);
        rolesRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(rolesService).toBeDefined();
    });

    describe('createRole', () => {
        it('should create a role', async () => {
            const roleName = 'user'

            jest.spyOn(rolesRepository, 'create').mockReturnValue(mockRole);
            jest.spyOn(rolesRepository, 'save').mockResolvedValue(mockRole);

            const result = await rolesService.createRole(roleName);

            expect(result).toBe(mockRole);
            expect(rolesRepository.create).toHaveBeenCalledWith({ name: roleName });
            expect(rolesRepository.save).toHaveBeenCalledWith(mockRole);
        });
    });

    describe('findByName', () => {
        it('should return a role when found', async () => {
            jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(mockRole);

            const result = await rolesService.findByName(mockRole.name);

            expect(result).toEqual(mockRole);
            expect(rolesRepository.findOne).toHaveBeenCalledWith({
                where: { name: mockRole.name },
            });
        });

        it('should return null when role is not found', async () => {
            const nonExistingRole = 'non-existing-role'

            jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(null);

            const result = await rolesService.findByName(nonExistingRole);

            expect(result).toBe(null);
            expect(rolesRepository.findOne).toHaveBeenCalledWith({
                where: { name: nonExistingRole },
            });
        });
    });
})