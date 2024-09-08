import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

const prismaMock = mockDeep<PrismaClient>();

jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };
