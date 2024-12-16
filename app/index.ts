import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { run } from "energy-label-types";
import { SqlError } from "mariadb";
import { PrismaClient } from "@prisma/client";

const prisma_clients = [createClient(3307), createClient(3308)];

function createClient(port: number) {
	const db_url = `mysql://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.HOST}:${port}/${process.env.DATABASE_NAME}`;
	return new PrismaClient({ datasources: { db: { url: db_url } } });
}

export async function main() {
	const port = 3000;
	const host = "localhost";

	if (isNaN(port)) {
		throw Error("Port must be a number");
	}

	let insertCount = 0;
	const app = Fastify({ logger: false });

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	app.get("/version", async () => ({ version: "0.0.1" }));
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "POST",
		url: "/log",
		schema: {
			body: run,
			response: {
				200: z.string,
			},
		},
		handler: async (request, reply) => {
			const body = request.body;
			try {
				await prisma_clients[
					insertCount % prisma_clients.length
				].fact.create({
					data: {
						score: body.score,
						status_code: body.statusCode,
						error_message: body.errorMessage,
						extension_version: body.extensionVersion,
						plugin_name: body.pluginName,
						plugin_version: body.pluginVersion,
						browser_name: body.browserName,
						browser_version: body.browserVersion,
						domain: body.url,
						path: body.path,
					},
				});

				reply.status(200).send();
			} catch (e) {
				if (e instanceof SqlError) reply.status(500).send(e);
				else reply.status(400).send(e);
			}
			insertCount += 1;
		},
	});

	try {
		await app.listen({ host: host, port: port });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

main()
	.then(async () => {
		for (const client of prisma_clients) {
			await client.$disconnect();
		}
	})
	.catch(async (e) => {
		console.error(e);
		for (const client of prisma_clients) {
			await client.$disconnect();
		}
		process.exit(1);
	});
