import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                summary: 'Register an ateendee',
                tags: ['attendees'],

                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email()
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number(),
                    })
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params
            const { name, email } = request.body

            const attendeeFromEmail = await prisma.attendee.findFirst({
                where: {
                    eventId: eventId,
                    email: email,
                },
            })
        
            if (attendeeFromEmail !== null) {
                throw new Error('This e-mail is already registered for this event.')
            }
            
            const [amoutOfAttendeesForEvent, event] = await Promise.all([
                prisma.attendee.count({
                    where: {
                        eventId,
                    }
                }),

                prisma.event.findUnique({
                    where: {
                        id: eventId,
                    }
                })
            ])
            
            if (event?.maximumAttendees && amoutOfAttendeesForEvent >= event?.maximumAttendees ) {
                throw new Error('The maximum number of attendees for this event has been reached')
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name, 
                    email,
                    eventId,
                }
            })

            return reply.status(201).send({ attendeeId: attendee.id })
        })
}