const { env } = process;


export const config = () => ({
    redis: {
        host: env.REDIS_HOST || 'cursor-redis',
        port: env.REDIS_PORT || 6379,
    },
});