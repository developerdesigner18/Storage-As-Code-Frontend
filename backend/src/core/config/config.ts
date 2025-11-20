import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    fusionMock: {
        url: string;
        port: number;
    };
    logging: {
        level: string;
    };
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-me',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    fusionMock: {
        url: process.env.FUSION_MOCK_URL || 'http://localhost:3001',
        port: parseInt(process.env.FUSION_MOCK_PORT || '3001', 10),
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};

export default config;
