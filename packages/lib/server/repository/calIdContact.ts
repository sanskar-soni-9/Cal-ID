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

export type CalIdContactMeetingStatus = "upcoming" | "completed" | "cancelled";

export type CalIdContactMeetingDTO = {
  id: number;
  title: string;
  date: Date;
  duration: number;
  status: CalIdContactMeetingStatus;
  meetingLink: string | null;
  notes: string | null;
};

const bookingMeetingSelect = {
  id: true,
  title: true,
  startTime: true,
  endTime: true,
  status: true,
  location: true,
  metadata: true,
  references: {
    select: {
      type: true,
      meetingUrl: true,
    },
    orderBy: {
      id: "desc",
    },
  },
  internalNote: {
    select: {
      text: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  },
} satisfies Prisma.BookingSelect;

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

  async listMeetingsByContactId({
    contactId,
    userId,
    limit,
  }: {
    contactId: number;
    userId: number;
    limit: number;
  }) {
    const contact = await this.getById({ id: contactId, userId });

    if (!contact) {
      return null;
    }

    const normalizedEmail = contact.email.trim();
    const normalizedPhone = contact.phone.trim();

    const attendeeMatchers: Prisma.AttendeeWhereInput[] = [
      {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    ];

    if (normalizedPhone.length > 0) {
      attendeeMatchers.push({
        phoneNumber: normalizedPhone,
      });
    }

    const now = Date.now();

    const bookings = await this.prismaClient.booking.findMany({
      where: {
        userId,
        attendees: {
          some: {
            OR: attendeeMatchers,
          },
        },
      },
      select: bookingMeetingSelect,
      orderBy: [{ startTime: "desc" }, { id: "desc" }],
      take: limit,
    });

    const rows: CalIdContactMeetingDTO[] = bookings.map((booking) => {
      const startTime = booking.startTime;
      const endTime = booking.endTime;
      const duration = Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / 60000));
      const bookingStatus = String(booking.status).toLowerCase();

      const status: CalIdContactMeetingStatus =
        bookingStatus === "cancelled" || bookingStatus === "rejected"
          ? "cancelled"
          : endTime.getTime() >= now
          ? "upcoming"
          : "completed";

      const videoReference = booking.references.find(
        (reference) => reference.type.includes("_video") && Boolean(reference.meetingUrl)
      );
      const fallbackReference = booking.references.find((reference) => Boolean(reference.meetingUrl));
      const locationLink =
        typeof booking.location === "string" && booking.location.startsWith("http") ? booking.location : null;
      const meetingLink = videoReference?.meetingUrl ?? fallbackReference?.meetingUrl ?? locationLink ?? null;

      const meetingNoteFromMetadata =
        booking.metadata && typeof booking.metadata === "object" && !Array.isArray(booking.metadata)
          ? "meetingNote" in booking.metadata && typeof booking.metadata.meetingNote === "string"
            ? booking.metadata.meetingNote
            : null
          : null;
      const latestInternalNote = booking.internalNote[0]?.text ?? null;
      const notes = meetingNoteFromMetadata ?? latestInternalNote;

      return {
        id: booking.id,
        title: booking.title,
        date: startTime,
        duration,
        status,
        meetingLink,
        notes,
      };
    });

    return {
      contact,
      rows,
    };
  }
}
