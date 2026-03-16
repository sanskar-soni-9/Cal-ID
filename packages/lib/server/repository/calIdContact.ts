import { prisma, type PrismaClient } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";

export type CalIdContactSortBy = "name" | "email" | "createdAt" | "updatedAt";
export type CalIdContactSortDirection = "asc" | "desc";

const calIdContactSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CalIdContactSelect;

export type CalIdContactDTO = Prisma.CalIdContactGetPayload<{
  select: typeof calIdContactSelect;
}>;

export class CalIdContactRepository {
  constructor(private readonly prismaClient: PrismaClient = prisma) {}

  async listByUserId({
    userId,
    search,
    sortBy,
    sortDirection,
    limit,
    offset,
  }: {
    userId: number;
    search?: string;
    sortBy: CalIdContactSortBy;
    sortDirection: CalIdContactSortDirection;
    limit: number;
    offset: number;
  }) {
    const normalizedSearch = search?.trim();

    const where: Prisma.CalIdContactWhereInput = {
      userId,
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { email: { contains: normalizedSearch, mode: "insensitive" } },
              { phone: { contains: normalizedSearch, mode: "insensitive" } },
              { notes: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const primaryOrderBy: Prisma.CalIdContactOrderByWithRelationInput = {
      [sortBy]: sortDirection,
    };

    const [rows, totalRowCount] = await this.prismaClient.$transaction([
      this.prismaClient.calIdContact.findMany({
        where,
        select: calIdContactSelect,
        orderBy: [primaryOrderBy, { id: "desc" }],
        take: limit,
        skip: offset,
      }),
      this.prismaClient.calIdContact.count({ where }),
    ]);

    return {
      rows,
      totalRowCount,
    };
  }

  async getById({ id, userId }: { id: number; userId: number }) {
    return this.prismaClient.calIdContact.findFirst({
      where: {
        id,
        userId,
      },
      select: calIdContactSelect,
    });
  }

  async create({
    userId,
    data,
  }: {
    userId: number;
    data: {
      name: string;
      email: string;
      phone: string;
      notes: string;
    };
  }) {
    return this.prismaClient.calIdContact.create({
      data: {
        userId,
        ...data,
      },
      select: calIdContactSelect,
    });
  }

  async updateById({
    id,
    userId,
    data,
  }: {
    id: number;
    userId: number;
    data: {
      name?: string;
      email?: string;
      phone?: string;
      notes?: string;
    };
  }) {
    const updated = await this.prismaClient.calIdContact.updateMany({
      where: {
        id,
        userId,
      },
      data,
    });

    if (!updated.count) {
      return null;
    }

    return this.getById({ id, userId });
  }

  async deleteById({ id, userId }: { id: number; userId: number }) {
    const deleted = await this.prismaClient.calIdContact.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return deleted.count > 0;
  }
}
