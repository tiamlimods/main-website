import Redis from 'ioredis';

// 从环境变量获取Redis配置，默认使用localhost:6379
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379');

/**
 * 创建Redis连接实例（ioredis内置连接池）
 * 配置说明：
 * - host: Redis服务器地址
 * - port: Redis服务器端口
 * - maxRetriesPerRequest: 每个请求最大重试次数，防止网络波动导致失败
 * - enableOfflineQueue: 启用离线队列，在网络断开时缓存命令
 * - connectTimeout: 连接超时时间(毫秒)
 * - connectionName: 连接名称，便于在Redis客户端识别
 * - lazyConnect: 延迟连接，首次操作时才建立连接
 * - enableReadyCheck: 启用就绪检查，确保连接可用
 * - enableAutoPipelining: 自动管道化，提升批量操作性能
 * - autoResubscribe: 自动重新订阅，连接断开恢复后保持订阅
 * - autoResendUnfulfilledCommands: 自动重发未完成命令
 */
const redis = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  connectTimeout: 5000,
  connectionName: 'main-pool',
  lazyConnect: true,
  enableReadyCheck: true,
  enableAutoPipelining: true,
  autoResubscribe: true,
  autoResendUnfulfilledCommands: true
});

// 错误处理：监听Redis错误事件并打印日志
redis.on('error', (err: Error) => {
  console.error('Redis Error:', err);
});

/**
 * 获取Redis客户端实例
 * @returns 返回已连接的Redis实例
 * @description 如果连接未就绪，会先建立连接
 */
export async function getRedisClient() {
  if (redis.status !== 'ready') {
    await redis.connect();
  }
  return redis;
}

/**
 * 关闭Redis连接
 * @description 优雅地关闭Redis连接，会等待所有命令完成
 */
export async function closeRedis() {
  await redis.quit();
}
