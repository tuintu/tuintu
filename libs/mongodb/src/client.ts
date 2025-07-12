import { MongoClientOptions, MongoClient as UnsafeClient } from "mongodb";
import { err, ok, Result } from "tuintu/core/result";
import { unsafe } from "tuintu/core";
import { MongoDb } from "./db.js";
import { MongoConfig, MongoSshConfig } from "./config.js";
import fs from "fs/promises";
import tunnel from "tunnel-ssh";

export class MongoClient {
    private client: UnsafeClient;

    private constructor(client: UnsafeClient) {
        this.client = client;
    }

    public static manualSetup(
        url: string,
        opt?: MongoClientOptions,
    ): Result<MongoClient, unknown> {
        const clientRes = unsafe.sync(() => new UnsafeClient(url, opt));
        if (clientRes.type === "err") {
            return clientRes;
        }

        const client = clientRes.ok;
        const mongo = new MongoClient(client);
        return ok(mongo);
    }

    public static async autoSetup(
        config: MongoConfig,
    ): Promise<Result<MongoClient, unknown>> {
        const { ssh } = config;

        // for connecting to a local mongod (hosted in windows) from within wsl:
        // if you aren't able to connect to mongod,
        // it is most likely a firewall issue (port is not accessible by wsl)
        // also make sure to set mongo server url to windows local network ip for your machine
        // and bind mongod to 0.0.0.0 (in mongod.cfg)
        switch (ssh) {
            case undefined:
                return MongoClient.setupLocalMongo(config.url);
            default:
                return await MongoClient.setupSshMongo(ssh);
        }
    }

    private static async setupSshMongo(
        ssh: MongoSshConfig,
    ): Promise<Result<MongoClient, unknown>> {
        const privateKeyRes = await unsafe.async(() =>
            fs.readFile(ssh.keyPath),
        );

        if (privateKeyRes.type === "err") {
            return err(privateKeyRes.err);
        }

        const privateKey = privateKeyRes.ok;

        const tunnelRes = await unsafe.async(() => {
            return tunnel.createTunnel(
                {
                    autoClose: true,
                    reconnectOnError: true,
                },
                {},
                {
                    host: ssh.host,
                    port: ssh.port,
                    username: ssh.username,
                    privateKey,
                },
                {
                    dstPort: 27017,
                },
            );
        });

        if (tunnelRes.type === "err") {
            return err(tunnelRes.err);
        }

        const [tunnelServer, _tunnelClient] = tunnelRes.ok;

        const address = tunnelServer.address();
        if (address === null) {
            return err("Mongo tunnel address is null");
        }

        if (typeof address === "string") {
            return err("Mongo tunnel address is a string");
        }

        const { port } = address;
        // localhost is your machine (not ssh)
        // port is the port the ssh tunnel is mapped to on your machine (not the ssh-ed machine's port)
        return MongoClient.setupLocalMongo(`localhost:${port}`);
    }

    private static setupLocalMongo(url: string): Result<MongoClient, unknown> {
        return MongoClient.manualSetup(`mongodb://${url}`);
    }

    public db(name: string): Result<MongoDb, unknown> {
        const dbRes = unsafe.sync(() => this.client.db(name));
        if (dbRes.type === "err") {
            return dbRes;
        }

        const db = MongoDb.new(dbRes.ok);
        return ok(db);
    }
}

export type NewCtx = { url: string; db: string };
export type NewError =
    | {
          type: "clientError";
          clientError: unknown;
      }
    | {
          type: "dbError";
          dbError: unknown;
      };
