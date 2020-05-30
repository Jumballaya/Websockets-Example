const { env } = process;

export const config = () => ({
    port: env.NODE_PORT || 5000,
    redis: {
        host: env.REDIS_HOST || 'cursor-redis',
        port: env.REDIS_PORT || 6379,
    },
});